import { createMachine, interpret } from 'xstate'

// Promise实现
const promiseMachine = createMachine({
  id: 'promise',
  initial: 'pending',
  states: {
    pending: {
      on: {
        RESOLVE: { target: 'resolved' },
        REJECT: { target: 'rejected' }
      }
    },
    resolved: {
      type: 'final'
    },
    rejected: {
      type: 'final'
    }
  }
})

const promiseService = interpret(promiseMachine).onTransition(state => console.log(state.value))

promiseService.start()

promiseService.send({ type: 'RESOLVE' })
