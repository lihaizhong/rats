class EventEmitter {
  constructor () {
    this.subs = Object.create(null)
  }

  on (eventType, handler) {
    this.subs[eventType] = this.subs[eventType] || []
    this.subs[eventType].push(handler)
  }

  off (eventType, handler) {
    if (this.subs[eventType]) {
      const index = this.subs[eventType].indexOf(handler)

      if (index !== -1) {
        this.subs[eventType].splice(index, 1)
      }
    }
  }

  emit (eventType, ...args) {
    if (this.subs[eventType]) {
      this.subs[eventType].forEach(handler => handler(...args))
    }
  }
}

export default EventEmitter
