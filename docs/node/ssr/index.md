---
title: ssr服务端渲染
order: 1
group:
  title: node
  order: 0
  path: /node/ssr
nav:
  order: 5
  title: 'node'
  path: /node
---

> 简历中有写道，可能是亮点，既然是亮点就要对得起面试官

## 可能需要问到的问题

server side Render (ssr)

- react ssr 是在什么场景下做的？
- react ssr 双端怎么做构建的？区别在哪里？
- 有没有做过同构组件？服务端和客户端怎么同步状态的？
- **render** 和 **renderToString** 的底层实现上的区别？得看 react 源码
- 客户端怎么处理 JS 事件失效的问题？客户端不重新加载 JS 的情况下怎么实现？ //
- 做服务端渲染的时候有没有遇到过比较难的点？
- react ssr 和 **ejs** 性能的差异？
- SSR 的实现原理是什么？
- React SSR 是怎么实现的？
- 你是怎么去做 React SSR 的？
- Next.js/Nuxt.js
- award.js 非登录态 ssr 登录态 csr 如何做到
- 服务端直出

## 什么是服务端渲染

## 脱水 Dehydrate 和 注水 Hydrate

#### 同构

一套 react 代码，在服务端执行一次，在客户端也执行一次，reactDom.renderToString 将 jsx 转为 html 文本的时候，不会处理 jsx 上面的 attrs 的事件属性。所以需要在客户端执行 **ReactDom.hydrat**e，把事件和属性生效

1. 服务端渲染 jsx->html,使用**ReactDom.renderToString**生成
2. 客户端在运行 jsx->html,使用**ReactDom.hydrate**进行客户端的再次渲染

如果用服务端渲染，务必保持服务端塞给 react 组件的数据跟浏览器端数据保持一致

#### 注水 Hydrate

服务端拿到数据之后注入到 windows，也就是塞到 window 全局环境中将服务端渲染的数据放到 script 中的**window.context**

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

##

## 手写 react ssr

## 参考

- [从头开始，彻底理解服务端渲染原理(8 千字汇总长文)](https://juejin.cn/post/6844903881390964744)
- [【万字长文警告】从头到尾彻底理解服务端渲染 SSR 原理](https://juejin.cn/post/6856321751115431944)
- [同构以及原理](https://hejialianghe.gitee.io/projectPractice/isomorphism.html#_1-1-%E8%AE%A4%E8%AF%86%E5%90%8C%E6%9E%84)
