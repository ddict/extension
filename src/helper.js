const ex = chrome || browser

exports.closeTab = closeTab
exports.openTab = openTab
exports.getURL = getURL
exports.sendMsg = sendMsg
exports.isRTL = isRTL

function closeTab() {
    ex.tabs.getCurrent(function(tab) {
        chrome.tabs.remove(tab.id, function() {})
    })
}

function openTab(url) {
    ex.tabs.create({ url })
}

function getURL(path) {
    return ex.extension.getURL(path)
}

function sendMsg(data, cb) {
    ex.runtime.sendMessage(data, cb)
}

function isRTL(locale) {
    return ['ar', 'fa', 'iw', 'yi', 'ur', 'pa'].indexOf(locale) > -1
}
