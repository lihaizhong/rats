import CountDown from '@/countdown/CountDown'

describe('【CountDown】init', function () {
  it('#init no setup', function () {
    const cd = new CountDown()
    expect(cd._needRemainFormat).to.equal(true)
  })

  it('#init setup true', function () {
    const cd = new CountDown(true)
    expect(cd._needRemainFormat).to.equal(true)
  })

  it('#init setup false', function () {
    const cd = new CountDown(false)
    expect(cd._needRemainFormat).to.equal(false)
  })
})

describe('【CountDown】remain time format', function () {
  it('#_getRemainTimeFormat not format(输入的单位为ms，输出的单位为s)', function () {
    const cd = new CountDown(false)
    const remain = 500000

    let remainVos = cd._getRemainTimeFormat(remain)
    console.log(remainVos)
    expect(remainVos).to.be.equal(remain / 1000)
  })

  it('#_getRemainTimeFormat format(输出为一个对象，包含天数、小时、分钟、秒钟以及以秒为单位的剩余时间)', function () {
    const cd = new CountDown(true)
    const remain = 500000
    let remainVos = cd._getRemainTimeFormat(remain)

    console.log(JSON.stringify(remainVos))
    expect(remainVos).to.be.a('object', '返回值不是一个对象')
    expect(remainVos.day).to.be.equal('00')
    expect(remainVos.hours).to.be.equal('00')
    expect(remainVos.minutes).to.be.equal('08')
    expect(remainVos.seconds).to.be.equal('20')
    expect(remainVos.remain).to.be.equal(remain / 1000)
  })
})

describe('【CountDown】set time format', function () {
  it('#static:setTimeFormat NaN', function () {
    const timestamp = CountDown.setTimeFormat()
    expect(timestamp).to.be.equal(parseInt(Date.now() / 1000) * 1000)
  })

  it('#static:setTimeFormat Date', function () {
    const date = new Date('2018-09-26T08:00')
    const timestamp = CountDown.setTimeFormat(date)
    expect(timestamp).to.be.equal(date.getTime())
  })

  it('#static:setTimeFormat Number', function () {
    const time = '500000'
    const timestamp = CountDown.setTimeFormat(time)
    expect(timestamp).to.be.equal(Number(time))
  })

  it('#static:setTimeFormat String', function () {
    const dateStr = '2018-09-27 12:00'
    const time = new Date('2018-09-27T12:00').getTime()
    const timestamp = CountDown.setTimeFormat(dateStr)
    expect(timestamp).to.be.equal(time)
  })
})

describe('【CountDown】set datetime', function () {
  const cd = new CountDown()

  afterEach(() => {
    cd.init()
  })

  it('#setRemainTime', function () {
    const remain = 40000
    cd.setRemainTime(remain)
    expect(cd._remain).to.equal(remain)
  })

  it('#setTime Timestamp', function () {
    const now = Date.now()
    const start = now
    const delay = 40000
    const end = start + delay

    cd.setTime(start, end)
    expect(cd._remain).to.equal(delay)
  })

  it('#setTime Date', function () {
    const now = Date.now()
    const start = new Date(now)
    const delay = 40000
    const end = new Date(now + delay)

    cd.setTime(start, end)
    expect(cd._remain).to.equal(delay)
  })
})

