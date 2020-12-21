const ex = chrome || browser

const google = require('./google')

exports.closeTab = closeTab
exports.openTab = openTab
exports.getURL = getURL
exports.sendMsg = sendMsg
exports.isRTL = isRTL
exports.getDdictURL = getDdictURL

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

async function getDdictURL(settings) {
    let lang = ''
    if (!settings) {
        const code = await google.getUserCountry()
        lang = google.getLangFromCode(code)
    } else {
        lang = settings.target
    }

    let page = ''
    switch (lang) {
        case 'vi':
            page = 'index.html'
            break

        case 'ru':
            page = 'ru.html'
            break

        default:
            page = 'en.html'
    }

    return `https://ddict.me/${page}`
}
