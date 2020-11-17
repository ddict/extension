const ex = chrome || browser

const helper = require('../helper')
const sample = require('../sample')

// on install or update. check the details for more info
ex.runtime.onInstalled.addListener(() => {
    // open option page to set default settings
    helper.openTab(helper.getURL('/option/index.html'))
})

ex.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.channel) {
        case 'translate':
            setTimeout(() => {
                sendResponse(sample)
                return
            }, 2000)
            break

        default:
            sendResponse(null)
    }

    return true
})