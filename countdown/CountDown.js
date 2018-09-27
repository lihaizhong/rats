/**
 * @author Sangbaipi
 * @email sangbaipi@2dfire.com
 * @create date 2018-08-27 02:45:53
 * @modify date 2018-08-27 02:45:53
 * @desc 倒计时 内部以 “毫秒” 为单位，对外抛出以 “秒” 为单位
 * @param {Boolean} needRemainFormat 非不填，是否需要格式化时间 默认是 true
 * @param {Date | String} startTime 非必填，开始时间 用于计算remain时间 默认是 Date.now()
 * @param {Date | String} endTime 非必填，结束时间 用于计算remain时间 默认是 Date.now()
 * @param {Number} remain 推荐，否则可以通过startTime和endTime计算出来
 * @param {Function} callback 倒计时的回调函数，有一个参数`remainTimeVos`和一个是否结束的参数`isFinished`
 * @key {Object} remainTimeVos
 * @sub-key {String} day 剩余天数
 * @sub-key {String} hours 剩余小时
 * @sub-key {String} minutes 剩余分钟
 * @sub-key {String} seconds 剩余秒
 * @sub-key {Number} remain 剩余时间（单位：秒）
 * @key {Function} includeSymbol 用于判断当前的symbol是否存在于symbol集合中
 *
 * 注：symbol的编写规则[type]:[value]![ET][expires]
 * 1. type表示value的类型（可以填写time表示具体时间，也可以填写remain表示剩余时间触发）
 * 2. 用:隔开，填写value的值
 * 3. 用!隔开，后面选填，如果不填，表示Infinity，剩余时间都会触发该symbol
 * 4. ET表示expires的类型（可以填写T表示具体时间，也可以填写R表示剩余时间，默认不填为R）
 * 5. expires表示生命周期
*/

import './requestAnimationFrame'

export default class CountDown {
  constructor (needRemainFormat) {
    this.init(needRemainFormat)
  }

  /* ##################### External methods ######################### */

  /**
   * @exports init
   *
   * 初始化
   * @param {boolean} needRemainFormat
   */
  init (needRemainFormat) {
    this._needRemainFormat = needRemainFormat !== false
    this._nowTime = this._startTime = this._endTime = null
    this._timer = null
    this._remain = 0
    this._breakpoint = {}
    this._callback = function () {}
  }

  /**
   * @exports setRemainTime
   *
   * 设置剩余时间
   * @param {number} remain
   */
  setRemainTime (remain) {
    if (remain < 0) {
      remain = 0
    }
    this._remain = typeof remain !== 'number' ? 0 : CountDown.setTimeFormat(remain)
    this.exit()

    return this
  }

  /**
   * @exports setTime
   *
   * 设置开始时间和结束时间
   * @param {date | number | string} startTime
   * @param {date | number | string} endTime
   * @param {date | number | string} nowTime
   */
  setTime (startTime, endTime, nowTime) {
    this._startTime = CountDown.setTimeFormat(startTime)
    this._endTime = CountDown.setTimeFormat(endTime)
    this._nowTime = CountDown.setTimeFormat(nowTime)
    let remainTime = this._endTime - Math.max(this._startTime, this._nowTime)
    this.setRemainTime(remainTime > 0 ? remainTime : 0)

    return this
  }

  /**
   * @exports setCallback
   *
   * 设置毁掉函数
   * @param {function} callback
   */
  setCallback (callback) {
    this._callback = callback
    this.exit()

    return this
  }

  /**
   * @exports registerSymbol
   *
   * 注册断点Symbol
   * @param {string} point
   */
  registerSymbol (point) {
    return this._registerSymbol(point)
  }

  /**
   * @exports registerFinishedSymbol
   *
   * 注册断点Symbol
   */
  registerFinishedSymbol () {
    return this._registerSymbol('finished')
  }

  /**
   * @exports registerUnstartSymbol
   *
   * 注册断点Symbol
   */
  registerUnstartSymbol () {
    return this._registerSymbol('unstart')
  }

