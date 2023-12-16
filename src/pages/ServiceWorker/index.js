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

async function main() {
  PageUtils.injectVersion(VERSION);

  if (ServiceWorkerUtils.isSupported) {
    const registration = await ServiceWorkerUtils.install();

    ServiceWorkerUtils.listenStateChange(registration);
  }
}

window.onload = main;
