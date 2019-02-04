import React from 'react';
import { connect } from 'react-redux';
import { Button } from '@blueprintjs/core';
import SizeMe from '@avinlab/react-size-me';
import WidgetLabel from '../../WidgetLabel/WidgetLabel';
import styles from './styles.module.scss';
import { getWidgetPinAddress } from '../../../../../../utils/data';
import blynkWSClient from '../../../../../../common/blynkWSClient';
import { pinValueSelector } from '../../../../../../redux/selectors';

export class ButtonView extends React.Component {
    renderButtonLabel() {
        const { widget, value } = this.props;

        if (Number(value)) {
            return widget.get('onLabel', 'ON');
        }
        return widget.get('offLabel', 'OFF');
    }

    handleMouseDown = () => {
        const { widget, value } = this.props;

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

        const pin = getWidgetPinAddress(widget);

        if (pin !== -1 && widget.get('pushMode')) {
            blynkWSClient.sendWritePin(pin, widget.get('min'));
        }
    };

    render() {
        const { widget, value } = this.props;

        return (
            <>
                <WidgetLabel title={widget.get('label') || 'Button'} />
                <div className={styles.buttonContainer}>
                    <SizeMe className={styles.sizeContainer}>
                        {({ width, height }) => (
                            <Button
                                className={styles.button}
                                active={!!Number(value)}
                                onMouseDown={this.handleMouseDown}
                                onMouseUp={this.handleMouseUp}
                                style={{
                                    margin: 2,
                                    width: (Math.min(width, height) * widget.get('width')) / 2 - 4,
                                    height: Math.min(width, height) - 4,
                                }}
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
