<template>
    <div class="text-left">
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
const helper = require('../helper')
const storage = require('../storage')
const google = require('../google')

const LABEL_SETTINGS = 'settings'
const DEFAULT_SETTINGS = {
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
            lang: 'en',

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
        const lang = await google.getUserCountry()
        const languages = await google.getLanguages(lang)
        this.lang = lang
        this.sl = languages.sl
        this.tl = languages.tl

        this.load(settings => {
            if (!settings) {
                settings = DEFAULT_SETTINGS
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
        close() {
            helper.closeTab()
        },
        save() {
            storage.set(LABEL_SETTINGS, {
                lang: this.lang,
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
