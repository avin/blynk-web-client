import repeat from '@avinlab/repeat';
import throttle from 'lodash/throttle';

const MsgType = {
    RESPONSE: 0,
    LOGIN: 2,
    PING: 6,
    TWEET: 12,
    EMAIL: 13,
    NOTIFY: 14,
    BRIDGE: 15,
    HW_SYNC: 16,
    HW_INFO: 17,
    HARDWARE: 20,
};

// eslint-disable-next-line no-unused-vars
const MsgStatus = {
    OK: 200,
    ILLEGAL_COMMAND: 2,
    NO_ACTIVE_DASHBOARD: 8,
    INVALID_TOKEN: 9,
    ILLEGAL_COMMAND_BODY: 11,
};

function getCommandByString(cmdString) {
    switch (cmdString) {
        case 'ping':
            return MsgType.PING;
        case 'login':
            return MsgType.LOGIN;
        case 'hardware':
            return MsgType.HARDWARE;
        case 'bridge':
            return MsgType.BRIDGE;
        case 'hwSync':
            return MsgType.HW_SYNC;
        default:
    }
}

function getStringByCommandCode(cmd) {
    switch (cmd) {
        case 0:
            return 'RESPONSE';
        case 20:
            return 'HARDWARE';
        default:
    }
}

// eslint-disable-next-line no-unused-vars
function getStatusByCode(statusCode) {
    switch (statusCode) {
        case 200:
            return 'OK';
        case 2:
            return 'ILLEGAL_COMMAND';
        case 8:
            return 'NO_ACTIVE_DASHBOARD';
        case 9:
            return 'INVALID_TOKEN';
        case 11:
            return 'ILLEGAL_COMMAND_BODY';
        default:
    }
}

/**
 * ArrayBuffer to string
 * @param buf
 * @returns {string}
 */
function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}

class EventHandler {
    constructor() {
        this._events = {};
    }

    addEventListener(event, action) {
        this._events[event] = this._events[event] || [];
        if (!this._events[event].includes(action)) {
            this._events[event].push(action);
        }
    }

    removeEventListener(event, action) {
        this._events[event] = this._events[event] || [];
        this._events[event] = this._events[event].filter(i => i !== action);
    }

    dispatchEvent(event, details) {
        this._events[event] = this._events[event] || [];
        this._events[event].forEach(eventHandler => {
            eventHandler(details);
        });
    }
}

class BlynkWSClient extends EventHandler {
    isRunning = false; // WS Connection status
    socket = null; // WS Socket
    pingTimer = null; // Internal ping timer
    token = null; // Blynk auth token
    debugging = false;

    /**
     * Init Blynk WS connection
     * @param token
     * @param serverHost
     * @param serverPort
     * @param connectionMode
     */
    init({ token, serverHost, serverPort, connectionMode }) {
        this.stop();
        this.token = token;

        this.socket = new WebSocket(
            `${connectionMode === 'no-ssl' ? 'ws' : 'wss'}://${serverHost}:${serverPort}/websockets`,
        );
        this.socket.binaryType = 'arraybuffer';

        this.socket.onmessage = this.handleWSMessage;
        this.socket.onopen = event => {
            this.start();
            this.debugging && console.info('WS: Connected');
        };
        this.socket.onclose = event => {
            this.stop();
            this.debugging && console.info('WS: Disconnected');
        };
        this.socket.onerror = event => {
            console.warn('WS: Error');
        };

        this.syncTimer = repeat({
            action: () => {
                this.sync();
            },
            delay: 1000,
            skipFirst: false,
        });
    }

    start() {
        if (this.isRunning) {
            return;
        }
        this.isRunning = true;

        this.send(`login ${this.token}`);

        this.send(`bridge 9999 i ${this.token}`);

        this.pingTimer = repeat({
            action: () => {
                this.send('ping');
            },
            delay: 1000 * 2,
            firstTimeDelay: 1000 * 2,
            skipFirst: true,
        });
        this.pingTimer.start();
    }

    setSyncTimerInterval(interval) {
        if (!interval) {
            this.syncTimer.stop();
        } else {
            this.syncTimer.updateDelay(interval);
            this.syncTimer.stop();
            this.syncTimer.start();
        }
    }

    sync() {
        this.send(`hwSync`);
    }

