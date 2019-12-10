export default class CircularArray {
  constructor (length) {
    this._head = -1
    this._tail = -1
    this._length = 0
    this._arr = new Array(length)
    this._length = length
  }

  setItem (value) {
    const length = this._length

    this._tail = (this._tail + 1) % length

    if (this._head === -1) {
      this._head = 0
    } else if (this._tail === this._head) {
      this._head = (this._tail + 1) % length
    }

    this._arr[this._tail] = value
  }

  getItem (index) {
    const realIndex = (this._head + index) % length
    return this._arr[realIndex]
  }

  getAll () {
    if (this._head < this._tail) {
      return this._arr.slice(this._head, this._tail)
    } else {
      const head = this._arr.slice(this._head)
      const tail = this._arr.slice(0, this._tail)
      return [].concat(head, tail)
    }
  }

  clear (index) {
    this._head = -1
    this._tail = -1
    this._arr = new Array(this._length)
  }
}
