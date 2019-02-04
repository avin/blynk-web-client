import React from 'react';
import { connect } from 'react-redux';
import { Slider } from '@blueprintjs/core';
import blynkWSClient from '../../../../../../common/blynkWSClient';
import { getWidgetPinAddress } from '../../../../../../utils/data';
import WidgetLabel from '../../WidgetLabel/WidgetLabel';
import { pinValueSelector } from '../../../../../../redux/selectors';
import styles from './styles.module.scss';

export class SliderView extends React.Component {
    handleChange = value => {
        const { widget } = this.props;

        const pin = getWidgetPinAddress(widget);
        const fakeUpdate = widget.get('sendOnReleaseOn');
        blynkWSClient.sendWritePin(pin, value, fakeUpdate);
    };

    handleRelease = value => {
        const { widget } = this.props;

        if (widget.get('sendOnReleaseOn')) {
            const pin = getWidgetPinAddress(widget);
            blynkWSClient.sendWritePin(pin, value);
        }
    };

    render() {
        const { widget, value, vertical } = this.props;

        const sliderValue = Math.max(Math.min(Number(value), widget.get('max')), widget.get('min'));
        return (
            <>
                <WidgetLabel title={widget.get('label') || (!vertical && 'Slider')} information={value} />
                <div className={styles.sliderContainer}>
                    <Slider
                        value={sliderValue}
                        labelRenderer={false}
                        min={widget.get('min')}
                        max={widget.get('max')}
                        onChange={this.handleChange}
                        onRelease={this.handleRelease}
                        vertical={vertical}
                    />
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
)(SliderView);