    stop() {
        if (!this.isRunning) {
            return;
        }

        this.isRunning = false;
        this.pingTimer.stop();
        this.socket.close();
    }

    handleWSMessage = event => {
        if (event.data instanceof ArrayBuffer) {
            const bufArray = event.data;

            const dataView = new DataView(bufArray);
            const msgCommand = dataView.getInt8(0);

            switch (msgCommand) {
                case MsgType.RESPONSE: {
                    this.debugging && console.info(this.messageToDebugString(bufArray));

                    break;
                }
                case MsgType.HARDWARE: {
                    this.handleHardwareMessage(ab2str(bufArray.slice(5)));
                    break;
                }
                default:
            }
        } else {
            console.warn(`WS: Unexpected type : ${event.data}`);
        }
    };

    messageToDebugString(bufArray) {
        const dataView = new DataView(bufArray);
        const cmdString = getStringByCommandCode(dataView.getInt8(0));
        const msgId = dataView.getUint16(1);
        const responseCode = getStatusByCode(dataView.getUint16(3));
        return `Command : ${cmdString}, msgId : ${msgId}, responseCode : ${responseCode}`;
    }

    /**
     * Send event `write-pin` to subscribers
     * @param pin
     * @param value
     */
    dispatchWritePin(pin, value) {
        this.dispatchEvent('write-pin', {
            pin: `${pin}`,
            value,
        });
    }

    /**
     * Send value to pin
     * @param pin
     * @param value
     * @param dontSend
     */
    sendWritePin(pin, value, dontSend = false) {
        const pinType = pin[0];
        const pinNumber = pin.slice(1);

        if (!dontSend) {
            this.throttleSend(pin)(`bridge 9999 ${pinType}w ${pinNumber} ${value}`);
        }

        this.dispatchWritePin(pin, value);
    }

    _throttleSendFunctions = {};
    throttleSend = pin => {
        this._throttleSendFunctions[pin] = this._throttleSendFunctions[pin] || throttle(this.send.bind(this), 100);
        return this._throttleSendFunctions[pin];
    };

    handleHardwareMessage(data) {
        const [type, pin, value] = data.split(String.fromCharCode(0));
        switch (type) {
            case 'vw': {
                // write virtual pin
                this.dispatchWritePin(`v${pin}`, value);
                break;
            }
            case 'aw': {
                // write analog pin
                this.dispatchWritePin(`a${pin}`, value);
                break;
            }
            case 'dw': {
                // write digital pin
                this.dispatchWritePin(`d${pin}`, value);
                break;
            }
            default:
        }
    }

    send(data) {
        if (!this.isRunning) {
            return;
        }
        if (this.socket.readyState !== WebSocket.OPEN) {
            return;
        }

        const commandAndBody = data.split(' ');
        const message = this.createMessage(commandAndBody);

        this.debugging && console.info(`WS sending : ${data}`);

        this.socket.send(message);
    }

    createMessage(commandAndBody) {
        const cmdString = commandAndBody[0];
        const cmdBody = commandAndBody.length > 1 ? commandAndBody.slice(1).join('\0') : null;
        const cmd = getCommandByString(cmdString);
        return this.buildBlynkMessage(cmd, 1, cmdBody);
    }

    buildBlynkMessage(cmd, msgId, cmdBody) {
        const BLYNK_HEADER_SIZE = 5;
        const bodyLength = cmdBody ? cmdBody.length : 0;
        const bufArray = new ArrayBuffer(BLYNK_HEADER_SIZE + bodyLength);
        const dataView = new DataView(bufArray);
        dataView.setInt8(0, cmd);
        dataView.setInt16(1, msgId);
        dataView.setInt16(3, bodyLength);
        if (bodyLength > 0) {
            for (let i = 0, offset = 5; i < cmdBody.length; i += 1, offset += 1) {
                dataView.setInt8(offset, cmdBody.charCodeAt(i));
            }
        }
        return new Uint8Array(bufArray);
    }
}

class BlynkWSMultiClient {
    _clients = {};

    getBlynkWSClient = deviceId => {
        if (!this._clients[String(deviceId)]) {
            this._clients[String(deviceId)] = new BlynkWSClient();
        }
        return this._clients[String(deviceId)];
    };
}

const blynkWSMultiClient = new BlynkWSMultiClient();

export default blynkWSMultiClient.getBlynkWSClient;
