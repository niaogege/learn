---
title: 前端路由原理
order: 10
group:
  title: react
  order: 1
  path: /read-code/react
nav:
  order: 1
  title: 'read-code'
  path: /read-code
---

- 为啥会出现前端路由？前端路由解决什么问题
- 前端路由实现原理？
- hash 模式如何实现
- history 模式如何实现
- histroy.pushState()/history.replaceState()

> 每次手写之前，一般的步骤是代码库基本使用->源码拷贝->源码分析->手写

要解决的现实场景是什么?为啥要有前端路由

## 前端路由实现的理论知识

前端路由要解决的问题：单页面应用如何在不刷新页面的前提下，当 url 变化，匹配对应的路由，然后显示其组件

### 传统页面

Dom 直出： 所有的页面返回的 html 都是最终呈现的结果，并且每次点击页面跳转都会重新请求资源 Ssr: 首屏直出

### 单页面

通过 JS 脚本渲染页面，html 页面上只有一个 dom 入口，所有的页面组件，都是通过运行上图底部的 app.js 脚本，挂载到 <div id="root"></div> 这个节点下面。用一个极其简单的 JS 展示挂载这一个步骤：

```html
<body>
  <div id="root"></div>
  <script>
    var root = document.getElementById('root');
    const newChild = document.createElement('div');
    newChild.innerText = 'This new App';
    root.appendChild(newChild);
  </script>
</body>
```

前端路由出现 为了解决单页面网站，通过切换浏览器地址路径，来匹配相对应的页面组件

前端路由 会根据浏览器地址栏 **pathname** 的变化，去匹配相应的页面组件。然后将其通过创建 DOM 节点的形式，塞入根节点 `<div id="root"></div>` 。这就达到了无刷新页面切换的效果，从侧面也能说明正因为无刷新，所以 React 、 Vue 、 Angular 等现代框架在创建页面组件的时候，每个组件都有自己的 **生命周期 lifecycle** 。

## 原理

> 用过 vue-router/reacy-router-dom 但是根本不会横向比较两者差别

## Hash

浏览器地址上 # 后面的变化，是可以被监听的，浏览器为我们提供了原生监听事件 hashchange ，它可以监听到如下的变化：

- 点击 a 标签，改变了浏览器地址
- 浏览器的前进后退行为
- 通过 window.location 方法，改变浏览器地址

```html
<!DOCTYPE html>
<html lang="en">
  <body>
    <div>
      <ul>
        <li><a href="#/page1">page1</a></li>
        <li><a href="#/page2">page2</a></li>
      </ul>
      <!--渲染对应组件的地方-->
      <div id="route-view"></div>
    </div>
  </body>
  <script>
    // 第一次加载的时候，不会执行 hashchange 监听事件，默认执行一次
    // DOMContentLoaded 为浏览器 DOM 加载完成时触发
    window.addEventListener('DOMContentLoaded', load);
    window.addEventListener('hashchange', hashChange);
    let routerView = '';
    function load() {
      routerView = document.getElementById('route-view');
      hashChange();
    }
    function hashChange() {
      switch (location.hash) {
        case '#/page1':
          routerView.innerText = 'this is Page1';
          break;
        case '#/page2':
          routerView.innerText = 'this is Page2';
          break;
        default:
          routerView.innerText = 'this is Page default';
      }
    }
  </script>
</html>
```

## History 历史模式

