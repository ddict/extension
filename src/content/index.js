const helper = require('../helper')
const storage = require('../storage')

const selected = require('./selected_text')
const icon = require('./icon')
const spinner = require('./spinner')
const bubble = require('./bubble')

const dom = require('component-dom')

// media
const src_spin = helper.getURL('/img/spin.gif')
const src_logo = helper.getURL('/logo/16.png')
const src_speaker = helper.getURL('/img/audio.png')

// only 1 icon and bubble in lifetime
let ICON, SPINNER, BUBBLE

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
            // we need to set delay a little bit
            // because when bubble close
            // the icon may show up
            // before the selected text disapear
            setTimeout(() => {
                // no icon if there is bubble
                if (SPINNER || BUBBLE) {
                    return
                }

                check(e, true)
            }, 20)
        })
    }

    // close event
    dom('html').on('mousedown', () => {
        clean()
    })

    dom('html').on('keyup', e => {
        if (e && e.keyCode === 27) {
            // esc
            clean()
        }
    })
}

function clean() {
    removeIcon()
    removeBubble()
}

function check(e, isIcon) {
    const select = getSelectedText(e)
    if (!select) {
        clean()
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

    ICON = icon.create(src_logo, (el, _e) => {
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
    removeSpinner()
    clean()

    SPINNER = spinner.create(src_spin)
    spinner.setLocation(SPINNER, e, select)

    translate(select.text, data => {
        removeSpinner()

        BUBBLE = bubble.create(src_speaker, data, () => {
            tts(data)
        })
        bubble.setLocation(BUBBLE, e, select)
    })
}

function removeSpinner() {
    if (SPINNER) {
        spinner.remove(SPINNER)
        SPINNER = null
    }
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

function tts(text) {
    helper.sendMsg({ channel: 'tts', data: text })
}