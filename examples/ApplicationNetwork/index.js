var ApplicationNetwork = function () {
  window.addEventListener('online', this.__connectionStateChange__.bind(this));
  window.addEventListener('offline', this.__connectionStateChange__.bind(this));

  this.__connectionStateChange__();
}

ApplicationNetwork.prototype.__connectionStateChange__ = function () {
  this.online = navigator.onLine;
}

/**
 * 整数，表示当前设备的带宽(以Mbit/s为单位)，舍入到最接近的25kbit/s。
 * * 这个值可能会根据历史网络推图量计算，也可能根据链接技术的能力来计算。
 * @returns
 */
ApplicationNetwork.prototype.getDownlink = function () {
  return navigator.connection.downlink;
}

/**
 * 整数，表示当前设备最大的下行带宽（以Mbit/s为单位），根据网络的帝一跳来确定。
 * * 因为帝一跳不一定反映端到端的网络速度，所以这个值只能作为粗略的上限值。
 * @returns
 */
ApplicationNetwork.prototype.getDownlinkMax = function () {
  return navigator.connection.downlinkMax;
}

/**
 * 字符串枚举值，表示连接速度和质量。
 * * 这些值对应不同的蜂窝数据网络连接技术，但也用于分类无线网络。
 * * 可能的值：
 * * - slow-2g (往返时间 >= 2000ms，下行带宽 < 50kbit/s)
 * * - 2g      (2000ms > 往返时间 >= 1400ms，70kbit/s > 下行带宽 >= 50kbit/s)
 * * - 3g      (1400ms > 往返时间 >= 270ms，700kbit/s > 下行带宽 >= 70kbit/s)
 * * - 4g      (0ms > 往返时间 >= 270ms，下行带宽 > 700kbit/s)
 * @returns
 */
ApplicationNetwork.prototype.getEffectiveType = function () {
  return navigator.connection.effectiveType;
}

/**
 * 毫秒，表示当前网络实际的往返时间，舍入为最接近的25ms。
 * * 这个值可能根据历史网络吞吐量计算，也可能根据连接技术的能力来计算。
 * @returns
 */
ApplicationNetwork.prototype.getRTT = function () {
  return navigator.connection.rtt;
}

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
 * @returns
 */
ApplicationNetwork.prototype.getType = function () {
  return navigator.connection.type;
}

/**
 * 布尔值，表示用户设备是否启用了“节流(reduced data)”模式
 * @returns
 */
ApplicationNetwork.prototype.getSaveData = function () {
  return navigator.connection.saveData;
}

/**
 * 事件处理程序，会在任何链接状态变化时激发一个change事件。
 * @param {function} handler
 */
ApplicationNetwork.prototype.onchange = function (handler) {
  navigator.connection.onchange = handler
}
