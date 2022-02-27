import { assign, createMachine } from 'xstate'

const counterMachine = createMachine({
  id: 'counter',
  initial: 'pending',
  context: {
    time: 60
  },
  states: {
    pending: {
      on: {

      }
    },
    timing: {},
    finished: {
      type: 'finish',
      invoke: {
        src: '',
        onDone: '',
        onError: ''
      }
    }
  }
})

