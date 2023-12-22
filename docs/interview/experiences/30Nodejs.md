---
title: Nodejs相关八股文
order: 30
group:
  order: 0
  title: interview
nav:
  order: 3
  title: 'interview'
  path: /interview
---

## 列表

- 1.Nodejs 事件循环
- 2.说说中间件，如何封装一个中间件，中间件的异常处理是怎么做的
- 3.说说你对洋葱模型的理解
- 4.手写 compose,或者说写一个 简易的 koa-compose
- 5.说说 commonjs 跟 esmodule 区别
- 6.说说 tree Shaking 原理
- 7.说说 nodejs 中的 EventEmitter 事件订阅机制,如何实现一个 eventEmitter
- 8.Nodejs 如何利用多核 CPU or 说说你对 Node.js 中多进程的理解
- 9.pm2 守护进程原理是什么
- 10.Nodejs 中的 cluster 和 fork 模式区别
- 11.node 中的回调函数变成 then 链式调用，手写 promisify
- 12.Nodejs 异步 IO 模型
- 13.Node 的日志和负载均衡怎么做的?
- 14.Node 开启子进程的方法有哪些?
- 15.在操作系统中，进程和线程如何进行通信？请列举几种常见的进程间通信方式。

## 1.Nodejs 事件循环

请移步[事件循环](../../node/eventLoop.md)

大体是这 6 个步骤：

timer -> I/O 回调 -> idle 闲置阶段 -> Poll -> check -> close Callback

## 2.说说中间件，如何封装一个中间件

NodeJS 中，中间件主要是指处理 http 请求和响应的函数，在 express、koa 等 web 框架中，中间件的本质为一个回调函数，参数包含**请求对象、响应对象和执行下一个中间件的函数**

Koa 中间件采用的是洋葱圈模型，每次执行下一个中间件传入两个参数：

- ctx ：封装了 request 和 response 的变量
- next ：进入下一个要执行的中间件的函数，下面则通过中间件封装 http 请求过程中几个常用的功能：

### 参考

