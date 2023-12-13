function injectContent(selector, label, content) {
  document.querySelector(selector).textContent = content;
  console.info(label, content);
}

function addEventListener(batteryManager) {
  // 添加充电状态变化时的处理程序
  batteryManager.addEventListener("chargingchange", () => {
    injectContent("#charging", "设备是否接入电源", batteryManager.charging);
  });

  // 添加充电时间变化时的处理程序
  batteryManager.addEventListener("chargingtimechange", () => {
    injectContent(
      "#charging-time",
      "预计充满需要多久",
      batteryManager.chargingTime
    );
  });

  // 添加放电时间变化时的处理程序
  batteryManager.addEventListener("dischargingtimechange", () => {
    injectContent(
      "#discharging-time",
      "预计电池耗尽时间",
      batteryManager.dischargingTime
    );
  });

  // 添加电量百分比变化时的处理程序
  batteryManager.addEventListener("levelchange", () => {
    injectContent('"#level', "电量百分比", batteryManager.level * 100 + "%");
  });
}

export function getBatteryStatus() {
  if (typeof navigator.getBattery !== "function") {
    return null;
  }

  navigator
    .getBattery()
    .then((batteryManager) => {
      // 布尔值，表示设备当前是否正接入电源充电。
      // 如果设备没有电池，则返回true。
      injectContent("#charging", "设备是否接入电源", batteryManager.charging);
      // 整数，表示预计离电池充满还有多少秒。
      // 如果电池已充满或设备没有电池，则返回0。
      injectContent(
        "#charging-time",
        "预计充满需要多久",
        batteryManager.chargingTime
      );
      // 整数，表示预计离电池耗尽还有多少秒。
      // 如果设备没有电池，则返回Infinity。
      injectContent(
        "#discharging-time",
        "预计电池耗尽时间",
        batteryManager.dischargingTime
      );
      // 浮点数，表示电量百分比。
      // 电量完全耗尽返回0.0，电池充满返回1.0。
      // 如果设备没有电池，则返回1.0。
      injectContent('"#level', "电量百分比", batteryManager.level * 100 + "%");

      addEventListener(batteryManager);
    })
    .catch((error) => console.error(error));
}
