/**
 * Created by sky on 2017/5/11.
 */

import Vue from 'vue';
import vueTouch from 'vue-touch';

import App from './src/view/App.vue';

Vue.config.devtools = true;

Vue.use(vueTouch);

new Vue({
    el: '#app',
    render: h => h(App)
})