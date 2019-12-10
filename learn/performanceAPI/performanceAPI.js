const timing = performance.timing
// 准备新页面时间耗时
const readyStart = timing.fetchStart - timing.navigationStart
console.log(readyStart)
// redirect 重定向耗时
const redirectTime = timing.redirectEnd - timing.redirectStart
console.log(redirectTime)
// AppCache 耗时
const appCacheTime = timing.domainLookupStart - timing.fetchStart
console.log(appCacheTime)
// unload 前文档耗时
const unloadEventTime = timing.unloadEventEnd - timing.unloadEventStart
console.log(unloadEventTime)
// DNS 查询耗时
const lookupDomainTime = timing.domainLookupEnd - timing.domainLookupStart
console.log(lookupDomainTime)
// TCP 连接耗时
const connectTime = timing.connectEnd - timing.connectStart
console.log(connectTime)
// request 请求耗时
const requestTime = timing.responseEnd - timing.responseStart
console.log(requestTime)
// 请求完毕至 DOM 加载
const initDomTreeTime = timing.domInteractive - timing.responseEnd
console.log(initDomTreeTime)
// 解析 DOM 树耗时
const domReadyTime = timing.domComplete - timing.domInteractive
console.log(domReadyTime)
// load 事件耗时
const loadEventTime = timing.loadEventEnd - timing.loadEventStart
console.log(loadEventTime)
// 加载时间耗时
const loadTime = timing.loadEventEnd - timing.navigationStart
console.log(loadTime)

// 内存占用的具体数据
console.log(performance.memory)
// 返回当前网页自 performance.timing 到现在的时间，
// 可以精确到微秒，用于更加精确的计数。但实际上，目前网页性能通过毫秒来计算就足够了
console.log(performance.now())
// 获取页面所有加载资源的 performance.timing 情况。
// 浏览器获取网页时，会对网页中每一个对象（脚本文件、样式表、图片文件等）发出一个 HTTP 请求。
// performance.getEntries 方法以数组形式返回所有请求的时间统计信息。
console.logg(performance.getEntries())
// performance 还可以提供用户行为信息，例如网络请求的类型和重定向的次数等。
// 一般都存放在 performance.navigation 对象里面
console.log(performance.navigation)
// 记录当前网页重定向的次数
console.log(performance.navigation.redirectCount)

// Profile 工具
// 测试页面脚本运行时系统内存和CPU资源占用情况

// 1. 分析页面脚本执行过程中最消耗资源的操作
// 2. 记录页面脚本执行过程中JavaScript对象消耗的内存与堆栈的使用情况
// 3. 检测页面脚本执行过程中CPU占用情况

console.profile()
console.profileEnd()
