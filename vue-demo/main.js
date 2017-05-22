/**
 * Created by sky on 2017/5/11.
 */

import Vue from 'vue';
import VueTouch from 'vue-touch';

import App from './src/view/App.vue';

Vue.use(VueTouch);

new Vue({
    el: '#app',
    render: h => h(App)
})