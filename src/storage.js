const ex = chrome || browser

exports.set = set
exports.get = get

function set(key, val) {
    const tmp = {}
    tmp[key] = val
    ex.storage.sync.set(tmp)
}

function get(key, cb) {
    ex.storage.sync.get([key], res => {
        cb(res[key])
    })
}
