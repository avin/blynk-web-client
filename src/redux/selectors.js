import createCachedSelector from 're-reselect';
import * as Immutable from 'immutable';

export const pinValueSelector = (state, deviceId, pinId) => state.blynk.getIn(['devices', deviceId, 'pins', pinId]);

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
