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

- [前端工程化历程](https://mp.weixin.qq.com/s/o8B8HAczZtIZM8V_HHwNqg)

## node 包含模块

- Koa
- ssr
- vite
- rollup
- webpack
- microFrontend

## Cjs/Amd/umd/Esmodule

### Cjs

CJS 是 CommonJS 的缩写。经常我们这么使用：

```js
// importing
const doSomething = require('./doSomething.js');

// exporting
module.exports = function doSomething(n) {
  // do something
};
```

### Amd

AMD 代表异步模块定义。(依赖前置)下面是一个示例代码

```js
define(['dep1', 'dep2'], function (dep1, dep2) {
  //Define the module value by returning a value.
  return function () {};
});
```

又或者

```js
// "simplified CommonJS wrapping" https://requirejs.org/docs/whyamd.html
define(function (require) {
  var dep1 = require('dep1'),
    dep2 = require('dep2');
  return function () {};
});
```

- AMD 是异步(asynchronously)导入模块的(因此得名)
- 一开始被提议的时候，AMD 是为前端而做的(而 CJS 是后端)
- AMD 的语法不如 CJS 直观。我认为 AMD 和 CJS 完全相反

### umd

UMD 代表**通用模块定义**（Universal Module Definition）

```js
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["jquery", "underscore"], factory);
    } else if (typeof exports === "object") {
        module.exports = factory(require("jquery"), require("underscore"));
    } else {
        root.Requester = factory(root.$, root._);
    }
}(this, function ($, _) {
    // this is where I defined my module implementation
    var Requester = { // ... };
    return Requester;
}));
```

- 在前端和后端都适用（“通用”因此得名）
- 与 CJS 或 AMD 不同，UMD 更像是一种配置多个模块系统的模式
- 当使用 Rollup/Webpack 之类的打包器时，UMD 通常用作备用模块
- UMD 随处可见，通常在 **ESM 不起作用的情况下用作备用**

## Esmodule 跟 commonjs 区别

commonjs 是 nodejs 端模块化组织方式 esm 是浏览器端模块化组织方式

### commonjs

Node 应用由模块组成，采用 **CommonJS** 模块规范。每个文件就是一个模块，有自己的作用域。在一个文件里面定义的变量、函数、类，都是私有的，对其他文件不可见。在服务器端，模块的加载是**运行时**同步加载的；在浏览器端，模块需要提前编译打包处理。

#### 特点

- 所有代码都运行在模块作用域，不会污染全局作用域。
- 模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果。- 要想让模块再次运行，必须清除缓存。
- 模块加载的顺序，按照其在代码中出现的顺序。

#### 基本语法

- 暴露方式 `module.exports = val` or `exports.val = value` 或者

```js
function test(a, b) {
  return a + b;
}
exports.default = test;
```

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

输入的值是输出值的拷贝，一旦一个原始类型值值输出，模块内部的变化不会影响到改值，**原始类型的值会被缓存，除非输出的是方法**，才能得到内部的值

### esm

ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量

#### esm 执行步骤

当我们在使用模块开发时，其实就是在构建一张模块依赖关系图，当模块加载时，就会从入口文件开始，最终生成完整的模块实例图。

ESM 的执行可以分为三个步骤：

- **构建**: 确定从哪里下载该模块文件、下载并将所有的文件解析为模块记录

- **实例化**: 将模块记录转换为一个模块实例，为所有的模块分配内存空间，依照导出、导入语句把模块指向对应的内存地址。

- **运行**：运行代码，将内存空间填充

从上面实例化的过程可以看出，ESM 使用实时绑定的模式，导出和导入的模块都指向相同的内存地址，也就是值引用。而 CJS 采用的是值拷贝，即所有导出值都是拷贝值。

#### ES6 模块化语法

export 命令用于规定模块的对外接口，import 命令用于输入其他模块提供的功能。

### ES6 和 Commonjs 差异

- Commonjs 模块输出的是一个**值的拷贝**，esm 模块输出的是**值的引用**;

• CommonJS 模块输出的是值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。 • ES6 模块的运行机制与 CommonJS 不一样。JS 引擎对脚本静态分析的时候，遇到模块加载命令 import，就会生成一个只读引用。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。换句话说，ES6 的 import 有点像 Unix 系统的“符号连接”，原始值变了，import 加载的值也会跟着变。因此，ES6 模块是**动态引用**，并且不会缓存值，**模块里面的变量绑定其所在的模块**。

- CommonjS 模块是运行时加载，ES6 模块是编译时输出接口。

• 运行时加载: CommonJS 模块就是对象；即在输入时是先加载整个模块，生成一个对象，然后再从这个对象上面读取方法，这种加载称为“运行时加载”。

•编译时加载: ES6 模块不是对象，而是通过 export 命令**显式指定输出的代码**，import 时采用静态命令的形式。即在 import 时可以指定加载某个输出值，而不是加载整个模块，这种加载称为“编译时加载”。

CommonJS 加载的是一个对象（即 module.exports 属性），该对象只有在脚本运行完才会生成。而 _ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成_。

### 如何在 Nodejs 中使用 ESM

- 在 package.json 中配置 module(推荐)

```js
"type": "module",
"main": "src/index.js",
```

配置好以后就可以直接在项目中使用 ESM 模块化规范了

### 如何在 ESM 规范下使用 CommonJs 规范

导入**createRequire**从 module 模块(自带的)

```js
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
//获取PackgeJson文件信息
let pkgManifest = require(path.join(cwd(), 'package.json'));
```

### 如何调试 nodejs 环境下的代码

- vscode debugger
- chrome devtools

原理： JS 引擎会启动一个 webSocket 服务器等待调试 UI 客户端链接，一般是 vscode debugger 和 chrome devtools ,调试协议用的是 V8 debugger protocol

vscode debugger 的使用主要是在 .vscode/launch.json 里面添加调试配置。

具体可参考神光的[让你 nodejs 水平暴增的 debugger 技巧](https://juejin.cn/post/6981820158046109703#heading-1)

## babel

## koa/express 学习和使用

## ssr

## webpack/vite/rollup

## BFF(Backends For Frontends))

## 中间件

## 前端工程化历程

## npx 使用场景

- npx 提供了一种使用 node.js CLI 工具的新方式，运行 **npx XX** 时，npx 会按照 **node_modules/.bin** 目录 -> **系统环境变量 Path 配置** -> **远程库**的搜索顺序，自动地找到命令的正确引用，而无需知道确切的路径，也不需要在全局和用户路径中安装软件包

- 无需全局先安装命令即可运行命令，示例 **creact-react-app 创建 React 工程** 以及 babel 中的 **npx babel ./index.js --out-file build.ast.plugin.js** 通过 npx 执行时，如果命令不在本地环境下的 $path 中时，npx 会自动从 **npm 注册源**中拉取具有该名字的模块并安装调用它

```js
npx create-react-app my-test-app
```

- 区别 1.一个永久存在，一个临时安装，用完后删除 npm 他会在本地全局性的安装 create-react-app，这个包会存储在 node 目录下面去。以后创建 react 项目直接执行 create-react-app 命令就可以了。

npx 命令他会把 create-react-app 安装包临时安装上，等项目初始化完成以后，他就删除掉。

- 区别 2.npx 会帮你执行依赖包里的二进制文件
- 区别 3.npx 可以执行文件，但是 npm 不可以 npx 阔以指定 node 版本来运行 npm scripts：

```js
npx -p node@16 npm run build
```

再比如 npx http-server 可以一句话帮你开启一个静态服务器！（第一次运行会稍微慢一些）

```js
npx http-server
```

主要好处是

- **临时安装可执行依赖包**，不用全局安装，不用担心长期的污染。
- 可以执行依赖包中的命令，安装完成自动运行。
- 自动加载 node_modules 中依赖包，不用指定$PATH。
- 可以指定 node 版本、命令的版本，解决了不同项目使用不同版本的命令的问题。

## 参考

- [微服务/API 前端开发时代之 BFF 速学入门教程](https://mp.weixin.qq.com/s/zP-sWo6IiRUjMsLeTtRA_w)

- [前端模块化详解(完整版)](https://juejin.cn/post/6844903744518389768#heading-39)
