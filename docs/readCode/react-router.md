---
title: 手写react-router
order: 3
group:
  title: react
  order: 1
  path: /read-code/react-router
nav:
  order: 1
  title: 'read-code'
  path: /read-code
---

react-router 相关的代码手写和原理加深理解

输入输出

要解决的现实场景是什么

## 实现简单路由

```js
class Router {
  constructor() {
    this.routes = {};
    // currentHash
    this.currentHash = '';
    this.freshRoute = this.freshRoute.bind(this);
    window.addEventListener('load', this.freshRoute, false);
    window.addEventListener('hashchange', this.freshRoute, false);
  }
  storeRoute(path, cb) {
    this.routes[path] = cb || function () {};
  }
  freshRoute() {
    this.currentHash = location.hash.slice(1) || '/';
    this.routes[this.currentHash]();
  }
}
```
