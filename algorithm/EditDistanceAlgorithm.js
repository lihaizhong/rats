/**
 * Created by sky on 2017/2/9.
 */

;(function(context) {
  function editDistance(target, compare) {
    const lenA = target.length
    const lenB = compare.length
    const space = new Array(lenB)
    const result = {
      // 最大的匹配词长度
      maxLength: -1,
      // 匹配词总个数
      count: 0,
      // 首个匹配字符的位置
      position: 1000000000,
      // 最短编辑路径
      distance: -1
    }

    function modifyResult(conj, pos) {
      const len = conj.length
      if (len) {
        // 设置最大匹配字符串长度
        if (len > result.maxLength) {
          result.maxLength = len
        }
        // 设置所有匹配字符的数量
        result.count += len
        // 设置首个匹配字符位置
        if (pos != -1 && result.position > pos) {
          result.position = pos
        }
      }
    }

    // 过滤目标或者比较值为空字符串的情况
    if (target === '' || compare === '') {
      return result
    }

    // 创建一个数组，用于单个字符匹配
    // for (let k = 0; k <= lenB; k++) {
    //   space[k] = k
    // }

    for (let i = 1; i <= lenA; i++) {
      let old = space[0] === undefined ? 0 : space[0]
      space[0] = i
      const curA = target[i - 1]
      // 是否连续匹配到字符
      let isContinue = false
      // 是否匹配到字符
      let isMatched = false
      // 匹配到的连续字符
      let continuousChar = ''
      // 匹配到的最终位置
      let finalPos = -1

      for (let j = 1; j <= lenB; j++) {
        const tmp = space[j] === undefined ? 0 : space[j]
        const curPos = j - 1
        const curB = compare[curPos]

        // 是否匹配到字符
        if (curA == curB) {
          space[j] = old

          if (finalPos === -1 || finalPos > curPos) {
            finalPos = curPos
          }

          // 确保只匹配成功一次
          if (!isContinue) {
            isMatched = true
            // 是否已经匹配到字符串，并且保证匹配的字符串可查询
            isContinue =
              target[i - 2] == compare[j - 2] &&
              compare.indexOf(continuousChar + curA) != -1
          }
        } else {
          // 获得最小编辑距离路径
          space[j] = Math.min(tmp + 1, space[curPos] + 1, old + 1)
        }
        old = tmp
      }

      // 如果是最后一个字符，无论字符串是否连续都执行设置结果集
      if (lenA == i) {
        // 如果是连续的字符串，就拼接最后一个字符
        if (isContinue) {
          continuousChar += curA
          isContinue = isMatched = false
        } else if (isMatched) {
          continuousChar += curA
          isMatched = false
        }
      }

      // 如果是连续的字符串，就拼接这个字符；否则去设置结果集
      if (isContinue || isMatched) {
        continuousChar += curA
      } else {
        modifyResult(continuousChar, finalPos)
      }
    }

    // 设置编辑距离
    result.distance = space[lenB]

    return result
  }

  // 计算数据相似度，根据权值调整
  function calcSimilarity(data) {
    const WEIGHT_CONFIG = {
      // 匹配到的最大长度
      maxLength: 40,
      // 匹配到的个数
      count: 20,
      // 匹配到的位置
      position: 5,
      // 编辑文本的距离
      distance: 30
    }

    return (
      data.maxLength * WEIGHT_CONFIG.maxLength +
      data.count * WEIGHT_CONFIG.count -
      data.position * WEIGHT_CONFIG.position -
      data.distance * WEIGHT_CONFIG.distance
    )
  }

  function getMaxSimilarity(target, keyNameList = [], match) {
    return keyNameList.reduce((accumulator, currentValue) => {
      const value = getValue(target, currentValue)

      if (typeof value !== 'string') {
        return accumulator
      }

      const result = editDistance(match.toLowerCase(), value.toLowerCase())

      if (result.count === 0) {
        return accumulator
      }

      const similarity = calcSimilarity(result)
      // console.log(match, value, similarity, JSON.stringify(result))

      if (
        accumulator.similarity !== undefined &&
        accumulator.similarity > similarity
      ) {
        return accumulator
      }

      return { similarity, result }
    }, {})
  }

  // 获取值
  function getValue(target, key) {
    return target !== null &&
      typeof target === 'object' &&
      typeof key === 'string' &&
      key !== ''
      ? target[key]
      : target
  }

  /**
   * 编辑距离算法排序
   * @param {array} rowList 待排序的数组
   * @param {string} match 排序的目标
   * @param {string} keyNameList 如果数组的每一个value为对象，keyNameList为读取对象的属性
   * @returns {array} sortList 排完序的数组
   */
  export default function suggest(rowList, match, keyNameList = ['value']) {
    const len = rowList.length
    const result = []

    if (typeof keyNameList === 'string') {
      keyNameList.split(',')
    } else if (!(keyNameList instanceof Array)) {
      throw new Error(`keyNameList 必须是字符串类型或者数组类型`)
    }

    // 遍历每一个数据，获得数据的编辑距离以及其它关键属性
    for (let i = 0; i < len; i++) {
      const data = rowList[i]

      const { similarity, result } = getMaxSimilarity(data, keyNameList, match)

      // 过滤完全没有匹配到的数据
      if (similarity === undefined || result === undefined) {
        continue
      }

      result.push({ similarity, result, data })
    }

    return (
      result
        // 根据数据的相似度进行排序
        .sort((a, b) => b.similarity - a.similarity)
        // 还原数据结构
        .map(item => {
          // console.log(item.data.key, item.data.value, item.similarity)
          return item.data
        })
    )
  }

  context.suggest = suggest
})(window || global)
