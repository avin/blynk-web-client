/* eslint-disable no-bitwise */
export function numToCssColor(num) {
    const color = parseColor(num);
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
