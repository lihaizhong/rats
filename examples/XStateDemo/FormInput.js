import { assign, createMachine } from 'xstate'

createMachine(
  {
    id: 'formInput',
    initial: 'active',
    context: {
      value: '',
      errorMessage: ''
    },
    states: {
      active: {
        on: { DISABLED: 'disabled' },
        type: 'parallel',
        states: {
          focus: {
            initial: 'unfocused',
            states: {
              focused: {
                on: { BLUR: 'unfocused' }
              },
              unfocused: {
                on: { FOCUS: 'focused' }
              }
            }
          },
          validation: {
            initial: 'pending',
            on: {
              CHANGE: {
                target: '.pending',
                actions: 'assignValueToContext'
              }
            },
            states: {
              pending: {
                on: {
                  REPORT_INVALID: {
                    target: 'invalid',
                    actions: 'assignReasonToErrorMessage'
                  }
                },
                invoke: {
                  src: 'validateField',
                  onDone: 'valid',
                  onError: 'invalid'
                }
              },
              valid: {},
              invalid: {}
            }
          }
        }
      },
      disabled: {
        on: { ENABLED: 'active' }
      }
    }
  },
  {
    actions: {
      assignReasonToErrorMessage: assign((context, event) => {
        if (event.type !== 'REPORT_INVALID') return {}

        return { errorMessage: event.reason }
      }),
      assignValueToContext: assign((context, event) => {
        if (event.type !== 'CHANGE') return {}

        return { value: event.value }
      })
    },
    services: {
      validateField: (context) => (send) => {
        if (context.value === '') {
          send({
            type: 'REPORT_INVALID',
            reason: 'Value cannot be empty!'
          })
        }
      }
    }
  }
)
