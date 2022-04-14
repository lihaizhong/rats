import { createMachine, interpret, assign } from 'xstate'

// Promise实现
const promiseMachine =
/** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AtgS1mAdMmAHYTbFQDEASgKIDKA8gDIBqtiK6s2ALtumKcQAD0QBGAMwAmfAA4AbAFYAnCoDsk8QBZtSrdIA0IAJ6IFK-JO3SADONvaVcxwrlyAvh+NosuAkSk5FR0AFK0AMIAKsLI3HwCQkiiEjLyymqaOnoGxmYI4uqW1uJq1tZ62p5exsToEHCxGDh4hCRkFLHx-ILCYgg2eRK2lurSRc7aChb27jUgvi0EqHDoADYAbpBdPD1JoP1atvjS0vruKtq2SoVGpogqx5d2ti4W6tNT84v++CsAVmAAMa8bbJOK7RJ9RBHE5nSQXK43MZDBAvfCXUoqBy2BSFbSSBTfZr+HYJXrJfriOSogC0knwyhcry0SmU6lKcy8HiAA */
createMachine({
  context: { test: 'xxx' },
  id: 'promise',
  initial: 'pending',
  states: {
    pending: {
      on: {
        RESOLVE: {
          actions: 'resolvingAction',
          target: '#promise.resolved',
        },
        REJECT: {
          actions: 'rejectingAction',
          target: '#promise.rejected',
        },
      },
    },
    resolved: {
      invoke: {
        src: 'resolvedServicer',
      },
      type: 'final',
    },
    rejected: {
      invoke: {
        src: 'rejectedServicer',
      },
      type: 'final',
    },
  },
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
