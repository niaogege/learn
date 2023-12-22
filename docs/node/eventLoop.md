---
title: node和浏览器中的事件循环
order: 1
group:
  title: node
  order: 0
nav:
  order: 5
  title: 'node'
  path: /node
---

> 面试遇到此问题的话术回答

JS 的运行机制就是**事件循环**

因为 js 是单线程运行的，在执行代码时，通过将不同函数的**执行上下文**压入执行栈中来保证代码的有序执行。

### 事件循环初探

- 1.首先要知道，JS 分为同步任务和异步任务
- 2.同步任务都在主线程(这里的主线程就是 JS 引擎线程)上执行，会形成一个执行栈

- 3.主线程之外，事件触发线程管理着一个任务队列，只要异步任务有了运行结果，就在任务队列之中放一个事件回调
- 4.一旦执行栈中的所有同步任务执行完毕(也就是 JS 引擎线程空闲了)，系统就会**检查任务队列是否有事件回调**，将可运行的异步任务(任务队列中的事件回调，**只要任务队列中有事件回调**，就说明可以执行)添加到执行栈中，开始执行

宏任务：js 引擎会将其添加到任务队列（task queue）中，在当前任务执行完毕后按顺序依次执行.宏任务队列**由事件触发线程**维护

微任务：js 引擎也会将异步任务添加到微任务队列中，但是微任务的执行在当前宏任务执行结束后立即进行，也就是说微任务具有更高的执行优先级，可以优先于下一个宏任务执行. 微任务队列是由**JS 引擎线程**维护

### 宏任务和微任务的执行过程(简单!!!)

