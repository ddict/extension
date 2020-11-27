import Vue from 'vue'

import {
    library
} from '@fortawesome/fontawesome-svg-core'

import {
    faExchangeAlt,
    faTimesCircle,
    faVolumeUp,
    faStopCircle,
    faPlus,
    faMinus,
} from '@fortawesome/free-solid-svg-icons'

import {
    FontAwesomeIcon
} from '@fortawesome/vue-fontawesome'

Vue.component('font-awesome-icon', FontAwesomeIcon)
library.add(faExchangeAlt, faTimesCircle, faVolumeUp, faStopCircle, faPlus, faMinus)