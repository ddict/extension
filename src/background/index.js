const ex = chrome || browser

const helper = require('../helper')
const sample = require('../sample')

// on install or update. check the details for more info
ex.runtime.onInstalled.addListener(() => {
    // open option page to set default settings
    helper.openTab(helper.getURL('/option/index.html'))
    helper.openTab(helper.getURL('/popup/index.html'))
})

// testing purpose
const sample_tts_url = 'http://www.jingle.org/westwood8.mp3'

ex.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.channel) {
        case 'translate':
            setTimeout(() => {
                sample.src = 'en'
                sample.target = 'vi'
                sendResponse(sample)
                return
            }, 2000)
            break

        case 'tts':
            console.log('tts', request.data)
            sendResponse(true)
            break

        case 'tts_urls':
            console.log('tts_urls', request.data)
            sendResponse({
                src_urls: ['http://www.jingle.org/westwood8.mp3'],
                target_urls: ['http://www.jingle.org/westwood8.mp3', 'http://www.jingle.org/westwood8.mp3'],
            })
            break

        default:
            sendResponse(null)
    }

    return true
})