import { createMachine } from 'xstate'

const paymentMachine = createMachine({
  id: 'payment',
  initial: 'method',
  states: {
    method: {
      initial: 'cash',
      states: {
        cash: {
          on: { SWITCH_CHECK: 'check' }
        },
        check: {
          on: { SWITCH_CASH: 'cash' }
        },
        hist: {
          type: 'history'
        }
      },
      on: { NEXT: 'review' }
    },
    review: {
      on: { PREVIOUS: 'method.hist' }
    }
  }
})

const checkState = paymentMachine.transition('method.cash', 'SWITCH_CHECK')

const reviewState = paymentMachine.transition(checkState, 'NEXT')

paymentMachine.transition(reviewState, 'PREVIOUS').valueOf;
