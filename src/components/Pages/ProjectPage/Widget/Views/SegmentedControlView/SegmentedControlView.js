import React from 'react';
import { connect } from 'react-redux';
import { Button, ButtonGroup } from '@blueprintjs/core';
import WidgetLabel from '../../WidgetLabel/WidgetLabel';
import { pinValueSelector } from '../../../../../../redux/selectors';
import { getWidgetPinAddress } from '../../../../../../utils/data';
import blynkWSClient from '../../../../../../common/blynkWSClient';
import { decodeBlynkColor } from '../../../../../../utils/color';
import styles from './styles.module.scss';

export class SegmentedControlView extends React.Component {
    handleClick = e => {
        const { widget } = this.props;
        const { value } = e.currentTarget.dataset;

        const pin = getWidgetPinAddress(widget);
        if (pin !== -1) {
            blynkWSClient(widget.get('deviceId')).sendWritePin(pin, value);
        }
    };

    render() {
        const { widget, value } = this.props;

        return (
            <>
                <WidgetLabel title={widget.get('label')} />
                <div className={styles.container}>
                    <ButtonGroup fill>
                        {widget.get('labels', []).map((label, idx) => {
                            const active = Number(value) === idx + 1;
                            let style;
                            if (active) {
                                style = {
                                    backgroundColor: decodeBlynkColor(widget.get('color')),
                                    fontWeight: 'bold',
                                    color: '#182026',
                                };
                            }

                            return (
                                <Button
                                    key={idx}
                                    data-value={idx + 1}
                                    onClick={this.handleClick}
                                    active={active}
                                    style={style}
                                >
                                    {label}
                                </Button>
                            );
                        })}
                    </ButtonGroup>
                </div>
            </>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const deviceId = ownProps.widget.get('deviceId');
    const pinId = ownProps.widget.get('pinId');
    return {
        value: pinValueSelector(state, deviceId, pinId) || 0,
    };
}

export default connect(
    mapStateToProps,
    {},
)(SegmentedControlView);
