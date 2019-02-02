import request from 'superagent';
import * as Immutable from 'immutable';
import pako from 'pako';
import * as d3 from 'd3';
import { SET_CONNECTION_PARAMS, SET_PIN_VALUE, SET_PROJECT, SET_PIN_HISTORY, SET_TOKEN } from './actionTypes';
import { listToMap } from '../../../utils/immutable';
import blynkWSClient from '../../../common/blynkWSClient';
import { getHttpBlynkUrl } from '../../../utils/connection';

/**
 * Setup connection options
 * @param token
 * @param serverHost
 * @param serverPort
 * @returns {{type: string, serverPort: *, serverHost: *, token: *}}
 */
export function setConnectionParams({ token, serverHost, serverPort, connectionMode }) {
    // Save base options to localstorage
    localStorage.setItem('blynk-web-client:token', token);
    localStorage.setItem('blynk-web-client:serverHost', serverHost);
    localStorage.setItem('blynk-web-client:serverPort', serverPort);
    localStorage.setItem('blynk-web-client:connectionMode', connectionMode);

    return {
        type: SET_CONNECTION_PARAMS,
        token,
        serverHost,
        serverPort,
        connectionMode,
    };
}

export function logout() {
    blynkWSClient.stop();
    localStorage.setItem('blynk-web-client:token', '');

    return {
        type: SET_TOKEN,
        token: '',
    };
}

/**
 * Get active blynk project
 * @returns {Function}
 */
export function getProject() {
    return async (dispatch, getState) => {
        const { token, serverHost, serverPort, connectionMode } = getState().blynk.toObject();

        let { body: project } = await request
            .get(`${getHttpBlynkUrl({ token, serverHost, serverPort, connectionMode })}/project`)
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
        const { token, serverHost, serverPort, connectionMode } = getState().blynk.toObject();

        await request
            .get(`${getHttpBlynkUrl({ token, serverHost, serverPort, connectionMode })}/isAppConnected`)
            .set('accept', 'json');
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

export function getPinHistory(pin) {
    return async (dispatch, getState) => {
        const { token, serverHost, serverPort, connectionMode } = getState().blynk.toObject();

        const res = await request
            .get(
                `${getHttpBlynkUrl({
                    token,
                    serverHost,
                    serverPort,
                    connectionMode,
                })}/data/${pin.toUpperCase()}`,
            )
            .responseType('blob');

        const processData = data =>
            new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const csv = pako.ungzip(reader.result, { to: 'string' });
                    const history = d3.csvParseRows(csv).map(item => [Number(item[1]), Number(item[0])]);
                    dispatch({
                        type: SET_PIN_HISTORY,
                        pin,
                        history,
                    });
                    resolve();
                };
                reader.readAsArrayBuffer(data);
            });
        await processData(res.body);
    };
}
