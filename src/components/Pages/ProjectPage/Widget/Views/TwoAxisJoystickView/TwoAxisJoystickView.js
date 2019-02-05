import React from 'react';
import { connect } from 'react-redux';
import SizeMe from '@avinlab/react-size-me';
import { Button } from '@blueprintjs/core';
import { DraggableCore } from 'react-draggable';
import WidgetLabel from '../../WidgetLabel/WidgetLabel';
import styles from './styles.module.scss';
import { pinValueSelector } from '../../../../../../redux/selectors';
import blynkWSClient from '../../../../../../common/blynkWSClient';
import { decodeBlynkColor } from '../../../../../../utils/color';

export class TwoAxisJoystickView extends React.Component {
    handleStartDrag = () => {};

    handleDrag = (e, { deltaX, deltaY }) => {
        const { widget, pin1Value, pin2Value } = this.props;

        const x = ((-this.getMiddleX() + Number(pin1Value)) / this.getMiddleX()) * this.margin;
        const y = ((-this.getMiddleY() + Number(pin2Value)) / this.getMiddleY()) * this.margin * -1;

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
            blynkWSClient(widget.get('deviceId')).sendWritePin(
                pin1Id,
                Math.floor(this.getMiddleX() + (rX / this.margin) * this.getMiddleX()),
            );
        }
        if (pin2Id !== -1) {
            blynkWSClient(widget.get('deviceId')).sendWritePin(
                pin2Id,
                Math.floor(this.getMiddleY() - (rY / this.margin) * this.getMiddleY()),
            );
        }
    };

    handleStop = () => {
        const { widget } = this.props;

        const pin1Id = widget.getIn(['pins', 0, 'pinId']);
        const pin2Id = widget.getIn(['pins', 1, 'pinId']);

        if (pin1Id !== -1) {
            blynkWSClient(widget.get('deviceId')).sendWritePin(pin1Id, this.getMiddleX());
        }
        if (pin2Id !== -1) {
            blynkWSClient(widget.get('deviceId')).sendWritePin(pin2Id, this.getMiddleY());
        }
    };

    getMiddleValue(pinIdx) {
        const { widget } = this.props;
        return (widget.getIn(['pins', pinIdx, 'max']) - widget.getIn(['pins', pinIdx, 'min']) + 1) / 2;
    }

    getMiddleX() {
        this._middleX = this._middleX !== undefined ? this._middleX : this.getMiddleValue(0);
        return this._middleX;
    }

    getMiddleY() {
        this._middleY = this._middleY !== undefined ? this._middleY : this.getMiddleValue(1);
        return this._middleY;
    }

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

                            const x = ((-this.getMiddleX() + Number(pin1Value)) / this.getMiddleX()) * this.margin;
                            const y = ((-this.getMiddleY() + Number(pin2Value)) / this.getMiddleY()) * this.margin * -1;

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
                                            className={styles.stick}
                                            style={{
                                                width: stickSize + moreSize * 2,
                                                height: stickSize + moreSize * 2,
                                                left: margin - moreSize,
                                                top: margin - moreSize,
                                                transform: `translate(${x}px, ${y}px)`,
                                                backgroundColor: decodeBlynkColor(widget.get('color')),
                                                border: `5px solid white`,
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
    const deviceId = ownProps.widget.get('deviceId');
    const pin1Id = ownProps.widget.getIn(['pins', 0, 'pinId']);
    const pin2Id = ownProps.widget.getIn(['pins', 1, 'pinId']);

    return {
        pin1Value: pinValueSelector(state, deviceId, pin1Id),
        pin2Value: pinValueSelector(state, deviceId, pin2Id),
    };
}

export default connect(
    mapStateToProps,
    {},
)(TwoAxisJoystickView);
