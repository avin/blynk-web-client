import createCachedSelector from 're-reselect';

export const pinValueSelector = (state, pinId) => state.blynk.getIn(['pins', pinId]);

export const widgetDataStreamsHistorySelector = createCachedSelector(
    (state, widget) => widget,
    state => state.blynk.get('pinsHistory'),
    (widget, pinsHistory) => {
        const dataStreamsHistory = [];
        widget.get('dataStreams').forEach(dataStream => {
            const pinId = dataStream.getIn(['pin', 'pinId']);
            dataStreamsHistory.push(pinsHistory.get(pinId));
        });

        return dataStreamsHistory;
    },
)((state, widget) => widget.get('id'));
