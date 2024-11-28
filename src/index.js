import { getBatteryStatus } from "./battery";
import { getNetworkStatus } from "./network";

window.onload = function main() {
  getBatteryStatus();
  getNetworkStatus();
}
