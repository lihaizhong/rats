# 扫码点餐

## 使用技术

- Video
- Canvas
- navigator.getUserMedia()

## 实现方案

- 使用`navigator.getUserMedia()`获取视频流
- 将视频流信息注入`video`的`srcObject`中
- 使用`canvas`获取视频帧
- 使用`jsqr`解析canvas的视频帧，抓取其中的二维码信息

## 参考资料

- [前端实现很哇塞的浏览器端扫码功能](https://segmentfault.com/a/1190000040809122)
- [如何使用JavaScript控制摄像头对焦](https://juejin.cn/post/7438676650818502697)
