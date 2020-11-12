module.exports = function() {
    if (window.pageXOffset) return window.pageXOffset
    return document.documentElement.clientWidth
        ? document.documentElement.scrollLeft
        : document.body.scrollLeft
}