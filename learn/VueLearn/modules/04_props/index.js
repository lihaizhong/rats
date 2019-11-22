/* eslint-disable vue/require-default-prop */

Vue.component('demo-component', {
  props: {
    demoText: {
      type: String,
      default: '',
      required: true,
      validator(val) {
        return value !== ''
      }
    },
    demoObj: {
      type: Object,
      default() {
        return {}
      }
    }
  }
})

new Vue({
  el: '#app',
  propsData: {
    text: 'this is test',
    text1: 'this is case'
  },
  props: {
    text: {
      type: String,
      default: 'test',
      required: true,
      validator(val) {
        return val !== ''
      }
    },
    text1: String
  },
  data() {
    return {
      demoObj: {
        demo1: '',
        demo2: ''
      }
    }
  },
  template: `
    <demo-component demo-text="this is demo component" :demo-obj="demoObj"></demo-component>
  `
})
