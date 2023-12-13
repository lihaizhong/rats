function injectContent(selector, label, content) {
  document.querySelector(selector).textContent = content;
  console.info(label, content);
}

function addEventListener(batteryManager) {
  // 添加充电状态变化时的处理程序
  batteryManager.addEventListener("chargingchange", () => {
    injectContent("#charging", "设备是否接入电源", formatCharging(batteryManager.charging));
  });

  // 添加充电时间变化时的处理程序
  batteryManager.addEventListener("chargingtimechange", () => {
    injectContent(
      "#charging-time",
      "预计充满需要多久",
      formatTime(batteryManager.chargingTime)
    );
  });

  // 添加放电时间变化时的处理程序
  batteryManager.addEventListener("dischargingtimechange", () => {
    injectContent(
      "#discharging-time",
      "预计电池耗尽时间",
      formatTime(batteryManager.dischargingTime)
    );
  });

  // 添加电量百分比变化时的处理程序
  batteryManager.addEventListener("levelchange", () => {
    injectContent('"#level', "电量百分比", formatLevel(batteryManager.level));
  });
}

function formatTime(timestamp) {
  const units = ["小时", "分", "秒"];
  let remain = timestamp;
  let timeStr = "";

  for (let i = 0; i < units.length; i++) {
    const t = Math.floor(remain / 60);

    remain -= t * 60;

    if (t !== 0) {
      timeStr += t + units[i];
    }
  }

  return timeStr;
}

function formatLevel(level) {
  return level * 100 + "%";
}

function formatCharging(charging) {
  return batteryManager.charging ? "正在充电" : "未接入电源"
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
      injectContent(
        "#charging",
        "设备是否接入电源",
        formatCharging(batteryManager.charging)
      );
      // 整数，表示预计离电池充满还有多少秒。
      // 如果电池已充满或设备没有电池，则返回0。
      injectContent(
        "#charging-time",
        "预计充满需要多久",
        formatTime(batteryManager.chargingTime)
      );
      // 整数，表示预计离电池耗尽还有多少秒。
      // 如果设备没有电池，则返回Infinity。
      injectContent(
        "#discharging-time",
        "预计电池耗尽时间",
        formatTime(batteryManager.dischargingTime)
      );
      // 浮点数，表示电量百分比。
      // 电量完全耗尽返回0.0，电池充满返回1.0。
      // 如果设备没有电池，则返回1.0。
      injectContent('"#level', "电量百分比", formatLevel(batteryManager.level));

      addEventListener(batteryManager);
    })
    .catch((error) => console.error(error));
}
