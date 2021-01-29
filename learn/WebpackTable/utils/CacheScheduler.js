export default class CacheScheduler {
  constructor () {
    this._key = ''
    this._timer = null
    this._storage = window.localStorage
  }

  updateCacheKey (key) {
    this._key = key
  }

  createScheduler () {}

  useCache () {}

  cleanCache () {}

  destroy () {}
}
