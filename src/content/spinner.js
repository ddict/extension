const dom = require('component-dom')
const scrolltop = require('scrolltop')
const scrollleft = require('scrollleft')

exports.create = create
exports.remove = remove
exports.setLocation = setLocation

// const
const CLASS_DDICT_WRAPPER = 'ddict_div'

function create(src_spin) {
    const spin = new Image()
    spin.src = src_spin

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
