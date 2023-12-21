---
title: BFF模式
order: 4
group:
  title: study
  order: 0
  path: /study
nav:
  order: 1
  title: 'node'
  path: /node
---

[携程度假基于 RPC 和 TypeScript 的 BFF 设计与实践](https://zhuanlan.zhihu.com/p/649364099)

随着多终端的发展，前后端的数据交互的复杂性和多样性都在急剧增加。不同的终端，其屏幕尺寸和页面 UI 设计不一，对接口的数据需求也不尽相同。构建一套接口满足所有场景的传统方式，面对新的复杂性日益捉襟见肘。

在这个背景下，BFF 作为一种模式被提出。其全称是 Backend for frontend，即**为前端服务的后端**。它的特点是考虑了不同端的数据访问需求，并给予各端针对性的优化。

微服务强调按领域模型分隔服务，BFF 则强调按**终端类型**分隔服务。

大部分情况下前端团队会采用相同的编程语言（JavaScript/TypeScript），基于 Node.js 运行时开发相应的 BFF 服务。基于这个前提，我们讨论几种技术选型。
