---
title: ssr服务端渲染
order: 1
group:
  title: node
  order: 0
  path: /node/ssr
nav:
  order: 5
  title: 'node'
  path: /node
---

面试中的重点！！！let us go!!

不知道如何看起，这个是重点中的重点，简历亮点

## 什么是服务端渲染

## 脱水 Dehydrate 和 注水 Hydrate

如果用服务器端渲染，一定要让服务器端塞给 React 组件的数据和浏览器端一致。

为了达到这一目的，服务端必须把传给 React 组件的数据给保留住，随着 HTML 一起传递给浏览器网页，这个过程，叫做“脱水”（Dehydrate）；在浏览器端，就直接拿这个“脱水”数据来初始化 React 组件，这个过程叫“注水”（Hydrate）。

## 手写 react ssr

## 参考

- [【万字长文警告】从头到尾彻底理解服务端渲染 SSR 原理](https://juejin.cn/post/6856321751115431944)
- [同构以及原理](https://hejialianghe.gitee.io/projectPractice/isomorphism.html#_1-1-%E8%AE%A4%E8%AF%86%E5%90%8C%E6%9E%84)
