---
title: ssr服务端渲染基础概念
order: 1
group:
  title: ssr
  order: 0
  path: /node/ssr
nav:
  order: 5
  title: 'node'
  path: /node
---

> 本文涉及的 React 版本是 17.x react18.0 的流式渲染还没搞懂

### SSR 原理

我们知道 vue 是通过 template 描述页面结构，而 react 是通过 jsx，但不管是 template 还是 jsx，编译后都会产生 render function，然后执行产生 vdom。 vdom 在浏览器里会通过 dom api 增删改 dom 来完成 CSR，在服务端会通过**拼接字符串**来完成 SSR

![ssr 实现过程](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f7ae42f6d7f8423abc530763b1ad684e~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

### React SSR 是怎么实现的？

### 同构

所谓同构，通俗的讲，就是一套 React 代码在服务器上运行一遍，到达浏览器又运行一遍。**服务端渲染完成页面结构,DOM 拼接**，**浏览器端渲染完成事件绑定**, 不仅是**模板页面渲染**，后面的**路由**，**数据的请求**都涉及到同构的概念。可以理解成，服务器端渲染都是基于同构去展开的

### 模板页面渲染同构

**reactDom.renderToString** 将 jsx 转为 html 文本的时候，不会处理 jsx 上面的 attrs 的事件属性。所以需要在客户端再执行一次 react 代码，把事件属性生效

1. 服务端渲染 jsx->html,使用**ReactDom.renderToString**生成
2. 客户端在运行 jsx->html,使用**ReactDom.hydrate**进行客户端的再次渲染

流程：服务端运行 react 渲染出 html->发送 html 到浏览器->浏览器加载 js 文件->js 中的 react 代码重新执行->js 中的 react 代码接管页面操作。

### 路由同构

### 数据请求同构

### css 样式同构

网上找了大量资料，发现配置都是一样，但为啥在他们那里不报错，在我项目中就报错，很神奇，后面发现：最大的深坑就是在客户端配置**isomorphic-style-loader**的时候需要使用 **commonjs** 规范，所以需要在配置**css-loader**那里加上**[esModule: false](https://www.npmjs.com/package/css-loader)**

> Default: true

By default, css-loader generates JS modules that use the ES modules syntax. There are some cases in which using ES modules is beneficial, like in the case of module concatenation and tree shaking.

You can enable a CommonJS modules syntax using:

默认情况下，css-loader 生成使用 ES 模块语法的 JS 模块。在某些情况下，使用 ES 模块是有益的，例如在模块连接和摇树的情况下。您可以使用启用 CommonJS 模块语法

```js
// server.config.js
  rules: [
      {
        test: /\.css?$/,
        use: [
          "isomorphic-style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              esModule: false, // !!!深坑
              modules: {
                localIdentName: "[name]__[local]___[hash:base64:5]",
              },
            },
          },
        ],
      },
    ],
```

css 同构的思路

客户端 css -> UNSAFE_componentWillMount -> this.props.staticContext -> ssr 拿到 css -> 塞到 html

实现原理： isomorphic-style-loader 利用 **context API**，在渲染页面组件时获取所有 React 组件的样式信息，在服务器端输出 html 字符串的同时，也将样式插入到 html 字符串当中，将结果一同输出到客户端。

目前通过 isomorphic-style-loader 实现 css 同构有两种方式,

- 单组件方式
- 结合 isomorphic-style-loader 提供的 **StyleContext** 按组件插入所需 css 文本

#### 单组件方式

- 客户端部分

```js
// Home.js
import styles from "./index.css";
UNSAFE_componentWillMount() {
    // 服务端isomorphic-style-loader插件会给styles绑定_getCss()方法
    if (this.props.staticContext) {
      const str = styles._getCss();
      this.props.staticContext.css.push(str);
    }
}
// client.config.js
  {
    test: /\.css?$/,
    use: [
      "style-loader",
      // "isomorphic-style-loader",
      {
        loader: "css-loader",
        options: {
          importLoaders: 1,
          modules: {
            localIdentName: "[name]__[local]___[hash:base64:5]",
          },
        },
      },
    ],
  },
```

- 服务端部分

```js
// server/render.js
export const render = (store, routes, req, context: { css: [] }) => {
  const cssStr = context.css.length ? context.css.join('\n') : '';
  return `
    <html>
    <head>
    <title>ssr Title cpp</title>
    <style>
    ${cssStr}
    </style>
    </head>
      <body>
      <div id='app'>${content}</div>
      <script>
        window.context = {
          state: ${JSON.stringify(store.getState())}
        }
      </script>
      <script src='index.js'></script>
      </body>
    </html>
  `;
};
```

#### 结合 isomorphic-style-loader 提供的 StyleContext 进行按组件插入所需 css 文本

按照官网的[示例](https://www.npmjs.com/package/isomorphic-style-loader)运行即可，唯一的区别是在客户端打包的时候需要配置下

> 官网上配置也是少了一个配置参数，配置 css-loader 少了 esModule: false, // !!!深坑

```js
// client.config.js
      {
        test: /\.css?$/,
        use: [
          // "style-loader",
          "isomorphic-style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              esModule: false, // 深坑需要注意
              modules: {
                localIdentName: "[name]__[local]___[hash:base64:5]",
              },
            },
          },
        ],
      },
```

最终服务端生成的页面**head**里看到 Style:

```js
   <html>
    <head>
    <title>ssr Title cpp</title>
    <style>
    .index__home___pP1Or {
      background-color: red;
      font-size: 20px;
    }
    .index__title___QJjl_ {
      color: yellow;
    }
    </style>
    </head>
      ...省略
    </html>
```

### 如何在 ssr 中进行调试

[调试参考](../../node/tool/1.debugger.md)

### 参考

- [SSR 和前端编译在代码生成上是一样的](https://juejin.cn/post/7068726116940251166)
- [css 同构](https://juejin.cn/post/6854573205349367815#heading-10)
- [css](https://juejin.cn/post/6997830859789172772#heading-6)
