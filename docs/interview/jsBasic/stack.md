---
title: 引擎，运行时和调用堆栈
order: 1
group:
  order: 1
  title: js Basic
  path: /interview/js
nav:
  order: 3
  title: 'interview'
  path: /interview
---

## 调用栈

JavaScript 是一种单线程编程语言，这意味着它只有一个调用堆栈。因此，它一次只能做一件事。

调用栈是一种数据结构，它记录了我们在程序中的位置。如果我们运行到一个函数，它就会将其放置到栈顶，当从这个函数返回的时候，就会将这个函数从栈顶弹出，这就是调用栈做的事情。

```js
function foo() {
  throw new Error('stack help you resolve crashes:');
}
function boo() {
  foo();
}
function start() {
  boo();
}
start();
```

然而，在某些时候，调用堆栈中的函数调用数量超过了调用堆栈的实际大小，浏览器决定采取行动，抛出一个错误，它可能是这样的:

图片

在单个线程上运行代码很容易，因为你不必处理在多线程环境中出现的复杂场景——例如死锁。但是在一个线程上运行也非常有限制，由于 JavaScript 只有一个调用堆栈，当某段代码运行变慢时会发生什么?

## 参考

- [JavaScript 是如何工作的 01：引擎，运行时和调用堆栈的概述！](https://segmentfault.com/a/1190000017352941)
- [JavaScript js 调用堆栈](https://mp.weixin.qq.com/s/nxlrWyfRNhsTaERd4nPiKQ)
