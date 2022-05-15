---
title: 初识axios
order: 2
group:
  title: axios
  order: 0
  path: /axios
nav:
  order: 1
  title: 'node'
  path: /node
---

## 总览

看到过 2019 年某一位大佬封装过 ts 版本的 axios，说的比较通透，值得学习[使用 Typescript 重构 axios](https://www.cnblogs.com/wangjiachen666/p/11234163.html) 使用 axios -> 封装实用的拦截器 -> 手写乞丐版 axios

> 202105 面试的时候取消请求如何取消，底层原理是啥

- axios(config)和 axios.get()或 axios.post 有上什么区别呢？

- 如何对一个请求进行取消,源码是怎么封装的

- 适配器是啥，axios 两种适配器分别有啥用

- 手写一个乞丐版的 axios

> 任何东西都是从使用开始，逐渐加深了解，不然你去看源码看个寂寞

- 源码里封装的 tool
