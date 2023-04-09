
export class QRCode {
  constructor() {
    this.dataMode = 1 << 2
  }

  make() {}

  /**
   * Position Detection Pattern
   * 定位图案：用于标记二维码矩形的大小；用三个定位图案即可标识并确定一个二维码矩形的位置和方向了。
   */
  setPositionDetectionPattern() {}

  setAlignmentPattern() {}

  setTimingPattern() {}

  setTypeInfo() {}

}