describe('【CountDown】add symbol', function () {
  const cd = new CountDown()

  afterEach(function () {
    cd.init()
  })

  it('#registerFinishedSymbol', function () {
    const COUNTDOWN_FINISHED_SYMBOL = cd.registerFinishedSymbol()
    const breakpoint = cd._breakpoint['finished']

    console.log(JSON.stringify(breakpoint))
    expect(breakpoint.type).to.equal('finished')
    expect(breakpoint.symbol).to.equal(COUNTDOWN_FINISHED_SYMBOL)
    expect(breakpoint.value).to.equal(null)
  })

  it('#registerUnstartSymbol', function () {
    const COUNTDOWN_UNSTART_SYMBOL = cd.registerUnstartSymbol()
    const breakpoint = cd._breakpoint['unstart']

    console.log(JSON.stringify(breakpoint))
    expect(breakpoint.type).to.equal('unstart')
    expect(breakpoint.symbol).to.equal(COUNTDOWN_UNSTART_SYMBOL)
    expect(breakpoint.value).to.equal(null)
  })

  it('#registerSymbol remain:1000', function () {
    const point = 'remain:1000'
    const COUNTDOWN_REMAIN_SYMBOL = cd.registerSymbol(point)
    const breakpoint = cd._breakpoint[point]

    console.log(JSON.stringify(breakpoint))
    expect(breakpoint.type).to.equal('remain')
    expect(breakpoint.symbol).to.equal(COUNTDOWN_REMAIN_SYMBOL)
    expect(breakpoint.value).to.equal(1000)
  })

  it('#registerSymbol remain:1000!', function () {
    const point = 'remain:1000!'
    const COUNTDOWN_REMAIN_SYMBOL = cd.registerSymbol(point)
    const breakpoint = cd._breakpoint[point]

    console.log(JSON.stringify(breakpoint))
    expect(breakpoint.type).to.equal('remain')
    expect(breakpoint.symbol).to.equal(COUNTDOWN_REMAIN_SYMBOL)
    expect(breakpoint.value).to.equal(1000)
    expect(breakpoint.expires).to.equal(Infinity)
  })

  it('#registerSymbol remain:10000!5000', function () {
    const point = 'remain:10000!5000'
    const COUNTDOWN_REMAIN_SYMBOL = cd.registerSymbol(point)
    const breakpoint = cd._breakpoint[point]

    console.log(JSON.stringify(breakpoint))
    expect(breakpoint.type).to.equal('remain')
    expect(breakpoint.symbol).to.equal(COUNTDOWN_REMAIN_SYMBOL)
    expect(breakpoint.value).to.equal(10000)
    expect(breakpoint.ET).to.equal('R')
    expect(breakpoint.expires).to.equal(5000)
  })

  it('#registerSymbol time:2018-09-26 08:00', function () {
    const point = 'time:2018-09-26 08:00'
    const COUNTDOWN_TIME_SYMBOL = cd.registerSymbol(point)
    const breakpoint = cd._breakpoint[point]

    console.log(JSON.stringify(breakpoint))
    expect(breakpoint.type).to.equal('time')
    expect(breakpoint.symbol).to.equal(COUNTDOWN_TIME_SYMBOL)
    expect(breakpoint.value).to.equal(new Date('2018-09-26T08:00').getTime())
  })

  it('#registerSymbol time:2018-09-26 08:00!', function () {
    const point = 'time:2018-09-26 08:00!'
    const COUNTDOWN_TIME_SYMBOL = cd.registerSymbol(point)
    const breakpoint = cd._breakpoint[point]

    console.log(JSON.stringify(breakpoint))
    expect(breakpoint.type).to.equal('time')
    expect(breakpoint.symbol).to.equal(COUNTDOWN_TIME_SYMBOL)
    expect(breakpoint.value).to.equal(new Date('2018-09-26T08:00').getTime())
    expect(breakpoint.expires).to.equal(Infinity)
  })

  it('#registerSymbol time:2018-09-26 08:00!T2018-09-28 08:00', function () {
    const point = 'time:2018-09-26 08:00!T2018-09-28 08:00'
    const COUNTDOWN_TIME_SYMBOL = cd.registerSymbol(point)
    const breakpoint = cd._breakpoint[point]

    console.log(JSON.stringify(breakpoint))
    expect(breakpoint.type).to.equal('time')
    expect(breakpoint.symbol).to.equal(COUNTDOWN_TIME_SYMBOL)
    expect(breakpoint.value).to.equal(new Date('2018-09-26T08:00').getTime())
    expect(breakpoint.ET).to.equal('T')
    expect(breakpoint.expires).to.equal(new Date('2018-09-28T08:00').getTime())
  })
})

describe('【CountDown】get breakpoint symbol list', function () {
  const cd = new CountDown()

  this.afterEach(function () {
    cd.init()
  })

  // it('#_getBreakPointSymbol ')
})
