/**
 * 参考资料：[前端实现很哇塞的浏览器端扫码功能](https://segmentfault.com/a/1190000040809122)
 */

import Scanner from './scanner'

window.onload = async function onload() {
  try {
    const videoRef = document.getElementById('video-scanner')
    const scanner = new Scanner(videoRef)
    const result = await scanner.scanCode()

    console.log(`扫码成功：${result.data}`, result)
    location.href = result.data
  } catch (ex) {
    console.error(`扫码失败：${ex.message}`)
  }
}
