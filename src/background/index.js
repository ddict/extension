const ex = chrome || browser

const helper = require('../helper')
const sample = require('../sample')

// on install or update. check the details for more info
ex.runtime.onInstalled.addListener(details => {
    // open option page to set default settings
    helper.openTab(helper.getURL('/option/index.html'))
})

ex.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.channel) {
        case 'translate':
            sendResponse(sample)
            break

        default:
            sendResponse(null)
    }

    return
})