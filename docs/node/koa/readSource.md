---
title: koa源码阅读
order: 1
group:
  title: koa
  order: 2
  path: /node/koa
nav:
  order: 5
  title: 'node'
  path: /node
---

参考大佬文章[KOA2 源码阅读笔记](https://jelly.jd.com/article/5f85be67608b0a015207d26e)

尽量精简，提取核心要点，领悟架构设计思想

### 手写 koa 源码

```js
const http = require("http");
const context = require("./context");
const request = require("./request");
const response = require("./response");

class MyKoa {
  constructor() {
    this.middleware = []
    this.context = Object.create(context);
    this.request = Object.create(request);
    this.response = Object.create(response);
  }
  listen(...args) {
    const server = http.createServer(this.callback());
    return server.listen(...args);
  }
  callback() {
    const fn = compose(this.middleware)
    const handleRequest = (req, res) => {
      let ctx = this.createContext()
      return this.handleRequest(ctx, fn)
    }
    return handleRequest
  }
  handleRequest(ctx, fn) {
    const handleResponse = () => respond(ctx)
    const onerror = err => ctx.onerror(err);
    return fn(ctx).then(handleResponse).ctach(onerror)
  }
  use(middleware) {
    this.middleware = middleware
    return this
  }
  createContext(req, res) {
    const ctx = Object.create(this.context);
    ctx.request = Object.create(request)
    ctx.response = Object.create(response)
    ctx.req = ctx.request.req = req
    ctx.res = ctx.response.res = res
    return ctx
  }
}
function respond(ctx) {
  const res = ctx.res; // 取出res对象
  const body = ctx.body; // 取出body
  return res.end(body); // 用res返回bodu
}
function compose(mws) {
  return (ctx, next) => {
    return dispatch(0)
    function dispatch(i) {
      let fn = mws[i]
      // fn取对应层的中间件，如果传入了next函数，那么next函数的优先级更高
      if (i === md.length) fn = next
      if (!fn) {
        return Promise.resolve()
      }
      try {
        // 每一层都是一个Promise需要resolved之后才会继续处理next之后的代码块
        // debugger 执行栈
        return Promise.resolve(fn(ctx, dispatch.bind(
          null,
          i+1
        )))
      } catch(e => {
        return Promise.reject(e)
      })
    }
  }
}
```
