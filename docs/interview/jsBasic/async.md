---
title: 四种异步
order: 3
group:
  order: 1
  title: js Basic
  path: /interview/js
nav:
  order: 3
  title: 'interview'
  path: /interview
---

## info asynchronization 和 synchronization

### js 中异步的应用场景

开篇讲了同步和异步的概念，那么在 JS 中异步的应用场景有哪些呢？

定时任务：setTimeout、setInterval 网络请求：ajax 请求、动态创建 img 标签的加载事件监听器：addEventListener

## callback 回调函数

## promise

### promise 异常捕获

```js
var p1 = new Promise((resolve, reject) => {
  reject('p1 is rejected');
});
p1.then((res) => {
  console.log('p1 then');
  return new Promise((resolve, reject) => {
    resolve('p1 return resolve');
  });
})
  .then((res) => {
    console.log('p1 then then:', res);
  })
  .catch((err) => {
    console.log('p1 catch:', err);
  });
```

## generator

## async/await

> async/await 的目的为了简化使用基于 promise 的 API 时所需的语法。async/await 的行为就好像搭配使用了生成器 generator 和 promise。

## 一些可能涉及到的问题

### 串行接口两个接口，如何保证第二个接口的正常发送

```js
var p1 = new Promise((resolve, rejece) => {
  reject('123');
});
var p2 = new Promise((resolve, reject) => {
  resolve('p2');
});
```

### 接口什么时候会 canceled

## 参考

- [js 四种异步解决方案](https://mp.weixin.qq.com/s/eHB1eDwEt93FzSmsX4BSzg)
- [mdn/async](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function)
