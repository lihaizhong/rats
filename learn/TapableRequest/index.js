import { SyncHook, AsyncSeriesWaterfallHook } from "tapable"

class Service {
  constructor() {
    this.hooks = {
      loading: new SyncHook(['show']),
      requestInterceptor: new AsyncSeriesWaterfallHook(['config', 'requestInterceptorFunction']),
      request: new SyncHook(['config']),
      responseInterceptor: new AsyncSeriesWaterfallHook(['config', 'response', 'responseInterceptorFunction']),
      success: new SyncHook(['response']),
      fail: new SyncHook(['config', 'error']),
      complete: new SyncHook(['config', 'xhr'])
    }
  }

  init() {
    this.hooks.loading.tap('loading', show => {
      if (show) {
        // 显示loading
      } else {
        // 隐藏loading
      }
    })

    this.hooks.requestInterceptor.tapAsync('requestInterceptor', (config, callback = val => val, done) => {
      // 数据拦截修改
      const modifyConfig = callback(config)

      done(null, modifyConfig)
    })

    this.hooks.responseInterceptor.tapAsync('responseInterceptor', (config, response, callback = val => val, done) => {
      const modifyResponse = callback(response)

      done(null, modifyResponse)
    })

    this.hooks.request.tap('request', (config) => {
      // 请求执行
      const response = {
        success: true
      };

      // 执行完成后，调用responseInterceptor钩子
      if (response.success) {
        this.hooks.responseInterceptor.callAsync(config, response, undefined, () => {
          this.hooks.success.call(response)
          this.hooks.complete.call(config, response)
        })
      } else {
        this.hooks.fail.call(config, response)
        this.hooks.complete.call(config, response)
      }

      if (config.loading) {
        this.hooks.loading.call(false)
      }
    })
  }

  start (config) {
    this.hooks.requestInterceptor.callAsync(config, undefined, () => {
      this.hooks.loading.call(config.hasLoading)
      this.hooks.request.call(config)
    })
  }

  subscribe (type, callback) {
    if (this.hooks[type]) {
      this.hooks[type].tap(type, callback)
    }
  }
}
