/**
 * 二维码基本知识
 * 二维码存在40种尺寸（Version），最小 21 x 21，最大 177 x 177。
 * 计算方法：Size = (Version - 1) x 4
 */
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
