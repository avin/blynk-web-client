import * as Immutable from 'immutable';
import {
    SET_CONNECTION_PARAMS,
    SET_PROJECT,
    SET_PIN_VALUE,
    SET_PIN_HISTORY,
    LOGOUT,
    SET_ACTIVE_TAB_ID,
} from './actionTypes';
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

    activeTabId: 0,

    project: null,
    pins: {},
    pinsHistory: {},
    pinsWriteHistory: {},
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
        case LOGOUT: {
            return state
                .set('token', '')
                .set('activeTabId', 0)
                .set('project', null)
                .set('pins', new Immutable.Map())
                .set('pinsHistory', new Immutable.Map())
                .set('pinsWriteHistory', new Immutable.Map());
        }
        case SET_ACTIVE_TAB_ID: {
            const { tabId } = action;
            return state.set('activeTabId', tabId);
        }
        case SET_PROJECT: {
            let { project } = action;

            let widgets = project.get('widgets');
            let pins = state.get('pins');

            const processWidgetPin = widgetPinBlock => {
                const pin = widgetPinBlock.get('pin', -1);
                const value = widgetPinBlock.get('value');
                if (pin !== -1) {
                    const pinId = getWidgetPinAddress(widgetPinBlock);
                    widgetPinBlock = widgetPinBlock.set('pinId', pinId);

                    if (value !== undefined) {
                        pins = pins.set(pinId, value);
                    }
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

            // Write value to pinsWriteHistory
            let pinWriteHistory = state.getIn(['pinsWriteHistory', pin], new Immutable.List());
            pinWriteHistory = pinWriteHistory.push(value);
            state = state.setIn(['pinsWriteHistory', pin], pinWriteHistory);

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
