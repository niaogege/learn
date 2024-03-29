---
title: browser总览
order: 0
group:
  order: 10
  title: browser
  path: /interview/browser
nav:
  order: 3
  title: 'interview'
  path: /interview
---

- BoM
- 浏览器的基本原理
- 浏览器的多进程架构

感谢大佬提供的技术好文

### 浏览器是如何渲染一个页面的

- HTML 解析在这个过程之前，浏览器会进行 DNS 解析及 TCP 握手等网络协议相关的操作，来与用户需要访问的域名服务器建议连接，域名服务器会给用户返回一个 **HTML 文本**用于后面的渲染 （这一点很关键，要注意）

- 渲染树的构建

浏览器客户端在收到服务端返回的 HTML 文本后，会对 HTML 的文本进行相关的解析，其中 DOM 会用于生成 DOM 树来决定页面的布局结构，CSS 则用于生成 CSSOM 树来决定页面元素的样式。如果在这个过程遇到脚本或是静态资源，会执行预加载对静态资源进行提前请求，最后将它们生成一个渲染树。

- 布局浏览器在拿到渲染树后，会进行布局操作，来确定页面上每个对象的大小和位置，再进行渲染。

- 绘制我们电脑的视图都是通过 GPU 的图像帧来显示出来的，绘制的过程其实就是将上面拿到的渲染树转化成 GPU 的图像帧来显示。首先浏览器会根据布局树的位置进行栅格化（用过组件库的同学应该不陌生，就是把页面按行列分成对应的层，比如 12 栅格，根据对应的格列来确定位置），最后得到一个合成帧，包括文本、颜色、边框等，最后将合成帧提升到 GPU 的图像帧，进而显示到页面中，就可以在电脑上看到我们的页面了。

- [你不知道的浏览器页面渲染机制](https://juejin.cn/post/6844903815758479374)
