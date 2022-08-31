---
title: transform和polyfill区别
order: 5
group:
  title: babel
  order: 1
  path: /babel
nav:
  order: 1
  title: 'node'
  path: /node
---

ES6 转换 ES5，高版本语法转换低版本语法就是转换，但是只是转换并不能解决所有问题，涉及到某个对象的 api，比如 Array.prototype.find，这种 api 的兼容并不是需要转换语法，而是要在环境中注入我们实现的 api，也就是 **polyfill** （垫片）。

## plugin -> preset

### tranform 转换

我们知道，[TC39](https://262.ecma-international.org/) 是制定 javascript 语言标准的组织，每年都会公布加入到语言标准的特性，es2015、es2016、es2017 等。这些是我们要转换的语言特性范围。在 babel6 时，分别用 preset-es2015、 preset-es2016 等来维护相应的 transform plugin，但在 babel7 的时候就改为 preset env 了。

### proposal 阶段的语法

babel 要转换的不只是加入标准的特性，语言特性从提出到标准会有一个过程，分为几个阶段。

- 阶段 0 - Strawman: 只是一个想法，可能用 babel plugin 实现
- 阶段 1 - Proposal: 值得继续的建议
- 阶段 2 - Draft: 建立 spec
- 阶段 3 - Candidate: 完成 spec 并且在浏览器实现
- 阶段 4 - Finished: 会加入到下一年的 es20xx spec

- syntax plugin syntax plugin 是在 parserOptions 中放入一个 flag 让 parser 知道要 parse 什么语法，最终的 parse 逻辑还是 babel parser（babylon） 实现的。

- transform plugin ransform plugin 是对 AST 的转换，各种 es20xx 语言特性、typescript、jsx 等的转换都是在 transform plugin 里面实现的。

- proposal plugin 未加入语言标准的特性的 AST 转换插件叫 proposal plugin，其实他也是 transform plugin，但是为了和标准特性区分，所以这样叫。

总之，babel 的内置的 plugin，就 @babel/plugin-syntax-xxx, @babel/plugin-transform-xxx、@babel/plugin-proposal-xxx 3 种。

这样的 plugin 还是很多的，所以又设计了 preset。

### preset

用于不同的目的需要不同的 babel 插件，所以 babel 设计了 preset

- 不同版本的语言标准支持： preset-es2015、preset-es2016 等，babel7 后用 preset-env 代替
- 未加入标准的语言特性的支持： 用于 stage0、stage1、stage2 的特性，babel7 后单独引入 proposal plugin
- 用于 react、jsx、flow 的支持：分别封装相应的插件为 preset-react、preset-jsx、preset-flow，直接使用对应 preset 即可

preset 就是插件的集合，但是它可以**动态**确定包含的插件，比如 preset-env 就是根据 **targets** 来确定插件。

插件和插件之间自然有一些公共的代码，这部分放在 helper 里

### @babel/preset-env

```js
'usage' | 'entry' | false;
```

usage: 按需引入 entry: 需要安装用户自定义的 target 引入 pollify false: 默认所有的垫片全都引入

一般是这样配置

```js
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          chrome: 99,
        },
        debug: true, // 用到的plugins
        useBuiltIns: "usage",
        corejs: "3.6.4", // 需要指定corejs版本
      },
    ],
  ],
```

## helper

每个特性的实现用一个 babel 插件实现，当 babel 插件多了，自然会有一些共同的逻辑。这部分逻辑怎么共享呢？

babel 设计了插件之间共享逻辑的机制，就是 helper。

helper 分为两种：

- 一种是注入到 AST 的运行时用的全局函数
- 一种是操作 AST 的工具函数，比如变量提升这种通用逻辑

### 注入到 AST 的全局函数

### babel runtime

babel runtime 里面放运行时加载的模块，会被打包工具打包到产物中，下面放着各种需要在 runtime 使用的函数，包括三部分：**regenerator、corejs、helper**。

- corejs 这就是新的 api 的 **polyfill**，分为 2 和 3 两个版本，3 才实现了实例方法的 polyfill

- regenerator 是 facebook 实现的 aync 的 runtime 库，babel 使用 regenerator-runtime 来支持实现 async await 的支持。

- helper 是 babel 做语法转换时用到的函数，比如 \_typeof、\_extends 等

## Babel 内置功能

1.@babel/preset-env，可以设置 targets,减少很多没必要的转换和 polyfill,但会全局引入，造成污染。 2.使用@babel/plugin-transform-runtime 以模块化方式引入，避免造成全局污染，但不支持根据 targets 的过滤。 3.babel8，解决了@babel/plugin-transform-runtime 和@babel/preset-env 的配合问题，不再需要 @babel/plugin-transform-runtime，
