---
title: ssr服务端渲染
order: 0
group:
  title: ssr
  order: 0
  path: /node/ssr
nav:
  order: 5
  title: 'node'
  path: /node
---

> 简历中有写道，可能是亮点，既然是亮点就要对得起面试官

## 可能需要问到的问题

- react ssr 是在什么场景下做的？
- react ssr 双端怎么做构建的？区别在哪里？
- 有没有做过同构组件？服务端和客户端怎么同步状态的？
- SSR 的实现原理是什么？
- 为啥需要同构？
- **render** 和 **renderToString** 的底层实现上的区别？
- 客户端怎么处理 JS 事件失效的问题？客户端不重新加载 JS 的情况下怎么实现？
- 做服务端渲染的时候有没有遇到过比较难的点？
- react ssr 和 **ejs** 性能的差异？
- React SSR 是怎么实现的？
- Next.js/Nuxt.js
- award.js 非登录态 ssr 登录态 csr 如何做到？
- 如何调试 ssr?
- 如何调试 vite+ts 配置出来的 ssr 项目

## 什么是服务端渲染

服务器端渲染（Server-Side Rendering）是指由服务端完成页面的 HTML 结构拼接的页面处理技术，发送到浏览器，然后为其绑定状态与事件，成为完全可交互页面的过程。

csr 和 ssr 最大的区别在于前者页面渲染是由 js 负责进行的，而后者则是由服务端直接返回 html 让浏览器直接渲染

服务器端渲染和客户端渲染的差异，决定了服务器端渲染在**爬虫** 关键词爬取的精准度上会远胜客户端渲染，使得站点更容易获得相关关键词更高的排名。

### 同构

