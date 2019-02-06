import createCachedSelector from 're-reselect';
import * as Immutable from 'immutable';

export const pinValueSelector = (state, deviceId, pinId) => {
    let value = state.blynk.getIn(['devices', deviceId, 'pins', pinId]);
    if (value && !isNaN(value)) {
        value = parseFloat(Number(value).toFixed(2));
    }
    return value;
};

export const widgetDataStreamsHistorySelector = createCachedSelector(
    (state, widget) => widget,
    state => state.blynk.getIn(['devices']),
    (widget, devices) => {
        const dataStreamsHistory = [];
        widget.get('dataStreams', new Immutable.List()).forEach(dataStream => {
            const deviceId = dataStream.get('targetId');
            const pinId = dataStream.getIn(['pin', 'pinId']);
            dataStreamsHistory.push(devices.getIn([deviceId, 'pinsHistory', pinId]));
        });

        return dataStreamsHistory;
    },
)((state, widget) => widget.get('id'));
