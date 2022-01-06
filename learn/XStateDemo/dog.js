import { createMachine, interpret } from 'xstate'

const dogMachine = createMachine({
  id: 'dog',
  initial: 'waiting',
  context: {},
  states: {
    waiting: {},
    walk: {}
  },
  // @optional 操作名称到其实现的映射
  actions: {},
  // @optional 活动名称到其实现的映射
  activities: {},
  // @optional 延迟名称到其实现的映射
  delays: {},
  // @optional 守卫名称到其实现的映射
  guards: {},
  // @optional 调用服务名称到其实现的映射
  services: {}
})

const dogService = interpret(dogMachine)

dogService.start()