[服务器端渲染的核心概念](https://juejin.cn/book/7137945369635192836/section/7141320046537605131)

同一套 React 代码在服务器端渲染一遍，然后在客户端再执行一遍，**reactDom.renderToString** 将 jsx 转为 html 字符串的时候，不会处理 jsx 上面的 attrs 的事件属性。所以需要在客户端执行 **ReactDom.hydrate**，把事件和属性生效

1. 服务端渲染 jsx->html,使用**ReactDom.renderToString**生成
2. 客户端在运行 jsx->html,使用**ReactDom.hydrate**进行客户端的再次渲染

> 模板创建好了，现在我们需要思考，怎么才能把这个模板转换成 HTML 标签传递给服务器端呢？这里我们可以使用 react-dom 中暴露的 renderToString 方法，这个方法可以把模板元素转换成 HTML 字符串返回。它的底层和客户端模板编译其实是一样的，都是根据 AST （也就是虚拟 DOM ）来转化成真实 DOM 的过程

如果用服务端渲染，务必保持服务端塞给 react 组件的数据跟浏览器端数据保持一致

所谓同构，通俗的讲，就是一套 React 代码在服务器上运行一遍，到达浏览器又运行一遍。**服务端渲染完成页面结构,DOM 拼接**，**浏览器端渲染完成事件绑定**, 不仅是**模板页面渲染**，后面的**路由**，**数据的请求**都涉及到同构的概念。可以理解成，服务器端渲染都是基于同构去展开的，大家这里关注一下这个概念，对后面的学习理解会有很大的帮助

> 服务端负责静态 dom 的拼接，而客户端负责事件的绑定

> 客户端如何绑定事件的？

ReactDom.hydrateRoot: 在已经提供了服务器端静态渲染节点的情况下使用，它只会对**模板中的事件**进行处理

让浏览器去拉取 JS 文件执行，让 JS 代码来控制

同构的执行流程：

服务端运 react 生产 html -> 发送到浏览器 -> 浏览器渲染 html -> 浏览器加载 js 脚本 -> JS 代码执行并接管页面的操作

具体如何操作呢？其实就是在服务端渲染的页面结构里加上一个 index.js 文件，这个文件拉取的 js 代码就是用来完成同构的，具体实现

```js
export const render = (store, routes, req) => {
  const content = renderToString(
    <Provider store={store}>
      // 服务端路由 StaticRouter
      <StaticRouter location={req.path}>
        <Nav />
        <div>{renderRoutes(routes)}</div>
      </StaticRouter>
    </Provider>,
  );
  return `
    <html>
    <head>
      <title>ssr Title cpp</title>
    </head>
      <body>
      <div id='app'>${content}</div>
      <script src='index.js'></script>
      <script>
        window.context = {
          state: ${JSON.stringify(store.getState())}
        }
      </script>
      </body>
    </html>
  `;
};
```

index.js 如何生成的呢，这个是由 client 端 webpack 打包生成的,先是在 client 端引入 **react-dom**

```js
// client/app.js
import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter, Link } from 'react-router-dom';
import routes from '../route';
import { Provider } from 'react-redux';
import { renderRoutes } from 'react-router-config';

const App = () => {
  return (
    <Provider>
      <BrowserRouter>
        <div>{renderRoutes(routes)}</div>
      </BrowserRouter>
    </Provider>
  );
};
// 水合
ReactDom.hydrate(<App />, document.getElementById('app'));
```

然后 webpack 打包成**index.js**

```js
// webpack.client.js
module.exports = merge(common, {
  mode: "development",
  entry: path.resolve(__dirname, "../src/client/app.js"),
  output: {
    path: path.resolve(__dirname, "../public"),
    filename: "index.js",
    chunkFilename: "js/[id].[chunkhash].js",
  },
}
```

#### 注水 Hydrate

服务端拿到数据之后注入到 **客户端 html** 文本里，也就是塞到 window 全局环境中将服务端渲染的数据放到 script 中的**window.context**

```js
//
// server/render.js
`
  <html>
  <head>
    <title>ssr Title</title>
  </head>
    <body>
    <div id='app'>${content}</div>
    <script src='index.js'></script>
    <script>
      window.context = {
        state: ${JSON.stringify(store.getState())}
      }
    </script>
    </body>
  </html>
  `;
```

**package.json** 中需要修改下执行命令,通过 nodemon 监视文件变化，然后重新编译

```json
//package.json的script部分
  "scripts": {
    "dev": "npm-run-all --parallel dev:**",
    "dev:start": "nodemon --watch build --exec node \"./build/bundle.js\"",
    "dev:build:server": "webpack --config webpack.server.js --watch",
    "dev:build:client": "webpack --config webpack.client.js --watch"
  },
```

### 脱水 Dehydrate

window 绑定的数据给到客户端 store 客户端的 store 初始数据从 **window.context** 里面拿,然后放到 redux 注入到 app.js 这样所有的组件都能拿到 redux 里的数据

```js
// store/index.js
// 客户端脱水
export const getClientStore = () => {
  const defaultState = window.context ? window.context.state : {};
  // return createStore(reducer, defaultState, applyMiddleware(thunk.withExtraArgument(clientAxios)));
  return createStore(reducer, defaultState, applyMiddleware(thunk));
};
// 客户端运用
// client/app.js
import ReactDom from 'react-dom';
import { getClientStore } from '../store';
import { renderRoutes } from 'react-router-config';

const App = () => {
  return (
    <Provider store={getClientStore()}>
      <BrowserRouter>
        <Nav />
        <div>{renderRoutes(routes)}</div>
      </BrowserRouter>
    </Provider>
  );
};
// 水合
ReactDom.hydrate(<App />, document.getElementById('app'));
```

## 安全问题

安全问题非常关键，尤其是涉及到服务端渲染，开发者要格外小心。这里提出一个点：我们前面提到了注水和脱水过程，其中的代码：

```js
<script>
  window.context = {
    initialState: ${JSON.stringify(store.getState())}
   }
</script>
```

非常容易遭受 XSS 攻击，JSON.stringify 可能会造成 script 注入,使用 serialize-javascript 库进行处理，这也是同构应用中最容易被忽视的细节。另一个规避这种 XSS 风险的做法是：将数据传递个页面中一个隐藏的 textarea 的 value 中，textarea 的 value 自然就不怕 XSS 风险了。

[ssr api](https://www.cnblogs.com/ayqy/p/react-ssr-api.html)

## 路由

上面我们只加入了 Home 页面的访问，但是事实上咱们站点不可能只有一个页面，所以我们需要再加上路由的匹配，那我们应该怎么做呢？

上个小标题我们介绍了同构的概念，同构有一个原因是，**客户端和服务端的返回需要保持一致**，不然会有客户端的报错，页面也没办法正常匹配。所以我们需要同时为客户端和服务端的入口都加上对应的路由配置。

因为存在客户端路由和服务端路由，所以服务器端渲染通过不同的方式跳转也会采用不同的渲染方式，

当使用 React 内置的路由跳转的时候，会进行客户端路由的跳转，采用客户端渲染；

而通过 a 标签，或者原生方式打开一个新页面的时候，才会进行服务器端路由的跳转，使用服务器端渲染。

## 手写 react ssr

见代码仓库[react ssr](https://github.com/niaogege/ssr)

## ssr 工程如何调试

调试套路：

- 想法设法生成 sourceMap,webpack 需要配置
- 想办法使得 sourceMap 中的 source 字段（源文件位置）指向你要调试的文件，利用 Chrome devTools Protocol

以本项目为例

- First webapck 打包后的文件需要有 sourceMap 文件在 build/webpack.server.js 中添加 sourceMap 配置

```js
module.exports = {
  mode: 'development',
  target: 'node',
  devtool: 'source-map',
  entry: path.resolve(__dirname, '../src/server/index.js'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../dist'),
    libraryTarget: 'commonjs',
  },
  // xxx 省略其他代码
};
```

- Second 命令行启动的时候加上调试参数

```json
  "scripts": {
    "dev:server": "webpack --config build/webpack.server.js --watch",
    "dev:client": "webpack --config build/webpack.client.js --watch",
    // 添加 --inspect参数 启动debugger
    "dev:start": "nodemon --watch build --exec node --inspect dist/bundle.js",
    "dev": "npm-run-all --parallel dev:*"
  },
```

- Third1: 用 Chrome DevTools 调试 node 代码

chrome 浏览器打开**chrome://inspect/#devices**，下面列出的是所有可以调试的目标，也就是 ws 服务端：

点击 inspect 就可以调试这个 node 脚本了：

但是这样也是和调试网页一样的问题，在 Chrome DevTools 里调试，在 VSCode 里写代码，这俩是分离开的，切来切去也挺不方便的。

那 VSCode 能不能调试 node 代码呢？

- Third2: 用 VSCode Debugger 调试 node 代码

项目跟目录添加 **.vscode/launch.json** 的调试配置文件：

```js
{
  "configurations": [
    {
      "name": "SSR Program",
      "program": "${workspaceFolder}/dist/bundle.js", // 需要自己制定项目的入口文件
      "request": "launch",
      "skipFiles": ["<node_internals>/**"],
      "type": "node"
    }
  ]
}
```

完了，现在本地在重新启动下，就能在 node 端调试源代码了

## 如何调试 vite+ts 配置出来的 ssr 项目？

其实主要是 ts 端代码如何调试，vite 可以先不考虑

## 参考

- [从头开始，彻底理解服务端渲染原理(8 千字汇总长文)](https://juejin.cn/post/6844903881390964744)
- [【万字长文警告】从头到尾彻底理解服务端渲染 SSR 原理](https://juejin.cn/post/6856321751115431944)
- [同构以及原理](https://hejialianghe.gitee.io/projectPractice/isomorphism.html#_1-1-%E8%AE%A4%E8%AF%86%E5%90%8C%E6%9E%84)
