const dom = require('component-dom')
const scrolltop = require('scrolltop')
const scrollleft = require('scrollleft')

const helper = require('../helper')

exports.create = create
exports.remove = remove
exports.setLocation = setLocation

// const
const CLASS_DDICT_WRAPPER = 'ddict_div'
const CLASS_DDICT_SPEAKER = 'ddict_audio'
const MIN_WIDTH = 120

function create(src_speaker, data, onTTS) {
    const wrapper = dom(document.createElement('div'))
        .addClass(CLASS_DDICT_WRAPPER)
        .appendTo('body')

    // speaker
    const speaker = new Image()
    speaker.src = src_speaker
    const speaker_wrapper = dom(speaker)
        .addClass(CLASS_DDICT_SPEAKER)
        .on('mousedown', e => {
            // call background for tts
            onTTS()

            // cancel another event listeners
            e.cancelBubble = true
            if (e.stopPropagation) e.stopPropagation()
        })
    wrapper.append(speaker_wrapper)

    // translit
    const translits = data.sentences.filter(sentence => sentence.src_translit)
    if (translits.length > 0) {
        const span = dom(document.createElement('span'))
            .addClass('ddict_translit')
            .text(translits[0].src_translit)

        const p = dom(document.createElement('p'))
        p.append(span)

        wrapper.append(p)
    }

    // sentences
    const text = data.sentences
        .map(sentence => (sentence.trans ? sentence.trans : ''))
        .join('')
    wrapper.append(
        dom(document.createElement('p'))
            .addClass('ddict_sentence')
            .text(text)
    )

    // dict
    if (data.dict && data.dict.length > 0) {
        for (dict of data.dict) {
            wrapper.append(document.createElement('hr'))

            const pos = dom(document.createElement('p'))
                .addClass('ddict_pos')
                .text(dict.pos)
            const terms = dom(document.createElement('p'))
                .addClass('ddict_terms')
                .text(dict.terms.join(', '))

            wrapper.append(pos)
            wrapper.append(terms)
        }
    }

    // spell
    if (data.spell) {
        wrapper.append(document.createElement('hr'))

        const p = dom(document.createElement('p'))
            .addClass('ddict_didumean')
            .text('Did you mean ')
        const spell = dom(document.createElement('span'))
            .addClass('ddict_spell')
            .text(data.ddict.spell)
        p.append(spell)

        wrapper.append(p)
    }

    // right to left lang
    if (helper.isRTL(data.target)) {
        wrapper.css({
            'text-align': 'right',
            direction: 'rtl',
        })
    }

    return wrapper
}

function remove(el) {
    el.remove()
    return null
}

function setLocation(el, e, select) {
    let top = select.bottom + 5

    if (select.textarea) {
        top = select.top === select.bottom ? select.top : select.bottom
        top += parseInt(el.css('line-height'), 10)
    }

    const style = {
        top: top + scrolltop() + 'px',
    }

    let max_width = select.width
    max_width = max_width < MIN_WIDTH ? MIN_WIDTH : max_width
    style.maxWidth = max_width + 'px'

    el.css(style)

    // center
    setCenter(el, select)
}

function setCenter(el, select) {
    let left = select.left
    const div_width = parseInt(el.css('width'), 10) + 10 // + padding

    if (div_width < select.width) {
        left = left + (select.width - div_width) / 2
    } else {
        left = left - (div_width - select.width) / 2
    }

    if (left < 0) {
        left = 5
    }

    el.css({
        left: left + scrollleft() + 'px',
    })
}
