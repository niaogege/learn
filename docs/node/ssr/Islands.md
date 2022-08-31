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
- es6 class 中 **#manifest**
- 需要会搭建基本的 **ssr** 框架

- [深入解读新一代全栈框架 Fresh](https://mp.weixin.qq.com/s/8qNI4a-3P2KId9WRAnz2dw)
- [isLand](https://github.com/sanyuan0704/island)
