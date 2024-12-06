# 扫一扫

实现一个简单的扫一扫功能

## 使用技术

- Video
- Canvas
- navigator.getUserMedia()

## 实现方案

- 使用`navigator.getUserMedia()`获取视频流
- 将视频流信息注入`video`的`srcObject`中
- 使用`canvas`获取视频帧
- 使用`jsqr`解析canvas的视频帧，抓取其中的二维码信息

## 进阶思考

- 如何识别多个二维码？
- 如何支持二维码选择？
- 如何在光线不佳的情况下，有效识别二维码？
- 如何提升二维码识别速度？

## 参考资料

- [前端实现很哇塞的浏览器端扫码功能](https://segmentfault.com/a/1190000040809122)
- [如何使用JavaScript控制摄像头对焦](https://juejin.cn/post/7438676650818502697)
- [MediaSource](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaSource)
- [MediaDevices](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices)
- [HTMLMediaElement：srcObject 属性](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement/srcObject)
- [CanvasRenderingContext2D：getImageData() 方法](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/getImageData)
