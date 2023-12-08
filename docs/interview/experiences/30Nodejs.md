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
- 2.说说中间件，如何封装一个中间件
- 3.说说你对洋葱模型的理解
- 4.手写 compose,或者说写一个 简易的 koa-compose
- 5.说说 commonjs 跟 esmodule 区别
- 6.说说 tree Shaking 原理
- 7.说说 nodejs 中的 EventEmitter 事件订阅机制,如何实现一个 eventEmitter
- 8.Nodejs 如何利用多核 CPU or 说说你对 Node.js 中多进程的理解
- 9.pm2 守护进程原理是什么
- 10.Nodejs 中的 cluster 和 fork 模式区别
- 11.node 中的回调函数变成 then 链式调用，手写 promisify
- Nodejs 异步 IO 模型
- Node 的日志和负载均衡怎么做的
- 在操作系统中，进程和线程如何进行通信？请列举几种常见的进程间通信方式。

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

## 手写 compose

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

## Nodejs 如何利用多核 CPU?

## Nodejs 中的 cluster 模式和 fork 模式区别

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
