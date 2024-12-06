export default class IntervalKit {
  #callback
  #loop
  #latestTime
  #interval

  constructor(callback, interval) {
    this.#latestTime = 0
    this.#interval = interval || 30
    this.#callback = callback
  }

  #doStart() {
    requestAnimationFrame(() => {
      let now = Date.now()
      if (this.#latestTime === 0 || now - this.#latestTime >= this.#interval) {
        this.#latestTime = now
        this.#callback?.()
      }

      if (this.#loop) {
        this.#doStart()
      }
    })
  }

  start() {
    this.#loop = true
    this.#doStart()
  }

  stop() {
    this.#loop = false
  }
}
