import { createMachine, interpret, assign } from 'xstate'

// Promise实现
const promiseMachine = createMachine({
  id: 'promise',
  initial: 'pending',
  context: {
    test: 'xxx'
  },
  states: {
    pending: {
      on: {
        RESOLVE: {
          target: 'resolved',
          actions: 'resolvingAction'
        },
        REJECT: {
          target: 'rejected',
          actions: 'rejectingAction'
        }
      }
    },
    resolved: {
      type: 'final',
      invoke: {
        src: 'resolvedServicer'
      }
    },
    rejected: {
      type: 'final',
      invoke: {
        src: 'rejectedServicer'
      }
    }
  }
}, {
  actions: {
    resolvingAction: assign((context) => {
      console.log('【Promise Action】invoke resolving action!')
    }),
    rejectingAction: assign((context) => {
      console.log('【Promise Action】invoke rejecting action!')
    })
  },
  services: {
    resolvedServicer: () => () => {
      console.log('【Promise Service】invoke resolved service!')
    },
    rejectedServicer: () => (send) => {
      console.log('【Promise Service】invoke rejected service!')
    }
  }
})

const promiseService = interpret(promiseMachine).onTransition(state => console.log(`【Promise Transition】${state.value}`))

promiseService.start()

promiseService.send({ type: 'RESOLVE' }, 'resolve payload')

// Warning: Event "REJECT" was sent to stopped service "promise". This service has already reached its final state, and will not transition.
// promiseService.send({ type: 'REJECT' })

promiseService.stop()
