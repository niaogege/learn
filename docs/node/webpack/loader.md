---
title: loader
order: 1
group:
  title: webpack
  order: 3
  path: /node/webpack
nav:
  order: 5
  title: 'node'
  path: /node
---

## loader 介绍

Webpack 是一个模块化打包工具，它被广泛地应用在前端领域的大多数项目中。利用 Webpack 我们不仅可以打包 JS 文件，还可以打包图片、CSS、字体等其他类型的资源文件。而支持打包非 JS 文件的特性是基于 Loader 机制来实现的。因此要学好 Webpack，我们就需要掌握 Loader 机制

- Loader 的本质是什么？
- Normal Loader 和 Pitching Loader 是什么？
- Pitching Loader 的作用是什么？
- Loader 是如何被加载的？
- Loader 是如何被运行的？
- 多个 Loader 的执行顺序是什么？
- Pitching Loader 的熔断机制是如何实现的？
- Normal Loader 函数是如何被运行的？
- Loader 对象上 raw 属性有什么作用？
- Loader 函数体中的 this.callback 和 this.async 方法是哪里来的？
- Loader 最终的返回结果是如何被处理的？

## loader 手写

```js
const loaderUtils = require('loader-utils');
const validateOptions = require('schema-utils');
// 定义loader里的options选项数据结构
const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
  },
};
module.exports = function (source) {
  // this指向当前的Loader Context,不是webpack实例也不是compilation
  const options = loaderUtils.getOptions(this);
  validateOptions(schema, options, 'Example Loader');
  return source;
};
```

## loader 使用

推荐 **resolveLoader** 的 alias 模式 以及匹配(test)单个 loader，当然还有常用的**npm link**软连接的方式

```js
// webpack.common.js
module.exports = {
  resolveLoader: {
    alias: {
      'async-loader': path.resolve(__dirname, '../loader/async-loader.js'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: '/node_modules/',
        use: [
          {
            loader: 'async-loader',
            options: {
              name: 'test my loader cpp',
            },
          },
        ],
      },
    ],
  },
};
```

## loader 作用是什么

（1）实现对不同格式文件的处理，比如将 Scss 转换为 CSS，或将 TypeScript 转化为 Javascript。

（2）可以编译文件，从而使其能够添加到依赖关系中。loader 是 WebPack 最重要的部分之一。通过使用不同的 loader，我们能够调用外部的脚本或者工具，实现对不同格式文件的处理。loader 需要在 webpack.config.js 里单独用 module 进行配置。

常用的 loader 如下：

- file-loader：把文件输出到一个文件夹中，在代码中通过相对 URL 去引用输出的文件
- url-loader：和 file-loader 类似，但是能在文件很小的情况下以 base64 的方式把文件内容注入到代码中去
- source-map-loader：加载额外的 Source Map 文件，以方便断点调试
- image-loader：加载并且压缩图片文件
- babel-loader：把 ES6 转换成 ES5
- css-loader：加载 CSS，支持模块化、压缩、文件导入等特性
- style-loader：把 CSS 代码注入到 JavaScript 中，通过 DOM 操作去加载 CSS。
- eslint-loader：通过 ESLint 检查 JavaScript 代码
