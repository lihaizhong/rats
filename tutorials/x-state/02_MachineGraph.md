<!--
 Copyright (c) 2022 Sangbaipi
 
 This software is released under the MIT License.
 https://opensource.org/licenses/MIT
-->

# 状态机和状态图简介

- 状态 states
- 转换与事件 transitions and events
- 初始状态 initial states
- 最终状态 final states
- 复合状态 compound states
- 并行状态 parallel states
- 自转换 self transitions
- 计划状态图 planning statecharts
- 延迟状态图 delayed transitions
- 动作 actions

## 状态

![asleep-awake](https://xstate.js.org/docs/assets/img/asleep-awake.a233a2ef.svg)

## 转换与事件

![transition-events](https://xstate.js.org/docs/assets/img/transitions-events.af54e0b5.svg)

```js
import { createMachine } from 'xstate'

const dogMachine = createMachine({
  id: 'dog',
  context: {},
  initial: 'asleep',
  states: {
    asleep: {
      on: {
        WAKES_UP: {
          target: 'awake'
        }
      }
    },
    awake: {
      on: {
        FALLS_ASLEEP: {
          target: 'asleep'
        }
      }
    }
  }
})
```

## 初始状态与最终状态

![initial-state-and-final-state](https://xstate.js.org/docs/assets/img/final-state.63512456.svg)

```js
import { createMachine } from 'xstate'

const dogMachine = createMachine({
  id: 'dog',
  context: {},
  initial: 'waiting',
  states: {
    waiting: {
      on: {
        LEAVE_HOME: {
          target: 'on_a_walk'
        }
      }
    },
    on_a_walk: {
      on: {
        ARRIVE_HOME: {
          target: 'completed'
        }
      }
    },
    completed: {
      type: 'final'
    }
  }
})
```

## 复合状态

![compound-state](https://xstate.js.org/docs/assets/img/compound-state.e9bfccbb.svg)

```js
import { createMachine } from 'xstate'

const dogMachine = createMachine({
  id: 'dog',
  context: {},
  initial: 'waiting',
  states: {
    waiting: {
      on: {
        LEAVE_HOME: {
          target: 'on_a_walk'
        }
      }
    },
    on_a_walk: {
      initial: 'walking',
      states: {
        walking: {
          on: {
            STOP: {
              target: 'stopping_to_sniff_good_smells'
            },
            SPEED_UP: {
              target: 'running'
            }
          }
        },
        running: {
          on: {
            SLOW_DOWN: {
              target: 'walking'
            },
            SUDDEN_STOP: {
              target: 'stopping_to_sniff_good_smells'
            }
          }
        },
        stopping_to_sniff_good_smells: {
          on: {
            SPEED_UP: {
              target: 'walking'
            },
            SUDDEN_SPEED_UP: {
              target: 'running'
            }
          }
        }
      },
      on: {
        ARRIVE_HOME: {
          target: 'completed'
        }
      }
    },
    completed: {
      type: 'final'
    }
  }
})
```

## 并行状态

![parallel-state](https://xstate.js.org/docs/assets/img/parallel-states.f60d5dd7.svg)

```js
import { createMachine } from 'xstate'

const dogMachine = createMachine({
  id: 'dog',
  initial: 'waiting',
  states: {
    waiting: {
      on: {
        LEAVE_HOME: {
          target: 'on_a_walk'
        }
      }
    },
    on_a_walk: {
      id: 'on_a_walk',
      type: 'parallel',
      states: {
        activities: {
          id: 'activities',
          initial: 'walking',
          states: {
            walking: {
              on: {
                SPEED_UP: {
                  target: 'running'
                },
                STOP: {
                  target: 'stopping_to_sniff_good_smells'
                }
              }
            },
            running: {
              on: {
                SLOW_DOWN: {
                  target: 'walking'
                },
                SUDDEN_STOP: {
                  target: 'stopping_to_sniff_good_smells'
                }
              }
            },
            stopping_to_sniff_good_smells: {
              on: {
                SPEED_UP: {
                  target: 'walking'
                },
                SUDDEN_SPEED_UP: {
                  target: 'running'
                }
              }
            }
          }
        },
        tail: {
          id: 'tail',
          initial: 'no_wagging',
          states: {
            no_wagging: {
              on: {
                WAGGING_STARTS: {
                  target: 'wagging'
                }
              }
            },
            wagging: {
              on: {
                WAGGING_STOPS: {
                  target: 'no_wagging'
                }
              }
            }
          }
        }
      },
      on: {
        ARRIVE_HOME: {
          target: 'completed'
        }
      }
    },
    completed: {
      type: 'final'
    }
  }
})
```

## 自转换

```js
import { createMachine } from 'xstate'

const dogMachine = createMachine({
  id: 'dog',
  initial: 'begging',
  states: {
    begging: {
      on: {
        GET_TREAT: {
          target: "begging",
        },
      },
    }
  }
})
```

## 计划状态图

```js
import { createMachine } from 'xstate'

const loginMachine = createMachine({
  id: 'login',
  initial: 'logged_in'
  states: {
    logged_in: {
      on: {
        LOG_OUT: {
          target: 'logged_out'
        }
      }
    },
    logged_out: {
      on: {
        LOG_IN: {
          target: 'logged_in'
        }
      }
    }
  }
})
```

## 延迟转换

```js
import { createMachine } from 'xstate'

const loginMachine = createMachine({
  id: 'login',
  initial: 'logged_in',
  states: {
    logged_in: {
      initial: 'active',
      states: {
        active: {
          after: {
            60000: {
              target: 'idle'
            }
          }
        },
        idle: {
          after: {
            180000: {
              target: '#login.logged_out'
            }
          },
          on: {
            ACTIVITY: {
              target: 'active'
            }
          }
        }
      },
      on: {
        LOG_OUT: {
          target: 'logged_out'
        }
      }
    },
    logged_out: {
      on: {
        LOG_IN: {
          target: 'logged_in'
        }
      }
    }
  }
})
```
