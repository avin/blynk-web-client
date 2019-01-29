import { createSelector } from 'reselect';
import { getWidgetPinAddress } from '../utils/data';

const widgetByIdSelector = (state, widgetId) => state.blynk.getIn(['project', 'widgets', widgetId]);

export const widgetValueSelector = createSelector(
    widgetByIdSelector,
    state => state.blynk.get('pins'),
    (widget, pins) => {
        if (widget.get('pin') === -1) {
            return widget.get('value');
        }

        if (widget.get('pinType')) {
            const pin = getWidgetPinAddress(widget);
            const pinValue = pins.get(pin);

            return pinValue !== undefined ? pinValue : widget.get('value');
        }

        return '???';
    },
);
