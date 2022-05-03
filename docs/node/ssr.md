---
title: ssr/csr
order: 1
group:
  title: node
  order: 0
nav:
  order: 5
  title: 'node'
  path: /node
---

面试中的重点！！！let us go!!

## 什么是服务端渲染

## 脱水 Dehydrate 和注水 Hydrate

如果用服务器端渲染，一定要让服务器端塞给 React 组件的数据和浏览器端一致。

为了达到这一目的，必须把传给 React 组件的数据给保留住，随着 HTML 一起传递给浏览器网页，这个过程，叫做“脱水”（Dehydrate）；在浏览器端，就直接拿这个“脱水”数据来初始化 React 组件，这个过程叫“注水”（Hydrate）。

## 手写 react ssr

## 参考
