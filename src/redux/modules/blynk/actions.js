import request from 'superagent';
import * as Immutable from 'immutable';
import { SET_CONNECTION_PARAMS, SET_PIN_VALUE, SET_PROJECT } from './actionTypes';
import { listToMap } from '../../../utils/immutable';

/**
 * Setup connection options
 * @param token
 * @param serverHost
 * @param serverPort
 * @returns {{type: string, serverPort: *, serverHost: *, token: *}}
 */
export function setConnectionParams({ token, serverHost, serverPort }) {
    // Save base options to localstorage
    localStorage.setItem('blynk-web-client:token', token);
    localStorage.setItem('blynk-web-client:serverHost', serverHost);
    localStorage.setItem('blynk-web-client:serverPort', serverPort);

    return {
        type: SET_CONNECTION_PARAMS,
        token,
        serverHost,
        serverPort,
    };
}

/**
 * Get active blynk project
 * @returns {Function}
 */
export function getProject() {
    return async (dispatch, getState) => {
        const { token, serverHost, serverPort } = getState().blynk.toObject();

        let { body: project } = await request
            .get(`http://${serverHost}:${serverPort}/${token}/project`)
            .set('accept', 'json');

        project = Immutable.fromJS(project);

        project = project.set('widgets', listToMap(project.get('widgets'), 'id'));

        dispatch({
            type: SET_PROJECT,
            project,
        });
    };
}

/**
 * Test connection with blynk server
 * @returns {Function}
 */
export function testConnection() {
    return async (dispatch, getState) => {
        const { token, serverHost, serverPort } = getState().blynk.toObject();

        await request.get(`http://${serverHost}:${serverPort}/${token}/isAppConnected`).set('accept', 'json');
    };
}

/**
 * Set pin value
 * @param pin - pin label
 * @param value - pin value
 * @returns {{pin: *, type: string, value: *}}
 */
export function setPinValue(pin, value) {
    return {
        type: SET_PIN_VALUE,
        pin,
        value,
    };
}
