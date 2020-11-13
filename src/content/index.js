const helper = require('../helper')
const storage = require('../storage')

var Bubble = require('./bubble')

var bubble

function translate(text, cb) {
    helper.sendMsg({ channel: 'translate', data: text }, cb)
}

var spin = helper.getURL('/img/spin.gif')
var logo = helper.getURL('/logo/16.png')
var tts_img = helper.getURL('/img/audio.png')

////////////////////////////////////////////////////////////////////////

// get settings
storage.get('settings', settings => {
    if (!settings) return

    ddict(settings)
})

function ddict(settings) {
    bubble = Bubble({
        dblclick: settings.dbclick,
        shift: settings.shift,
        btn: settings.icon,
        spin: spin,
        logo: logo,
        tts_img: tts_img,
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
        translate(text, data => {
            // TODO: rtl
            const rtl = false

            callback(data, rtl)

            // TODO: audio
            // if (settings.tts) {
            //     audio(data.audio)
            // }
        })
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