  /**
   * @exports start
   *
   * 启动计时器
   */
  start () {
    let isFinished = this._remain <= 0
    let symbols = this._getBreakPointSymbols(isFinished)
    // 执行回调函数
    this._callback(this._getRemainTimeFormat(this._remain), CountDown.includeSymbol(symbols))
    if (!isFinished) {
      this.play()
    }
  }

  /**
   * @exports play
   *
   * 重启计时器
   */
  play () {
    let timerStart = Date.now()

    if (this._startTime && this._startTime > this._nowTime) {
      return
    }

    function __callback__ () {
      let timerEnd = Date.now()
      let interval = parseInt((timerEnd - timerStart) / 1000) * 1000
      let base = 1000
      let remain = this._remain
      let isFinished = false

      if (interval >= base) {
        // 确保时间是绝对精确的
        timerStart = parseInt(timerEnd / base) * base + (timerStart % base)
        // 由于requestAnimationFrame在离开页面后会出现暂停的效果，顾返回页面时，要减去中间的差值
        remain -= interval
        // 更新当前时间
        this._nowTime += interval

        // BUGFIX 由于离开页面时间太久，已经过了剩余时间，导致展示内容是负值
        if (remain < 0) {
          remain = 0
        }

        if (remain <= 0) {
          isFinished = true
        }

        this._remain = remain
        // 格式化剩余时间
        let remainFormat = this._getRemainTimeFormat(remain)
        // 执行断点毁掉函数
        let symbols = this._getBreakPointSymbols(isFinished)
        // 执行回调函数
        this._callback(remainFormat, CountDown.includeSymbol(symbols))
      }

      if (!isFinished) {
        this._timer = requestAnimationFrame(__callback__.bind(this))
      }
    }

    this._timer = requestAnimationFrame(__callback__.bind(this))
  }

  /**
   * @exports pause
   *
   * 暂停计时器
   */
  pause () {
    cancelAnimationFrame(this._timer)
    this._timer = null
  }

  /**
   * @exports exit
   *
   * 关闭计时器
   */
  exit () {
    this.pause()
  }

  /* ##################### Internal methods ######################### */

  /**
   * 注册断点Symbol
   * @param {string} point
   */
  _registerSymbol (point) {
    if (typeof point !== 'string') {
      console.error('【CountDown】Symbol必须是字符串！')
      return false
    }

    if (this._breakpoint[point]) {
      console.warn('【CountDown】Symbol已存在！')
      return this._breakpoint[point]
    }

    let breakpoint = this._breakpoint[point] = {}
    let match = null
    switch (point) {
      case 'unstart':
        match = ['unstart', 'unstart', null]
        break
      case 'finished':
        match = ['finished', 'finished', null]
        break
      default:
        match = point.match(/^\s*(\w+):(.+?)(?:(!)(.*))?\s*$/)
    }

    if (match) {
      let type = breakpoint['type'] = match[1]
      let s = match[3]
      let expires = match[4]

      if (type === 'remain') {
        breakpoint['value'] = Number(match[2])
      } else if (type === 'time') {
        breakpoint['value'] = CountDown.setTimeFormat(match[2])
      } else {
        breakpoint['value'] = null
      }

      if (s === '!') {
        if (expires) {
          if (expires.substring(0, 1) === 'T') {
            expires =  CountDown.setTimeFormat(expires.substring(1))
            breakpoint['ET'] = 'T'
          } else {
            if (expires.substring(0, 1) === 'R') {
              expires = expires.substring(1)
            }

            expires = CountDown.setTimeFormat(expires)
            breakpoint['ET'] = 'R'
          }
          breakpoint['expires'] = expires
        } else {
          breakpoint['expires'] = Infinity
        }
      }
    } else {
      console.error('【CountDown】错误的断点类型！')
    }

    let symbol = `CD${ Date.now() }R${ parseInt(Math.random() * 1000) }P${ point }`
    breakpoint['symbol'] = symbol
    return symbol
  }

