const Utils = {
  isPrimitive (value) {
    return value === null || ['undefined', 'number', 'string', 'boolean'].includes(typeof value)
  },
  isArray (value) {
    return value instanceof Array
  },
  isObject (value) {
    return Object.prototype.toString.call(value) === '[object Object]'
  },
  isSymbol () {},
  isFunction (value) {
    return typeof value === 'function'
  }
}

export default function deepEqual (target, source, targetStack = [], sourceStack = []) {
  // 循环引用
  const targetStackIndex = target.findIndex(item => item === target)
  const sourceStackIndex = source.findIndex(item => item === source)

  if (
    targetStackIndex !== -1 &&
    sourceStackIndex !== -1 &&
    targetStackIndex === sourceStackIndex
  ) {
    return true
  }

  // 同一个数据
  if (target === source) {
    return true
  }

  // 函数
  const targetIsFunction = Utils.isFunction(target)
  const sourceIsFunction = Utils.isFunction(source)

  if (targetIsFunction && sourceIsFunction) {
    return target.toString() === source.toString()
  }

  if (targetIsFunction || sourceIsFunction) {
    return false
  }

  // 基本类型
  const targetIsPrimitive = Utils.isPrimitive(target)
  const sourceIsPrimitive = Utils.isPrimitive(source)

  if (targetIsPrimitive && sourceIsPrimitive) {
    return target === source
  }

  if (targetIsPrimitive || sourceIsPrimitive) {
    return false
  }

  // 对象
  const targetIsObject = Utils.isObject(target)
  const sourceIsObject = Utils.isObject(source)

  if (targetIsObject && sourceIsObject) {
    const targetKeys = Object.keys(target)
    const sourceKeys = Object.keys(source)
    const targetKeysLength = targetKeys.length
    const sourceKeysLength = sourceKeys.length

    if (targetKeysLength === sourceKeysLength) {
      targetStack.push(target)
      sourceStack.push(source)
      return targetKeys.every(key => deepEqual(target[key], source[key], targetStack))
    } else {
      return false
    }
  }

  if (targetIsObject || sourceIsObject) {
    return false
  }

  // 数组
  const targetIsArray = Utils.isArray(target)
  const sourceIsArray = Utils.isArray(source)

  if (targetIsArray && sourceIsArray) {
    const targetLength = target.length
    const sourceLength = source.length

    if (targetLength === sourceLength) {
      targetStack.push(target)
      sourceStack.push(source)
      return target.every((item, index) => deepEqual(item, source[index], targetStack))
    }

    return false
  }

  if (targetIsArray || sourceIsArray) {
    return false
  }

  return false
}
