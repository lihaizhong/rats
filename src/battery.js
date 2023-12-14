const Format = {
  formatTime(timestamp) {
    if (!isFinite(timestamp)) {
      return "";
    }

    const gaps = [
      { unit: "天", pre: 86400 },
      { unit: "小时", pre: 3600 },
      { unit: "分", pre: 60 },
      { unit: "秒", pre: 1 },
    ];
    let remain = timestamp;
    let timeStr = "";

    for (let i = 0; i < gaps.length; i++) {
      const gap = gaps[i];
      const t = Math.floor(remain / gap.pre);

      remain -= t * 60;

      if (t !== 0) {
        timeStr += t + gap.unit;
      }
    }

    return timeStr;
  },

  formatLevel(level) {
    return level * 100 + "%";
  },

  formatCharging(charging) {
    return charging ? "正在充电" : "未接入电源";
  },
};

function injectContent(selector, label, content) {
  document.querySelector(selector).textContent = content;
  console.info(label, content);
}

function addEventListeners(batteryManager) {
  // 添加充电状态变化时的处理程序
  batteryManager.addEventListener("chargingchange", () => {
    injectContent(
      "#charging",
      "设备是否接入电源",
      Format.formatCharging(batteryManager.charging)
    );
  });

  // 添加充电时间变化时的处理程序
  batteryManager.addEventListener("chargingtimechange", () => {
    injectContent(
      "#charging-time",
      "预计充满需要多久",
      Format.formatTime(batteryManager.chargingTime)
    );
  });

  // 添加放电时间变化时的处理程序
  batteryManager.addEventListener("dischargingtimechange", () => {
    injectContent(
      "#discharging-time",
      "预计电池耗尽时间",
      Format.formatTime(batteryManager.dischargingTime)
    );
  });

  // 添加电量百分比变化时的处理程序
  batteryManager.addEventListener("levelchange", () => {
    injectContent(
      "#electric-quantity",
      "电量百分比",
      Format.formatLevel(batteryManager.level)
    );
  });
}

export async function getBatteryStatus() {
  if (typeof navigator.getBattery !== "function") {
    console.error('当前浏览器不支持"navigator.getBattery"功能');
    return null;
  }

  const batteryManager = await navigator.getBattery();

  // 布尔值，表示设备当前是否正接入电源充电。
  // 如果设备没有电池，则返回true。
  injectContent(
    "#charging",
    "设备是否接入电源",
    Format.formatCharging(batteryManager.charging)
  );
  // 整数，表示预计离电池充满还有多少秒。
  // 如果电池已充满或设备没有电池，则返回0。
  injectContent(
    "#charging-time",
    "预计充满需要多久",
    Format.formatTime(batteryManager.chargingTime)
  );
  // 整数，表示预计离电池耗尽还有多少秒。
  // 如果设备没有电池，则返回Infinity。
  injectContent(
    "#discharging-time",
    "预计电池耗尽时间",
    Format.formatTime(batteryManager.dischargingTime)
  );
  // 浮点数，表示电量百分比。
  // 电量完全耗尽返回0.0，电池充满返回1.0。
  // 如果设备没有电池，则返回1.0。
  injectContent(
    "#electric-quantity",
    "电量百分比",
    Format.formatLevel(batteryManager.level)
  );

  addEventListeners(batteryManager);
}
