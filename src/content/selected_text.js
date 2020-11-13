const textarea = require('textarea-caret')

module.exports = SelectedText

function SelectedText(event) {
    var selected_range, selected_rect, top, bottom, left, width, height

    var selected = window.getSelection()

    var selected_text = selected + ''

    var ele = event.target

    if (!selected_text.length) {
        if (!(ele && ele.selectionEnd)) {
            return false
        }

        selected_text = ele.value.substring(
            ele.selectionStart,
            ele.selectionEnd
        )
    }

    if ((selected + '').length) {
        selected_range = selected.getRangeAt(0)
        selected_rect = selected_range.getBoundingClientRect()

        top = selected_rect.top
        bottom = selected_rect.bottom
        left = selected_rect.left
        width = selected_rect.width
        height = selected_rect.height
    }

    if (!bottom && !left) {
        if (!ele.selectionEnd) {
            return false
        }

        var start = textarea(ele, ele.selectionStart)
        var end = textarea(ele, ele.selectionEnd)

        selected_rect = ele.getBoundingClientRect()

        left = selected_rect.left + start.left
        width = end.left - start.left

        if (start.top != end.top) {
            left = selected_rect.left
            width = selected_rect.width
        }

        top = selected_rect.top + start.top
        bottom = selected_rect.top + end.top
    }

    return {
        text: selected_text,
        top: top,
        bottom: bottom,
        left: left,
        width: width,
        textarea: !!end,
    }
}