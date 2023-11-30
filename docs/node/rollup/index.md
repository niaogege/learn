---
title: rollup
order: 0
group:
  title: rollup
  order: 5
  path: /node/rollup
nav:
  order: 5
  title: 'node'
  path: /node
---

干起来，三大打包工具，干翻他,[rollup 官网](https://cn.rollupjs.org/introduction/)

学习的目的：

- 了解并学习 rollup 插件接口的设计和思想

## 简历上写了 了解 rollup/vite 打包构建流程以及相关 plugin 插件

<!-- 简直给自己挖坑，如何填坑呢 -->

### 说说 rollup 打包构建过程

### 说说 rollup 插件机制

### 常用插件

#### @rollup/plugin-node-resolve

在某个时刻，你的项目可能会依赖于从 NPM 安装到 node_modules 文件夹中的软件包。与 Webpack 和 Browserify 等其他打包程序不同，Rollup 默认情况下不知道如何处理这些依赖项，我们需要添加一些配置。 @rollup/plugin-node-resolve 插件可以让 Rollup 找到外部模块。让我们安装它

```shell
npm install --save-dev @rollup/plugin-node-resolve
```

然后将它添加到我们的配置文件中：

```js
// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/main.js',
  output: {
    file: 'bundle.js',
    format: 'cjs',
  },
  plugins: [resolve()],
};
```

#### @rollup/plugin-commonjs

一些库会暴露出 ES 模块，你可以直接导入它们，**the-answer** 就是这样的一个模块。但是目前，大多数 NPM 上的包都以 CommonJS 模块的方式暴露。在这种情况下，我们需要在 Rollup 处理它们之前将 **CommonJS 转换为 ES2015**。

@rollup/plugin-commonjs 插件就是用来做这件事的。

请注意，大多数情况下，@rollup/plugin-commonjs 应该放在转换模块的其他插件之前 - 这是为了防止其他插件对 CommonJS 检测产生影响。一个例外是 Babel 插件，如果你使用它，请将它放在 commonjs 插件之前。

#### @rollup/plugin-babel

许多开发人员在项目中使用 Babel 来使用尚未被浏览器和 Node.js 支持的最新 JavaScript 特性。

使用 Babel 和 Rollup 最简单的方法是使用 @rollup/plugin-babel。首先，安装该插件：

```shell
npm i -D @rollup/plugin-babel @rollup/plugin-node-resolve
```

Add it to rollup.config.js:

```js
// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';

export default {
  input: 'src/main.js',
  output: {
    file: 'bundle.js',
    format: 'cjs',
  },
  plugins: [resolve(), babel({ babelHelpers: 'bundled' })],
};
```

在 Babel 实际编译代码之前，需要进行配置。创建一个名为 **src/.babelrc.json** 的新文件：

```json
{
  "presets": ["@babel/env"]
}
```

现在，在运行 rollup 之前，我们需要安装 babel-core 和 env 预设：

```shell
npm i -D @babel/core @babel/preset-env
```

### 参考

- [rollup 官网](https://cn.rollupjs.org/tools/)
