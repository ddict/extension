const helper = require('../helper')
const storage = require('../storage')

var Bubble = require('./bubble')

var bubble

function translate(text, cb) {
    helper.sendMsg({ channel: 'translate', data: text }, cb)
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
    console.log(settings)
    bubble = Bubble({
        dblclick: settings.dbclick,
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
        translate(text, data => {
            // get translated text
            const translated_text = data.sentences
                .map(sentence => sentence.trans)
                .join('')

            // TODO: rtl
            const rtl = false

            callback(translated_text, rtl)

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