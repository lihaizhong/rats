export default class VideoKit {
  #videoRef

  constructor(videoRef) {
    this.#videoRef = videoRef
  }

  getRef() {
    return this.#videoRef
  }

  getWidth() {
    return this.#videoRef.clientWidth
  }

  getHeight() {
    return this.#videoRef.clientHeight
  }

  getRect() {
    return {
      width: this.getWidth(),
      height: this.getHeight()
    }
  }

  hasEnoughData() {
    return this.#videoRef.readyState === this.#videoRef.HAVE_ENOUGH_DATA
  }

  setVideoSource(stream) {
    const videoRef = this.#videoRef

    if ('srcObject' in videoRef) {
      videoRef.srcObject = stream
    } else if ('mozSrcObject' in videoRef) {
      videoRef.mozSrcObject = stream
    } else if ('createObjectURL' in URL) {
      videoRef.src = URL.createObjectURL(stream)
    } else if ('webkitURL' in window) {
      videoRef.src = window.webkitURL.createObjectURL(stream)
    } else {
      videoRef.src = stream
    }
  }

  setPlaysInline(enable) {
    const videoRef = this.#videoRef

    if (videoRef.playsInline !== undefined) {
      videoRef.playsInline = enable
    } else if (videoRef.webkitPlaysInline !== undefined) {
      videoRef.webkitPlaysInline = enable
    }
  }

  play() {
    const videoRef = this.#videoRef

    return videoRef.play()
  }

  stop() {
    const videoRef = this.#videoRef
    if (videoRef.srcObject) {
      videoRef.srcObject.getTracks().forEach((t) => t.stop())
    } else {
      videoRef.stop()
    }
  }
}
