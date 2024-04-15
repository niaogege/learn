---
title: 积少成多 面试经验
group:
  order: 0
  title: /interview/guide
nav:
  order: 3
  title: 'interview'
  path: /interview
---

> 20221229 开始积累面试经验！好久不背面试题，都快忘记了，记忆力真差

- [山月的面经](https://q.shanyue.tech/interview)

> 20230105 感觉在面试方面没有自信心了，更多的是忧虑/恐慌/无助

> 20231123 再来重温经典面试题

### 如何防御 XSS 攻击

- 输入的内容进行过滤或者转译
- csp,配置安全内容策略白名单，告诉浏览器**哪个域名**下自由受信任

### 简单说明 JS 运行机制

1.单线程: JS 引擎、事件触发器、定时触发器都是单线程的。 2.任务队列:JS 分为同步任务和异步任务，一旦执行栈中的所有同步任务执行完毕(此时 JS 引擎空闲)，系统就会读取任务队列，将可运行的异步任务添加到可执行栈中，开始执行。 3.eventloop(事件循环机制): 执行栈中的代码调用某些 api 时，会在事件队列中添加各种事件，当栈中的代码执行完毕后，会读取事件队列中的事件并执行回调的循环过程。

### 虚拟列表的实现方式，固定高度与不固定高度两者方式

### 如何分解 longtask

### 你确定多窗口之间 sessionStorage 不能共享状态吗？？？

sessionStorage 属性允许你访问一个，对应当前源的 session `Storage`[1] 对象。它与 `localStorage`[2] 相似，不同之处在于 localStorage 里面存储的数据没有过期时间设置，而存储在 sessionStorage 里面的数据在页面会话结束时会被清除。

- 页面会话在浏览器打开期间一直保持，并且重新加载或恢复页面仍会保持原来的页面会话。
- 在**新标签或窗口**打开一个页面时会复制**顶级浏览会话的上下文作为新会话的上下文**， 这点和 session cookies 的运行方式不同。
- 打开多个相同的 URL 的 Tabs 页面，会创建各自的 sessionStorage。
- 关闭对应浏览器标签或窗口，会清除对应的 sessionStorage。

对面试官：多窗口之间 sessionStorage 不可以共享状态！！！但是在某些特定场景下新开的页面会复制之前页面的 sessionStorage！！也就是在**新标签或窗口**打开一个页面时会复制**顶级浏览会话的上下文作为新会话的上下文**

### **preload** 跟 **prefetch** 区别，都应用在什么场景下

```js
<link rel="preload" href="style.css" as="style">
<link rel="preload" href="main.js" as="script">
```

proload 资源预加载，prefetch 在**空闲时加载可能会利用到的资源**. 与普通 script 标签不同的是，对于原生 ESM 模块，浏览器提供了 **modulepreload** 来进行预加载:

```js
<link rel='modulepreload' href='/src/app.js'>
```

### 描述下 tree-shaking,或者说 tree-shaking 摇晃的原理是什么？

Tree shaking（树摇）是一种代码优化技术，它依赖于 ES6 模块（ES6 modules）的静态结构。Tree shaking 的工作原理是通过**消除未使用的代码，从而减小最终的 bundle 大小。这个过程主要涉及到两个步骤：静态分析和代码生成**。

- 静态分析：在这个阶段，Tree shaking 会分析你的代码，找出哪些代码是被引用的，哪些是未被引用的。这个过程主要**依赖于 ES6 模块的静态特性**。例如，当你在代码中导入一个模块，如 `import { add } from './math'`，Tree shaking 会知道你只使用了 add 函数，而没有使用其他的函数。这是因为 ES6 模块是静态的，它的**导入和导出是在编译时**就已经确定了的。
- 代码生成：在这个阶段，Tree shaking 会生成一个新的 bundle，这个 bundle 只包含被引用的代码。例如，在上面的例子中，Tree shaking 会生成一个新的 bundle，这个 bundle 只包含 add 函数的代码，而不包含其他未被引用的函数的代码。需要注意的是，Tree shaking 只能消除死代码，也就是说，它只能消除那些没有被任何代码引用的代码。如果你的代码中存在一些动态的引用，那么 Tree shaking 可能无法正确地消除这些代码。例如，如果你的代码中存在一个动态的变量名，如 `var name = 'add'; var result = math[name]();，`那么 Tree shaking 无法知道 add 函数是否被引用，因此无法消除 add 函数的代码。

Tree shaking 的主要优点是它可以减小 bundle 的大小，从而**提高加载速度和运行效率**。然而，Tree shaking 也有一些缺点，例如，它可能会导致代码的复杂性增加，因为你需要确保你的代码是静态的，以便 Tree shaking 能够正确地工作。此外，Tree shaking 也可能会导致一些副作用，例如，如果你的代码中存在一些副作用，如修改全局变量或修改 DOM，那么 Tree shaking 可能会改变这些副作用的行为。

总的来说，Tree shaking 是一种非常有效的代码优化技术，它可以帮助你减小 bundle 的大小，提高加载速度和运行效率。然而，你需要确保你的代码是静态的，以便 Tree shaking 能够正确地工作。
