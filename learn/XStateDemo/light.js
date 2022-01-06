import { createMachine, interpret } from 'xstate'

const lightMachine = createMachine({
  id: 'light',
  initial: 'green',
  states: {
    green: {
      on: {
        TIMER: 'yellow'
      }
    },
    yellow: {
      on: {
        TIMER: 'red'
      }
    },
    red: {
      on: {
        TIMER: 'green'
      },
      initial: 'walk',
      states: {
        walk: {
          on: {
            PED_TIMER: 'wait'
          }
        },
        wait: {
          on: {
            PED_TIMER: 'stop'
          }
        },
        stop: {}
      }
    }
  }
})

const lightService = interpret(lightMachine).onTransition(state => console.log(state.value)).onStop(() => clearInterval(timer))

lightService.start()
const timer = setInterval(() => {
  const { value } = lightService.state
  switch (value) {
    case 'yellow':
      lightService.send('TIMER')
      break
    case 'red':
      lightService.send('TIMER')
      break
    case 'green':
      lightService.send('TIMER')
      break
    default:
      lightService.stop()
  }
}, 1000)
