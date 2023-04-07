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
- isomorphic-style-loader 有什么用
- isomorphic-style-loader 源码阅读

网上一般都是这种方式引用 css,

CSS 服务端渲染思路：组件拿到 css -> 客户端组件塞 css 到 props.staticContext -> 服务端 renderToString 之后拿到 css -> 挂在到页面 style 标签里

### 参考

[isomorphic-style-loader 在前后端渲染样式同构中的应用与源码分析](https://juejin.cn/post/6844904114787188749#heading-0)
