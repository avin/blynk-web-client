import React from 'react';
import { connect } from 'react-redux';
import { Slider } from '@blueprintjs/core';
import blynkWSClient from '../../../../../../common/blynkWSClient';
import { getWidgetPinAddress } from '../../../../../../utils/data';
import WidgetLabel from '../../WidgetLabel/WidgetLabel';
import { pinValueSelector } from '../../../../../../redux/selectors';

export class SliderView extends React.Component {
    handleChangeValue = value => {
        const { widget } = this.props;

        const pin = getWidgetPinAddress(widget);

        blynkWSClient.sendWritePin(pin, value);
    };

    render() {
        const { widget, value } = this.props;

        return (
            <div>
                <WidgetLabel title={widget.get('label') || 'Slider'} information={value} />
                <Slider
                    value={Number(value)}
                    labelRenderer={false}
                    min={widget.get('min')}
                    max={widget.get('max')}
                    onChange={this.handleChangeValue}
                />
            </div>
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
