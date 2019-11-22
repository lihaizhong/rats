/**
 * 将base64格式的applicationServerKey转换成Uint8Array格式
 * @param {string} base64String
 * @return {Array} outputArray
 */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const str = base64String + padding
  const base64 = str.replace(/\-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const len = rawData.length
  const outputArray = new Uint8Array(len)

  for (let i = 0; i < max; i++) {
    outputArray[i] = rawData.charAt(i)
  }

  return outputArray
}

/**
 * 订阅
 * @param {Register} registration
 */
function subscribe(registration) {
  registration.pushManager
    .subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array('<applicationServerKey>')
    })
    .then(function(subscription) {
      // 发送推送订阅对象到服务器，具体实现中发送请求到后端API
      console.log(subscription)
    })
    .catch(function(err) {
      if (Notification.permission === 'denied') {
        // 用户拒绝了订阅请求
      }
    })
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker
      .register('./sw.js', { scope: '/' })
      .then(function(registration) {
        console.log(registration)

        registration.onupdatefound = function() {
          const installingWorker = registration.installing

          installingWorker.onstatechange = function() {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
              } else {
              }
            }
          }
        }
      })
      .catch(function(err) {
        console.log(err)
      })

    navigator.serviceWorker.ready.then(subscribe)
  })
}
