<template>
    <Popup
        :export_data="data"
        :export_select="select"
        :export_tts="tts"
        @srctarget="srctarget"
        @translate="translate"
    />
</template>

<script>
const helper = require('../../helper')
const storage = require('../../storage')
const google = require('../../google')

export default {
    name: 'Test',
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

            helper.sendMsg(
                {
                    channel: 'translate',
                    data: text,
                },
                data => {
                    this.loadData(data)
                }
            )
        },
        loadData(data) {
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
                this.getTTS(this.data)
                
        },
        getTTS(data) {
            helper.sendMsg(
                {
                    channel: 'tts_popup',
                    data: {
                        src: data.src,
                        target: data.target,
                        src_text: text,
                        target_text: data.sentences
                            .map(sentence =>
                                sentence.trans ? sentence.trans : ''
                            )
                            .join(''),
                    },
                },
                res => {
                    this.tts = {
                        src: res.src_urls,
                        target: res.target_urls,
                    }
                }
            )
        },
        srctarget(select) {
            this.select = select
            storage.get('settings', settings => {
                settings.src = select.src
                settings.target = select.target
                storage.set('settings', settings)
            })
        },
    },
}
</script>
