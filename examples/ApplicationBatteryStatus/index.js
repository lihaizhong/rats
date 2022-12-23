navigator.getBattery()
  .then((batteryManager) => {
    // 布尔值，表示设备当前是否正接入电源充电。
    // 如果设备没有电池，则返回true。
    console.info('设备是否接入电源', batteryManager.charging)
    // 整数，表示预计离电池充满还有多少秒。
    // 如果电池已充满或设备没有电池，则返回0。
    console.info('预计充满需要多久（秒）', batteryManager.chargingTime)
    // 整数，表示预计离电池耗尽还有多少秒。
    // 如果设备没有电池，则返回Infinity。
    console.info('预计电池耗尽时间（秒）', batteryManager.dischargingTime)
    // 浮点数，表示电量百分比。
    // 电量完全耗尽返回0.0，电池充满返回1.0。
    // 如果设备没有电池，则返回1.0。
    console.info('电量百分比', batteryManager.level)

    // 添加充电状态变化时的处理程序
    batteryManager.addEventListener('chargingchange', () => {})
    // 添加充电时间变化时的处理程序
    batteryManager.addEventListener('chargingtimechange', () => {})
    // 添加放点时间变化时的处理程序
    batteryManager.addEventListener('dischargingtimechange', () => {})
    // 添加电量百分比变化时的处理程序
    batteryManager.addEventListener('levelchange', () => {})
  })
  .catch((error) => {
    console.error(error)
  })
