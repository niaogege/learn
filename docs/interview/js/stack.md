---
title: 引擎/运行时和调用堆栈/浏览器
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

![microMacro.jpg](https://s2.loli.net/2022/05/08/f7lQt3xoyCcWv9B.jpg)

## 调用栈

JavaScript 是一种单线程编程语言，这意味着主线程只有一个调用堆栈。因此，它一次只能做一件事。

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

在单个线程上运行代码很容易，因为你不必处理在多线程环境中出现的复杂场景——例如死锁。但是在一个线程上运行也非常有限制，由于 JavaScript 只有一个调用堆栈，当某段代码运行变慢时会发生什么?

## 实际代码表现

- 问：说出一下代码的执行过程

```js
console.log(1);
setTimeout(function () {
  console.log(2);
}, 0);
console.log(3);
```

- console.log(1)被压入执行栈，直接执行
- setTimeout 在执行栈被识别为异步任务，放入 webapis 中
- console.log（3）被压入执行栈，此时 setTimeout 的可执行代码还在回调队列里等待
- console.log（3)执行完成后，执行栈此时已经清空了，从回调队列头部取出 console.log(2)，放入执行栈
- console.log(2)执行

### 回调队列(event queue)先进先出

- 问下面代码输出

```js
console.log(1);
setTimeout(() => {
  console.log(2);
  setTimeout(() => {
    console.log(3);
  }, 0);
}, 0);
setTimeout(() => {
  console.log(4);
}, 0);
console.log(5);
// output 1 5 2 4 3
```

描述上述的过程 1，输出 1，将 2push 进 webapis，倒计时结束后的 setTimeout 的可执行函数，被放入了回调队列

2，将 4push 进回调队列

3，输出 5

4，清空了执行栈，读取输出 2，发现有 3，将 3push 进回调队列

5，清空了执行栈，读取输出 4

6，清空了执行栈，读取输出 3

### Macrotask(宏任务)、Microtask（微任务）

> 宏任务队列和微任务队列两个队列有什么区别？

Microtask(微任务)同样是一个任务队列，这个队列的执行时机是在**清空执行栈**之后

Microtask（微任务）虽然是队列，但并不是一个一个放入执行栈，而是当执行栈清空，会执行全部 Microtask（微任务）队列中的任务，清空执行栈之后最后才是取回调队列的第一个 Macrotask(宏任务)

```js
console.log(1);
setTimeout(() => {
  console.log(2);
}, 4000);
var p = new Promise((resolve, reject) => {
  console.log(3);
  resolve('成功');
});
p.then(() => {
  console.log(4);
});
console.log(5);
// output: 1 3 5 4 2
```

描述下上述过程

- console.log(1)推入执行栈直接执行，输出 1
- setTimeout 推入 webapi,4000 毫秒之后压入事件队列中
- p 压入执行栈，执行，输出 3
- p.then()推入 webpai,然后进入事件队列
- console.log(5)执行，输出 5
- 事件队列中有 setTimeout/new Promise
- 执行栈此时已经清空，微任务 new Promise 推入执行栈，打印 4
- 执行栈此时已经清空，宏任务 setTimeout 推入执行栈，打印 2

#### demo

```js
setTimeout(() => {
  console.log(1);
});
Promise.resolve().then(() => {
  console.log(2);
  Promise.resolve().then(() => {
    console.log(3);
  });
});
Promise.resolve().then(() => {
  console.log(4);
});
// output: 2 4 3 1
```

描述以上过程

- setTimeout push 宏任务
- 将 then(2)push 进微任务
- 将 then(4)push 进微任务
- 任务队列为空，取出微任务第一个 then(2)压入执行栈
- 输出 2，将 then(3)push 进微任务
- 任务队列为空，取出微任务第一个 then(4)压入执行栈
- 输出 4
- 任务队列为空，取出微任务第一个 then(3)压入执行栈
- 输出 3
- 任务队列为空，微任务也为空，取出宏任务中的 setTimeout（1）
- 输出 1

### 为什么 then 是微任务

这和每个浏览器有关，每个浏览器实现的 promise 不同，有的 then 是宏任务，有的是微任务，chrome 是微任务，普遍都默认为微任务除了 then 以外，还有几个事件也被记为微任务：

- process.nextTick
- promises
- Object.observe
- MutationObserver

## 参考

- [JavaScript 是如何工作的 01：引擎，运行时和调用堆栈的概述！](https://segmentfault.com/a/1190000017352941)
- [JavaScript js 调用堆栈](https://mp.weixin.qq.com/s/nxlrWyfRNhsTaERd4nPiKQ)
- [图解搞懂 JavaScript 引擎 Event Loop](https://juejin.cn/post/6844903553031634952)
