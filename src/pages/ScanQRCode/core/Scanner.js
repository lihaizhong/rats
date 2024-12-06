import jsQR from 'jsqr'
import VideoKit from './VideoKit'
import IntervalKit from './IntervalKit'

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
      const intervalKit = new IntervalKit(() => {
        try {
          const result = this.#doScan()

          // 识别成功的处理
          if (result?.data) {
            intervalKit.stop()
            this.#singleton = null
            resolve(result)
          }
        } catch (ex) {
          intervalKit.stop()
          this.#singleton = null
          reject(ex)
        }
      })

      intervalKit.start()
    })
  }

  #getConstraints() {
    const videoKit = this.#videoKit
    const constrains = navigator.mediaDevices.getSupportedConstraints()
    const videoConstraints = videoKit.getRect()

    if (constrains.facingMode) {
      videoConstraints.facingMode = { exact: 'environment' }
    }

    return {
      video: videoConstraints,
      audio: false
    }
  }

  #getUserMedia() {
    if ('getUserMedia' in navigator.mediaDevices) {
      const constrains = this.#getConstraints()

      return navigator.mediaDevices.getUserMedia(constrains)
        .catch((err) => {
          if (err instanceof Error && err.name === 'OverconstrainedError') {
            // 使用降级方案
            return navigator.mediaDevices.getUserMedia({ video: true, audio: false })
          }

          throw err
        })
    }

    return Promise.reject(new Error('not support'))
  }

  scanCode() {
    if (this.#singleton instanceof Promise) {
      return this.#singleton
    }

    this.#singleton = this.#getUserMedia()
      .then(async (stream) => {
        const videoKit = this.#videoKit
        // 视频流设置到video标签中
        videoKit.setVideoSource(stream)
        // 指明视频将内嵌（inline）播放，即在元素的播放区域内。请注意，没有此属性并不意味着视频始终是全屏播放的。
        videoKit.setPlaysInline(true)
        // 播放视频
        await videoKit.play()
        // 开始扫码
        return await this.#doStart()
      })

    return this.#singleton
  }
}
