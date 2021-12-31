const PageUtils = {
  isSupportedSW () {
    return 'serviceWorker' in navigator
  },
  initialize () {
    console.log('开始注册ServiceWorker！')
    //* NOTE 引用文件地址是相对于URL的，而不是相对于引用这个文件的地址
    //* NOTE scope是选填的，可以用于指定控制内容的子目录
    navigator.serviceWorker
      .register('/service-worker.js?t=v1')
      .then(function (registration) {
        const sw = registration.installing || registration.waiting || registration.active || null

        console.log('ServiceWorker注册成功！')

        if (sw) {
          sw.addEventListener('statechange', () => {
            switch (sw.state) {
              case 'installing':
                console.log('ServiceWorker正在安装！')
                break
              case 'installed':
                console.log('ServiceWorker已安装！')
                break
              case 'activating':
                console.log('ServiceWorker正在激活！')
                break
              case 'activated':
                console.log('ServiceWorker已激活!')
                break
              case 'parsed':
                console.log('ServiceWorker已解析！')
                break
              case 'redundant':
                console.log('ServiceWorker有冗余！')
                break
            }

            if (sw.state === 'installed') {
              console.log('您有新的服务已安装完成！')
              registration.update()
            }
          })
        }
      })
      .catch(function (err) {
        console.log(err)
      })
  },
  checkStatus () {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = './services/sw-on-off.js'
      script.async = true
      script.onload = function () {
        if (window.__SW_TURN_OFF__) {
          navigator.serviceWorker.getRegistrations()
            .then((registrations) => {
              for (const registration of registrations) {
                registration.unregister()
              }
              reject()
            })
        } else {
          resolve()
        }
      }

      document.head.appendChild(script)
    })
  }
}

if (PageUtils.isSupportedSW()) {
  PageUtils.checkStatus()
    .then(() => {
      PageUtils.initialize()
    })
    .catch(() => {
      console.log('已关闭所有的ServiceWorker！')
    })
}
