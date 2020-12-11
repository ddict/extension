<template>
    <div>
        <app-header></app-header>

        <div class="container-fluid">
            <app-popup></app-popup>

            <app-footer></app-footer>
        </div>
    </div>
</template>

<script>
import header from './components/header'
import popup from './components/popup'
import footer from './components/footer'

export default {
    name: 'Ddict',
    components: {
        appHeader: header,
        appPopup: popup,
        appFooter: footer,
    },
}
</script>