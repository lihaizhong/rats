new Vue({
  el: '#app',
  data() {
    return {
      message: '',
      text: ''
    }
  },
  computed: {
    messageComputed() {
      return this.message + ' computed'
    },
    textComputed: {
      get() {
        return this.text + ' computed'
      },
      set(val) {
        console.log(val)
      }
    }
  },
  created() {
    setTimeout(() => {
      console.log('created setTimeout evaluated')
      this.message = '这是一个computed源码理解'
      this.text = '这是一个例子'
    }, 2000)
  }
})
