const Translate = require('@ddict/translate')

// default
const default_languages = require('./languages')

const DDICT_HEADER = 'https://ddict.me'
const MAX_LENGTH = 5000

exports.getCountries = Translate.language.getCountries
exports.getUserCountry = getUserCountry
exports.getLangFromCode = getLangFromCode
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
        return country.country
    }
}

function getLangFromCode(code) {
    return Translate.language.mapLangFromCode(code)
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
    if (text.length > MAX_LENGTH) {
        alert(`Maximum text length exceeded: ${MAX_LENGTH}`)
        return {}
    }

    const rq = Translate.google.translate(lang, text, src, target)

    // to tell extension header listener to enable the custom user-agent
    rq.headers.ddict = DDICT_HEADER

    const res = await fetch(rq.url, {
        method: rq.method,
        headers: rq.headers,
    })

    const data = await res.json()
    // inject for more info
    data.text = text
    data.target = target
    
    return data
}

async function tts(lang = 'en', text, target) {
    const rq = Translate.google.tts(lang, text, 'input', target)
    // return rq.url

    // enable below if google require their header for tts
    
    // to tell extension header listener to enable the custom user-agent
    rq.headers.ddict = DDICT_HEADER

    const res = await fetch(rq.url, {
        method: rq.method,
        headers: rq.headers,
    })

    const data = await res.blob()
    return URL.createObjectURL(data)
}
