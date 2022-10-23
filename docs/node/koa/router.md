---
title: koa-router
order: 2
group:
  title: koa
  order: 2
  path: /node/koa
nav:
  order: 5
  title: 'node'
  path: /node
---

实际上路由的概念最早是从后端提出的，一个请求打进去，根据请求的路径匹配到对应的 **Controller**进行处理。后来变成前后端分离架构，然后前端也出现了路由。因此对于一个服务端框架来说，路由是必不可少的,先来看看如何使用：

```js
const fs = require('fs');
const path = require('path');
const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

app.use(bodyParser());

router.get('/', (ctx) => {
  ctx.body = 'Hello World';
});

router.get('/api/users', (ctx) => {
  const resData = [
    {
      id: 1,
      name: '小明',
      age: 18,
    },
    {
      id: 2,
      name: '小红',
      age: 19,
    },
  ];

  ctx.body = resData;
});

router.post('/api/users', async (ctx) => {
  // 使用了koa-bodyparser才能从ctx.request拿到body
  const postData = ctx.request.body;

  // 使用fs.promises模块下的方法，返回值是promises
  await fs.promises.appendFile(path.join(__dirname, 'db.txt'), JSON.stringify(postData));

  ctx.body = postData;
});

app.use(router.routes());

const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on http://127.0.0.1:${port}/`);
});
```

### 膜拜大佬

- [koa/router 源码](https://github.com/koajs/router/blob/master/lib/router.js)
- [手写@koa/router 源码](https://juejin.cn/post/6895594434843869197#heading-2)
- [深入源码分析 Koa 中间件与洋葱模型](https://juejin.cn/post/7060130853514379278#heading-3)
