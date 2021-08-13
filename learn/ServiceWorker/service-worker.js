const REQUEST_PREFIX = '/'
const SWUtils = {
  cacheContents: [
    REQUEST_PREFIX,
    `${REQUEST_PREFIX}index.html`,
    `${REQUEST_PREFIX}index.js`,
    `${REQUEST_PREFIX}static/important-notes.png`,
    `${REQUEST_PREFIX}static/sw-events.png`,
    `${REQUEST_PREFIX}static/sw-fetch.png`,
    `${REQUEST_PREFIX}static/sw-lifecycle.png`
  ],
  cacheName: 'sw_v1',
  install(event) {
    return caches.open(SWUtils.cacheName).then(cache => {
      return cache.addAll(SWUtils.cacheContents).then(() => {
        // 自动跳过等待阶段，一般在开发环境使用
        // self.skipWaiting();
      });
    })
  },
  fetch(event) {
    return caches.match(event.request).then((cacheResponse) => {
      // 如果有缓存，则直接返回缓存内容
      if(cacheResponse !== null && cacheResponse !== undefined) {
        return cacheResponse
      }

      // 如果没有缓存，则通过远程请求获取
      return fetch(event.request).then((response) => {
        if (event.request.url.indexOf('chrome://')) {
          return response;
        }

        return caches.open(SWUtils.cacheName).then((cache) => {
          cache.put(event.request, response.clone());

          return response;
        });
      });
    })
  },
  activate(event) {
    self.clients.claim();
    return caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== SWUtils.cacheName) {
          return caches.delete(key);
        }
      }));
    });
  }
};

self.addEventListener('install', (event) => {
  event.waitUntil(SWUtils.install(event));
});

self.addEventListener('fetch', (event) => {
  event.respondWith(SWUtils.fetch(event));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(SWUtils.activate(event));
})
