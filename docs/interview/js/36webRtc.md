---
title: web-RTC
order: 36
group:
  order: 1
  title: js Basic
  path: /interview/js
nav:
  order: 3
  title: 'interview'
  path: /interview
---

> 本文转自[WebRTC 这么火 🔥，前端靓仔，请收下这篇入门教程](https://juejin.cn/post/7266417942182608955)

## webRtc

WebRTC（Web Real-Time Communications）是一项**实时通讯技术**，它允许网络应用或者站点，在不借助中间媒介的情况下，建立浏览器之间点对点（Peer-to-Peer）的连接，实现视频流和（或）音频流或者其他任意数据的传输。WebRTC 包含的这些标准使用户在无需安装任何插件或者第三方的软件的情况下，创建点对点（Peer-to-Peer）的数据分享和电话会议成为可能。

> 手机和手机之间建立点对点连接，实现视频流或者音频流的传输

### 实时通信和即时通信的区别

- IM 即时通信，就是通过文字聊天、语音消息发送、文件传输等方式通信，考虑的是**可靠性**；
- RTC 实时通信：音视频通话、电话会议，考虑的是**低延时**。

### WebRTC 应用场景

WebRTC 的能力使其适用于各种实时通信场景：

- 点对点通讯：WebRTC 支持浏览器之间进行音视频通话，例如语音通话、视频通话等；
- 电话会议：WebRTC 可以支持多人音视频会议，例如腾讯会议、钉钉会议等；
- 屏幕共享：WebRTC 不仅可以传输音视频流，还可以用于实时共享屏幕；
- 直播：WebRTC 可以用于构建实时直播，用户可以通过浏览器观看直播内容。

## WebRTC 组成部分

WebRTC 主要由三部分组成：浏览器 API、音视频引擎和网络 IO。

### 浏览器 API

用于采集摄像头和麦克风生成媒体流，并处理音视频通信相关的编码、解码、传输过程，可以使用以下 API 在浏览器中创建实时通信应用程序。

- getUserMedia: 获取麦克风和摄像头的许可，使得 WebRTC 可以拿到本地媒体流；
- RTCPeerConnection: 建立点对点连接的关键，提供了创建，保持，监控，关闭连接的方法的实现。像媒体协商、收集候选地址都需要它来完成；
- RTCDataChannel: 支持点对点数据传输，可用于传输文件、文本消息等。

### 音视频引擎

WebRTC 内置了强大的音视频引擎，可以对媒体流进行编解码、回声消除、降噪、防止视频抖动等处理，我们使用者大可不用去关心如何实现 。主要使用的音视频编解码器有:

- **OPUS**: 一个开源的低延迟音频编解码器，WebRTC 默认使用；
- **G711**: 国际电信联盟 ITU-T 定制出来的一套语音压缩标准，是主流的波形声音编解码器；
- VP8: VP8，VP9，都是 Google 开源的视频编解码器，现在主要用于 WebRTC 视频编码；
- H264: 视频编码领域的通用标准，提供了高效的视频压缩编码，之前 WebRTC 最先支持的是自己家的 VP8，后面也支持了 H264、H265 等。

## 网络 I/O

WebRTC 传输层用的是 UDP 协议，因为音视频传输对及时性要求更高，如果使用 TCP 当传输层协议的话，如果发生丢包的情况下，因为 TCP 的可靠性，就会尝试重连，如果第七次之后仍然超时，则断开 TCP 连接。而如果第七次收到消息，那么传输的延迟就会达到 2 分钟。在延迟高的情况下，想做到正常的实时通讯显然是不可能的，此时 TCP 的**可靠性**反而成了弊端。而 UDP 则正好相反，它只负责有消息就传输，不管有没有收到，这里从底层来看是满足 WebRTC 的需求的，所以 WebRTC 是采用 UDP 来当它的传输层协议的。

这里主要用到以下几种协议/技术

- RTP/SRTP: 传输音视频数据流时，我们并不直接将音视频数据流交给 UDP 传输，而是先给音视频数据加个 RTP 头，然后再交给 UDP 进行，但是由于浏览器对安全性要求比较高，增加了加密这块的处理，采用 SRTP 协议；
- RTCP：通过 RTCP 可以知道各端的网络质量，这样对方就可以做流控处理；
- **P2P(ICE + STUN + TURN)**: 这是 WebRTC 最核心的技术，利用 ICE、STUN、TURN 等技术，实现了浏览器之间的直接点对点连接，解决了 NAT 穿透问题，实现了高质量的网络传输。

除了以上三部分，WebRTC 还需要一个**信令服务**做会话管理，但 WebRTC 规范里没有包含信令协议，需要自行实现。
