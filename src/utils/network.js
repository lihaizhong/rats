import { injectContent } from "./inject";
import { formatBoolean, formatConnectionType, formatRTT, formatBrandWidth } from "./format";

function addEventListeners() {
  window.addEventListener("online", () => {});
  window.addEventListener("offline", () => {});

  navigator.connection.onchange = () => {};
}

export function initNetworkStatus() {
  const {
    downlink,
    downlinkMax,
    effectiveType,
    rtt,
    type,
    saveData
  } = navigator.connection
  console.log('navigator.connection', navigator.connection)

  /**
   * 整数，表示当前设备的带宽(以Mbit/s为单位)，舍入到最接近的25kbit/s。
   * * 这个值可能会根据历史网络推图量计算，也可能根据链接技术的能力来计算。
   */
  injectContent("#downlink", "当前设备的带宽", formatBrandWidth(downlink));
  /**
   * 整数，表示当前设备最大的下行带宽（以Mbit/s为单位），根据网络的帝一跳来确定。
   * * 因为第一跳不一定反映端到端的网络速度，所以这个值只能作为粗略的上限值。
   */
  injectContent("#downlink-max", "当前设备最大的下行带宽", formatBrandWidth(downlinkMax));
  /**
   * 字符串枚举值，表示连接速度和质量。
   * * 这些值对应不同的蜂窝数据网络连接技术，但也用于分类无线网络。
   * * 可能的值：
   * * - slow-2g (往返时间 >= 2000ms，下行带宽 < 50kbit/s)
   * * - 2g      (2000ms > 往返时间 >= 1400ms，70kbit/s > 下行带宽 >= 50kbit/s)
   * * - 3g      (1400ms > 往返时间 >= 270ms，700kbit/s > 下行带宽 >= 70kbit/s)
   * * - 4g      (0ms > 往返时间 >= 270ms，下行带宽 > 700kbit/s)
   */
  injectContent("#effective-type", "连接速度和质量", effectiveType);
  /**
   * 毫秒，表示当前网络实际的往返时间，舍入为最接近的25ms。
   * * 这个值可能根据历史网络吞吐量计算，也可能根据连接技术的能力来计算。
   */
  injectContent("#rtt", "当前网络实际的往返时间", formatRTT(rtt));
  /**
   * 字符串枚举值，表示网络连接技术。
   * * 可能得值：
   * * - bluetooth: 蓝牙
   * * - cellular: 蜂窝
   * * - ethernet: 以太网
   * * - none: 无网络连接
   * * - mixed: 多种网络混合
   * * - other: 其他
   * * - unknown: 不确定
   * * - wifi: Wi-Fi
   * * - wimax: WiMax
   */
  injectContent("#connection-type", "网络连接技术", formatConnectionType(type));
  /**
   * 布尔值，表示用户设备是否启用了“节流(reduced data)”模式
   */
  injectContent("#connection-save-data", "用户设备是否启用了“节流(reduced data)”模式", formatBoolean(saveData));

  addEventListeners();
}
