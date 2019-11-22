new Vue({
  data() {
    return {
      message: '',
      message1: '',
      message2: '',
      message3: ''
    }
  },
  watch: {
    message(newVal, oldVal) {
      console.log(newVal, oldVal)
    },
    message1: {
      deep: true,
      handler(newVal, oldVal) {
        console.log(newVal, oldVal)
      }
    },
    message2: {
      immediate: true,
      handler(newVal, oldVal) {
        console.log(newVal, oldVal)
      }
    },
    message3: 'handleWatchMessage3'
  },
  created() {
    setTimeout(() => {
      this.message = 'message'
      this.message1 = 'message1'
      this.message2 = 'message2'
      this.message3 = 'message3'
    }, 2000)
  },
  methods: {
    handleWatchMessage3(newVal, oldVal) {
      console.log(newVal, oldVal)
    }
  }
})
