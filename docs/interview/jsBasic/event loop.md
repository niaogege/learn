---
title: event loop
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

我们都知道，

- javascript 是一门单线程语言
- **Event Loop**是 js 的执行机制, 事件循环也是 js 实现异步的一种方式
- 只要主线程空了，就会去读取 "任务队列 task queue"，这就是 JavaScript 的运行机制
- js 单线程又是如何实现异步的呢? **通过事件循环**

JS 的执行机制是

- 首先判断 js 代码是同步还是异步,同步就进入主进程,异步就进入 event table
- 异步任务在 event table 中注册函数,当满足触发条件后,会推入事件队列里，比如 setTimeout(fn, delay)中的 delay 后才会被推入 event queue
- 同步任务进入主线程后一直执行,直到主线程空闲时,才会去 event queue 中查看是否有可执行的异步任务,如果有就推入主进程中
- event queue 其实还分为 mircoTask / macroTask,微任务也是一个队列，但是微任务中的任务不是一个一个放入执行栈，而是当执行栈清空的时候会执行所有的微任务，同样是执行栈清空的时候，才会执行宏任务队列中的第一个宏任务

### 参考

- [图解搞懂 JavaScript 引擎 Event Loop](https://juejin.cn/post/6844903553031634952)
