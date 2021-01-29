/**
 * 执行回调函数
 * @param {function} fn
 * @param  {...any} args
 */
export const callFunction = (fn, ...args) => {
  if (typeof fn === 'function') {
    return fn(...args)
  }
}

/**
 * 时间格式校验
 * @param {string|number|date} value
 */
export const isValidDate = value =>
  value !== null &&
  new Date(value).toString() !== 'Invalid Date' &&
  value !== 0

/**
 * 基本类型校验
 * @param {any} value
 */
export const isPrimitive = (value) =>
  value === null ||
  ['undefined', 'string', 'number', 'boolean'].includes(typeof value)

/**
 * 时间格式化
 * @param {string|number|date} date
 * @param {string} format
 */
export function formatter (date, format = 'yyyy/MM/dd hh:mm:ss') {
  if (!isValidDate(date)) {
    return ''
  }

  date = new Date(date)

  const map = {
    M: () => date.getMonth() + 1, // 月份
    d: () => date.getDate(), // 日
    h: () => date.getHours(), // 小时
    m: () => date.getMinutes(), // 分
    s: () => date.getSeconds(), // 秒
    q: () => Math.floor((date.getMonth() + 3) / 3), // 季度
    S: () => date.getMilliseconds() // 毫秒
  }

  format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
    let v = map[t]
    if (typeof v === 'function') {
      v = v()
      if (all.length > 1) {
        v = '0' + v
        v = v.substr(v.length - 2)
      }
      return v
    } else if (t === 'y') {
      return (date.getFullYear() + '').substr(4 - all.length)
    }

    return all
  })

  return format
}

export function generateKey (name) {
  if (typeof name !== 'string' || name === '') {
    throw new Error('generateKey必须有一个字符串参数！')
  }

  return name +
    Date.now() +
    Math.floor(Math.random() * 10000) +
    Math.floor(Math.random() * 10000)
}
