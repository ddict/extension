<template>
    <div class="text-left">
        <div class="form-group form-check">
            <input type="checkbox" class="form-check-input" id="icon" />
            <label class="form-check-label" for="icon">
                <img src="/logo/16.png" />
                Icon
            </label>
            <small class="form-text text-muted">
                There will be a Ddict Icon when you select any words.
            </small>
        </div>

        <div class="form-group form-check">
            <input type="checkbox" class="form-check-input" id="dbclick" />
            <label class="form-check-label" for="dbclick">
                Double click on words to translate
            </label>
        </div>

        <div class="form-group form-check">
            <input type="checkbox" class="form-check-input" id="shift" />
            <label class="form-check-label" for="shift">
                Highlight text then press "Shift" button to translate
            </label>
        </div>

        <div class="form-group form-check">
            <input type="checkbox" class="form-check-input" id="auto_tts" />
            <label class="form-check-label" for="auto_tts">
                Auto Speak/TTS
            </label>
        </div>

        <br />

        <button class="btn btn-lg btn-secondary btn-block" @click="close()">
            Close
        </button>
    </div>
</template>

<script>
const helper = require('../helper')

module.exports = {
    data() {
        return {
            user: null,
        }
    },
    methods: {
        close() {
            helper.closeTab()
        },
    },
}
</script>
