---
title: ssr服务端渲染中的css处理
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

- ssr 中如何处理 css 资源
- 具体做法是什么

网上一般都是这种方式引用 css,

CSS 服务端渲染思路：isomorphic-style-loader 拿到组件 css -> 客户端组件塞 css 到 props.staticContext -> 服务端 renderToString 之后拿到 css -> 挂在到页面 style 标签里