![micro || macro](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/1/18/16fb7adf5afc036d~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

- 1.执行栈执行宏任务(执行栈么有就从事件队列中获取)

- 2.执行过程中遇到微任务，将微任务添加到微任务队列中

- 3.当前宏任务执行完执行栈为空时，查询是否有异步任务(分宏任务和微任务)需要执行，如有则立即依次执行当前微任务队列中的微任务

- 4.当前微任务执行完成之后，开始检查是否有必要渲染，如有需要 则 **GUI 线程**接管

- 5.渲染完毕后，JS 引擎线程接管，开启下一次事件循环，执行下一个宏任务(从事件队列中获取)

> 死记硬背 也要完全记下来

### 图解完整的事件循环(面试版，需要完全背下来)

> 敲重点，面试问，就阔以这么回答

![Event Loop](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/1/18/16fb7ae3b678f1ea~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

- 1.首先，整体的 script(作为第一个宏任务)开始执行的时候，会把所有代码分为同步任务、异步任务两部分

- 2.同步任务会直接进入主线程依次执行

- 3.异步任务会再分为宏任务和微任务

- 4.1 宏任务进入到 Event Table (事件表) 中，并在里面**注册回调函数**，每当指定的事件完成时，Event Table 会将这个函数移到 Event Queue 中,

> 举例 1：AJax 在执行请求时，会在事件队列中添加事件，ajax 请求完毕后，执行栈为空时就会读取事件队列中的事件，执行回调 success 等，setTimeout/文件上传同理

- 4.2 微任务也会进入到另一个 Event Table (事件表)中，并在里面**注册回调函数**，每当指定的事件完成时，Event Table 会将这个函数移到 Event Queue 中

- 5.当主线程内的任务执行完毕，主线程为空时，会**先检查微任务**的 Event Queue **是否有事件回调**，如果有事件回调，则执行，如果没有就执行下一个宏任务

> 我们不禁要问了，那怎么知道主线程执行栈为空啊？**js 引擎**存在 monitoring process 进程，会持续不断的检查主线程执行栈是否为空，一旦为空，就会去 Event Queue 那里检查是否有等待被调用的函数。

- 6.上述过程会不断重复，这就是 Event Loop，比较完整的事件循环

### 通过一个实际案例加强理解

```js
setTimeout(function () {
  console.log('setTimeout');
});

new Promise(function (resolve) {
  console.log('promise');
}).then(function () {
  console.log('then');
});

console.log('console');
```

说说执行过程：

- 这段代码作为宏任务，进入主线程。

- 先遇到 setTimeout，那么将其回调函数注册后分发到**宏任务 Event Queue**

- 接下来遇到了 Promise，new Promise 立即执行，then 函数分发到微任务 Event Queue

- 遇到 console.log()，立即执行

- 好啦，整体代码 script 作为第一个宏任务执行结束，看看有哪些微任务？我们发现了 then 在微任务 Event Queue 里面，执行

- ok，第一轮事件循环结束了，我们开始第二轮循环，当然要从宏任务 Event Queue 开始。我们发现了宏任务 Event Queue 中 setTimeout 对应的回调函数，立即执行。

- 结束

### 为啥要区分宏任务和微任务

宏任务和微任务的区分是为了更好地协调任务的**执行优先级**，提高 JavaScript 的运行效率和代码的可读性

### javascript 的执行和运行

执行和运行有很大的区别，javascript 在不同的环境下，比如 node，浏览器，Ringo 等等，执行方式是不同的。而运行大多指 javascript 解析引擎，是统一的。

### Node 中的事件循环

Node 中的 Event Loop 和浏览器中的是完全不相同的东西。 Node 的 Event Loop 分为 6 个阶段，它们会按照顺序反复运行。每当进入某一个阶段的时候，都会从对应的回调队列中取出函数去执行。当队列为空或者执行的回调函数数量到达系统设定的阈值，就会进入下一阶段。

- 1.Timers（计时器阶段）: 这个阶段执行 timer（setTimeout、setInterval）的回调

- 2.I/O 事件回调阶段： 执行延迟到下一个循环迭代的 I/O 回调，即执行上一轮循环中未被执行的 I/O 回调

- 3.idle 和 prepare 闲置阶段：仅供 node 内部使用

- 4.进入 poll 轮询阶段，检索新的 I/O 事件，执行与 I/O 相关的回调
- 4.1 当回调队列不为空时：会执行回调，若回调中触发了相应的微任务，这里的微任务执行时机和其他地方有所不同，不会等到所有回调执行完毕后才执行，而是针对每一个回调执行完毕后，就执行相应微任务。执行完所有的回调后，变为下面的情况。
- 4.2 当回调队列为空时（没有回调或所有回调执行完毕）：但如果存在有计时器（setTimeout、setInterval 和 setImmediate）没有执行，会结束轮询阶段，进入 Check 阶段。否则会阻塞并等待任何正在执行的 I/O 操作完成，并马上执行相应的回调，直到所有回调执行完毕。

- 5.check 查询类型：再执行所有类型为 check 的 宏任务，然后执行所有的 微任务，setImmediate 回调函数会在此阶段执行

- 6.关闭回调：再执行所有类型为 close callbacks 关闭回调 的 宏任务，然后执行所有的 微任务

至此，完成一个 Tick，回到 timers 阶段

……

> 主要的是 timer 定时器/pending 回调 poll/轮询/check 检查/

### 事件循环过程：

- 执行全局 Script 的同步代码。
- 执行完同步代码调用栈清空后，执行微任务。先执行 NextTick 队列（NextTick Queue）中的所有任务，再执行其他微任务队列中的所有任务。
- 开始执行宏任务，上面 6 个阶段。从第 1 个阶段开始，执行相应每一个阶段的宏任务队列中所有任务。（每个阶段的宏任务队列执行完毕后，开始执行微任务），然后在开始下一阶段的宏任务，依次构成事件循环。
- timers Queue -> 执行微任务 -> I/O Queue -> 执行微任务 -> Check Queue 执行微任务 -> Close Callback Queue -> 执行微任务

在 node 环境下，**process.nextTick**的优先级高于 **Promise.then**，可以简单理解为在宏任务结束后会先执行微任务队列中的 nextTickQueue 部分，然后才会执行微任务中的 Promise.then 部分

如此反复，无穷无尽……

### 浏览器和 Node 端事件循环的差别

- 两者的运行机制完全不同，实现机制也不同。
- node.js 可以理解成 4 个宏任务队列（timer、I/O、check、close）和 2 个微任务队列。但是执行宏任务时有 6 个阶段。
- node.js 在开始宏任务 6 个阶段时，每个阶段都将该宏任务队列中所有任务都取出来执行，每个阶段的宏任务执行完毕后，开始执行微任务。但是浏览器中的事件循环，是只取一个宏任务执行，然后看微任务队列是否存在，存在执行微任务，然后再取一个宏任务，构成循环。

### 通过实例加深印象

```js
console.log('1');
setTimeout(function () {
  console.log('2');
  process.nextTick(function () {
    console.log('3');
  });
  new Promise(function (resolve) {
    console.log('4');
    resolve();
  }).then(function () {
    console.log('5');
  });
});
process.nextTick(function () {
  console.log('6');
});
new Promise(function (resolve) {
  console.log('7');
  resolve();
}).then(function () {
  console.log('8');
});

setTimeout(function () {
  console.log('9');
  process.nextTick(function () {
    console.log('10');
  });
  new Promise(function (resolve) {
    console.log('11');
    resolve();
  }).then(function () {
    console.log('12');
  });
});
// 1 7 6 8 2 4 3 5 9 11 10 12
```

- 1.主代码块作为第一个宏任务开始执行，遇到 console.log(1)则打印 1
- 2.遇到 setTimeout 则将 setTimeout 移到宏任务队列,macroTask1
- 3.process.nextTick 微任务，移到微任务队列 microTask1
- 4.Promise 中的同步函数执行，打印 7
- 5.然后将 Promise.then 移到微任务队列 microTask2
- 6.又遇到一个 setTimeout 移到宏任务队列 MacroTask2
- 7.接下来开始执行当前宏任务产生的微任务队列，首先执行 process.nextTick，打印 6
- 8.继续执行微任务队列 microTask2，打印 8
- 9.当前宏任务执行完，开始执行下一个宏任务，首先第一个宏任务 macroTask1，打印 2，然后将 process.nextTick 添加到微任务队列中，执行 Promise 同步代码，打印 4，将 Promise.then 移入到微任务队列
- 10.先执行第一个微任务 打印 3 接着执行第二个微任务 打印 5
- 11.当前第二轮宏任务执行完成，继续执行下一个宏任务 MacroTask2
- 12.打印 9/11/10/12

## Node 环境下的事件循环机制

## 浏览器环境下的事件循环机制

## 区别

## 参考

- [JS 运行机制](https://juejin.cn/post/6976927131095793678?searchId=20231201210755359B842682307A9F6668)

- [「硬核 JS」一次搞懂 JS 运行机制](https://juejin.cn/post/6844904050543034376?searchId=20231201233712D5595BAB6E2502B738BB)

- [node 端事件循环](https://mp.weixin.qq.com/s/huyn95OyOz45J93B3WGXdA)
