import React from 'react';
import { connect } from 'react-redux';
import { Button } from '@blueprintjs/core';
import SizeMe from '@avinlab/react-size-me';
import cn from 'clsx';
import WidgetLabel from '../../WidgetLabel/WidgetLabel';
import styles from './styles.module.scss';
import { getWidgetPinAddress } from '../../../../../../utils/data';
import blynkWSClient from '../../../../../../common/blynkWSClient';
import { pinValueSelector } from '../../../../../../redux/selectors';
import { decodeBlynkColor } from '../../../../../../utils/color';

export class ButtonView extends React.Component {
    state = {
        pressed: false,
    };

    renderButtonLabel() {
        const { widget } = this.props;

        if (this.isButtonActive()) {
            return widget.get('onLabel', 'ON');
        }
        return widget.get('offLabel', 'OFF');
    }

    handleMouseDown = () => {
        const { widget, value } = this.props;

        this.setState({
            pressed: true,
        });

        const pin = getWidgetPinAddress(widget);

        if (pin !== -1) {
            if (widget.get('pushMode')) {
                // If push mode
                blynkWSClient.sendWritePin(pin, widget.get('max'));
            } else {
                // If switch mode
                // eslint-disable-next-line no-lonely-if
                if (String(value) === String(widget.get('max'))) {
                    blynkWSClient.sendWritePin(pin, widget.get('min'));
                } else {
                    blynkWSClient.sendWritePin(pin, widget.get('max'));
                }
            }
        }
    };

    handleMouseUp = () => {
        const { widget } = this.props;

        this.setState({
            pressed: false,
        });

        const pin = getWidgetPinAddress(widget);

        if (pin !== -1 && widget.get('pushMode')) {
            blynkWSClient.sendWritePin(pin, widget.get('min'));
        }
    };

    getButtonStyle({ width, height, isStyledButton }) {
        const { widget } = this.props;

        const buttonActive = this.isButtonActive();

        if (isStyledButton) {
            let borderRadius;
            switch (widget.get('edge')) {
                case 'SHARP':
                    borderRadius = 0;
                    break;
                case 'ROUNDED':
                    borderRadius = 3;
                    break;
                case 'PILL':
                    borderRadius = height / 2;
                    break;
                default:
            }

            return {
                width,
                height,
                borderRadius,
                backgroundColor: buttonActive
                    ? decodeBlynkColor(widget.getIn(['onButtonState', 'backgroundColor']))
                    : decodeBlynkColor(widget.getIn(['offButtonState', 'backgroundColor'])),

                color: buttonActive
                    ? decodeBlynkColor(widget.getIn(['onButtonState', 'textColor']))
                    : decodeBlynkColor(widget.getIn(['offButtonState', 'textColor'])),
            };
        }

        return {
            margin: 2,
            width: (Math.min(width, height) * widget.get('width')) / 2 - 4,
            height: Math.min(width, height) - 4,
            border: `2px solid ${decodeBlynkColor(widget.get('color'))}`,
            color: this.isButtonActive() ? decodeBlynkColor(-1) : decodeBlynkColor(widget.get('color')),
            backgroundColor: this.isButtonActive() ? decodeBlynkColor(widget.get('color')) : decodeBlynkColor(255),
        };
    }

    isButtonActive() {
        const { pressed } = this.state;
        const { widget, value } = this.props;

        return String(value) === String(widget.get('max')) || pressed;
    }

    render() {
        const { widget } = this.props;

        const isStyledButton = widget.get('type') === 'STYLED_BUTTON';

        return (
            <>
                <WidgetLabel title={widget.get('label') || (isStyledButton ? '' : 'Button')} />
                <div className={styles.buttonContainer}>
                    <SizeMe className={styles.sizeContainer}>
                        {({ width, height }) => (
                            <Button
                                className={cn({
                                    [styles.button]: !isStyledButton,
                                    [styles.styledButton]: isStyledButton,
                                })}
                                active={this.isButtonActive()}
                                onMouseDown={this.handleMouseDown}
                                onMouseUp={this.handleMouseUp}
                                style={this.getButtonStyle({ width, height, isStyledButton })}
                            >
                                {this.renderButtonLabel()}
                            </Button>
                        )}
                    </SizeMe>
                </div>
            </>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const pinId = ownProps.widget.get('pinId');
    return {
        value: pinValueSelector(state, pinId),
    };
}

export default connect(
    mapStateToProps,
    {},
)(ButtonView);
