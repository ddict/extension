<template>
    <header class="navbar">
        <a class="navbar-brand text-white" href="/">
            Ddict
        </a>
        <form class="form-inline">
            <a
                :href="fund_url"
                class="text-white"
                target="_blank"
                style="margin-right: 10px"
            >
                <b-icon-flower1></b-icon-flower1>
            </a>
            <a :href="option_url" class="text-white" target="_blank">
                <b-icon-gear-fill></b-icon-gear-fill>
            </a>
        </form>
    </header>
</template>

<script>
const storage = require('../../storage')
const helper = require('../../helper')

module.exports = {
    data() {
        return {
            option_url: '',
            fund_url: '',
        }
    },
    created() {
        this.option_url = helper.getURL('/option/index.html')

        storage.get('settings', async settings => {
            const url = await helper.getDdictURL(settings)
            this.fund_url = url + '#about'
        })
    },
}
</script>

<style>
header {
    margin-bottom: 0.5rem;
    background-color: #3b5998;
}
</style>