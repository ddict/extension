<template>
    <div class="text-left">
        <hr />

        <div class="form-row">
            <div class="col">
                <select v-model="src" class="form-control">
                    <option v-for="(value, key) in sl" :value="key">
                        {{ value }}
                    </option>
                </select>
            </div>
            <div class="col">
                <select v-model="target" class="form-control">
                    <option v-for="(value, key) in tl" :value="key">
                        {{ value }}
                    </option>
                </select>
            </div>
        </div>

        <hr />

        <div class="form-group form-check">
            <input
                v-model="icon"
                type="checkbox"
                class="form-check-input"
                id="icon"
            />
            <label class="form-check-label" for="icon">
                <img src="/logo/16.png" />
                Icon
            </label>
            <small class="form-text text-muted">
                There will be a Ddict Icon when you select any words.
            </small>
        </div>

        <div class="form-group form-check">
            <input
                v-model="dbclick"
                type="checkbox"
                class="form-check-input"
                id="dbclick"
            />
            <label class="form-check-label" for="dbclick">
                Double click on words to translate
            </label>
        </div>

        <div class="form-group form-check">
            <input
                v-model="shift"
                type="checkbox"
                class="form-check-input"
                id="shift"
            />
            <label class="form-check-label" for="shift">
                Highlight text then press "Shift" button to translate
            </label>
        </div>

        <div class="form-group form-check">
            <input
                v-model="tts"
                type="checkbox"
                class="form-check-input"
                id="tts"
            />
            <label class="form-check-label" for="tts">
                Auto Speak/TTS
            </label>
        </div>

        <hr />

        <button class="btn btn-lg btn-secondary btn-block" @click="close()">
            Close
        </button>
    </div>
</template>

<script>
const translate = require('@ddict/translate')

const helper = require('../helper')
const storage = require('../storage')

const LABEL_SETTINGS = 'settings'
const DEFAULT_SETTINGS = {
    icon: true,
    dbclick: true,
    shift: true,
    tts: true,
}

module.exports = {
    data() {
        return {
            src: 'auto',
            target: 'vi',
            icon: false,
            dbclick: false,
            shift: false,
            tts: false,

            sl: {},
            tl: {},
        }
    },
    watch: {
        src() {
            this.save()
        },
        target() {
            this.save()
        },
        dbclick() {
            this.save()
        },
        shift() {
            this.save()
        },
        tts() {
            this.save()
        },
    },
    async created() {
        this.load(async settings => {
            if (settings) {
                const languages = await this.getLanguages(settings.target)
                this.sl = languages.sl
                this.tl = languages.tl

                this.src = settings.src
                this.target = settings.target
                this.dbclick = settings.dbclick
                this.shift = settings.shift
                this.tts = settings.tts
                return
            }

            settings = DEFAULT_SETTINGS
        })
    },
    methods: {
        async getUserCountry() {
            // TODO: handle error
            const rq = translate.google.getUserCountry()
            const res = await fetch(rq.url, {
                method: rq.method,
                headers: rq.headers,
            })

            const country = res.json()
            const code = language.mapLangFromCode(country.country)
            return code
        },
        async getLanguages(locale) {
            // TODO: handle error
            const rq = translate.google.getLanguages(locale)
            const res = await fetch(rq.url, {
                method: rq.method,
                headers: rq.headers,
            })
            const languages = res.json()
            return languages
        },
        close() {
            helper.closeTab()
        },
        save() {
            storage.set(LABEL_SETTINGS, {
                src: this.src,
                target: this.target,
                icon: this.icon,
                dbclick: this.dbclick,
                shift: this.shift,
                tts: this.tts,
            })
        },
        load(cb) {
            storage.get(LABEL_SETTINGS, settings => {
                cb(settings)
            })
        },
    },
}
</script>
