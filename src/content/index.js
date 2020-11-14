const helper = require('../helper')
const storage = require('../storage')

const selected = require('./selected_text')
const bubble = require('./bubble')

const dom = require('component-dom')
var scrolltop = require('scrolltop')
var scrollleft = require('scrollleft')

// const
const CLASS_DDICT_BTN = 'ddict_btn'

// media
const img_spin = helper.getURL('/img/spin.gif')
const img_logo = helper.getURL('/logo/16.png')
const img_speaker = helper.getURL('/img/audio.png')

// get settings
storage.get('settings', settings => {
    if (!settings) return

    init(settings)
})

// listen for selected text
function init(settings) {
    // dbclick
    if (settings.dbclick) {
        dom('body').on('dblclick', function(e) {
            check(e)
        })
    }

    // shift
    if (settings.shift) {
        dom('body').on('keyup', function(e) {
            if (e && e.keyCode === 16) {
                check(e)
            }
        })
    }

    // ddict icon
    if (settings.icon) {
        dom('body').on('mouseup', function(e) {
            // setTimeout(function() {
            check(e)
            // }, 100)
        })
    }
}

function check(e, icon) {
    const select = getSelectedText(e)
    if (!select) {
        return
    }

    if (icon) {
        showIcon(e, select)
        return
    }

    openBubble(e, select)
}

function getSelectedText(e) {
    var select = selected(e)

    if (!select.text) {
        return
    }

    if (!select.text.trim().length) {
        return
    }
}

function showIcon(e, select) {
    const logo = new Image()
    logo.src = img_logo

    // create img wrapper and set the click event
    const div = dom(document.createElement('div'))
        .addClass(CLASS_DDICT_BTN)
        .appendTo('body')
        .on('mousedown', function(_e) {
            openBubble(_e, select)
            div.remove()

            // TODO: ???
            // _e.cancelBubble = true
            // if (_e.stopPropagation) {
            //     _e.stopPropagation()
            // }
        })

    // position
    const top = e.y || e.clientY
    const left = select.left + select.width

    div.css({
        top: top + scrolltop() + 'px',
        left: left + scrollleft() + 'px',
    })

    div.append(logo)
}

function openBubble() {
    bubble({
        spin: (new Image().src = img_spin),
        speaker: (new Image().src = img_speaker),

        translate: translate,
    })
}

function translate(text, cb) {
    helper.sendMsg({ channel: 'translate', data: text }, cb)
}