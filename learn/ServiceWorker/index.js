const PageUtils = {
  isSupportedSW() {
    return 'serviceWorker' in navigator
  },
  initialize() {
    //* NOTE 引用文件地址是相对于URL的，而不是相对于引用这个文件的地址
    //* NOTE scope是选填的，可以用于指定控制内容的子目录
    navigator.serviceWorker
      .register('/service-worker.js?t=v1')
      .then(function (registration) {
        const sw = registration.installing || registration.waiting || registration.active || null;

        console.log('ServiceWorker注册成功！');

        if (sw) {
          sw.addEventListener('statechange', () => {
            if (sw.state === 'installed') {
              console.log('您有新的服务已安装完成！');
            }
          })
        }
        registration.onupdatefound = function () {
          registration.update();
        }
      })
      .catch(function (err) {
        console.log(err)
      });
  },
  checkStatus() {
    return new Promise((resolve) => {
      let script = document.createElement('script');
      script.src = './services/sw-on-off.js'
      script.async = true
      script.onload = function () {
        if (window.__SW_TURN_OFF__) {
          navigator.serviceWorker.getRegistrations()
            .then((registrations) => {
              for (let registration of registrations) {
                registration.unregister()
              }
              resolve();
            });
        } else {
          resolve();
        }
      }

      document.head.appendChild(script);
    })

  }
};

if (PageUtils.isSupportedSW()) {
  PageUtils.checkStatus()
    .then(() => {
      PageUtils.initialize();
    });
}