  /**
   * 执行断点回调函数
   * @param {boolean} isFinished
   */
  _getBreakPointSymbols (isFinished) {
    let remain = this._remain
    let symbols = []

    for (let k in this._breakpoint) {
      if (this._breakpoint.hasOwnProperty(k)) {
        let breakpoint = this._breakpoint[k]
        let trigger = false
        let type = breakpoint['type']
        let value = breakpoint['value']

        switch (type) {
          case 'remain':
            // 防止页面重新展示时，时间已过，无法触发过期断点问题
            trigger = remain <= value
            break
          case 'time':
            if (!this._endTime) {
              console.error('【CountDown】请设置开始时间和结束时间！')
              continue
            }

            let time = CountDown.setTimeFormat(value)
            let nowTime = this._endTime - remain
            // 防止页面重新展示时，时间已过，无法触发过期断点问题
            trigger = nowTime >= time
            break
          case 'unstart':
            if (!this._startTime) {
              console.error('【CountDown】请设置开始时间和结束时间！')
              continue
            }

            trigger = this._startTime &&  this._nowTime < this._startTime
            break
          case 'finished':
            trigger = isFinished
            break
          default:
            console.error('【CountDown】未知断点标识！')
        }

        // 达到触发条件，做执行回调函数操作
        if (trigger) {
          let symbol = breakpoint['symbol']
          let expires = breakpoint['expires']
          let ET = breakpoint['ET']
          if (isFinite(expires)) {
            if ('T' === ET) {
              if (!this._nowTime) {
                console.error('【CountDown】请设置开始时间和结束时间！')
                continue
              }

              if (expires >= this._nowTime) {
                delete this._breakpoint[k]
              }
            } else if ('R' === ET && remain <= expires) {
              delete this._breakpoint[k]
            }
          }
          symbols.push(symbol)
        }
      }
    }

    return symbols
  }

  /**
   * 获取格式化后的剩余时间对象
   * @param {number} remain
   */
  _getRemainTimeFormat (remain) {
    if (!this._needRemainFormat) {
      return remain / 1000
    }

    let remainFormat = {}

    remainFormat.remain = remain / 1000

    let dayFormat = 86400000
    remainFormat.day = CountDown.formatTime(parseInt(remain / dayFormat))
    remain = remain % dayFormat

    let hoursFormat = 3600000
    remainFormat.hours = CountDown.formatTime(parseInt(remain / hoursFormat))
    remain = remain % hoursFormat

    let minutesFormat = 60000
    remainFormat.minutes = CountDown.formatTime(parseInt(remain / minutesFormat))
    remain = remain % minutesFormat

    let secondsFormat = 1000
    remainFormat.seconds = CountDown.formatTime(parseInt(remain / secondsFormat))

    return remainFormat
  }
}

/**
 * STATIC: 主要用于开始时间和结束时间的初始化
 * @param {date | number | string} time
 */
CountDown.setTimeFormat = function (time) {
  let result = null
  if (time instanceof Date) {
    result = time.getTime()
  } else if (!isNaN(time) && (typeof time === 'number' || typeof time === 'string')) {
    result = Number(time)
  } else if (isNaN(time) && typeof time === 'string') {
    // 针对safari浏览器做时间调整
    if (/safari/gi.test(navigator.userAgent)) {
      time = time.trim()
      time = time.replace(/\s+/, 'T')
    }

    result = new Date(time).getTime()
  } else {
    result = Date.now()
  }

  return parseInt(result / 1000) * 1000
}

/**
 * STATIC: 格式化时间
 * @param {number} time
 */
CountDown.formatTime = function (time) {
  if (isNaN(time) || time === '' || typeof time === 'boolean') {
    time = 0
  }

  time = '0' + time

  return time.substring(time.length - 2)
}

/**
 * STATIC: 类似数组的includeOf
 * @param {array} symbols
 */
CountDown.includeSymbol = symbols => symbol => symbols.indexOf(symbol) !== -1
