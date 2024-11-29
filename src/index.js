import { initBatteryStatus } from "./utils/battery";
import { initNetworkStatus } from "./utils/network";

window.onload = function main() {
  // 初始化电池状态
  initBatteryStatus();
  // 初始化网络状态
  initNetworkStatus();
}
