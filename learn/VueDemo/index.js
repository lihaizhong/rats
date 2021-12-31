// Copyright (c) 2021 Sangbaipi
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.esm.browser.js'

Vue.component('test-demo', {
  props: ['value'],
  render (h) {
    return h('p', 'test dom')
  }
})

const vm = new Vue({
  el: document.querySelector('#app'),
  mounted () {
    debugger
    console.log(this.children)
  },
  render (h) {
    return h(
      'div',
      {
        style: {
          width: '400px',
          height: '400px',
          background: 'red'
        }
      },
      [
        h('test-demo')
      ]
    )
  }
})

// vm.$createElement('div', { style: { width: '400px', height: '400px', background: 'red' } })

console.log(vm, Vue.prototype)
