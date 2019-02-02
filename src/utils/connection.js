export function getHttpBlynkUrl({ token, serverHost, serverPort, connectionMode }) {
    return `${connectionMode === 'no-ssl' ? 'http' : 'https'}://${serverHost}:${serverPort}/${token}`;
}
