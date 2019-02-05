import request from 'superagent';
import * as Immutable from 'immutable';
import pako from 'pako';
import * as d3 from 'd3';
import {
    SET_CONNECTION_PARAMS,
    SET_PIN_VALUE,
    SET_PROJECT,
    SET_PIN_HISTORY,
    LOGOUT,
    SET_ACTIVE_TAB_ID,
} from './actionTypes';
import { listToMap } from '../../../utils/immutable';
import blynkWSClient from '../../../common/blynkWSClient';
import { getHttpBlynkUrl } from '../../../utils/connection';
import { getWidgetPinAddress } from '../../../utils/data';

/**
 * Setup connection options
 * @param token
 * @param serverHost
 * @param serverPort
 * @param connectionMode
 * @returns {{type: string, serverPort: *, serverHost: *, token: *}}
 */
export function setConnectionParams({ tokens, serverHost, serverPort, connectionMode }) {
    // Save base options to localstorage
    localStorage.setItem('blynk-web-client:tokens', tokens.join(','));
    localStorage.setItem('blynk-web-client:serverHost', serverHost);
    localStorage.setItem('blynk-web-client:serverPort', serverPort);
    localStorage.setItem('blynk-web-client:connectionMode', connectionMode);

    return {
        type: SET_CONNECTION_PARAMS,
        tokens,
        serverHost,
        serverPort,
        connectionMode,
    };
}

export function logout() {
    return (dispatch, getState) => {
        localStorage.setItem('blynk-web-client:tokens', '');

        getState()
            .blynk.get('devices')
            .forEach(device => {
                blynkWSClient(device.get('id')).stop();
            });

        dispatch({
            type: LOGOUT,
        });
    };
}

/**
 * Get active blynk project
 * @returns {Function}
 */
export function getProject() {
    return async (dispatch, getState) => {
        const { tokens, serverHost, serverPort, connectionMode } = getState().blynk.toObject();

        let { body: project } = await request
            .get(`${getHttpBlynkUrl({ token: tokens.first(), serverHost, serverPort, connectionMode })}/project`)
            .set('accept', 'json');

        project = Immutable.fromJS(project);
        let devices = project.get('devices');
        devices = devices.map((device, idx) => {
            return device
                .set('token', tokens.get(idx))
                .set('pins', new Immutable.Map())
                .set('pinsHistory', new Immutable.Map())
                .set('pinsWriteHistory', new Immutable.Map());
        });

        devices = listToMap(devices, 'id');

        project = project.set('widgets', listToMap(project.get('widgets'), 'id'));

        let widgets = project.get('widgets');

        const processWidgetPin = (widgetPinBlock, deviceId) => {
            const pin = widgetPinBlock.get('pin', -1);
            const value = widgetPinBlock.get('value');
            if (pin !== -1) {
                const pinId = getWidgetPinAddress(widgetPinBlock);
                widgetPinBlock = widgetPinBlock.set('pinId', pinId);

                if (value !== undefined) {
                    devices = devices.setIn([deviceId, 'pins', pinId], value);
                }
            }
            return widgetPinBlock;
        };

        // Prepare pin ids and get exist pins values
        widgets = widgets.map(widget => {
            widget = processWidgetPin(widget, widget.get('deviceId'));

            let widgetPins = widget.get('pins');
            if (widgetPins) {
                widgetPins = widgetPins.map(widgetPinBlock => {
                    return processWidgetPin(widgetPinBlock, widget.get('deviceId'));
                });
                widget = widget.set('pins', widgetPins);
            }

            let widgetDataStreams = widget.get('dataStreams');
            if (widgetDataStreams) {
                widgetDataStreams = widgetDataStreams.map(widgetDataStream =>
                    widgetDataStream.set('pin', processWidgetPin(widgetDataStream.get('pin'), widget.get('deviceId'))),
                );
                widget = widget.set('dataStreams', widgetDataStreams);
            }

            return widget;
        });

        project = project.set('widgets', widgets);

        devices.forEach(device => {
            const token = device.get('token');
            const deviceId = device.get('id');

            // Connect to blynk ws server
            blynkWSClient(deviceId).init({
                token,
                serverHost,
                serverPort,
                connectionMode,
            });
            blynkWSClient(deviceId).addEventListener('write-pin', e => {
                const { pin, value } = e.detail;

                dispatch(setPinValue({ deviceId, pin, value }));
            });
        });

        dispatch({
            type: SET_PROJECT,
            project,
            devices,
        });
    };
}

/**
 * Test connection with blynk server
 * @returns {Function}
 */
export function testConnection() {
    return async (dispatch, getState) => {
        const { tokens, serverHost, serverPort, connectionMode } = getState().blynk.toObject();

        await request
            .get(`${getHttpBlynkUrl({ token: tokens.first(), serverHost, serverPort, connectionMode })}/isAppConnected`)
            .set('accept', 'json');
    };
}

/**
 * Set pin value
 * @param deviceId
 * @param pin - pin label
 * @param value - pin value
 * @returns {{pin: *, type: string, value: *}}
 */
export function setPinValue({ deviceId, pin, value }) {
    return {
        type: SET_PIN_VALUE,
        deviceId,
        pin,
        value,
    };
}

/**
 * Load pin history from server
 * @param pin
 * @param deviceId
 * @returns {Function}
 */
export function getPinHistory({ deviceId, pin }) {
    return async (dispatch, getState) => {
        const { serverHost, serverPort, connectionMode } = getState().blynk.toObject();

        const token = getState().blynk.getIn(['devices', deviceId, 'token']);

        try {
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
                            deviceId,
                            pin,
                            history,
                        });
                        resolve();
                    };
                    reader.readAsArrayBuffer(data);
                });
            await processData(res.body);
        } catch (e) {
            dispatch({
                type: SET_PIN_HISTORY,
                deviceId,
                pin,
                history: [],
            });
        }
    };
}

/**
 * Set active tab
 * @param tabId
 * @returns {{tabId: *, type: string}}
 */
export function setActiveTabId(tabId) {
    return {
        type: SET_ACTIVE_TAB_ID,
        tabId,
    };
}
