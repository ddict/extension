const helper = require('../helper')

var Bubble = require('./bubble')

var bubble

function send(data, callback) {
    // chrome.runtime.sendMessage(data, callback);

    // TODO: call chrome send message
    console.log(data)

    const settings = {
        dblclick: true,
        shift: true,
        btn: true,
    }

    switch (data.channel) {
        case 'get':
            callback(settings)
            break

        case 'translate':
            callback({
                html: '<p>hello</p>',
                rtl: true,
            })
            break

        default:
            callback(null)
    }
}

var spin = helper.getURL('/img/spin.gif')
var logo = helper.getURL('/logo/16.png')

////////////////////////////////////////////////////////////////////////

send({ channel: 'get' }, function(settings) {
    ddict(settings)
})

function ddict(settings) {
    bubble = Bubble({
        dblclick: settings.dblclick,
        shift: settings.shift,
        btn: settings.btn,
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

            if (settings.auto_audio) {
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