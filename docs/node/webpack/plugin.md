---
title: plugin
order: 2
group:
  title: webpack
  order: 3
  path: /node/webpack
nav:
  order: 5
  title: 'node'
  path: /node
---

- tapable 事件流
- tapable 用法
- tapable 如何跟 webpack 关联
- webpack 插件
- 何时触发插件逻辑
- compiler 跟 compilation 区别
- 事件发布订阅模式的插件结构

### 参考

- [干货！撸一个 webpack 插件(内含 tapable 详解+webpack 流程)](https://juejin.cn/post/6844903713312604173#heading-1)
- [Webpack 的插件机制 - Tapable](https://juejin.cn/post/6886404950507831309)

### 简介

webpack 由来已久，虽然之前都是练习 demo,但今天还是深刻理解下 webpack 插件机制

Webpack 可以将其理解是一种基于事件流的编程范例，一个插件合集。

而将这些插件控制在 webapck 事件流上的运行的就是 webpack 自己写的基础类**Tapable**。

### Tapable

**tapable** 库暴露了很多 Hook（钩子）类，为插件提供挂载的钩子。

Tapable 暴露出挂载**plugin**的方法，使我们能 将 plugin 控制在 webapack 事件流上运行。后面我们将看到核心的对象 Compiler、Compilation 等都是继承于 Tabable 类。

```js
const {
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  SyncLoopHook,
  AsyncParallelHook,
  AsyncParallelBailHook,
  AsyncSeriesHook,
  AsyncSeriesBailHook,
  AsyncSeriesWaterfallHook,
} = require('tapable');
```

上面是官方文档给出的 9 种钩子的类型，我们看命名就能大致推测他们的类型和区别，分成**同步、异步，瀑布流、串行、并行类型、循环类型**等等，

Tapable 提供的类型钩子分 Sync 和 Async 两大类，下面我们看看 webpack 中常用的几类钩子的使用特点与具体实现。

- SyncHook，同步钩子；
- SyncBailHook，同步熔断钩子；
- SyncWaterfallHook，同步瀑布流钩子；
- SyncLoopHook，同步循环钩子；
- AsyncSeriesHook，异步串行钩子；
- AsyncParallelHook，异步并行钩子。

waterfall 瀑布流是指 前一个回调的返回值会被作为参数传入下一个回调中；

bail 熔断是指 依次调用回调，若有任何一个回调返回非 undefined 值，则终止后续的调用；

loop 循环调用，直到所有回调函数都返回  undefined。

钩子的目的是为了显式地声明，触发监听事件时（call/callAsync/promise）传入的参数，以及订阅该钩子的 **callback** 函数所接受到的参数

#### new Hook 新建钩子

tapable 暴露出来的都是类方法，new 一个类方法获得我们需要的钩子。 class 接受数组参数 options，非必传。类方法会根据传参，接受同样数量的参数。

比如

```js
const hook = new SyncHook(['arg1', 'arg2', 'arg3']);
```

#### 使用 tap/tapAsync/tapPromise 绑定钩子

tapable 提供了同步和异步绑定钩子的方法，并且他们都有**绑定事件**和**执行事件**对应的方法。

- 同步： tap: 同步绑定 call: 同步执行

- 异步： tapAsync/tapPromise: 异步绑定 callAsync/promise: 执行

> tapAsync 跟 callAsync 对应，tapPromise 跟 promise 对应，区别是 tapAsync 绑定的时候需要用 callback 结束回调函数，callAsync/promise 不需要

#### call/callAsync 执行绑定事件

```js
const hook1 = new SyncHook(['cpp', 'wmh']);
hook1.tap('test', (arg1, arg2) => {
  console.log(arg1, arg2);
});

hook1.call();
```

### 完整的测试案例

tapable 如何与 webpack 关联的呢？需要看下测试案例

#### compiler.js

- 定义 webpack 的核心 **Compiler** 类
- 接受 options 里传入的 plugins
- 将 Compiler 作为参数传给 plugin
- 执行 run 函数，在编译的每个阶段，都触发执行相对应的钩子函数。

```js
const { SyncHook, AsyncParallelHook, AsyncSeriesHook } = require('tapable');

class Compiler {
  constructor(options) {
    this.hooks = {
      accelerate: new SyncHook(['newSpeed']),
      break: new SyncHook(),
      calculateRoutes: new AsyncParallelHook(['source', 'target', 'routesList']),
      asyncTest: new AsyncSeriesHook(['name']),
    };
    let plugins = options.plugins;
    if (plugins && plugins.length) {
      plugins.forEach((plugin) => plugin.apply(this));
    }
  }
  run() {
    console.time('cost');
    console.time('async');
    this.accelerate('hello');
    this.break();
    this.calculateRoutes('i', 'like', 'tapable');
    this.asyncTest('wmh');
  }
  accelerate(param) {
    this.hooks.accelerate.call(param);
  }
  break() {
    this.hooks.break.call();
  }
  calculateRoutes() {
    const args = Array.from(arguments);
    this.hooks.calculateRoutes.callAsync(...args, (err) => {
      console.timeEnd('cost');
      if (err) console.log(err);
    });
  }
  asyncTest() {
    const args = Array.from(arguments);
    this.hooks.asyncTest.callAsync(...args, (err) => {
      console.timeEnd('async');
      if (err) console.log(err);
    });
  }
}
module.exports = Compiler;
```

#### MyPlugin.js

- 引入上文定义的 Compiler
- 定义一个自己的插件。
- apply 方法接受 compiler 参数，compiler 引用下有各种时机的钩子，比如 break/accelerate/calculateRoutes 等等

> 插件必须提供 apply 方法给 WebPack 完成注册流程，插件在 apply 方法内做一些初始化操作并监听 WebPack 构建过程中的**生命周期事件**，**等待构建时生命周期事件的发布**

```js
const Compiler = require('../compiler');

class MyPlugin {
  constructor() {}
  apply(compiler) {
    compiler.hooks.break.tap('WarningLampPlugin', () => {
      console.log('WarningLampPlugin');
    });
    compiler.hooks.accelerate.tap('logPlugin', (speed) => {
      console.log('logPlugin', speed);
    });
    // 绑定异步钩子
    compiler.hooks.calculateRoutes.tapPromise(
      'cal tapPromise',
      (source, target, routesList, callback) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            console.log(`tapPromise to ${source}-${target}-${routesList}`);
            resolve();
          }, 2000);
        });
      },
    );
    // 绑定异步钩子 tapAsync
    compiler.hooks.asyncTest.tapAsync('asyncTest tapAsync', (name, cb) => {
      setTimeout(() => {
        console.log(('asyncTest:', name));
        cb();
      }, 1000);
    });
  }
}

const myPlugin = new MyPlugin();

const options = {
  plugins: [myPlugin],
};

let compiler = new Compiler(options);
compiler.run();
```

然后本地 node 执行下 **MyPlugin.js**,控制台输出:

```js
logPlugin hello
WarningLampPlugin
wmh
async: 1.006s
tapPromise to i-like-tapable
cost: 2.006s
```

### 如何写一个插件

假设有一个需求是说编译后的文件都去掉注释，如何拥抱 plugin 实现？

参照官网的插件实例

```js
// A JavaScript class.
class MyExampleWebpackPlugin {
  // Define `apply` as its prototype method which is supplied with compiler as its argument
  apply(compiler) {
    // Specify the event hook to attach to
    // 在emit阶段绑定异步执行钩子
    compiler.hooks.emit.tapAsync('MyExampleWebpackPlugin', (compilation, callback) => {
      console.log('This is an example plugin!');
      console.log(
        'Here’s the `compilation` object which represents a single build of assets:',
        compilation,
      );

      // Manipulate the build using the plugin API provided by webpack
      compilation.addModule(/* ... */);

      callback();
    });
  }
}
```

一个插件的步骤

- 一个 JavaScript 类函数
- 在函数原型 (prototype)中定义一个注入 compiler 对象的 apply 方法
- apply 函数中通过 **compiler** 插入对应的事件钩子(比如下文的**emit**),在钩子回调中拿到 compilation 对象
- 使用 **compilation** 操纵修改 webapack 内部实例数据
- 异步插件，数据处理完后使用 **callback** 回调

```js
class MyPlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    var reg =
      /("([^\\\"]*(\\.)?)*")|('([^\\\']*(\\.)?)*')|(\/{2,}.*?(\r|\n))|(\/\*(\n|.)*?\*\/)|(\/\*\*\*\*\*\*\/)/g;
    // 【编译完成】在生成资源并输出到目录之前
    compiler.hooks.emit.tap('CodeBeautify', (compilation) => {
      Object.keys(compilation.assets).forEach((data) => {
        let content = compilation.assets[data].source(); // 欲处理的文本
        content = content.replace(reg, function (word) {
          // 去除注释后的文本
          return /^\/{2,}/.test(word) || /^\/\*!/.test(word) || /^\/\*{3,}\//.test(word)
            ? ''
            : word;
        });
        compilation.assets[data] = {
          source() {
            return content;
          },
          size() {
            return content.length;
          },
        };
      });
    });
  }
}
module.exports = MyPlugin;
```

上述案例编写了一个 MyPlugin 的类，提供了一个 apply 方法，该方法中我们能获取到 webpack 执行全过程的单一的**compiler 实例**，通过 compiler 实例，我们在 webpack 的生命周期**emit 节点**tap 绑定了一个监听事件,也就是说当 Webpack 流程执行到 _【编译完成】在生成资源并输出到目录之前_，监听事件将会被触发，在事件中我们就阔以写自己内部的业务逻辑

### plugin 执行时机，

思考下，plugin 里的逻辑是何时触发的，以上文的 Hooks emit 为例

顺序： webpack options => new Compiler() => plugin apply() => compliler.run() => this.hooks.emit.callAsync()

```js
// 参考上文的案例
class Compiler {
  constructor(options) {
    this.hooks = {
      emit: new SyncHook(['newSpeed']),
      done: new SyncHook(),
      // 其他钩子
    };
    let plugins = options.plugins;
    if (plugins && plugins.length) {
      plugins.forEach((plugin) => plugin.apply(this));
    }
  }
  run() {
    this.emit();
    this.done();
  }
  emit() {
    this.hooks.emit.call('xx', () => {});
  }
  done() {
    this.hooks.done.callAsync('xx', (err) => {});
  }
}
class MyPlugin {
  apply(compiler) {}
}
const myPlugin = new MyPlugin();

const options = {
  plugins: [myPlugin],
};

let compiler = new Compiler(options);
compiler.run();
```

### compiler 和 compliation

从字面理解，compiler (v.) 表示运行时 (编译)，complication (n.) 表示运行后产物 (bundles)。

- compiler 对象在 WebPack 构建过程中代表着整个 WebPack 环境，包含上下文、项目配置信息、执行、监听、统计等等一系列的信息，提供给 loader 和插件使用；compiler 对象在编译过程只会在初始化的时候创建一次，而 complication 在每次文件变化的时候都会重新创建一次，一个 Compilation 对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息，一个 complication 代表了一次资源版本构建。

> 官网介绍 compiler: Compiler 对象代表了完整的 WebPack 环境配置。这个对象在启动 WebPack 时被一次性建立，并在所有可操作的设置中被配置，包括原始配置，loader 和插件。当在 WebPack 环境中应用一个插件时，插件将收到一个编译器对象的引用。可以使用它来访问 WebPack 的主环境。

- Compiler、Complication 对象都继承自 Tapable 对象；我们更多的是关注 webpack 通过 **compiler、complication** 对象暴露的钩子 (hook) 列举一些重要的，详细的参考：

#### compiler 暴露的 hooks

[Compiler Hooks](https://webpack.js.org/api/compiler-hooks/#hooks)

| 钩子        | 作用                                   | 类型  |
| ----------- | -------------------------------------- | ----- |
| run         | 在读取记录之前                         | async |
| compile     | 【开始编译】在创建新 compilation 之前  | sync  |
| compilation | compilation 创建完成                   | sync  |
| emit        | 【编译完成】在生成资源并输出到目录之前 | async |
| done        | 编译完成                               | sync  |

#### compilation 暴露的钩子

[Compilation Hooks](https://webpack.js.org/api/compilation-hooks/)

常用的有：

buildModule,normalModuleLoader,succeedModule,finishModules,seal,optimize,after-seal
