import React from 'react';
import { Slider } from '@blueprintjs/core';
import blynkWSClient from '../../../../../common/blynkWSClient';
import { getWidgetPinAddress } from '../../../../../utils/data';

export default class WidgetSlider extends React.Component {
    handleChangeValue = value => {
        const { widget } = this.props;

        const pin = getWidgetPinAddress(widget);

        blynkWSClient.sendWritePin(pin, value);
    };

    render() {
        const { widget, value } = this.props;
        return (
            <div>
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
