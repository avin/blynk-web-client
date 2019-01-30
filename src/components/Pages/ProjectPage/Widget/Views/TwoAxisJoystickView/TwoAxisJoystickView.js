import React from 'react';
import { connect } from 'react-redux';
import SizeMe from '@avinlab/react-size-me';
import { Button, Intent } from '@blueprintjs/core';
import Draggable from 'react-draggable';
import WidgetLabel from '../../WidgetLabel/WidgetLabel';
import styles from './styles.module.scss';
import { pinValueSelector } from '../../../../../../redux/selectors';

export class TwoAxisJoystickView extends React.Component {
    handleStartDrag = () => {
        // console.log('handleStartDrag');
    };

    handleDrag = () => {
        // console.log('handleDrag');
    };

    handleStop = () => {
        // console.log('handleStop');
    };

    render() {
        const { widget, pin1Value, pin2Value } = this.props;

        return (
            <>
                <WidgetLabel title={widget.get('label') || 'Joystick'} information={` ${pin1Value} -- ${pin2Value}`} />
                <div className={styles.mainContainer}>
                    <SizeMe className={styles.sizeContainer}>
                        {({ width, height }) => {
                            const moreSize = 20;
                            const areaSize = Math.min(width, height) - moreSize * 2;
                            const stickSize = areaSize / 2;
                            const margin = stickSize / 2;

                            return (
                                <div
                                    className={styles.stickContainer}
                                    style={{ width: areaSize, height: areaSize, margin: moreSize }}
                                >
                                    <Draggable
                                        // axis="x"
                                        // handle=".handle"
                                        defaultPosition={{ x: 0, y: 0 }}
                                        bounds={{ left: -margin, top: -margin, right: margin, bottom: margin }}
                                        position={null}
                                        scale={1}
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
                                                left: margin + margin * ((pin1Value - 512) / 512) - moreSize,
                                                top: margin - margin * ((pin2Value - 512) / 512) - moreSize,
                                            }}
                                        />
                                    </Draggable>
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
