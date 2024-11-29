export function formatRemainTime(timestamp, zeroValue = '', infiniteValue = '') {
  if (!isFinite(timestamp)) {
    return infiniteValue;
  }

  if (timestamp === 0) {
    return zeroValue;
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

    if (remain < gap.pre) {
      continue
    }

    const t = Math.floor(remain / gap.pre);

    remain -= t * gap.pre;

    if (t !== 0) {
      timeStr += t + gap.unit;
    }
  }

  return timeStr;
}

export function formatElectricQuantity(level) {
  return level * 100 + "%";
}

export function formatCharging(charging) {
  return charging ? "正在充电" : "未充电";
}

export function formatBoolean(bool) {
  return bool ? "是" : "否";
}

export function formatConnectionType(type) {
 if (type === 'bluetooth') {
   return '蓝牙'
 }

 if (type === 'cellular') {
   return '蜂窝'
 }

 if (type === 'ethernet') {
   return '以太网'
 }

 if (type === 'mixed') {
   return '多种网络混合'
 }

 if (type === 'wifi') {
   return 'Wi-Fi'
 }

 if (type === 'wimax') {
   return 'WiMax'
 }

 if (type === 'other') {
   return '其他'
 }

 if (type === 'none') {
   return '无网络连接'
 }

 if (type === 'unknown') {
   return '未知'
 }

 return '未知'
}

export function formatRTT(rtt) {
  if (typeof rtt === 'number') {
    return `${rtt}ms`
  }

  return '未知'
}

export function formatBrandWidth(downlink) {
  if (typeof downlink === 'number') {
    return `${downlink}Mb/s`
  }

  return '未知'
}
