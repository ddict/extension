const ex = chrome || browser

const helper = require('../helper')

ex.runtime.onInstalled.addListener(function(details) {
    // open option page to set default settings
    helper.openTab(helper.getURL('/option/index.html'))
})