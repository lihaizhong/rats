import { injectContent } from "./inject";
import { formatRemainTime, formatElectricQuantity, formatCharging } from "./format";

function addEventListeners(batteryManager) {
  // 添加充电状态变化时的处理程序
  batteryManager.addEventListener("chargingchange", () => {
    injectContent(
      "#charging",
      "设备是否接入电源",
      formatCharging(batteryManager.charging)
    );
  });

  // 添加充电时间变化时的处理程序
  batteryManager.addEventListener("chargingtimechange", () => {
    injectContent(
      "#charging-time",
      "预计充满需要多久",
      formatRemainTime(batteryManager.chargingTime, '已充满', '未知')
    );
  });

  // 添加放电时间变化时的处理程序
  batteryManager.addEventListener("dischargingtimechange", () => {
    injectContent(
      "#discharging-time",
      "预计电池耗尽时间",
      formatRemainTime(batteryManager.dischargingTime, '已耗尽', '未知')
    );
  });

  // 添加电量百分比变化时的处理程序
  batteryManager.addEventListener("levelchange", () => {
    injectContent(
      "#electric-quantity",
      "电量百分比",
      formatElectricQuantity(batteryManager.level)
    );
  });
}

export async function initBatteryStatus() {
  if (typeof navigator.getBattery !== "function") {
    console.error('当前浏览器不支持"navigator.getBattery"功能');
    return null;
  }

  const batteryManager = await navigator.getBattery();

  console.log('batteryManager', batteryManager)
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
    formatRemainTime(batteryManager.chargingTime, '已充满', '未知')
  );
  // 整数，表示预计离电池耗尽还有多少秒。
  // 如果设备没有电池，则返回Infinity。
  injectContent(
    "#discharging-time",
    "预计电池耗尽时间",
    formatRemainTime(batteryManager.dischargingTime, '已耗尽', '未知')
  );
  // 浮点数，表示电量百分比。
  // 电量完全耗尽返回0.0，电池充满返回1.0。
  // 如果设备没有电池，则返回1.0。
  injectContent(
    "#electric-quantity",
    "电量百分比",
    formatElectricQuantity(batteryManager.level)
  );

  addEventListeners(batteryManager);
}
