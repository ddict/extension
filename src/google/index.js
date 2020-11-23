const Translate = require('@ddict/translate')

// default
const default_languages = require('./languages')

const DDICT_HEADER = 'https://ddict.me'

exports.getUserCountry = getUserCountry
exports.getLanguages = getLanguages
exports.translate = translate
exports.tts = tts

async function getUserCountry() {
    // default
    let country = { country: 'US' }
    let code = 'en'

    try {
        const rq = Translate.google.getUserCountry()
        const res = await fetch(rq.url, {
            method: rq.method,
            headers: rq.headers,
        })

        country = await res.json()
    } finally {
        code = Translate.language.mapLangFromCode(country.country)
    }

    return code
}

async function getLanguages(code) {
    try {
        const rq = Translate.google.getLanguages(code)
        const res = await fetch(rq.url, {
            method: rq.method,
            headers: rq.headers,
        })

        const languages = await res.json()
        return languages
    } catch (err) {
        return default_languages
    }
}

async function translate(lang = 'en', text, src, target) {
    try {
        const rq = Translate.google.translate(lang, text, src, target)

        // to tell extension header listener to enable the custom user-agent
        rq.headers.ddict = DDICT_HEADER

        const res = await fetch(rq.url, {
            method: rq.method,
            headers: rq.headers,
        })

        const data = await res.json()
        return data
    } catch (err) {
        throw err
    }
}

async function tts(lang = 'en', text, target) {
    try {
        const rq = Translate.google.tts(lang, text, 'input', target)

        // to tell extension header listener to enable the custom user-agent
        rq.headers.ddict = DDICT_HEADER

        const res = await fetch(rq.url, {
            method: rq.method,
            headers: rq.headers,
        })

        const data = await res.blob()
        return URL.createObjectURL(data)
    } catch (err) {
        throw err
    }
}
