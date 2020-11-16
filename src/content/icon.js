const dom = require('component-dom')
const scrolltop = require('scrolltop')
const scrollleft = require('scrollleft')

exports.create = create
exports.remove = remove
exports.setLocation = setLocation

// const
const CLASS_DDICT_BTN = 'ddict_btn'

// return icon dom
function create(logo_src, onClick) {
    const icon = new Image()
    icon.src = logo_src

    // create img wrapper and set the click event
    const wrapper = dom(document.createElement('div'))
        .addClass(CLASS_DDICT_BTN)
        .appendTo('body')
        .on('mousedown', e => {
            onClick(wrapper, e)

            // cancel another event listeners
            e.cancelBubble = true
            if (e.stopPropagation) e.stopPropagation()
        })

    wrapper.append(icon)
    return wrapper
}

function remove(el) {
    el.remove()
    return null
}

function setLocation(el, e, select) {
    const top = e.y || e.clientY
    const left = select.left + select.width

    el.css({
        top: top + scrolltop() + 'px',
        left: left + scrollleft() + 'px',
    })
}
