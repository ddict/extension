<template>
    <app-popup :export_data="data"
               :export_select="select"
               :export_tts="tts"
               @srctarget="srctarget"
               @translate="translate" />
</template>

<script>
import popup from '@ddict/popup'

const helper = require('../helper')
const storage = require('../storage')
const google = require('../google')

// testing purpose
const sample_tts_url = 'http://www.jingle.org/westwood8.mp3'

export default {
    name: 'Test',
    components: {
        appPopup: popup,
    },
    data() {
        return {
            data: null,
            select: null,
            tts: {},
        }
    },
    async created() {
        const code = await google.getUserCountry()
        const languages = await google.getLanguages(code)

        this.loadSettings(settings => {
            if (!settings) {
                return
            }

            this.select = {
                src: settings.src,
                target: settings.target,

                srcs: languages.sl,
                targets: languages.tl,
            }
        })
    },
    methods: {
        loadSettings(cb) {
            storage.get('settings', settings => {
                cb(settings)
            })
        },
        translate(text) {
            if (!text) {
                return
            }

            helper.sendMsg({ channel: 'translate', data: text }, data => {
                this.data = data

                // set data src and target
                if (!Object.prototype.hasOwnProperty.call(data, 'src')) {
                    this.data.src = this.select.src
                }
                if (!Object.prototype.hasOwnProperty.call(data, 'target')) {
                    this.data.target = this.select.target
                }
                this.data.ddictSrc = this.select.srcs[data.src]
                this.data.ddictTarget = this.select.targets[data.target]

                // generate tts urls
                this.tts = {
                    src: [sample_tts_url],
                    target: [sample_tts_url, sample_tts_url, sample_tts_url],
                }
            })
        },
        srctarget(select) {
            console.log('srctarget:', select)
            this.select = select
        },
    },
}
</script>

