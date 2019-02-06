import escape from 'lodash/escape';
import escapeRegExp from 'lodash/escapeRegExp';
import isNumber from 'lodash/isNumber';

export function getWidgetPinAddress(widget) {
    if (widget.get('pin') === -1) {
        return -1;
    }
    return widget.get('pinType')[0].toLowerCase() + widget.get('pin');
}

export function makeValueSpan(valueStr) {
    return `<span class="pinValue">${escape(valueStr)}</span>`;
}

export function formatValueString(value, valueFormatting, pinExpression = 'pin') {
    if (!valueFormatting) {
        if (isNumber(value)) {
            value = parseFloat(Number(value).toFixed(2));
        }
        return `<span class="pinValue">${escape(value)}</span>`;
    }

    return valueFormatting.replace(new RegExp(`/${escapeRegExp(pinExpression)}([.]?([#]*))/`), function(g1, g2, g3) {
        let result;
        if (g2) {
            result = parseFloat(Number(value).toFixed(g3.length));
        } else {
            result = value;
        }
        return makeValueSpan(String(result));
    });
}
