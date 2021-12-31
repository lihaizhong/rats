import { SyncHook, AsyncParallelHook, AsyncSeriesWaterfallHook } from 'tapable'

function logger (name) {
  return (...rest) => {
    console.log(`%c【${name}】`, 'color: blue;', ...rest)
  }
}

/**
 * 同步钩子
 * SyncHook: 最基本的钩子
 * SyncBailHook: 类似于SyncHook，执行过程中注册的回调返回**非undefined时停止执行**
 * SyncWaterfallHook: 接收至少一个参数，上一个注册的回调返回值会作为下一个注册的回调参数。
 * SyncLoopHook: 有点类似SyncBailHook, 执行过程中注册的回调返回**非undefined时继续执行**
 */
;(function () {
  const log = logger('Sync Hook')
  const hook = new SyncHook(['name'])

  hook.tap('hello', name => {
    log(`hello ${name}`)
    return '111'
  })

  hook.tap('hello again', name => {
    log(`hello ${name} again`)
    return '222'
  })

  log('hook call result', hook.call('sky'))
  log('hook call result', hook.call('lee'))
})()

/**
 * 异步钩子
 * AsyncParallelHook: 异步并行钩子
 * AsyncSeriesHook: 异步串行钩子
 * AsyncParallelBailHook: 执行过程中注册的回调返回非undefined时就会直接执行callAsync或者Promise中的函数（由于并行执行的原因，注册的其他回调依然会执行）
 * AsyncSeriesBailHook: 执行过程中注册的回调返回非undefined时就会直接执行callAsync或者Promise中的函数（由于串行执行的原因，注册的其他回调不会执行）
 * AsyncSeriesWaterfallHook: 与SyncWaterfallHook类似，上一个注册的异步回调执行之后的返回值会传递给下一个注册的回调。
 */
;(function () {
  const log = logger('Async Parallel Hook')
  const hook = new AsyncParallelHook(['name'])

  hook.tapAsync('hello', (name, done) => {
    setTimeout(() => {
      log(`hello ${name}`)
      done(null, 'async result')
    }, 2000)
  })

  hook.tapPromise('hello again', name => {
    return new Promise(resolve => {
      setTimeout(() => {
        log(`hello ${name} again`)
        resolve('promise')
      }, 1000)
    })
  })

  hook.callAsync('sky async', (err, result) => {
    log('async parallel hook done!', err, result)
  })

  hook.promise('sky promise').then(args => {
    console.log(args)
  })
})()

;(function () {
  const log = logger('Async Series Hook')
  const hook = new AsyncSeriesWaterfallHook(['name'])

  hook.tapAsync('hello', (name, done) => {
    setTimeout(() => {
      log(`hello ${name}`)
      done(null, 'async series hook')
    }, 2000)
  })

  hook.tapPromise('hello again', name => {
    return new Promise(resolve => {
      setTimeout(() => {
        log(`hello ${name} again`)
        resolve(111)
      }, 1000)
    })
  })

  hook.callAsync('sky async', (error, result) => {
    console.log(error)
    console.log(result)
    log('async series hook done!')
  })

  hook.promise('sky promise').then(result => {
    console.log(result)
  })
})()
