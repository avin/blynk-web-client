import * as Immutable from 'immutable';
import { SET_CONNECTION_PARAMS, SET_PROJECT, SET_PIN_VALUE } from './actionTypes';

const defaultToken = localStorage.getItem('blynk-web-client:token');
const defaultServerHost = localStorage.getItem('blynk-web-client:serverHost') || 'blynk-cloud.com';
const defaultPort = Number(localStorage.getItem('blynk-web-client:serverPort')) || 8082;

const initialState = Immutable.fromJS({
    token: defaultToken,
    serverHost: defaultServerHost,
    serverPort: defaultPort,

    project: null,
    pins: {},
});

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case SET_CONNECTION_PARAMS: {
            const { token, serverHost, serverPort } = action;
            return state
                .set('token', token)
                .set('serverHost', serverHost)
                .set('serverPort', serverPort);
        }
        case SET_PROJECT: {
            const { project } = action;
            return state.set('project', project);
        }
        case SET_PIN_VALUE: {
            const { pin, value } = action;
            return state.setIn(['pins', pin], value);
        }
        default:
            return state;
    }
}
