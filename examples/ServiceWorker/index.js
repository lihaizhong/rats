const VERSION = "1.0.0";
const PageUtils = {
  injectVersion(version) {
    const elem = document.querySelector("#version");

    elem.textContent = `当前版本号：${version}`;
  },
  injectMessage(message) {
    const el = document.querySelector("#message-container");
    const row = document.createElement("p");

    row.textContent = message;
    el.appendChild(row);
  },
};
const ServiceWorkerUtils = {
  isSupported: "serviceWorker" in navigator,
  async install() {
    // * NOTE 引用文件地址是相对于URL的，而不是相对于引用这个文件的地址
    // * NOTE scope是选填的，可以用于指定控制内容的子目录
    const registration = await navigator.serviceWorker.register(
      new URL("sw.js", import.meta.url),
      {
        type: "module",
      }
    );

    return registration;
  },
  uninstall(registration) {
    registration.unregister();
  },
  async uninstallAll() {
    const registrations = await navigator.serviceWorker.getRegistrations();

    registrations.forEach(ServiceWorkerUtils.uninstall);
  },
  listenStateChange(registration) {
    const target =
      registration.installing ||
      registration.waiting ||
      registration.active ||
      null;

    if (target === null) {
      return;
    }

    target.addEventListener("statechange", () => {
      switch (target.state) {
        case "installing":
          PageUtils.injectMessage("ServiceWorker正在安装中...");
          break;
        case "installed":
          PageUtils.injectMessage("ServiceWorker已安装！");
          registration.update();
          break;
        case "activating":
          PageUtils.injectMessage("ServiceWorker正在激活中...");
          break;
        case "activated":
          PageUtils.injectMessage("ServiceWorker已激活！");
          break;
        case "parsed":
          PageUtils.injectMessage("ServiceWorker已解析！");
          break;
        case "redundant":
          PageUtils.injectMessage("ServiceWorker有冗余！");
          break;
        default:
      }
    });
  },
};

function getBatteryStatus() {
  if (typeof navigator.getBattery !== 'function') {
    return null
  }

  navigator.getBattery()
    .then((batteryManager) => {
      // 布尔值，表示设备当前是否正接入电源充电。
      // 如果设备没有电池，则返回true。
      document.querySelector('#charging').textContent = batteryManager.charging ? '正在充电' : '使用电池';
      console.info('设备是否接入电源', batteryManager.charging);
      // 整数，表示预计离电池充满还有多少秒。
      // 如果电池已充满或设备没有电池，则返回0。
      document.querySelector('#charging-time').textContent = batteryManager.chargingTime;
      console.info('预计充满需要多久（秒）', batteryManager.chargingTime);
      // 整数，表示预计离电池耗尽还有多少秒。
      // 如果设备没有电池，则返回Infinity。
      document.querySelector('#discharging-time').textContent = batteryManager.dischargingTime;
      console.info('预计电池耗尽时间（秒）', batteryManager.dischargingTime);
      // 浮点数，表示电量百分比。
      // 电量完全耗尽返回0.0，电池充满返回1.0。
      // 如果设备没有电池，则返回1.0。
      document.querySelector('#level').textContent = (batteryManager.level * 100) + '%';
      console.info('电量百分比', batteryManager.level);

      // 添加充电状态变化时的处理程序
      batteryManager.addEventListener('chargingchange', () => {
        document.querySelector('#charging').textContent = batteryManager.charging ? '正在充电' : '使用电池';
        console.info('设备是否接入电源', batteryManager.charging);
      });
      // 添加充电时间变化时的处理程序
      batteryManager.addEventListener('chargingtimechange', () => {
        document.querySelector('#charging-time').textContent = batteryManager.chargingTime;
        console.info('预计充满需要多久（秒）', batteryManager.chargingTime);
      });
      // 添加放电时间变化时的处理程序
      batteryManager.addEventListener('dischargingtimechange', () => {
        document.querySelector('#discharging-time').textContent = batteryManager.dischargingTime;
        console.info('预计电池耗尽时间（秒）', batteryManager.dischargingTime);
      });
      // 添加电量百分比变化时的处理程序
      batteryManager.addEventListener('levelchange', () => {
        document.querySelector('#level').textContent = (batteryManager.level * 100) + '%';
        console.info('电量百分比', batteryManager.level);
      });
    })
    .catch((error) => console.error(error));
}

async function main() {
  PageUtils.injectVersion(VERSION);

  if (ServiceWorkerUtils.isSupported) {
    const registration = await ServiceWorkerUtils.install();

    ServiceWorkerUtils.listenStateChange(registration);
  }
}

window.onload = () => {
  main();
  getBatteryStatus();
}
