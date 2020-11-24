<template>
    <header class="navbar">
        <a class="navbar-brand text-white" href="/">
            Ddict
        </a>
        <form class="form-inline">
            <a :href="option_url" target="_blank">
                ⚙️
            </a>
        </form>
    </header>
</template>

<script>
const helper = require('../../helper')

module.exports = {
    data() {
        return {
            option_url: '',
        }
    },
    created() {
        this.option_url = helper.getURL('/option/index.html')
    },
}
</script>

<style>
header {
    margin-bottom: 0.5rem;
    background-color: #3b5998;
}
</style>