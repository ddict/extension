const translate = require('@ddict/translate')

// default
const default_languages = require('./languages')

exports.getUserCountry = getUserCountry
exports.getLanguages = getLanguages

async function getUserCountry() {
    // default
    let country = { country: 'US' }
    let code = 'en'

    try {
        const rq = translate.google.getUserCountry()
        const res = await fetch(rq.url, {
            method: rq.method,
            headers: rq.headers,
        })

        country = await res.json()
    } finally {
        code = translate.language.mapLangFromCode(country.country)
    }

    return code
}

async function getLanguages(code) {
    try {
        const rq = translate.google.getLanguages(code)
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
