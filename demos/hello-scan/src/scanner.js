import jsQR from 'jsqr'
import VideoKit from './videoKit'
import Interval from './interval'

export default class Scanner {
  #videoKit
  #singleton

  constructor(videoRef) {
    this.#videoKit = new VideoKit(videoRef)
    this.#singleton = null
  }

  #doScan() {
    const videoKit = this.#videoKit

    // 视频处于准备阶段，并且已经加载了足够的数据
    if (videoKit.hasEnoughData()) {
      // 获取视频流信息，绘制到canvas上
      const canvasRef = new OffscreenCanvas(videoKit.getWidth(), videoKit.getHeight())
      const context = canvasRef.getContext('2d', { willReadFrequently: true })
      context.drawImage(videoKit.getRef(), 0, 0, canvasRef.width, canvasRef.height)
      // 获取图片信息
      const imageData = context.getImageData(0, 0, canvasRef.width, canvasRef.height)

      // 解析图片信息，识别二维码
      return jsQR(imageData.data, imageData.width, imageData.height)
    }

    return null
  }

  #doStart() {
    return new Promise((resolve, reject) => {
      // 设置定时器，识别二维码
      const interval = new Interval(() => {
        try {
          const result = this.#doScan()

          // 识别成功的处理
          if (result?.data) {
            interval.stop()
            this.#singleton = null
            resolve(result)
          }
        } catch (ex) {
          interval.stop()
          this.#singleton = null
          reject(ex)
        }
      })

      interval.start()
    })
  }

  scanCode() {
    if (this.#singleton instanceof Promise) {
      return this.#singleton
    }

    if (typeof navigator.mediaDevices?.getUserMedia === 'function') {
      const videoKit = this.#videoKit

      this.#singleton = navigator.mediaDevices
        .getUserMedia({ video: videoKit.getRect() })
        .then(async (stream) => {
          // 视频流设置到video标签中
          videoKit.setVideoSource(stream)
          // 指明视频将内嵌（inline）播放，即在元素的播放区域内。请注意，没有此属性并不意味着视频始终是全屏播放的。
          videoKit.setPlaysInline(true)
          // 播放视频
          await videoKit.play()
          // 开始扫码
          return await this.#doStart()
        })
    } else {
      this.#singleton = Promise.reject(new Error('not support'))
    }

    return this.#singleton
  }
}
