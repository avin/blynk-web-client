export function decodeBlynkColor(blynkColor) {
    switch (blynkColor) {
        case 600084223: // Green
            return '#23C48E';
        case 1602017535: // Purple
            return '#5F7CD8';
        case 79755519: // Blue
            return '#04C0F8';
        case -308477697: // Orange
            return '#ED9D00';
        case -750560001: // Red
            return '#D3435C';
        case -1: // White
            return '#FFFFFF';
        case 255: // Black
            return '#293742';
        default:
    }
    return '#999';
}

export function numToCssColor(num) {
    const color = parseColor(num);
    if (color[0] === 0 && color[1] === 0 && color[2] === 0) {
        return undefined;
    }
    return `rgba(${color.join(', ')})`;
}

function convertARGBtoRGBA(color) {
    const a = (color & 0xff000000) >> 24;
    const r = (color & 0x00ff0000) >> 16;
    const g = (color & 0x0000ff00) >> 8;
    const b = color & 0x000000ff;

    return [r, g, b, a & 0xff];
}

function setAlphaComponent(color, alpha) {
    return (color & 0x00ffffff) | (alpha << 24);
}

function parseColor(value) {
    const decodedColor = Number(value);
    return convertARGBtoRGBA(setAlphaComponent(decodedColor, 255));
}
