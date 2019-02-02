import * as Immutable from 'immutable';
import { SET_CONNECTION_PARAMS, SET_PROJECT, SET_PIN_VALUE, SET_PIN_HISTORY, SET_TOKEN } from './actionTypes';
import { getWidgetPinAddress } from '../../../utils/data';

const defaultToken = localStorage.getItem('blynk-web-client:token');
const defaultServerHost = localStorage.getItem('blynk-web-client:serverHost') || 'blynk-cloud.com';
const defaultPort = Number(localStorage.getItem('blynk-web-client:serverPort')) || 8080;
const defaultConnectionMode = Number(localStorage.getItem('blynk-web-client:connectionMode')) || 'no-ssl';

const initialState = Immutable.fromJS({
    token: defaultToken,
    serverHost: defaultServerHost,
    serverPort: defaultPort,
    connectionMode: defaultConnectionMode,

    project: null,
    pins: {},
    pinsHistory: {},
});

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case SET_CONNECTION_PARAMS: {
            const { token, serverHost, serverPort, connectionMode } = action;
            return state
                .set('token', token)
                .set('serverHost', serverHost)
                .set('serverPort', serverPort)
                .set('connectionMode', connectionMode);
        }
        case SET_TOKEN: {
            const { token } = action;
            return state.set('token', token);
        }
        case SET_PROJECT: {
            let { project } = action;

            let widgets = project.get('widgets');
            let pins = state.get('pins');

            const processWidgetPin = widgetPinBlock => {
                const pin = widgetPinBlock.get('pin', -1);
                if (pin !== -1) {
                    const pinId = getWidgetPinAddress(widgetPinBlock);
                    pins = pins.set(pinId, widgetPinBlock.get('value'));
                    widgetPinBlock = widgetPinBlock.set('pinId', pinId);
                }
                return widgetPinBlock;
            };

            // Prepare pin ids and get exist pins values
            widgets = widgets.map(widget => {
                widget = processWidgetPin(widget);

                let widgetPins = widget.get('pins');
                if (widgetPins) {
                    widgetPins = widgetPins.map(widgetPinBlock => {
                        return processWidgetPin(widgetPinBlock);
                    });
                    widget = widget.set('pins', widgetPins);
                }

                let widgetDataStreams = widget.get('dataStreams');
                if (widgetDataStreams) {
                    widgetDataStreams = widgetDataStreams.map(widgetDataStream => {
                        return widgetDataStream.set('pin', processWidgetPin(widgetDataStream.get('pin')));
                    });
                    widget = widget.set('dataStreams', widgetDataStreams);
                }

                return widget;
            });

            project = project.set('widgets', widgets);

            return state.set('project', project).set('pins', pins);
        }
        case SET_PIN_VALUE: {
            const { pin, value } = action;
            return state.setIn(['pins', pin], value);
        }
        case SET_PIN_HISTORY: {
            const { pin, history } = action;
            return state.setIn(['pinsHistory', pin], history);
        }
        default:
            return state;
    }
}
