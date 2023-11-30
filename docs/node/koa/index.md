---
title: koa 综述
order: 0
group:
  title: koa
  order: 2
  path: /node/koa
nav:
  order: 5
  title: 'node'
  path: /node
---

[中文官网](https://www.koajs.com.cn/)

- koa 基本知识
- 中间件一般指什么，解释下
- 洋葱模型说说看
- 实现一下 koa 的中间件中的 run 方法

### Koa

官网介绍： 基于 Node.js 平台的下一代 web 开发框架

Koa 应用是一个包含一系列中间件 generator 函数的对象。 这些中间件函数基于 request 请求以一个类似于栈的结构组成并依次执行。 Koa 类似于其他中间件系统（比如 Ruby's Rack 、Connect 等）， 然而 Koa 的核心设计思路是为**中间件层提供高级语法糖封装**，以增强其互用性和健壮性，并使得编写中间件变得相当有趣。

### 中间件定义

那么什么是中间件呢，中间件主要用于**抽象 HTTP 请求过程**，在单一请求响应过程中加入中间件，可以更好地应对复杂的业务逻辑。在 HTTP 请求的过程中，中间件相当于一层层的滤网，每个中间件在 HTTP 处理过程中通过改写请求和响应数据、状态，实现相应业务逻辑。Koa 中间件机制就是**函数式组合**概念，将一组需要顺序执行的函数复合为一个函数，外层函数的参数实际是内层函数的返回值。我们可以将中间件视为设计模式中的责任链模式。

> 在 NodeJS 中，中间件主要是指封装 http 请求细节处理的方法

通过以上执行流程，我们可以看出中间件的执行顺序，流程是一层层的打开，然后一层层的闭合，就像剥洋葱一样，早期的 Python 为这种执行方式起了一个很好听的名字，洋葱模型。

### koa 洋葱模型

本质上都是高阶函数的嵌套，外层的中间件嵌套着内层的中间件，这种机制的好处是可以自己控制中间件的能力（外层的中间件可以影响内层的请求和响应阶段，内层的中间件只能影响外层的响应阶段）

### koa 中间件基本使用

Koa 的中间件就是函数，可以是 async 函数，或是普通函数

```js
const Koa = require('koa');
const axios = require('axios');
const app = new Koa();
// 普通使用
app.use(function cpp1(ctx, next) {
  console.log(1);
  next();
  console.log(2);
});

app.use(function cpp2(ctx, next) {
  console.log('mid');
  const now = new Date();
  return next().then(() => {
    const ms = Date.now() - now;
    console.log('mid after ');
    console.log(`mid ${ms}::ms`);
  });
});
// 异步使用
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const delta = new Date() - start;
  console.log(`请求耗时: ${delta} MS`);
  console.log('拿到上一次请求的结果：', ctx.body);
});

app.use(async (ctx, next) => {
  // 处理 db 或者进行 HTTP 请求
  // ctx.state.baiduHTML = await axios.get("http://baidu.com");
  ctx.body = 'This is CPP';
});

app.listen(9000, '0.0.0.0', () => {
  console.log(`Server is starting: 9000`);
});
```

### koa 中间件实现

[compose 函数](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c4f7c41d1b94f379917d0f9bc76064e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

```js
var list = [{ function(next) {} }];

function run(list) {}
```

> 洋葱圈函数接收的两个参数 ctx、next 中的**next 方法**就是一个异步方法，代表将当前这层洋葱圈强制 resolve，控制权指向下游，当前的函数将被阻塞，直到下游所有逻辑处理完之后，才能继续执行。

```js
const middleware = [];
const delay = () => new Promise((resolve) => setTimeout(() => resolve(), 2000));
let mw1 = function (ctx, next) {
  console.log('next前，第一个中间件', ctx);
  const start = Date.now();
  next().then(() => {
    console.log('next后，第一个中间件', ctx);
    const ms = Date.now() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
  });
};
let mw2 = async function (ctx, next) {
  console.log('next前，第二个中间件', ctx);
  await delay();
  await next();
  console.log('next后，第二个中间件', ctx);
};
let mw3 = async function (ctx, next) {
  console.log('第三个中间件before', ctx);
  await next();
  console.log('第三个中间件after', ctx);
};
function use(mw) {
  middleware.push(mw);
}
function compose(middleware) {
  return function (context, next) {
    return dispatch(0);
    function dispatch(i) {
      let fn = middleware[i];
      console.log(i, middleware.length);
      if (i === middleware.length) fn = next;
      if (!fn) return Promise.resolve();
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };
}
use(mw1);
use(mw2);
use(mw3);
let fn = compose(middleware);
fn({ name: 'cpp' }, function print() {
  console.log(this, 'Print');
});
```

核心是组合函数 compose 1013 尝试：

```js
function compose(mw) {
  return (ctx, next) => {
    return dispatch(0);
    function dispatch(i) {
      let fn = mw[i];
      if (i === mw.length) fn = next;
      if (!fn) {
        return Promise.resolve();
      }
      try {
        return Promise.resolve(fn(ctx, dispatch.bind(null, i + 1)));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  };
}
```

![核心架构](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/acc44bd2385740f4ab847cf7027552b1~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image)

每个中间件执行到 **await next()** 语句的时候，都会调用下一层的中间件。你也可以将代码理解为

```js
// 前半部分处理逻辑
await next();
// 后半部分处理逻辑
/* ================= 等价于 ================= */
// 前半部分处理逻辑
await new Promise([下一层中间件的逻辑]);
// 后半部分处理逻辑
```

### use

use 方法就是做了一件事，维护得到 middleware 中间件数组

```js
use(fn) {
  this.middleware.push(fn)
  return this
}
```

### listen 方法 和 callback 方法

执行 app.listen 方法的时候，其实是 Node.js 原生 http 模块 **createServer** 方法创建了一个服务，其回调为 callback 方法。callback 方法中就有我们今天的重点 compose 函数，它的返回是一个 **Promise** 函数。

```js
  listen(...args) {
    debug('listen');
    const server = http.createServer(this.callback());
    return server.listen(...args);
  }

  callback() {
    const fn = compose(this.middleware);

    if (!this.listenerCount('error')) this.on('error', this.onerror);

    const handleRequest = (req, res) => {
      const ctx = this.createContext(req, res);
      return this.handleRequest(ctx, fn);
    };

    return handleRequest;
  }
```

handleRequest 中会执行 compose 函数中返回的 Promise 函数并返回结果。

```js
  handleRequest(ctx, fnMiddleware) {
    const res = ctx.res;
    res.statusCode = 404;
    const onerror = err => ctx.onerror(err);
    const handleResponse = () => respond(ctx);
    onFinished(res, onerror);
     // 执行 compose 中返回的promise函数，将结果返回
    return fnMiddleware(ctx).then(handleResponse).catch(onerror);
  }
```

### 常用的 koa 中间件

- 异常处理

```js
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    console.error(e);
    ctx.res.statusCode = 500;
    ctx.res.write('Internet server error');
  }
});
```

> 注意异常捕获的中间件需要放到所有中间件的最前面

- logger

用于记录处理当前请求花了多长时间，也很简单 或者设置响应时间

```js
app.use(async (ctx, next) => {
  try {
    let date = Date.now();
    await next();
    let diff = Date.now() - date;
    const { method, url } = ctx.req;
    console.log(`${method}${url}::-${diff}ms`);
    ctx.set('X-Response-Time', diff + 'ms');
  } catch (e) {
    console.log(e);
  }
});
```

- koa-static

koa-static 是一个用来搭建**静态资源服务器**的中间件。实际上静态资源服务器对于前端来说应该都很熟悉，例如 nginx 就是一个典型的静态资源服务器，webpack-dev-server 也是一个静态资源服务器。静态资源服务器的工作流程很简单：**根据请求地址获取到文件路径，然后根据路径获取到对应文件，将文件内容作为响应体返回，并设置缓存响应头**。

```js
const Koa = require('koa');
const serve = require('koa-static');
const app = new Koa();
// 处理静态资源
app.use(serve('public'));

app.listen(3000, () => {
  console.log('listening on port 3000');
});
```

看下[koa-static 源码](https://github.com/koajs/static/blob/master/index.js)

```js
const send = require('koa-send')
// server 可以接受两个参数
// 一个是路径地址，还有一个是配置项
function serve (root, opts) {
  opts = Object.assign(Object.create(null), opts)
  // 将 root 解析为合法路径并添加到配置项中
  opts.root = resolve(root)

  // 如果请求的路径是一个目录，默认去取 index.html
  opts.index = opts.index ?? 'index.html'
  if (!opts.defer) {
      // 返回值是一个 Koa 中间件
  return async function serve (ctx, next) {
      let done = false // 标记文件是否成功响应

      if (ctx.method === 'HEAD' || ctx.method === 'GET') {
        try {
          // 调用 koa-send 响应文件
          // 如果发送成功，会返回路径
          done = await send(ctx, ctx.path, opts)
        } catch (err) {
          // 如果是 400、500 等错误，向外抛出异常
          if (err.status !== 404) {
            throw err
          }
        }
      }
      // 如果文件发送成功，本次请求就到此为止了
      // 如果没成功，就让后续的中间件继续处理
      if (!done) {
        await next()
      }
    }
  }
  return async function serve(ctx, next) {
      await next()
      if (ctx.method !== 'HEAD' && ctx.method !== 'GET') return
      // response is already handled
      if (ctx.body != null || ctx.status !== 404) return // eslint-disable-line
      try {
        await send(ctx, ctx.path, opts)
      } catch (err) {
        if (err.status !== 404) {
          throw err
        }
      }
    }
  }
}
```

调用 serve 函数的时候，需要传 2 个参数， root：root directory string. 根目录字符串 opts：options object.

- defer If true, serves after return next(), allowing any downstream middleware to respond first. defer 如果为 true，则在 return next() 之后服务，允许任何下游中间件首先响应

配置项可以传递一个 opt.defer 参数，默认为 false，如果传了 true，koa-static 会让其他中间件优先响应，即使其他中间件写在 koa-static 后面。这实际上就是控制了 next 方法的调用时机，当配置了 defer = true 之后，koa-static 会**先调用 next** ，**让其他中间件先执行，然后再执行 koa-static 的逻辑**。

- [router 路由](../koa/router.md)

### 膜拜大佬

- [【Node】深入浅出 Koa 的洋葱模型](https://mp.weixin.qq.com/s/uO-M7VePpBJIUjwHMybfVw)
- [如何更好地理解中间件和洋葱模型](https://juejin.cn/post/6890259747866411022#heading-3)
- [这些高阶的函数技术，你掌握了么](https://juejin.cn/post/6892886272377880583?searchId=20231128205315E68CD3641D010A87C8E3)
