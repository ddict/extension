var dom = require('./dom')
var scrolltop = require('scrolltop')
var scrollleft = require('scrollleft')
var selected = require('./selected_text')

module.exports = Bubble

function Bubble(opt) {
    if (!(this instanceof Bubble)) {
        return new Bubble(opt)
    }

    this.min_width = opt.min_width || 120

    this.dblclick = opt.dblclick
    this.shift = opt.shift
    this.btn = opt.btn

    this.spin = new Image()
    this.src_spin = opt.spin
    this.logo = new Image()
    this.src_logo = opt.logo
    this.tts_img = new Image()
    dom(this.tts_img)
        .src(opt.tts_img)
        .addClass('ddict_audio')

    this.class_wrapper = 'ddict_div'
    this.class_btn = 'ddict_btn'

    var self = this

    this.onText = opt.onText
    this.onClick = opt.onClick

    if (this.dblclick) {
        dom('body').on('dblclick', function(e) {
            self.show(e, 'dblclick')
        })
    }

    dom('body').on('keyup', function(e) {
        switch (e.keyCode) {
            case 16: //shift
                if (self.shift) {
                    self.show(e, 'shift')
                }
                break

            case 27: //esc
                self.hide()
                break
            default:
                break
        }
    })

    if (this.btn) {
        dom('body').on('mouseup', function(e) {
            setTimeout(function() {
                self.showButton(e)
            }, 100)
        })
    }

    //close
    dom('body').on('mousedown', function(e) {
        self.hide()
    })

    return this
}

Bubble.prototype.hide = function() {
    dom('.' + this.class_wrapper).remove()
    this.hideBtn()
}

Bubble.prototype.hideBtn = function() {
    dom('.' + this.class_btn).remove()
}

Bubble.prototype.show = function(e, src) {
    var self = this

    this.hideBtn()

    var select = selected(e)

    if (!select.text) {
        return
    }

    if (!select.text.trim().length) {
        return
    }

    // load later
    if (!this.spin.src) {
        self.spin.src = self.src_spin
    }

    var div = dom(document.createElement('div'))
        .addClass(self.class_wrapper)
        .appendTo('body')
        .on('mousedown', function(e) {
            if (e && e.target) {
                self.onClick(e)
            }

            e.cancelBubble = true

            if (e.stopPropagation) {
                e.stopPropagation()
            }
        })

    var top = select.bottom + 5

    if (select.textarea) {
        top = select.top === select.bottom ? select.top : select.bottom
        top += parseInt(div.css('line-height'), 10)
    }

    var style = {
        top: top + scrolltop() + 'px',
    }

    div.css(style)

    //text-align bug in ff
    const spinner = dom(document.createElement('p'))
        .css('textAlign', 'center')
        .append(self.spin)
    div.append(spinner)

    //center
    self.center(div, select)

    self.onText(select.text, src, function(data, rtl) {
        // remove spinner
        spinner.remove()

        var max_width = select.width
        max_width = max_width < self.min_width ? self.min_width : max_width

        style = {
            maxWidth: max_width + 'px',
        }

        if (rtl) {
            style['text-align'] = 'right'
            style.direction = 'rtl'
        }

        div.css(style)

        // tts img
        div.append(self.tts_img)

        // translit
        const translits = data.sentences.filter(
            sentence => sentence.src_translit
        )
        if (translits.length > 0) {
            const span = dom(document.createElement('span'))
                .addClass('ddict_translit')
                .text(translits[0].src_translit)

            const p = dom(document.createElement('p'))
            p.append(span)

            div.append(p)
        }

        // sentences
        const text = data.sentences
            .map(sentence => (sentence.trans ? sentence.trans : ''))
            .join('')
        div.append(
            dom(document.createElement('p'))
                .addClass('ddict_sentence')
                .text(text)
        )

        //center
        self.center(div, select)
    })
}

Bubble.prototype.showButton = function(e) {
    var self = this

    if (dom('.' + this.class_wrapper).length > 0) {
        return
    }

    var select = selected(e)

    if (!select.text) {
        return
    }

    if (!select.text.trim().length) {
        return
    }

    //load later
    if (!this.logo.src) {
        self.logo.src = self.src_logo
    }

    var div = dom(document.createElement('div'))
        .addClass(self.class_btn)
        .appendTo('body')
        .on('mousedown', function(_e) {
            self.show(e, 'btn')
            div.remove()

            _e.cancelBubble = true
            if (_e.stopPropagation) {
                _e.stopPropagation()
            }
        })

    var top = e.y || e.clientY
    var left = select.left + select.width

    var style = {
        top: top + scrolltop() + 'px',
        left: left + scrollleft() + 'px',
    }

    div.css(style)

    div.append(self.logo)
}

Bubble.prototype.center = function(div, select) {
    var left = select.left
    var div_width = parseInt(div.css('width'), 10) + 10 // + padding

    if (div_width < select.width) {
        left = left + (select.width - div_width) / 2
    } else {
        left = left - (div_width - select.width) / 2
    }

    if (left < 0) {
        left = 5
    }

    div.css({
        left: left + scrollleft() + 'px',
    })
}
