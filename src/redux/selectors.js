import { createSelector } from 'reselect';
import { getWidgetPinAddress } from '../utils/data';

const widgetByIdSelector = (state, widgetId) => state.blynk.getIn(['project', 'widgets', widgetId]);

export const widgetValueSelector = createSelector(
    widgetByIdSelector,
    state => state.blynk.get('pins'),
    (widget, pins) => {
        if (widget.get('pinType') && widget.get('pin') > -1) {
            const pin = getWidgetPinAddress(widget);
            const pinValue = pins.get(pin);

            return pinValue !== undefined ? pinValue : widget.get('value');
        }
        return 'SHIT_PIN';
    },
);
