(function (win) {
  if ("Notification" in window) {
    // 请求用户授权
    // 如果已经授权，将不会触发授权弹框
    Notification.requestPermission()
  }

  win.sendNotification = function (title, options) {
    // Memoize based on feature detection.
    if ("Notification" in window) {
      sendNotification = function (title, options) {
        return new Notification(title, options)
      }
    } else if ("mozNotification" in navigator) {
      sendNotification = function (title, options) {
        // Gecko < 22
        return navigator.mozNotification
                 .createNotification(title, options.body, options.icon)
                 .show()
      }
    } else {
      sendNotification = function (title, options) {
        alert(title + ": " + options.body)
      }
    }
    return sendNotification(title, options)
  }
})(window)
