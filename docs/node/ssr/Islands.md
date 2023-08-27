---
title: 孤岛架构，island ssr
order: 2
group:
  title: ssr
  order: 0
  path: /node/ssr
nav:
  order: 5
  title: 'node'
  path: /node
---

- 什么是孤岛架构
- 孤岛架构带来的实际用处是什么
- 如何实现孤岛架构

问题：

- **import.meta.url** 代表什么, // 获取当前脚本文件的 url,只有在 esmodule 中才能用，原因是 ES Modules 是通过 **URL** 规范来引用文件的
- es6 class 中 **#manifest** 用法
- 需要会搭建基本的 **ssr** 框架

### isLand architecture

在传统 SSR 中，首屏渲染时，服务端会向浏览器输出 HTML 结构。

当浏览器渲染 HTML 后，再执行前端框架的初始化逻辑，为 HTML 结构绑定事件，这一步叫**hydrate（注水）**。

当 hydrate 完成后，页面才能响应用户交互。

也就是说，只有当整个页面所有组件 hydrate 完成后，页面中任一组件才能响应用户交互。

Chrome LightHouse 跑分中的 **TTI**[2]（Time to Interactive，可交互时间）指标用于衡量「页面变得完全可交互所需的时间」。

传统 SSR 架构的页面随着应用体积变大，TTI 指标会持续走高。

孤岛架构的目的就是为了优化 SSR 架构下 TTI 指标的问题。

在孤岛架构架构下，组件分为：

交互组件

首屏不可交互组件

「首屏不可交互组件」会像传统 SSR 一样向浏览器输出 HTML，而「交互组件」会在浏览器异步、并发渲染。

「交互组件」就像 HTML 海洋中的孤岛，因此得名孤岛架构。

孤岛架构可以让「交互优先级较高的组件」优先变得可交互，剩下的低优组件再慢慢**hydrate**。

如此，在页面 hydrate 完成前，重要的组件已经可交互了，借此就能降低 TTI 指标。

孤岛架构的现实意义在哪呢？比如，对于一个电商网站，显然「立刻购买按钮」的可交互性优先级高于「反馈按钮」的可交互性。

SSR 让用户能够更早看到页面，孤岛架构让页面中重要的部分（立刻购买按钮）可以更早被点击。

- [深入解读新一代全栈框架 Fresh](https://mp.weixin.qq.com/s/8qNI4a-3P2KId9WRAnz2dw)
- [isLand](https://github.com/sanyuan0704/island)
