// import { install } from "./WebComponent/index"
import { getBatteryStatus } from "./battery";
import { getNetworkStatus } from "./network";

function main() {
  getBatteryStatus();
  getNetworkStatus();
}


// install()

window.onload = main;
