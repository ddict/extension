const helper = require('../helper')
const storage = require('../storage')

var Bubble = require('./bubble')

var bubble

function send(data, callback) {
    chrome.runtime.sendMessage(data, callback)
}

var spin = helper.getURL('/img/spin.gif')
var logo = helper.getURL('/logo/16.png')

////////////////////////////////////////////////////////////////////////

// get settings
storage.get('settings', settings => {
    if (!settings) return

    ddict(settings)
})

function ddict(settings) {
    bubble = Bubble({
        dblclick: settings.dblclick,
        shift: settings.shift,
        btn: settings.icon,
        spin: spin,
        logo: logo,
        onText: onText,
        onClick: function(e) {
            //audio
            if (!e) {
                return
            }

            if (!(e.target && e.target.className)) {
                return
            }

            if (e.target.className !== 'ddict_audio') {
                return
            }

            audio(e.target.dataset.url)
        },
    })

    function onText(text, src, callback) {
        translate(text, src, function(data) {
            callback(data.html, data.rtl)

            if (settings.tts) {
                audio(data.audio)
            }
        })
    }

    function translate(text, src, callback) {
        send(
            {
                channel: 'translate',
                src: src || 'content',
                data: text,
            },
            function(data) {
                callback(data)
            }
        )
    }

    function audio(url) {
        if (!url) {
            return
        }

        send(
            {
                channel: 'audio',
                data: url,
            },
            function() {}
        )
    }
}