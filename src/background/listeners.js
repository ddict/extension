const ex = chrome || browser

const DDICT_HEADER = 'GoogleTranslate/Ddict.me'

// Given a UserAgent object, will replace the "User-Agent" header in the
// map provided as requestHeaders.
function replaceHeader(requestHeaders) {
    console.log(requestHeaders)
    return requestHeaders

    var newHeaders = []
    for (var i = 0; i < requestHeaders.length; i++) {
        if (requestHeaders[i].name != 'User-Agent') {
            newHeaders.push(requestHeaders[i])
        } else {
            newHeaders.push({ name: 'User-Agent', value: DDICT_HEADER })
        }
    }
    return newHeaders
}

// Adds listeners that handle modifying headers on any request that comes through.
// Really only needs to be called once.
// The Listener can *not* be a callback.  It *must* be blocking.
function updateListeners() {
    if (!listener) {
        listener = function(details) {
            // We only want to modify requests that have a URL, and that have headers.
            // Any others are not interesting enough to have their headers modified.
            var header_map = { requestHeaders: details.requestHeaders }
            if (
                details &&
                details.url &&
                details.requestHeaders &&
                details.requestHeaders.length > 0
            ) {
                header_map = {
                    requestHeaders: replaceHeader(details.requestHeaders),
                }
            }
            return header_map
        }
    }
    ex.webRequest.onBeforeSendHeaders.addListener(
        listener,
        { urls: ['http://*/*', 'https://*/*'] },
        ['requestHeaders', 'blocking']
    )
}

var listener = null
updateListeners()