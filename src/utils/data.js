export function getWidgetPinAddress(widget) {
    if (widget.get('pin') === -1) {
        return -1;
    }
    return widget.get('pinType')[0].toLowerCase() + widget.get('pin');
}
