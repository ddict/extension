const helper = require('../helper')
const storage = require('../storage')

const selected = require('./selected_text')
const bubble = require('./bubble')
const icon = require('./icon')

const dom = require('component-dom')

// media
const img_spin = helper.getURL('/img/spin.gif')
const img_logo = helper.getURL('/logo/16.png')
const img_speaker = helper.getURL('/img/audio.png')

// only 1 icon and bubble in lifetime
let ICON, BUBBLE

// get settings
storage.get('settings', settings => {
    if (!settings) return

    init(settings)
})

// listen for selected text
function init(settings) {
    // dbclick
    if (settings.dbclick) {
        dom('html').on('dblclick', e => {
            check(e)
        })
    }

    // shift
    if (settings.shift) {
        dom('html').on('keyup', e => {
            if (e && e.keyCode === 16) {
                check(e)
            }
        })
    }

    // ddict icon
    if (settings.icon) {
        dom('html').on('mouseup', e => {
            // no icon if there is bubble
            if (BUBBLE) {
                return
            }

            check(e, true)
        })
    }

    // close event
    dom('html').on('mousedown', e => {
        removeIcon()
        removeBubble()
    })

    // esc
    dom('html').on('keyup', e => {
        if (e && e.keyCode === 27) {
            removeIcon()
            removeBubble()
        }
    })
}

function check(e, isIcon) {
    const select = getSelectedText(e)
    if (!select) {
        removeIcon()
        return
    }

    if (isIcon) {
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

    return select
}

function showIcon(e, select) {
    // remove existing icons
    removeIcon()

    ICON = icon.create(img_logo, (el, _e) => {
        removeIcon()
        openBubble(_e, select)
    })

    icon.setLocation(ICON, e, select)
}

function removeIcon() {
    if (ICON) {
        icon.remove(ICON)
        ICON = null
    }
}

function openBubble(e, select) {
    removeIcon()
    removeBubble()

    BUBBLE = bubble.create(img_spin)
    bubble.setLocation(BUBBLE, e, select)
}

function removeBubble() {
    if (BUBBLE) {
        bubble.remove(BUBBLE)
        BUBBLE = null
    }
}

function translate(text, cb) {
    helper.sendMsg({ channel: 'translate', data: text }, cb)
}