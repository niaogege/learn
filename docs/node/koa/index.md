---
title: koa
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

- 实现一下 koa 的中间件中的 run 方法

```js
var list = [function (next) {}];

function run(list) {}
```

## KOA 的中间件原理

```js
const middleware = [];
let mw1 = async function (ctx, next) {
  console.log(ctx, 'next前，第一个中间件');
  await next();
  console.log(ctx, 'next后，第一个中间件');
};
let mw2 = async function (ctx, next) {
  console.log('next前，第二个中间件');
  await next();
  console.log('next后，第二个中间件');
};
let mw3 = async function (ctx, next) {
  console.log('第三个中间件，没有next了');
};

function use(mw) {
  middleware.push(mw);
}

function compose(middleware) {
  return function (context, next) {
    return dispatch(0);
    function dispatch(i) {
      let fn = middleware[i];
      if (!fn) return Promise.resolve();
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  };
}

use(mw1);
use(mw2);
use(mw3);
let fn = compose(middleware);
fn();
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

执行 app.listen 方法的时候，其实是 Node.js 原生 http 模块 createServer 方法创建了一个服务，其回调为 callback 方法。callback 方法中就有我们今天的重点 compose 函数，它的返回是一个 **Promise** 函数。

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

## 膜拜大佬

- [【Node】深入浅出 Koa 的洋葱模型](https://mp.weixin.qq.com/s/uO-M7VePpBJIUjwHMybfVw)
