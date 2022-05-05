import { interpret } from "xstate"
import { FormInputMachine } from "./form-input.machine"

describe('form input machine test', () => {
  let service = null;

  beforeEach(() => {
    service = interpret(FormInputMachine)

    service.start()
  })

  afterEach(() => {
    service.stop()
  })

  it('focus.FOCUS', () => {
    service.send('FOCUS')
    expect(service.state.matches('focused')).toBeTruthy()
  })
})
