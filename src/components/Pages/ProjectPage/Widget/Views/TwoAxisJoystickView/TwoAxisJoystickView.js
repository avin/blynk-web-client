import React from 'react';
import { connect } from 'react-redux';
import SizeMe from '@avinlab/react-size-me';
import { Button, Intent } from '@blueprintjs/core';
import { DraggableCore } from 'react-draggable';
import WidgetLabel from '../../WidgetLabel/WidgetLabel';
import styles from './styles.module.scss';
import { pinValueSelector } from '../../../../../../redux/selectors';
import blynkWSClient from '../../../../../../common/blynkWSClient';

export class TwoAxisJoystickView extends React.Component {
    handleStartDrag = () => {};

    handleDrag = (e, { deltaX, deltaY }) => {
        const { widget, pin1Value, pin2Value } = this.props;

        const x = ((-512 + Number(pin1Value)) / 512) * this.margin;
        const y = ((-512 + Number(pin2Value)) / 512) * this.margin * -1;

        let rX = x + deltaX;
        let rY = y + deltaY;

        rX = Math.max(Math.min(rX, this.margin), -this.margin);
        rY = Math.max(Math.min(rY, this.margin), -this.margin);

        const distance = Math.sqrt(rX * rX + rY * rY);
        if (distance > this.margin) {
            rX *= this.margin / distance;
            rY *= this.margin / distance;
        }

        const pin1Id = widget.getIn(['pins', 0, 'pinId']);
        const pin2Id = widget.getIn(['pins', 1, 'pinId']);

        if (pin1Id !== -1) {
            blynkWSClient.sendWritePin(pin1Id, Math.floor(512 + (rX / this.margin) * 512));
        }
        if (pin2Id !== -1) {
            blynkWSClient.sendWritePin(pin2Id, Math.floor(512 - (rY / this.margin) * 512));
        }
    };

    handleStop = () => {
        const { widget } = this.props;

        const pin1Id = widget.getIn(['pins', 0, 'pinId']);
        const pin2Id = widget.getIn(['pins', 1, 'pinId']);

        if (pin1Id !== -1) {
            blynkWSClient.sendWritePin(pin1Id, 512);
        }
        if (pin2Id !== -1) {
            blynkWSClient.sendWritePin(pin2Id, 512);
        }
    };

    render() {
        const { widget, pin1Value, pin2Value } = this.props;

        return (
            <>
                <WidgetLabel
                    title={widget.get('label') || 'Joystick'}
                    information={
                        <div>
                            {pin1Value}
                            <br />
                            {pin2Value}
                        </div>
                    }
                />
                <div className={styles.mainContainer}>
                    <SizeMe className={styles.sizeContainer}>
                        {({ width, height }) => {
                            const moreSize = 20;
                            const areaSize = Math.min(width, height) - moreSize * 2;
                            const stickSize = areaSize / 2;
                            const margin = stickSize / 2;

                            this.margin = margin;

                            const x = ((-512 + Number(pin1Value)) / 512) * this.margin;
                            const y = ((-512 + Number(pin2Value)) / 512) * this.margin * -1;

                            return (
                                <div
                                    className={styles.stickContainer}
                                    style={{ width: areaSize, height: areaSize, margin: moreSize }}
                                >
                                    <DraggableCore
                                        onStart={this.handleStartDrag}
                                        onDrag={this.handleDrag}
                                        onStop={this.handleStop}
                                    >
                                        <Button
                                            intent={Intent.PRIMARY}
                                            className={styles.stick}
                                            style={{
                                                width: stickSize + moreSize * 2,
                                                height: stickSize + moreSize * 2,
                                                left: margin - moreSize,
                                                top: margin - moreSize,
                                                transform: `translate(${x}px, ${y}px)`,
                                            }}
                                        />
                                    </DraggableCore>
                                </div>
                            );
                        }}
                    </SizeMe>
                </div>
            </>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const pin1Id = ownProps.widget.getIn(['pins', 0, 'pinId']);
    const pin2Id = ownProps.widget.getIn(['pins', 1, 'pinId']);

    return {
        pin1Value: pinValueSelector(state, pin1Id),
        pin2Value: pinValueSelector(state, pin2Id),
    };
}

export default connect(
    mapStateToProps,
    {},
)(TwoAxisJoystickView);
