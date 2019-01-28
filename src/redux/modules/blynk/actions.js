import request from 'superagent';
import { SET_CONNECTION_PARAMS, SET_PROJECT } from './actionTypes';

export function setConnectionParams({ token, serverHost, serverPort }) {
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

export function getProject() {
    return async (dispatch, getState) => {
        const { token, serverHost, serverPort } = getState().blynk.toObject();

        const { body: project } = await request
            .get(`http://${serverHost}:${serverPort}/${token}/project`)
            .set('accept', 'json');

        dispatch({
            type: SET_PROJECT,
            project,
        });
    };
}

export function testConnection() {
    return async (dispatch, getState) => {
        const { token, serverHost, serverPort } = getState().blynk.toObject();

        await request.get(`http://${serverHost}:${serverPort}/${token}/isAppConnected`).set('accept', 'json');
    };
}

// const blynk = new Blynk.Blynk('e9bf0d151b96431________', {
//     connector: new Blynk.WsClient({
//         addr: 'xxx.in',
//         port: 8080,
//         path: '/websockets',
//     }),
// });
// fetch(`http://xxx.in:8080/e9bf0d151b96431________/project`)
//     .then(res => res.json())
//     .then(data => {
//         console.log('data', data);
//     })
//     .catch(e => {
//         console.warn(e);
//     });
