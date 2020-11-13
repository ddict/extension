const ex = chrome || browser

const helper = require('../helper')

// on install or update. check the details for more info
ex.runtime.onInstalled.addListener(details => {
    // open option page to set default settings
    helper.openTab(helper.getURL('/option/index.html'))
})

ex.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(
        sender.tab
            ? 'from a content script:' + sender.tab.url
            : 'from the extension'
    )
    // if (request.greeting == 'hello') sendResponse({ farewell: 'goodbye' })

    sendResponse('gaga')
})