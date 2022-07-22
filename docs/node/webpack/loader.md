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
