/**
 * Chrome For Developers
 * https://developer.chrome.com/docs/workbox/service-worker-overview?hl=zh-cn
 */

const REQUEST_PREFIX = "/";
const SWUtils = {
  cacheContents: [
    REQUEST_PREFIX,
    `${REQUEST_PREFIX}index.html`,
    `${REQUEST_PREFIX}index.js`,
    `${REQUEST_PREFIX}static/important-notes.png`,
    `${REQUEST_PREFIX}static/sw-events.png`,
    `${REQUEST_PREFIX}static/sw-fetch.png`,
    `${REQUEST_PREFIX}static/sw-lifecycle.png`,
  ],
  cacheName: "sw_v3",
  install(_event) {
    return caches
      .open(SWUtils.cacheName)
      .then((cache) => cache.addAll(SWUtils.cacheContents))
      .then(() => {
        // 自动跳过等待阶段，一般在开发环境使用
        self.skipWaiting();
      });
  },
  fetch(event) {
    return caches.match(event.request).then((cacheResponse) => {
      // 如果有缓存，则直接返回缓存内容
      if (cacheResponse !== null && cacheResponse !== undefined) {
        return cacheResponse;
      }

      // 如果没有缓存，则通过远程请求获取
      return fetch(event.request).then((response) => {
        // 过滤缓存
        if (event.request.url.indexOf("chrome://")) {
          return response;
        }

        return caches.open(SWUtils.cacheName).then((cache) => {
          cache.put(event.request, response.clone());

          return response;
        });
      });
    });
  },
  async activate(_event) {
    // https://web.dev/blog/navigation-preload?hl=zh-cn#the-solution
    // 检查是否支持导航预缓存
    if (self.registration.navigationPreload) {
      // 开启导航预缓存
      await self.registration.navigationPreload.enable();
    }

    // 获取所有客户端的控制权
    await self.clients.claim();

    return caches.open(SWUtils.cacheName).then((cache) =>
      cache.keys().then((keys) => {
        keys.forEach((request) => cache.delete(request));
      })
    );
  },
};

self.addEventListener("install", (event) => {
  console.log("进入install事件");
  event.waitUntil(SWUtils.install(event));
});

self.addEventListener("activate", (event) => {
  console.log("进入activate事件");
  // waitUntil的参数可以是一个Promise对象实例。
  event.waitUntil(SWUtils.activate(event));
});

// 只有在激活之后才能监听到
self.addEventListener("fetch", (event) => {
  console.log("进入fetch事件");
  // respondWith的参数可以是Response对象实例，也可以是Promise对象实例。
  event.respondWith(SWUtils.fetch(event));
});

// 只有在激活后才能接收到消息
self.addEventListener("message", (event) => {
  console.log("获取到客户端发过来的消息", event);
});

/**
 * 网络推送
 * 网络推送的建立设计到三端的相互配合。
 * 1. UA（User Agent），即浏览器。
 * 2. Push Service，即推送服务器，用于管理推送订阅、消息推送等功能的第三方服务器。（Push Service服务器是浏览器决定的）
 * 3. Application Server，即网站应用的后端服务。
 * 从具体推送步骤上进行划分，可以分为订阅（Subscribe）与推送（Push Message）两个部分。
 * 其中订阅部分包含以下步骤：
 * 1. Subscribe，浏览器需要向推送服务器发起推送订阅的请求；
 * 2. Monitor，订阅成功后，浏览器与推送服务器之间会进行通信，同时推送服务器会生成并维护相关订阅信息，在后续的消息推送流程将基于该订阅信息与浏览器保持通信。
 * 3. Distribute Push Resource，浏览器将推送服务器返回的订阅消息发送给网站后端服务进行保存，服务器将基于该订阅信息向推送服务器发起消息推送。
 * 而推送部分主要分为两步：
 * 1. 后端服务通过Web Push向推送服务器发送消息通知，发送时会将前面提到的订阅信息带上，以告知推送服务器这条消息推送的目的地。
 * 2. 推送服务器接收到消息后，再根据订阅信息将消息推送给对应的浏览器。
 */
self.addEventListener("push", (event) => {
  // node端可以使用`web-push`库来实现push功能。推送消息校验遵循VAPID协议进行身份校验。
  console.log('接收到push消息', event, event.data.text())
});

self.addEventListener("sync", (event) => {
  console.log('接收到sync消息', event)
})
