---
title: base学习基础的vite常识
order: 1
group:
  title: vite
  order: 4
  path: /node/vite
nav:
  order: 5
  title: 'node'
  path: /node
---

Vite 旨在利用生态系统中的新进展解决上述问题：浏览器开始**原生支持 ES 模块**，且越来越多 JavaScript 工具使用**编译型语言**编写(TS)。

## why is vite

### 缓慢的服务器启动

Vite 通过在一开始将应用中的模块区分为 **依赖 和 源码** 两类，改进了开发服务器启动时间

- 依赖 大多为在开发时不会变动的纯 JavaScript,依赖也通常会存在多种模块化格式（例如 ESM 或者 CommonJS),Vite 将会使用 **esbuild 预构建依赖**。esbuild 使用 Go 编写，并且比以 JavaScript 编写的打包器预构建依赖快 10-100 倍。

> vite 使用 esbuild 预构建依赖

- 源码 通常包含一些并非直接是 JavaScript 的文件，需要转换（例如 JSX，CSS 或者 Vue/Svelte 组件），时常会被编辑。同时，并不是所有的源码都需要同时被加载（例如基于路由拆分的代码模块）

Vite 以 **原生 ESM** 方式提供源码。这实际上是让**浏览器接管了打包程序**的部分工作：**Vite 只需要在浏览器请求源码时进行转换并按需提供源码**。根据情景动态导入代码，即只在当前屏幕上实际使用时才会被处理。

### 缓慢的更新

- 在 Vite 中，**HMR 是在原生 ESM 上执行的**。当编辑一个文件时，Vite 只需要精确地使已编辑的模块与其最近的 HMR 边界之间的链失活[1]（大多数时候只是模块本身），使得无论应用大小如何，HMR 始终能保持快速更新

- Vite 同时**利用 HTTP 头来加速整个页面的重新加载**（再次让浏览器为我们做更多事情）：源码模块的请求会根据 304 Not Modified 进行协商缓存，而依赖模块请求则会通过 Cache-Control: max-age=31536000,immutable 进行强缓存，因此一旦被缓存它们将不需要再次请求

## 开始

是一种新型前端构建工具，能够显著提升前端开发体验。它主要由两部分组成：

- 一个开发服务器，它基于 **原生 ES 模块** 提供了 丰富的内建功能，如速度快到惊人的 模块热更新（HMR）。
- 一套构建指令，它使用 **Rollup** 打包你的代码，并且它是预配置的，可输出用于生产环境的高度优化过的静态资源。

> 内建功能有哪些呢

## Npm 依赖解析和预构建

原生 ES 导入不支持下面这样的裸模块导入：

```js
import { someMethod } from 'module';
```

上面的代码会在浏览器中抛出一个错误。Vite 将会检测到所有被加载的源文件中的此类裸模块导入，并执行以下操作:

1.预构建 它们可以提高页面加载速度，并将 CommonJS / UMD 转换为 ESM 格式。预构建这一步由 esbuild 执行，这使得 Vite 的冷启动时间比任何基于 JavaScript 的打包器都要快得多。

2.重写导入为合法的 URL，例如 **/node_modules/.vite/deps/my-dep.js?v=f3sf2ebd** 以便浏览器能够正确导入它们。

## 模块热重载

Vite 提供了一套 **原生 ESM 的 HMR** API。 具有 HMR 功能的框架可以利用该 API 提供即时、准确的更新，而无需重新加载页面或清除应用程序状态。Vite 内置了 HMR 到 Vue 单文件组件（SFC） 和 React Fast Refresh 中。也通过 @prefresh/vite 对 Preact 实现了官方集成。

> 如何做到的

## TypeScript¶

Vite 天然支持引入 .ts 文件。

Vite 使用**esbuild**将 TypeScript 转译到 JavaScript，约是 tsc 速度的 20~30 倍，同时 HMR 更新反映到浏览器的时间小于 50ms。

> esbuild 是如何做到编译成 js 的 而且速度比 tsc 还快

## Plugin

Vite 可以使用插件进行扩展，这得益于 **Rollup 优秀的插件接口设计**和一部分 Vite 独有的额外选项。这意味着 Vite 用户可以利用 Rollup 插件的强大生态系统，同时根据需要也能够扩展开发服务器和 SSR 功能。

> 我想知道 rollup 是如何设计插件接口的 哇咔咔 0701

## 创建自己的插件

> [指向 rollup 插件](https://rollupjs.org/guide/en/#plugin-development)
