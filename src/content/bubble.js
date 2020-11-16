const dom = require('component-dom')
const scrolltop = require('scrolltop')
const scrollleft = require('scrollleft')

exports.create = create
exports.remove = remove
exports.setLocation = setLocation

// const
const CLASS_DDICT_WRAPPER = 'ddict_div'
const CLASS_DDICT_SPEAKER = 'ddict_audio'
const MIN_WIDTH = 120

function create(spin_src) {
    const spin = new Image()
    spin.src = spin_src

    const wrapper = dom(document.createElement('div'))
        .addClass(CLASS_DDICT_WRAPPER)
        .appendTo('body')
        .on('mousedown', function(e) {
            // cancel another event listeners
            e.cancelBubble = true
            if (e.stopPropagation) e.stopPropagation()
        })

    // spin
    // text-align bug in ff
    const spinner = dom(document.createElement('p'))
        .css('textAlign', 'center')
        .append(spin)
    wrapper.append(spinner)

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

    el.css({
        top: top + scrolltop() + 'px',
    })

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

// dom(this.tts_img)
//     .src(opt.tts_img)
//     .addClass('ddict_audio')

// Bubble.prototype.show = function(e, src) {
//     self.onText(select.text, src, function(data, rtl) {
//         // remove spinner
//         spinner.remove()
//
//         var max_width = select.width
//         max_width = max_width < self.min_width ? self.min_width : max_width
//
//         style = {
//             maxWidth: max_width + 'px',
//         }
//
//         if (rtl) {
//             style['text-align'] = 'right'
//             style.direction = 'rtl'
//         }
//
//         div.css(style)
//
//         // tts img
//         div.append(self.tts_img)
//
//         // translit
//         const translits = data.sentences.filter(
//             sentence => sentence.src_translit
//         )
//         if (translits.length > 0) {
//             const span = dom(document.createElement('span'))
//                 .addClass('ddict_translit')
//                 .text(translits[0].src_translit)
//
//             const p = dom(document.createElement('p'))
//             p.append(span)
//
//             div.append(p)
//         }
//
//         // sentences
//         const text = data.sentences
//             .map(sentence => (sentence.trans ? sentence.trans : ''))
//             .join('')
//         div.append(
//             dom(document.createElement('p'))
//                 .addClass('ddict_sentence')
//                 .text(text)
//         )
//
//         //center
//         self.center(div, select)
//     })
// }
