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
- [手写 webpack tapable 源码，官方 tapable 的性能真的就一定是好的吗？](https://juejin.cn/post/7097881373754687525#comment) webpack 基于 Tapable 实现了一套插件架构体系，它能够在特定时机触发钩子，并附带上足够的上下文信息。

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

上面的示例代码中，我们订阅了 compiler 对象的 run 节点，在 webpack 流程运行到此处时，console.log 会被打印出来。

Tapable 通过 tap 订阅，通过 call 来发布，对应于原生 events 中的 **on 和 emit**。