[MDN History](https://developer.mozilla.org/zh-CN/docs/Web/API/History_API) [MDN popstate](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/popstate_event)

history 模式依赖的是原生事件 popstate ，下面是来自 MDN 的解释：

每当激活同一文档中不同的历史记录条目时，popstate 事件就会在对应的 window 对象上触发。如果当前处于激活状态的历史记录条目是由 history.pushState() 方法创建的或者是由 history.replaceState() 方法修改的，则 popstate 事件的 state 属性包含了这个历史记录条目的 state 对象的一个拷贝。**调用 history.pushState() 或者 history.replaceState() 不会触发 popstate 事件**。popstate 事件只会在浏览器某些行为下触发，比如点击后退按钮（或者在 JavaScript 中调用 history.back() 方法）。即，在同一文档的两个历史记录条目之间导航会触发该事件。

> 猜测 history 库 应该是弥补原生 history API 不足

pushState 和 replaceState 都是 HTML5 的新 API，他们的作用很强大，可以做到改变浏览器地址却不刷新页面。这是实现改变地址栏却不刷新页面的重要方法。

HTML5 引入了 history.pushState() 和 history.replaceState() 方法，它们分别可以**添加和修改历史记录条目**。这些方法通常与 window.onpopstate 配合使用。

#### history.pushState()

假设在 http://localhost:3002/ 页面的 console 中执行了以下 JavaScript 代码：

```js
window.onpopstate = function (e) {
  alert(2);
};
let stateObj = {
  foo: 'bar',
};
history.pushState(stateObj, 'page 2', 'bar.html');
```

页面 url 地址会变成 `http://localhost:3002/bar.html`,但是页面不会刷新，点击浏览器返回会执行 alert(2),在点击浏览器前进，先 alert(2),然后会跳转到`http://localhost:3002/bar.html`，同时页面会刷新

#### histroy.replaceState()

比如在当前页面*http://localhost:3002/*执行以下代码

```js
let stateObj = {
  foo: 'bar',
};
history.pushState(stateObj, 'page 2', 'react-router');
```

页面 url 变成*http://localhost:3002/react-router*，然后再次执行

```js
history.replaceState(stateObj, 'page 3', 'react-router2');
```

这将会导致地址栏显示 `http://localhost:3002/react-router2`,但是浏览器并不会去加载 react-router2 甚至都不需要检查 react-router2 是否存在

> 两个区别？

history.replaceState() 的使用与 history.pushState() 非常相似，区别在于 replaceState() 是修改了当前的历史记录项而不是新建一个。 注意这**并不会阻止**其在全局浏览器历史记录中创建一个新的历史记录项.replaceState() 的使用场景在于为了响应用户操作，你想要更新状态对象 state 或者当前历史记录的 URL。

#### 实现历史模式

问题：

- a 标签的点击事件也是不会被 popstate 监听
- 调用 history.pushState() 或者 history.replaceState() 不会触发 popstate 事件

方案：

- 遍历 a 标签得到 href 中的 url 地址
- 通过**pushState** 去改变浏览器的 location.pathname 属性值
- 通过监听**popstate**事件，手动执行回调函数，匹配相应路由

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>hash</title>
  </head>
  <body>
    <div>
      <ul>
        <li><a href="./page1">page1</a></li>
        <li><a href="./page2">page2</a></li>
      </ul>
      <!--渲染对应组件的地方-->
      <div id="route-view"></div>
    </div>
  </body>
  <script>
    // 第一次加载的时候，不会执行 hashchange 监听事件，默认执行一次
    // DOMContentLoaded 为浏览器 DOM 加载完成时触发
    window.addEventListener('DOMContentLoaded', load);
    window.addEventListener('popstate', popStateChange);
    let routerView = '';
    function load() {
      routerView = document.getElementById('route-view');
      popStateChange();
      var aList = document.querySelectorAll('a[href]');
      aList.forEach((e) => {
        e.addEventListener('click', function (target) {
          target.preventDefault();
          var href = e.getAttribute('href');
          // pushstate方法能改变浏览器url pathName 且不会刷新页面
          history.pushState(null, '', href);
          // popstate只能监听到手动点击浏览器的前进或者返回
          popStateChange();
        });
      });
    }
    function popStateChange() {
      switch (location.pathname) {
        case '/page1':
          routerView.innerText = 'this is Page1';
          break;
        case '/page2':
          routerView.innerText = 'this is Page2';
          break;
        default:
          routerView.innerText = 'this is Page default';
      }
    }
  </script>
</html>
```

## 其他方式实现简单路由

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

## 参考文档

- [前端路由实现原理](https://mp.weixin.qq.com/s/j78ycLwTFYOVFIM9er-A7Q)
