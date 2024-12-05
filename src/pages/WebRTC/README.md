# WebRTC

## WebRTC服务器

WebRTC提供了点对点（浏览器到浏览器）之间的通信，但并不意味着WebRTC不需要服务器。至少WebRTC有两件事需要用到服务器：

1. 浏览器之间交换建立通信的元数据（信令）必须通过服务器
2. 穿透NAT和防火墙

## 信令的作用

1. 用来控制通信开启或者关闭的连接控制消息
2. 发生错误时用来彼此告知的消息
3. 媒体流元数据，比如像解码器、解码器的配置、带宽、媒体类型等等
4. 用来建立安全连接的关键数据
5. 外界所看到的的网络上的数据，比如IP地址、端口等

在建立连接之前，浏览器之间显然没有办法传递数据。需要服务器做中转，在浏览器之间传递这些数据，然后建立浏览器之间点对点的连接。

## 资料

- [WebRTC 中文网](https://webrtc.org.cn/)
- [WebRTC adapter.js是什么以及我们为什么需要它？（一）](https://webrtc.org.cn/adapterjs-1/)
- [WebRTC adapter.js是什么以及我们为什么需要它？（二）](https://webrtc.org.cn/adapterjs-2/)
- [WebRTC 學習筆記 (1) 基本觀念與流程](https://clairechang.tw/2023/04/25/webrtc/webrtc-intro/)
