import * as Immutable from 'immutable';
import {
    SET_CONNECTION_PARAMS,
    SET_PROJECT,
    SET_PIN_VALUE,
    SET_PIN_HISTORY,
    LOGOUT,
    SET_ACTIVE_TAB_ID,
} from './actionTypes';

const defaultTokens = (localStorage.getItem('blynk-web-client:tokens') || '').split(',');
const defaultServerHost = localStorage.getItem('blynk-web-client:serverHost') || 'blynk-cloud.com';
const defaultPort = Number(localStorage.getItem('blynk-web-client:serverPort')) || 8080;
const defaultConnectionMode = localStorage.getItem('blynk-web-client:connectionMode') || 'no-ssl';

const initialState = Immutable.fromJS({
    tokens: defaultTokens,
    serverHost: defaultServerHost,
    serverPort: defaultPort,
    connectionMode: defaultConnectionMode,

    activeTabId: 0,

    project: null,

    devices: {},
});

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case SET_CONNECTION_PARAMS: {
            const { tokens, serverHost, serverPort, connectionMode } = action;
            return state
                .set('tokens', tokens)
                .set('serverHost', serverHost)
                .set('serverPort', serverPort)
                .set('connectionMode', connectionMode);
        }
        case LOGOUT: {
            return state
                .set('tokens', new Immutable.List())
                .set('activeTabId', 0)
                .set('project', null)
                .set('pins', new Immutable.Map())
                .set('pinsHistory', new Immutable.Map())
                .set('pinsWriteHistory', new Immutable.Map())
                .set('devices', new Immutable.Map());
        }
        case SET_ACTIVE_TAB_ID: {
            const { tabId } = action;
            return state.set('activeTabId', tabId);
        }
        case SET_PROJECT: {
            const { project, devices } = action;

            return state.set('project', project).set('devices', devices);
        }
        case SET_PIN_VALUE: {
            const { deviceId, pin, value } = action;

            let device = state.getIn(['devices', deviceId]);

            device = device.setIn(['pins', pin], value);

            // Write value to pinsWriteHistory
            let pinWriteHistory = device.getIn(['pinsWriteHistory', pin], new Immutable.List());
            pinWriteHistory = pinWriteHistory.push(value);
            device = device.setIn(['pinsWriteHistory', pin], pinWriteHistory);

            return state.setIn(['devices', deviceId], device);
        }
        case SET_PIN_HISTORY: {
            const { deviceId, pin, history } = action;

            let device = state.getIn(['devices', deviceId]);
            device = device.setIn(['pinsHistory', pin], history);

            return state.setIn(['devices', deviceId], device);
        }
        default:
            return state;
    }
}
