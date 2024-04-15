---
title: weixin小程序相关
order: 24
group:
  order: 1
  title: js Basic
  path: /interview/js
nav:
  order: 3
  title: 'interview'
  path: /interview
---

weixin 小程序相关

- [京东快递小程序分包优化实践](https://mp.weixin.qq.com/s/LoWA132iCrnKarpz7ItrjQ)

## 双线程架构

小程序使用了双线程模型，包括逻辑层和渲染层：

- 逻辑层 JSCore 负责运行 JavaScript 脚本，进行数据处理；
- 渲染层使用 WebView 进行渲染，负责页面展示、处理用户交互
