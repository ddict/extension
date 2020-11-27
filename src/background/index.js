const ex = chrome || browser

const helper = require('../helper')
const storage = require('../storage')
const google = require('../google')

const ERROR_LABEL =
    'There is an issue with the Google Translate server. Please contact me at https://ddict.me'

// on install or update. check the details for more info
ex.runtime.onInstalled.addListener(() => {
    // open option page to set default settings
    helper.openTab(helper.getURL('/option/index.html'))
    helper.openTab('https://ddict.me')
})

ex.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.channel) {
        case 'translate':
            translate(request.data, (data, autoTTS) => {
                sendResponse(data)

                // auto tts & dictionary
                if (autoTTS && data.dict) {
                    tts(request.data, data.src, url => {
                        play(url)
                    })
                }
            })
            break

        // from content
        case 'tts_content':
            tts(request.data.text, request.data.src, url => {
                play(url)
                sendResponse(true)
            })
            break

        case 'tts_popup':
            tts(request.data.src_text, request.data.src, src_url => {
                tts(
                    request.data.target_text,
                    request.data.target,
                    target_url => {
                        sendResponse({
                            src_urls: [src_url],
                            target_urls: [target_url],
                        })
                    }
                )
            })
            break

        default:
            sendResponse(null)
    }

    return true
})

function translate(text, cb) {
    storage.get('settings', async settings => {
        try {
            const data = await google.translate(
                settings.lang,
                text,
                settings.src,
                settings.target
            )

            cb(data, settings.tts)
        } catch (err) {
            alert(ERROR_LABEL)
            cb({})
        }
    })
}

function tts(text, target, cb) {
    storage.get('settings', async settings => {
        try {
            const url = await google.tts(settings.lang, text, target)
            cb(url)
        } catch (err) {
            alert(ERROR_LABEL)
            cb()
        }
    })
}

function play(url) {
    if (!url) return
    const player = new Audio()
    player.src = url
    player.play().catch(() => {})
}