export function formatRemainTime(timestamp) {
  if (!isFinite(timestamp)) {
    return "";
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
    const t = Math.floor(remain / gap.pre);

    remain -= t * 60;

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
  return charging ? "正在充电" : "未接入电源";
}
