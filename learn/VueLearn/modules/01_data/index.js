/**
 * 生成常量
 * @param {object} constants
 * @return {object} constants
 */
function generateConstants (constants) {
  const nativeType = Object.prototype.toString.call(constants).slice(8)
  if (['array', 'object'].includes(nativeType)) {
    const keys = Object.keys(constants)

    keys.forEach(key =>
      // 定义数据描述符
      Object.defineProperty(constants, key, {
        enumerable: true,
        configurable: false,
        value: constants[key],
        writeable: false
      })
    )
  }

  return constants
}

const CONSTANTS = generateConstants({
  NO_OPEN: 0,
  OPEN: 1
})

new Vue({
  el: '#app',
  data () {
    const value = {
      name: 'ggg',
      age: 26,
      hobby: ['aaa', { name: 'bbb', order: 4 }, { name: 'ccc', order: 1 }],
      family: {
        father: 'xxx',
        mother: 'yyy'
      }
    }

    Object.defineProperty(value, 'constants', {
      enumerable: true,
      configurable: false,
      value: CONSTANTS,
      writeable: false
    })

    return value
  },
  created () {
    // setter
    this.name = 'hhh'
    this.age = 27
    this.hobby.push('eee')
    this.family.father = 'zzz'

    setTimeout(() => {
      // getter
      console.log(this.name)
      console.log(this.age)
      console.log(this.hobby)
      console.log(this.family)
    }, 1000)
  }
})
