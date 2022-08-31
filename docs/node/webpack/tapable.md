---
title: tapable
order: 5
group:
  title: webpack
  order: 3
  path: /node/webpack
nav:
  order: 5
  title: 'node'
  path: /node
---

- [[源码解读] Webpack 插件架构深度讲解](https://mp.weixin.qq.com/s?__biz=Mzg3OTYwMjcxMA==&mid=2247483941&idx=1&sn=ce7597dfc8784e66d3c58f0e8df51f6b&chksm=cf00bf5cf877364a03e4aa688d971000edad1a63cacd0a6493a15b25d3cbbec53cc0f026e490&scene=178&cur_album_id=1856066636768722949#rd)
- [深入 Webpack: Tapable](https://juejin.cn/post/7018860885393276936#comment)
- [Webpack 插件架构 - Tapable](https://juejin.cn/post/7127626731275419661#heading-4)
- [手写 webpack tapable 源码，官方 tapable 的性能真的就一定是好的吗？](https://juejin.cn/post/7097881373754687525#comment)
- [webpack 系列之二 Tapable](https://juejin.cn/post/6844903750729990152)

webpack 基于 Tapable 实现了一套插件架构体系，它能够在特定时机触发钩子，并附带上足够的上下文信息。

Tapable 是 webpack 中插件能运行的基石，是 webpack 与开发者交流的话筒，增强了 webpack 基础功能。

Tapable 是一个发布订阅的事件系统，相对于 node 原生 events，Tapable 更关注于发布订阅中，订阅者的流程处理。

来看一下 webpack 官方示例

```js
const pluginName = 'ConsoleLogOnBuildWebpackPlugin';

class ConsoleLogOnBuildWebpackPlugin {
  apply(compiler) {
    compiler.hooks.run.tap(pluginName, (compilation) => {
      console.log('webpack 构建正在启动！');
    });
  }
}

module.exports = ConsoleLogOnBuildWebpackPlugin;
```

上面的示例代码中，我们订阅了 compiler 对象的 **run** 节点，在 webpack 流程运行到此处时，console.log 会被打印出来。

从 Tapable 的钩子的调用时机上，可以分为了两个大类，**同步和异步**钩子。 在异步钩子中，又分为串行和并行。

根据事件执行的**终止条件**的不同，由衍生出 **Bail/Waterfall/Loop** 类型(中断型，流水型和循环型)

而按照这些分类，在钩子的注册和调用上也有所不同。

钩子的订阅分为 tap、tapAsync、tapPromise。

钩子的发布分为 call、callAsync、promise。

> 对应于原生 events 中的 **on 和 emit**。

```js
const {
  SyncHook, // 同步
  SyncBailHook, // 同步熔断钩子
  SyncWaterfallHook, // 同步流水型钩子
  SyncLoopHook, // 同步循环钩子

  AsyncParallelHook, // 异步并行钩子
  AsyncParallelBailHook, // 异步并行中断钩子

  AsyncSeriesHook, // 异步串行钩子
  AsyncSeriesBailHook, // 异步串行中断钩子
  AsyncSeriesWaterfallHook, // 异步串行流水型钩子
  AsyncSeriesLoopHook, // 异步串行循环钩子
} = require('tapable');
```

[Tapable 钩子](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/269f6d1400bd43479ed96cb221c32210~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

### 同步 SyncHook

SyncHook 是一个普通的同步钩子，订阅后，在发布之后就会按顺序执行。

```js
const sh = new SyncHook(['name']);

sh.tap('one', (name) => {
  console.log(name, 1);
});
sh.tap('second', (name) => {
  console.log(name, 2);
});
sh.call('tapable');
// tapable 1
// tapable 2
```

伪代码如下

```js
class Hook {
  constructor() {
    this.taps = [];
  }
  tap(fn) {
    this.taps.push(fn);
  }
  call(done) {
    for (let i = 0; i < this.taps.length; i++) {
      const fn = this.taps[i];
      fn();
    }
    done();
  }
}

const hook = new Hook();
hook.tap(() => {
  console.log('one');
});
hook.tap(() => {
  console.log('two');
});
hook.call(() => {
  console.log('done');
});
// one
// two
// done
```

### 同步熔断钩子 SyncBailHook

在顺序执行的订阅者函数中，如果有一个订阅者函数返回了**非 undefined** 值， 则会中断后面的订阅者函数的执行， 直接到达 call 的回调函数。

```js
const { SyncBailHook } = require('tapable');
const sh = new SyncBailHook(['name']);

sh.tap('one', (name) => {
  console.log('one');
  return null;
});
sh.tap('two', (name) => {
  console.log('two');
});
sh.tap('three', (name) => {
  console.log('three');
});
sh.callAsync('tapable', (error) => {
  if (error) console.log(error);
  console.log('all done');
});

//two
//all done
```

伪代码如下

```js
// xxx 省略代码
function syncBailCall(done) {
  for (let i = 0; i < this.taps.length; i++) {
    const cb = this.taps[i];
    const res = cb();
    if (res !== undefined) {
      done();
      return res;
    }
  }
  done();
}
```

### 同步流水型钩子 SyncWaterfallHook

waterfall 的特点是将**前一个回调的返回值作为参数传入下一个回调中**，最终返回**最后一个回调**的返回值。伪代码表示如下：

```js
const { SyncWaterfallHook } = require('tapable');
const hook = new SyncWaterfallHook(['msg']);
hook.tap('fn1', (arg) => {
  return `${arg}, fn1`;
});
hook.tap('fn2', (arg) => {
  return `${arg}, fn2 cpp`;
});
console.log(hook.call('hello'));

// 运行结果：
// hello, fn1, fn2 cpp
```

伪代码如下

```js
callWaterfallHooks(done) {
  let init = 'initValue'
  for (let i = 0; i < this.taps.length; i ++) {
    const cb = this.taps[i]
    const res = cb(init)
    if(res !== undefined) {
      init = res
    }
  }
  done(init)
}
```

使用上，SyncWaterfallHook 钩子有一些注意事项：

- 初始化时必须提供参数，例如上例 **new SyncWaterfallHook(["msg"])** 构造函数中必须传入参数 ["msg"] ，用于动态编译 call 的参数依赖，后面会讲到「动态编译」的细节。
- 发布调用 call 时，需要传入初始参数

### 同步循环钩子 SyncLoopHook

特点是循环执行，直到所有的回调函数返回 undefined,不过这里循环的维度是单个回调函数，例如有回调队列 [fn1, fn2, fn3] ，loop 钩子先执行 fn1 ，如果此时 fn1 返回了非 undefined 值，则继续执行 fn1 直到返回 undefined 后才向前推进执行 fn2 。

```js
const { SyncLoopHook } = require('tapable');
const hook = new SyncLoopHook(['name']);

let total = 0;
hook.tap('fn1', (arg) => {
  console.log('exec fn1.');
  return ++total === 3 ? undefined : 'fn1';
});
hook.tap('fn2', (arg) => {
  console.log('exec fn2.');
});
hook.call('hello');

// 运行结果：
// exec fn1.
// exec fn1.
// exec fn1.
// exec fn2.
```

伪代码：

```js
  callLoop(done) {
    for (let i = 0; i < this.taps.length; i++) {
      const fn = this.taps[i];
      const res = fn();
      while (res !== undefined) {
        done();
      }
    }
  }
```

### 异步风格的钩子

前面说的 Sync 开头的都是同步风格的钩子，优点是执行顺序相对简单，回调之前依次执行，缺点是不能在回调中执行异步操作。除了同步钩子外，Tapable 还提供了一系列 Async 开头的异步钩子，支持在回调函数中执行异步操作，逻辑比较复杂。

### 异步串行 AsyncSeriesHook

```js

```

### 异步并行 AsyncParallelHook

```js
const { AsyncParallelHook } = require('tapable');

const sh = new AsyncParallelHook(['name']);

console.time('AsyncParallelHook');

sh.tapAsync('one', (name, cb) => {
  console.log('one start');
  setTimeout(() => {
    console.log('one done ', name);
    cb(11);
  }, 4000);
});
sh.tapPromise('two', (name) => {
  return new Promise((resolve, reject) => {
    console.log('two start');
    setTimeout(() => {
      console.log('two done ', name);
      resolve();
    }, 1000);
  });
});
// 执行
sh.promise('tapable').then(() => {
  console.log('all done');
  console.timeEnd('AsyncParallelHook');
});

//one start
//two start
//two done  tapable
//one done  tapable
//all done
//AsyncParallelHook: 4.015s
```

并行钩子依次订阅，当发布的时候，会同时进行，当有一个报错或者全部执行完毕后，会执行统一的回调。需要注意的是，这里 cb 函数的第一个参数是 error，传入非真值将会直接终止
