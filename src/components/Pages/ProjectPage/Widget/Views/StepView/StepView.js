import React from 'react';
import { connect } from 'react-redux';
import { Button } from '@blueprintjs/core';
import cn from 'clsx';
import repeat from '@avinlab/repeat';
import WidgetLabel from '../../WidgetLabel/WidgetLabel';
import styles from './styles.module.scss';
import { pinValueSelector } from '../../../../../../redux/selectors';
import blynkWSClient from '../../../../../../common/blynkWSClient';
import { getWidgetPinAddress } from '../../../../../../utils/data';

export class StepView extends React.Component {
    getButtonLabel(direction) {
        const { widget } = this.props;

        if (!widget.get('isArrowsOn')) {
            if (direction === -1) {
                return '←';
            }
            return '→';
        }

        if (direction === -1) {
            return '-';
        }
        return '+';
    }

    handleMouseDown = e => {
        const { widget } = this.props;
        const step = widget.get('step');
        const isSendStep = widget.get('isSendStep');
        const isLoopOn = widget.get('isLoopOn');
        const max = widget.get('max');
        const min = widget.get('min');

        const pin = getWidgetPinAddress(widget);

        const direction = Number(e.currentTarget.dataset.direction);

        this.sendRepeatAction = repeat({
            action: () => {
                const value = Number(this.props.value) || 0;

                let sendValue;
                if (isSendStep) {
                    sendValue = step * direction;
                } else {
                    sendValue = value + step * direction;

                    if (sendValue > max) {
                        if (isLoopOn) {
                            sendValue = min;
                        } else {
                            sendValue = max;
                        }
                    } else if (sendValue < min) {
                        if (isLoopOn) {
                            sendValue = max;
                        } else {
                            sendValue = min;
                        }
                    }
                }

                if (pin !== -1) {
                    blynkWSClient.sendWritePin(pin, sendValue);
                }
            },
            delay: 80,
            firstTimeDelay: 400,
            skipFirst: false,
        });
        this.sendRepeatAction.start();
    };

    handleMouseUp = e => {
        if (this.sendRepeatAction) {
            this.sendRepeatAction.stop();
        }
    };

    render() {
        const { widget, value } = this.props;

        const isVertical = widget.get('type') === 'VERTICAL_STEP';

        const defaultLabel = isVertical ? 'Step V' : 'Step H';

        return (
            <>
                <WidgetLabel title={widget.get('label') || defaultLabel} information={value} />
                <div
                    className={cn({
                        [styles.verticalButtonsContainer]: isVertical,
                        [styles.buttonsContainer]: !isVertical,
                    })}
                >
                    <Button
                        minimal
                        small
                        className={styles.button}
                        data-direction={isVertical ? 1 : -1}
                        onMouseDown={this.handleMouseDown}
                        onMouseUp={this.handleMouseUp}
                    >
                        {this.getButtonLabel(isVertical ? 1 : -1)}
                    </Button>
                    <div
                        className={cn({
                            [styles.dividerHorizontal]: isVertical,
                            [styles.dividerVertical]: !isVertical,
                        })}
                    />
                    <Button
                        minimal
                        small
                        className={styles.button}
                        data-direction={isVertical ? -1 : 1}
                        onMouseDown={this.handleMouseDown}
                        onMouseUp={this.handleMouseUp}
                    >
                        {this.getButtonLabel(isVertical ? -1 : 1)}
                    </Button>
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
)(StepView);
