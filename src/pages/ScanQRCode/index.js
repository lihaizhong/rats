// 基于zxing的二维码识别 https://github.com/LazarSoft/jsqrcode
import Scanner from './core/Scanner'

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
