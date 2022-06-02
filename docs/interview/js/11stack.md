---
title: 引擎/运行时和调用堆栈/浏览器
order: 11
group:
  order: 1
  title: js Basic
  path: /interview/js
nav:
  order: 3
  title: 'interview'
  path: /interview
---

[深入：微任务与 Javascript 运行时环境](https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_DOM_API/Microtask_guide/In_depth) ![microMacro.jpg](https://s2.loli.net/2022/05/08/f7lQt3xoyCcWv9B.jpg)

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

## JavaScript 执行上下文

当一段 JavaScript 代码在运行的时候，它实际上是运行在执行上下文中。下面 3 种类型的代码会创建一个新的执行上下文：

- 全局上下文是为运行代码主体而创建的执行上下文，也就是说它是为那些存在于 JavaScript 函数之外的任何代码而创建的。
- 每个函数会在执行的时候创建自己的执行上下文。这个上下文就是通常说的 “本地上下文”。
- 使用 eval() 函数也会创建一个新的执行上下文(谨慎使用)

每一个上下文在本质上都是一种作用域层级。每个代码段开始执行的时候都会创建一个新的上下文来运行它，并且在代码退出的时候销毁掉。看看下面这段 JavaScript 程序：

```js
let outputElem = document.getElementById('output');

let userLanguages = {
  Mike: 'en',
  Teresa: 'es',
};

function greetUser(user) {
  function localGreeting(user) {
    let greeting;
    let language = userLanguages[user];

    switch (language) {
      case 'es':
        greeting = `¡Hola, ${user}!`;
        break;
      case 'en':
      default:
        greeting = `Hello, ${user}!`;
        break;
    }
    return greeting;
  }
  outputElem.innerHTML += localGreeting(user) + '<br>\r';
}

greetUser('Mike');
greetUser('Teresa');
greetUser('Veronica');
```

这段程序代码包含了三个执行上下文，其中有些会在程序运行的过程中多次创建和销毁。每个上下文创建的时候会被推入执行上下文栈。当退出的时候，它会从上下文栈中移除。

看看执行过程

- 程序开始运行时，全局上下文就会被创建好。
  - 当执行到 greetUser("Mike") 的时候会为 greetUser() 函数创建一个它的上下文。这个执行上下文会被推入执行上下文栈中。
    - 当 greetUser() 调用 localGreeting()的时候会为该方法创建一个新的上下文。并且在 localGreeting() 退出的时候它的上下文也会从执行栈中弹出并销毁。 程序会从栈中获取下一个上下文并恢复执行, 也就是从 greetUser() 剩下的部分开始执行。
    - greetUser() 执行完毕并退出，其上下文也从栈中弹出并销毁。
  - 当 greetUser("Teresa") 开始执行时，程序又会为它创建一个上下文并推入栈顶 ...
  - 当 greetUser("Veronica") 开始执行时，程序又会为它创建一个上下文并推入栈顶 ...
- 主程序退出，全局执行上下文从执行栈中弹出。此时栈中所有的上下文都已经弹出，程序执行完毕。

以这种方式来使用执行上下文，使得每个程序和函数都能够拥有自己的变量和其他对象。每个上下文还能够额外的跟踪程序中下一行需要执行的代码以及一些对上下文非常重要的信息。以这种方式来使用上下文和上下文栈，使得我们可以对程序运行的一些基础部分进行管理，包括局部和全局变量、函数的调用与返回等。

关于递归函数——即多次调用自身的函数，需要特别注意：每次递归调用自身都会创建一个新的上下文。这使得 JavaScript 运行时能够追踪递归的层级以及从递归中得到的返回值，但这也意味着每次递归都会消耗内存来创建新的上下文。

## JavaScript 运行时

在执行 JavaScript 代码的时候，JavaScript 运行时实际上维护了一组用于执行 JavaScript 代码的代理。每个代理由一组执行上下文的集合、执行上下文栈、主线程、一组可能创建用于执行 worker 的额外的线程集合、一个任务队列以及一个微任务队列构成。除了主线程（某些浏览器在多个代理之间共享的主线程）之外，其它组成部分对该代理都是唯一的。

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
- [深入：微任务与 Javascript 运行时环境](https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_DOM_API/Microtask_guide/In_depth)
