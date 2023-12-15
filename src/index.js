// import { install } from "./WebComponent/index"
import { getBatteryStatus } from "./battery";

function main() {
  getBatteryStatus();
}


// install()

window.onload = main;
