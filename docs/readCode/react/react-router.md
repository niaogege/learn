---
title: 手写react-router
order: 12
group:
  title: react
  order: 1
  path: /read-code/react
nav:
  order: 1
  title: 'read-code'
  path: /read-code
---

react-router 相关的代码手写和原理加深理解,需要理解什么？单页应用的路由跳转？

> 看源码重点是理解代码是如何优雅设计的

> 提升自己思维设计

[react-router](https://github.com/remix-run/react-router#readme)

- 项目里的 react-dom-router 如何 debugger?
- v5 Vs V6 版本差异
- HistoryRouter/BrowserRouter/HashRouter 三者区别以及应用场景
- HistoryRouter/BrowserRouter/HashRouter/StaticRouter 实现原理
- Switch/Route 两个组件为啥要一起才能使用 如何封装
- useParams/useHistory/useLocation/useRouteMatch 如何封装
- 看完 React-router/React-router-dom 学到了什么，别说白看？

> 每次手写之前，一般的步骤是代码库基本使用->源码拷贝->源码分析->手写

## 手写简单版的 react-router-dom

React Router 对应的 hash 模式和 history 模式对应的组件为：

1.HashRouter 2.BrowserRouter

这两个组件的使用都十分的简单，作为最顶层组件包裹其他组件，如下所示

```js
// 1.import { BrowserRouter as Router } from "react-router-dom";
// 2.import { HashRouter as Router } from "react-router-dom";

import React from 'react';
import {
  BrowserRouter as Router,
  // HashRouter as Router
  Switch,
  Route,
} from 'react-router-dom';
import Login from './pages/Login';
import Backend from './pages/Backend';
function App() {
  return (
    <Router>
      <Route path="/login" component={Login} />
      <Route path="/backend" component={Backend} />
    </Router>
  );
}

export default App;
```

## 手写乞丐版 HashRouter

路由描述了 URL 与 UI 之间的映射关系，这种映射是单向的，即 URL 变化引起 UI 更新（无需刷新页面）

下面以 hash 模式为例子，改变 hash 值并不会导致浏览器向服务器发送请求，浏览器不发出请求，也就不会刷新页面

hash 值改变，触发全局 window 对象上的 hashchange 事件。所以 hash 模式路由就是利用 hashchange 事件监听 URL 的变化，从而进行 DOM 操作来模拟页面跳转

react-router 也是基于这个特性实现路由的跳转

下面以 HashRouter 组件分析进行展开：

### HashRouter

HashRouter 包裹了整应用，通过**window.addEventListener('hashChange',callback)**监听 hash 值的变化，并传递给其嵌套的组件

然后通过**context**将 location 数据往后代组件传递，如下：

```js
import React, { Component } from 'react';
import { Provider } from './context';
// 该组件下Api提供给子组件使用
class HashRouter extends Component {
  constructor() {
    super();
    this.state = {
      location: {
        pathname: window.location.hash.slice(1) || '/',
      },
    };
  }
  // url路径变化 改变location
  componentDidMount() {
    window.location.hash = window.location.hash || '/';
    window.addEventListener('hashchange', () => {
      this.setState(
        {
          location: {
            ...this.state.location,
            pathname: window.location.hash.slice(1) || '/',
          },
        },
        () => console.log(this.state.location),
      );
    });
  }
  render() {
    let value = {
      location: this.state.location,
    };
    return <Provider value={value}>{this.props.children}</Provider>;
  }
}

export default HashRouter;
```

### Route 组件

Route 组件主要做的是通过**BrowserRouter**传过来的当前值，通过 props 传进来的 path 与 context 传进来的 pathname 进行匹配，然后决定是否执行渲染组件

```js
import React, { Component } from 'react';
import { Consumer } from './context';
const { pathToRegexp } = require('path-to-regexp');
class Route extends Component {
  render() {
    return (
      <Consumer>
        {(state) => {
          let { path } = this.props;
          let Comp = this.props.component;
          let pathname = state.location.pathname;
          let reg = pathToRegexp(path, [], { end: false });
          // 判断当前path是否包含pathname
          if (pathname.match(reg)) {
            return <Comp />;
          }
          return null;
        }}
      </Consumer>
    );
  }
}
export default Route;
```

## 参考文档

- [前端路由实现原理](https://mp.weixin.qq.com/s/j78ycLwTFYOVFIM9er-A7Q) V5:
- [「源码解析 」这一次彻底弄懂 react-router 路由原理](https://juejin.cn/post/6886290490640039943)
- [不看看 react-router 源码？真的懂路由咩](https://juejin.cn/post/6872752069766283271)
- [深入浅出解析 React Router 源码](https://juejin.cn/post/6950248553549660191) V6:
- [React-Router v6 完全解读指南 - react-router 篇（万字长文，学懂毕业）](https://juejin.cn/post/7067436563457638413#comment)
- [「React 进阶」react-router v6 通关指南](https://juejin.cn/post/7069555976717729805)
- [React-Router v6 新特性解读及迁移指南](https://juejin.cn/post/6844904096059621389)
