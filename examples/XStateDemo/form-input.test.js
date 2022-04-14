import { interpret } from "xstate"
import { FormInputMachine } from "./form-input.machine"

describe('form input machine test', () => {
  it('focus.FOCUS', () => {
    const service = interpret(FormInputMachine)

    service.start()

    service.send('FOCUS')
    expect(service.state.matches('focused')).toBeTruthy()

    service.stop()
  })
})
