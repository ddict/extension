<template>
    <div class="text-left">
        <div class="text-right">
            <select v-model="code">
                <option v-for="code in countries" :key="code" :value="code">
                    {{ flag(code) }}
                </option>
            </select>
        </div>
        <hr />

        <div class="form-row">
            <div class="col">
                <select v-model="src" class="form-control">
                    <option v-for="(value, key) in sl" :key="key" :value="key">
                        {{ value }}
                    </option>
                </select>
            </div>
            <div class="col">
                <select v-model="target" class="form-control">
                    <option v-for="(value, key) in tl" :key="key" :value="key">
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
                Auto Speak/TTS on Dictionary.
            </label>
        </div>

        <hr />

        <button class="btn btn-lg btn-secondary btn-block" @click="close()">
            Close
        </button>
    </div>
</template>

<script>
const flag = require('emoji-flag')

const helper = require('../helper')
const storage = require('../storage')
const google = require('../google')

const LABEL_SETTINGS = 'settings'
const DEFAULT_SETTINGS = {
    code: 'VN',

    src: 'auto',
    target: 'vi',
    icon: true,
    dbclick: true,
    shift: true,
    tts: true,
}

module.exports = {
    data() {
        return {
            code: '',
            countries: google.getCountries(),

            src: 'auto',
            target: '',
            icon: false,
            dbclick: false,
            shift: false,
            tts: false,

            lang: '',
            sl: {},
            tl: {},
        }
    },
    watch: {
        async code(code) {
            this.lang = google.getLangFromCode(code)

            const languages = await google.getLanguages(this.lang)
            this.sl = languages.sl
            this.tl = languages.tl

            this.target = this.lang

            this.save()
        },
        icon() {
            this.save()
        },
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
            if (!settings) {
                this.code = await google.getUserCountry()
                settings = DEFAULT_SETTINGS
            } else {
                this.code = settings.code
            }

            this.src = settings.src
            this.target = settings.target
            this.icon = settings.icon
            this.dbclick = settings.dbclick
            this.shift = settings.shift
            this.tts = settings.tts
            return
        })
    },
    methods: {
        flag(code) {
            return flag(code)
        },
        close() {
            helper.closeTab()
        },
        save() {
            storage.set(LABEL_SETTINGS, {
                code: this.code,
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
