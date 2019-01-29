export function getWidgetPinAddress(widget) {
    return widget.get('pinType')[0].toLowerCase() + widget.get('pin');
}
