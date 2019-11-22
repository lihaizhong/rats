/**
 * Application Cache仍是一个不成熟的本地缓存解决方案，实际项目中也不推荐使用，但是其设计思路为我们后面实现离线访问机制提供了方向。
 * 1. Application Cache 已经开始被标准弃用，渐渐将会由Serveice Workers来替代，所以现在不建议使用Application Cache来实现离线应用，仅作为一种技术了解即可。
 * 2. Application Cache 仍不能兼容目前全部主流的浏览器环境，即使是在移动端。
 * 3. Application Cache 为站点离线存储提供的容量限制为5MB，现在来说显然不适用。
 * 4. 如果manifest文件或者内部列表中的某一个文件不能正常下载，整个更新过程将视为失败，浏览器将继续使用旧的缓存。
 * 5. 引用manifest的HTML、缓存列表的静态资源必须与manifest文件同源，即保持在同一个域下。
 * 6. 当manifest文件发生改变时，资源请求本身也会触发更新。
 *
 * app.manifest
 *
 * CACHE MANIFEST
 * #VERSION 1.0
 * CACHE:
 *
 * main.css
 * main.js
 */

!function() {
  const appCache = window.applicationCache

  appCache.update() // 尝试更新用户的Application Cache

  switch (appCache.status) {
  case appCache.UNCACHED: // 0，表示未缓存
    return 'UNCACHED'
  case appCache.IDLE: // 1，表示闲置
    return 'IDLE'
  case appCache.CHECKING: // 2，表示检查中
    return 'CHECKING'
  case appCache.DOWNLOADING: // 3，表示下载中
    return 'DOWNLOADING'
  case appCache.UPDATEREADY: // 4，表示已更新
    appCache.swapCache()
    return 'UPDATEREADY'
  case appCache.OBSOLETE: // 5，表示已失效
    return 'OBSOLETE'
  default:
    return 'UNKNOWN CACHE STATUS'
  }
}

/**
 * cacheStorage
 * # 核心API
 * @function open 打开一个Cache对象，并返回一个promise对象
 * @function match 匹配key中含有该字符串的Cache对象，返回一个promise对象
 * @function has 检查如果包含Cache对象，则返回一个promise对象
 * @function delete 删除Cache对象，成功则返回一个promise对象，否则返回false
 * @function keys 含有keys中字符串的任意一个，则返回一个promise对象
 *
 * cacheStorage 提供缓存能力
 * ServiceWorker和WebWorker 提供独立线程并行能力
 * message/postMessage 提供与页面的数据通信能力
 */

if (navigator.serviceWorker) {
  navigator.serviceWorker
    .register('./service-worker.js')
    .then(registration => {
      console.log('service worker 注册成功')
    })
    .catch(err => {
      console.log('service worker 注册失败')
    })
}

// service-worker.js
const cacheList = ['main.js', 'main.css']

self.addEventListener('install', event => {
  event
    .waitUtil(caches.open('my-page-cache'))
    .then(cache => {
      return caches.addAll(cacheList)
    })
    .catch(err => {
      console.error(err)
    })
})

self.addEventListener('fetch', event => {
  const promise = caches.match(event.request).then(response => {
    if (response) {
      return response
    }

    const responseToCache = response.clone()

    caches.open('my-page-cache').then(cache => {
      cache.put(event.request, responseToCache)
    })
  })

  event.responseWith(promise)
})
