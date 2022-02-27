<!--
 Copyright (c) 2022 Sangbaipi

 This software is released under the MIT License.
 https://opensource.org/licenses/MIT
-->

# 入门

## 状态机的基本配置结构

> 配置

```json
{
  "id": "唯一标识（选填）",
  "context": "上下文内容（选填）",
  "type": "atomic | compound | parallel | final | history",
  "initial": "初始化状态",
  "states": "状态集合（必填）"
}
```

> 选项

```json
{
  "guards": {
    "description": "转换守卫 (cond) ，名称与其执行的映射"
  },
  "actions": {
    "description": "action 名称到它们的执行的映射"
  },
  "services": {
    "description": "调用的服务 (src) ，名称与其执行的映射"
  },
  "delays": {
    "description": "delays 名称与其执行的映射"
  },
  "activities": {
    "description": "activities 名称与其执行的映射"
  }
}
```

> State定义

- value: 当前状态的值。(*例如， {red: 'walk'}*)
- context: 当前状态的`context`
- event: 触发转换到此状态的事件对象
- actions: 要执行的`动作`数组
- activities: 如果`活动`开始，则活动映射到`true`，如果活动停止，则映射到`false`。
- history: 上一个`State`实例
- meta: 在`状态节点`的元属性上定义的任何静态元数据
- done: 状态是否表示最终状态

PS: State 对象还包含其他属性，例如 historyValue、events、tree 和其他通常不相关并在内部使用的属性。

## 创建一个状态机来实现 Promise 功能

```js
import { createMachine, interpret } from 'xstate'

const promiseMachine = createMachine({
  id: 'promise',
  initial: 'pending',
  states: {
    pending: {
      on: {
        RESOLVE: {
          target: 'resolved',
        },
        REJECT: {
          target: 'rejected',
        },
      },
    },
    resolved: {
      type: 'final',
    },
    rejected: {
      type: 'final',
    },
  },
})

const promiseService = interpret(promiseMachine).onTransition((state) => {
  console.log(state.value)
})

promiseService.start()

promiseService.send({ type: 'RESOLVE' })
```
