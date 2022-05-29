---
title: node
order: 0
group:
  title: node
  order: 0
nav:
  order: 5
  title: 'node'
  path: /node
---

## node 自身架构

## Esmodule 跟 commonjs 区别

commonjs 是 nodejs 端模块化组织方式 es5 是浏览器端模块化组织方式

### commonjs

Node 应用由模块组成，采用 **CommonJS** 模块规范。每个文件就是一个模块，有自己的作用域。在一个文件里面定义的变量、函数、类，都是私有的，对其他文件不可见。在服务器端，模块的加载是**运行时**同步加载的；在浏览器端，模块需要提前编译打包处理。

#### 特点

- 所有代码都运行在模块作用域，不会污染全局作用域。
- 模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果。- 要想让模块再次运行，必须清除缓存。
- 模块加载的顺序，按照其在代码中出现的顺序。

#### 基本语法

- 暴露方式 `module.exports = val` or `exports.val = value`

#### 加载机制

```js
// lib.js
var count = 3;
function add() {
  count++;
}
module.exports = {
  count,
  add,
};
```

```js
// main.js
var count = requrie('./lib').count;
var add = requrie('./lib').add;
console.log(count); // 3
add();
console.log(count); // 3
```

输入的值是输出值的拷贝，一旦一个原始类型值值输出，模块内部的变化不会影响到改值，原始类型的值会被缓存，除非输出的是方法，才能得到内部的值

### es6

ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量

#### ES6 模块化语法

export 命令用于规定模块的对外接口，import 命令用于输入其他模块提供的功能。

#### ES6 和 Commonjs 差异

1.commonjs 模块输出的是一个值的拷贝 ，es6 模块输出的是值的引用 2.CommonjS 模块是运行时加载，ES6 模块是编译时输出接口。

第二个差异是因为 CommonJS 加载的是一个对象（即**module.exports**属性），该对象只有在脚本运行完才会生成。而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。

ES6 模块的运行机制与 CommonJS 不一样。ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块。

## BFF(Backends For Frontends))

## koa/express 学习和使用

## babel

## ssr

## 中间件

## 参考

- [微服务/API 前端开发时代之 BFF 速学入门教程](https://mp.weixin.qq.com/s/zP-sWo6IiRUjMsLeTtRA_w)

- [前端模块化详解(完整版)](https://juejin.cn/post/6844903744518389768#heading-39)