- [express 中间件](https://expressjs.com/zh-cn/guide/using-middleware.html)

### token 校验

```js
module.exports = function resolveToken(options) {
  return (ctx, next) => {
    try {
      // get Token
      const token = ctx.header.authorization
      if (token) {
        try {
          await verify(token)
        } catch(e) {
           console.log(err)
        }
      }
    } catch(e) {
      console.log(e)
    }
  }
}
```

在这个示例中，resolveToken 函数返回一个函数，该函数接收请求和响应对象，并且调用 next() 函数来将**控制权传递给下一个中间件函数**。

### 日子模块中间件

```js
module.exports = (option) => async (ctx, next) => {
  const startTime = Date.now();
  const requestTime = Date.now();
  await next();
  const ms = Date.now() - startTime;
  let logout = `${ctx.request.ip} -- ${requestTime} -- ${ctx.method} -- ${ctx.url} -- ${ms}ms`;
  // 输出日志文件
  fs.appendFileSync('./log.txt', logout + '\n');
};
```

## 3.说说你对洋葱模型的理解

Koa 框架是一个 Node.js 的 Web 应用程序框架，它通过中间件（Middleware）机制实现了业务逻辑的分层和复用。Koa 中使用的中间件机制被称为**洋葱模型**（Onion Model），其核心思想是**将 HTTP 请求和响应对象依次传递给各个中间件函数，形成一条类似于洋葱的管道，最终返回响应结果**。

具体来说，Koa 洋葱模型的处理流程可以大致分为四个阶段：

- 请求阶段：从外到内依次执行请求相关的中间件，例如解析请求体、设置响应头等操作。

- 业务阶段：执行业务逻辑相关的中间件，例如处理授权、验证身份、路由分发等操作。

- 响应阶段：从内到外依次执行响应相关的中间件，例如格式化响应数据、设置响应头等操作。

- 错误处理阶段：如果在前面的中间件过程中出现了错误，则会跳过后续中间件并交给错误处理中间件来处理异常情况。

在这个过程中，每个中间件都可以根据需要对请求和响应对象进行修改、扩展、封装等操作，并将控制权传递给下一个中间件，形成了一条流水线式的处理模式。这种设计可以大大提高代码的复用和可读性，同时也方便了对程序行为进行监控、调试和优化。

## 4.手写 compose

```js
function compose(middlewares) {
  return (ctx, next) => {
    return dispatch(0);
    function dispatch(i) {
      var fn = middlewares[i];
      if (i === middlewares.length) fn = next;
      if (!fn) return Promise.resolve('');
      try {
        return Promise.resolve(fn.apply(ctx, dispatch(i + 1)));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  };
}
```

## 5.说说 commonjs 跟 esmodule 区别

## 6.说说 tree Shaking 原理

## 7.说说 nodejs 中的 EventEmitter 事件订阅机制,如何实现一个 eventEmitter

## 8.Nodejs 如何利用多核 CPU?

在 Node.js 中，JS 也是单线程的，只有一个主线程用于执行任务。但是，在 Node.js 中可以使用**多进程**来利用多核机器，以充分利用 CPU 系统资源。

- Node.js 提供了  **cluster/child_process**  模块，可以轻松创建子进程来处理任务。通过将任务分配给不同的子进程，每个子进程可以在自己的线程上执行任务，从而实现多核机器的利用。
- Node.js 也提供了 **worker_threads** 模块，可以创建真正的**多线程**应用程序。这个模块允许开发者创建和管理多个工作线程，每个线程都可以独立地执行任务。

> Node.js 中的 worker_threads[4] 模块是用于创建多线程应用程序的官方模块。它允许在 Node.js 程序中创建和管理真正的操作系统线程，以实现并行处理和利用多核 CPU 的能力。

- 利用的是 Node.js 的**事件循环机制和异步非阻塞的 I/O**操作。Node.js 使用事件驱动的模型来处理请求，当有请求到达时，Node.js 将其放入事件队列中，然后通过事件循环来处理这些请求。在等待 I/O 操作的过程中，Node.js 不会阻塞其他请求的处理，而是继续处理其他请求。这样，即使 JavaScript 是单线程的，但在实际运行中，多个请求可以同时处理，充分利用了多核系统的能力。

## [9.pm2 守护进程原理是什么]()

守护进程是什么：守护进程是一个在后台运行并且不受任何终端控制的进程，并且能够因为某个异常导致进程退出的时候重启子进程。守护进程一般在系统启动时开始运行，除非强行终止，否则直到系统关机都保持运行.使用命令 ps axj 查看当前守护进程。

### 实现监听子进程退出

利用 NodeJS 的事件机制，监听 exit 事件

在 master.js 中使用 fork 创建子进程监听 exit 事件，1s 之后创建一个新的子进程

```js
// master.js
const { fork } = require('child_process');

const forkChild = () => {
  const child = fork('log.js');
  child.on('exit', () => {
    setTimeout(() => {
      forkChild();
    }, 1000);
  });
};
forkChild();

// log.js
const fs = require('fs');
const path = require('path');

fs.open(path.resolve(__dirname, 'log.txt'), 'w', function (err, fd) {
  setInterval(() => {
    fs.write(fd, process.pid + '\n', function () {});
  }, 2000);
});
```

使用 node master 启动项目之后，使用 kill 命令杀掉对应的子进程，能够成功重启子进程，守护进程生效~

### 如何退出终端运行？

使用 setsid

在 Node 中如何调用 setsid 方法呢？ Node 尚未对 setsid 进程封装，但是我们可以通过 child_process.spawn 来调用该方法。 spawn 中有一个配置项 detached，当其 **detached: true** 时，会调用 setsid 方法

> 在非 Windows 平台上，如果 options.detached 设置为 true，则子进程将成为新进程组和会话的领导者。 子进程可以在父进程退出后继续运行。

### 开始实现

- 在 command 中使用 child_process.spawn(master) 创建子进程
- 对进程 master 执行 setsid 方法
- 进程 command 退出，进程 master 由 init 进程接管，此时进程 master 为守护进程

创建 command，使用 spawn 方法衍生子进程

```js
//command.js
const { spawn } = require('child_process');

spawn('node', ['./master.js'], {
  detached: true,
});

process.exit(0);
```

当我们执行 node command 之后，我们的主进程就会关闭，但是我们的子进程还在继续运行，且不受终端控制，该进程就是我们创建的守护进程

## 10.Nodejs 中的 cluster 模式和 fork 模式区别

### [fork 分叉模式(child_process.fork(modulePath[, args][, options]))](https://nodejs.org/api/child_process.html#child_process_child_process_fork_modulepath_args_options)，**单实例多进程**

常用于多语言混编，比如 php、python 等，不支持端口复用，需要自己做应用的端口分配和负载均衡的子进程业务代码。缺点就是单服务器实例容易由于异常会导致服务器实例崩溃。

for Example: 默认情况下，pm2 将使用 node 这样 `pm2 start server.js`

### [cluster 集群模式](https://nodejs.org/api/cluster.html)，**多实例多进程**，

但是只支持 node，端口可以复用，不需要额外的端口配置，0 代码实现负载均衡。优点就是由于多实例机制，可以保证服务器的容错性，就算出现异常也不会使多个服务器实例同时崩溃。 for Example: `pm2 start -i 4 server.js` 将启动 4 个 server.js 实例并让集群模块处理负载平衡

### 共同点：都是多进程，都需要消息机制或数据持久化来实现数据共享

## promisify

实现一个 node 异步函数的 promisify?

promisify 作用是把**回调函数转成 promise 形式**

即调用该回调函数的时候有 2 个参数，第一个是错误信息，其次才是真正要返回的内容，Promisify 就是把第二个参数转化为 promise

```js
function Promisify(fn) {
  return (...rest) => {
    return new Promise((resolve, reject) => {
      rest.push((error, ...con) => {
        if (error) {
          reject(error);
        }
        resolve(con);
      });
      // fn.apply(this, rest);
      Reflect.apply(fn, this, rest);
    });
  };
}

// 输入：
// 原有的callback调用
fs.readFile('test.js', function (err, data) {
  if (!err) {
    console.log(data);
  } else {
    console.log(err);
  }
});
// 输出：
// promisify后
var readFileAsync = promisify(fs.readFile);
readFileAsync('test.js').then(
  (data) => {
    console.log(data);
  },
  (err) => {
    console.log(err);
  },
);
```

## 13.Node 的日志和负载均衡怎么做的?

## 14.Node 开启子进程的方法有哪些?

> child_process / cluster 模块

## 15.在操作系统中，进程和线程如何进行通信？请列举几种常见的进程间通信方式。

## 16.cluster 模块为什么可以让多个子进程监听同一个端口呢

开启多进程时候端口疑问讲解：如果多个 Node 进程监听同一个端口时会出现 Error:listen EADDRIUNS 的错误，而 cluster 模块为什么可以让多个子进程监听同一个端口呢?原因是 master 进程内部启动了一个 TCP 服务器，而真正监听端口的只有这个服务器，当来自前端的请求触发服务器的 connection 事件后，master 会将对应的 socket 句柄发送给子进程。而 child_process 操作子进程时，创建多个 TCP 服务器， 无论是 child_process 模块还是 cluster 模块，为了解决 Node.js 实例单线程运行，无法利用多核 CPU 的问题而出现的。核心就是通过 fork()或者其他 API，创建了子进程之后，父进程（即 master 进程）负责监听端口，接收到新的请求后将其分发给下面的 worker 进程，父子进程之间才能通过 message 和 send()进行 IPC 通信（Inter-Process Communication）。

Node 中实现 IPC 通道是依赖于 **libuv**，

## 17.说说 Nodejs 异步 IO 模型

## 18.孤儿进程 / 僵尸进程

### 孤儿进程

父进程已经退出，它的一个或者多个子进程还在运行，上述的子进程会成为孤儿进程孤儿进程会被 **init** 进程(pid 为 1)收养，并由 init 进程完成对它们的状态收集工作，init 进程会循环 wait 回收资源，孤儿进程无害

### 僵尸进程

主进程通过 fork 创建了子进程，如果子进程退出之后父进程没有调用 wait/waitpid 获取子进程的状态信息，那么子进程中保存的进程号/退出状态/运行时间等都不会被释放，进程号会一直被占用

```js
const fork = require('child_process').fork;

zombie();

function zombie() {
  const worker = fork('./worker.js');
  console.log(`Worker is created, pid: ${worker.pid}, ppid: ${process.pid}`);
  while (1) {} // 主进程永久阻塞
}
```

该示例之所以能够成为僵尸进程是因为 while(1){}吃满了父进程的 CPU，无法处理子进程的退出信号。

修改上述代码，子进程退出之后，父进程可以监听到，就不会有僵尸进程的产生。

```js
const fork = require('child_process').fork;

zombie();

function zombie() {
  const worker = fork('./worker.js');
  worker
    .on('exit', () => {
      console.log('exit');
    })
    .on('close', () => {
      console.log('close');
    });
}
```

## 参考

- [nodejs 线程和进程](https://mp.weixin.qq.com/s/huyn95OyOz45J93B3WGXdA)
