// closest polyfill
if (!Element.prototype.closest) {
    Element.prototype.closest = function(css) {
        let node = this;

        while (node) {
            if (node.matches(css)) {
                return node;
            }

            node = node.parentElement;
        }
        return null;
    };
}

// matches polyfill
if (!Element.prototype.matches) {
    Element.prototype.matches =
        Element.prototype.matchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector;
}
