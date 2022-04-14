import { assign, createMachine } from 'xstate';

createMachine(
  {
    id: 'createOrUpdateForm',
    initial: 'checkingIfInEditMode',
    context: {
      isInEditMode: false,
      itemToProcess: null,
      errorMessage: ''
    },
    states: {
      checkingIfInEditMode: {
        always: [
          {
            cond: 'isInEditMode',
            target: 'fetchingItemToEdit'
          },
          {
            target: 'awaitingSubmit'
          }
        ]
      },
      fetchingItemToEdit: {
        invoke: {
          src: 'fetchItem',
          onError: {
            target: 'failedToFetch',
            actions: 'assignErrorMessageToContext'
          }
        },
        on: {
          SUCCESSFULLY_FETCHED_ITEM: {
            target: 'awaitingSubmit',
            actions: 'assignItemToContext'
          }
        }
      },
      failedToFetch: {
        exit: ['clearErrorMessage'],
        on: {
          RETRY: 'fetchingItemToEdit'
        }
      },
      awaitingSubmit: {
        id: 'awaitingSubmit',
        exit: ['clearErrorMessage'],
        on: {
          SUBMIT: {
            target: 'submitting',
            actions: ['assignItemToContext']
          }
        }
      },
      submitting: {
        initial: 'checkingIfInEditMode',
        states: {
          checkingIfInEditMode: {
            always: [
              {
                cond: 'isInEditMode',
                target: 'editing'
              },
              {
                target: 'creating'
              }
            ]
          },
          editing: {
            invoke: {
              src: 'editItem',
              onDone: {
                target: '#complete',
                actions: 'onEditSuccess'
              },
              onError: {
                target: '#awaitingSubmit',
                actions: 'assignErrorMessageToContext'
              }
            }
          },
          creating: {
            invoke: {
              src: 'createItem',
              onDone: {
                target: '#complete',
                actions: 'onCreateSuccess'
              },
              onError: {
                target: '#awaitingSubmit',
                actions: 'assignErrorMessageToContext'
              }
            }
          }
        }
      },
      complete: {
        id: 'complete',
        /**
         * The type of this state node:
         *
         *  - `'atomic'` - no child state nodes
         *  - `'compound'` - nested child state nodes (XOR)
         *  - `'parallel'` - orthogonal nested child state nodes (AND)
         *  - `'history'` - history state node
         *  - `'final'` - final state node
         */
        type: 'final'
      }
    }
  },
  {
    guards: {
      isInEditMode: context => context.isInEditMode
    },
    actions: {
      onCreateSuccess: () => { },
      onEditSuccess: () => { },
      clearErrorMessage: assign((context) => ({
        errorMessage: undefined
      })),
      assignErrorMessageToContext: assign((context, event) => {
        return {
          errorMessage: event.data?.message || 'An unknown error occurred!'
        }
      }),
      assignItemToContext: assign((context, event) => {
        if (event.type !== 'SUCCESSFULLY_FETCHED_ITEM' && event.type !== 'SUBMIT') {
          return {}
        }

        return {
          itemToProcess: event.item
        }
      })
    },
    services: {
      fetchItem: () => async (send) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (Math.random() < 0.5) {
              resolve('resolve')
            } else {
              reject('reject')
            }
          })
        })
      },
      createItem: () => () => {
        console.log('create item!')
      },
      editItem: () => () => {
        console.log('edit item!')
      }
    }
  }
);
