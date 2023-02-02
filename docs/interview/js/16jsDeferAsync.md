---
title: async/defer/proload/prefetch
order: 16
group:
  order: 1
  title: js Basic
  path: /interview/js
nav:
  order: 3
  title: 'interview'
  path: /interview
---

### 浏览器渲染页面的过程

从耗时的角度，浏览器请求、加载、渲染一个页面，时间花在下面五件事情上：

- DNS 查询,通过 DNS 服务器查到域名对应的 IP 地址
- TCP 连接,即向目标 IP 服务器发送 TCP 链接
- HTTP 请求即响应
- 服务器响应
- 客户端渲染

主要说说第五个部分，即浏览器对内容的渲染，这一部分（渲染树构建、布局及绘制），又可以分为下面五个步骤：

- 处理 HTML 标记并构建 DOM 树。(dom)
- 处理 CSS 标记并构建 CSSOM 树。(cssom)
- 将 DOM 与 CSSOM 合并成一个渲染树。(render tree)
- 根据渲染树来布局，以计算每个节点的几何信息。(layout)
- 将各个节点绘制到屏幕上。(paint)

需要明白，这五个步骤并不一定一次性顺序完成。如果 DOM 或 CSSOM 被修改，以上过程需要重复执行，这样才能计算出哪些像素需要在屏幕上进行重新渲染。实际页面中，CSS 与 JavaScript 往往会多次修改 DOM 和 CSSOM，下面就来看看它们的影响方式。

### 阻塞渲染：CSS 与 JavaScript

现代浏览器总是并行加载资源。例如，当 HTML 解析器（HTML Parser）被脚本阻塞时，解析器虽然会停止构建 DOM，但仍会识别该脚本后面的资源，并进行预加载。同时，由于下面两点：

- 默认情况下，CSS 被视为阻塞渲染的资源，这意味着浏览器将不会渲染任何已处理的内容，直至 CSSOM 构建完毕。
- JavaScript 不仅可以读取和修改 DOM 属性，还可以读取和修改 CSSOM 属性。

存在阻塞的 CSS 资源时，**浏览器会延迟 JavaScript 的执行和 DOM 的解析**。另外：

- 当浏览器遇到一个 script 标记时，DOM 构建将暂停，直至脚本完成执行。
- JavaScript 可以查询和修改 DOM 与 CSSOM。
- CSSOM 构建时，JavaScript 执行将暂停，直至 CSSOM 就绪。所以，script 标签的位置很重要。实际使用时，可以遵循下面两个原则：

CSS 优先：引入顺序上，CSS 资源先于 JavaScript 资源。

**JavaScript 应尽量少影响 DOM 的构建**。

### 面试官问： 将 js 放在页面底部位置，并尽可能用 defer 或者 async 避免阻塞的 js 加载，或者问 为啥要将 js 放在页面底部位置

js 下载和解析是两个过程，默认情况下，js 下载和执行会阻塞 html 的解析当浏览器遇到 script 标签时，文档的解析将停止，并立即下载并执行脚本，脚本执行完毕后将继续解析文档。即 js 文件的下载和执行是与 html 文档解析同步进行，它会阻塞 html 文档的解析，如果控制得不好，在用户体验上就会造成一定程度的影响

划重点：

- js 下载和解析是两个过程,两个步骤
- **async/defer 异步加载脚步中的异步只是相当于 html 文档解析来说的，默认情况下都是同步的，同步也就会有阻塞的问题**

改变阻塞模式：defer 与 async

![defer vs async vs common](https://www.bythewayer.com/img/defer%20and%20async.webp)

## 正常脚本的加载和解析

同步脚本（标签中不含 async 或 defer): ` <script src="/src/a.js" charset="utf-8"></script>`

当 HTML 文档被解析时如果遇见（同步）脚本，则停止解析，先去加载脚本，然后执行，执行结束后继续解析 HTML 文档

### Async

async 脚本： `<script src="***.js" charset="utf-8" async></script>`

当 HTML 文档被解析时如果遇见 async 脚本，则在后台加载脚本，文档解析过程不中断。脚本加载完成后，文档停止解析，脚本执行，执行结束后文档继续解析.

> 还是会阻塞文档解析

注意点:

- 也是只适用于外联脚本，和 defer 保持一致
- 多个 async 脚本，下载和执行也是异步的，**不能保证执行顺序**
- 执行时机，一定是在**window.onload**之前执行，但不能确保是在 DOMContentLoaded 事件的执行先后顺序

### Defer

```js
<script src="***.js" charset="utf-8" defer></script>
```

当 HTML 文档被解析时如果遇见 defer 脚本，则在后台加载脚本，文档解析过程不中断，而等文档解析结束之后，defer 脚本执行

> 完全不会阻塞文档解析

注意点：

- 只适用于外联脚本(含有 src 属性)，不会对内联脚本有效
- 多个 defer 脚本按照下载的**顺序执行**，按序执行
- 执行时机是在**文档解析完成之后**，也就是 DOMContentLoaded 之前执行(整个 document 解析完毕且 defer-script 也加载完成之后（这两件事情的顺序无关），会执行所有由 defer-script 加载的 JavaScript 代码，然后触发 DOMContentLoaded 事件。这句话当中的 document 文档解析完毕后不一定会触发 DOMContentLoaded 事件，得等到 defer-script 执行完成之后)

> 文档解析完之后，执行所有的 defer 脚本，然后执行 DOMContentLoaded 事件

### Async 跟 defer 区别

一句话概括：

-async 是异步加载，加载完会立即执行，执行的时候会阻塞 html 文档解析。

- defer 也是异步加载脚本，等 Html 文档解析完成之后再去执行脚本

## 关键渲染路径 CRP

CRP: critical Render Path 指与当前用户操作有关的内容。例如用户刚刚打开一个页面，首屏的显示就是当前用户操作相关的内容，具体就是从浏览器收到 HTML、CSS 和 JavaScript 等资源并对其进行处理从而渲染出 Web 页面。

另一种大白话：关键渲染路径(Critical Rendering Path)是浏览器将 HTML，CSS 和 JavaScript 转换为屏幕上的像素所经历的步骤序列。**优化关键渲染路径(CRP)可提高渲染性能**。

## DOMContentLoaded 跟 load

DOMContentLoaded 事件本身不会等待 CSS 文件、图片、iframe 加载完成。

DOMContentLoaded 的触发时机是：加载完页面，解析完所有标签（不包括执行 CSS 和 JS），但是 JS 的执行，需要等待位于它前面的 CSS 加载（如果是外联的话）、执行完成，因为 JS 可能会依赖位于它前面的 CSS 计算出来的样式。所以：

- 如果页面中没有 script 标签，DOMContentLoaded 事件并没有等待 CSS 文件、图片加载完成。
- 如果页面中静态的写有 script 标签，DOMContentLoaded 事件需要等待 JS 执行完才触发。而且 script 标签中的 JS 需要等待位于其前面的 CSS 的加载完成。

### defer 与 DOMContentLoaded

结论： 先执行 defer 脚本 再触发 DOMContentLoaded,在 DOM、CSSOM 构建完毕，defer 脚本执行完成之后，DOMContentLoaded 事件触发。如果 script 标签中包含 defer，那么这一块脚本将不会影响 HTML 文档的解析，而是等到 HTML 解析完成后才会执行。而 DOMContentLoaded 只有在 defer 脚本执行结束后才会被触发。 所以这意味着什么呢？HTML 文档解析不受影响，等 DOM 构建完成之后 defer 脚本执行，但脚本执行之前需要等待 CSSOM 构建完成。在 DOM、CSSOM 构建完毕，defer 脚本执行完成之后，DOMContentLoaded 事件触发。

### DOMContentLoaded 与 onLoad

当 HTML 文档解析完成就会触发 DOMContentLoaded，而所有资源加载完成之后，load 事件才会被触发。

> 肯定是先执行 DOMContentLoaded 事件，然后才执行 onLoad 事件

## Preload and Prefetch

### prefetch

```js
<link rel="prefetch" as="script" href="index.js">
```

prefetch 是利用浏览器的空闲时间，加载页面将来可能用到的资源的一种机制；通常可以用于加载其他页面（非首页）所需要的资源，以便加快后续页面的打开速度. 比如对于 A 页面中插入了这样的 link 标签:

```js
<link rel="prefetch" href="https://B.com/index.js" as="script">
```

这样浏览器会在 A 页面加载完毕之后去加载 B 这个域名下的资源，如果用户跳转到了 B 页面中，浏览器会直接使用预加载好的资源，从而提升 B 页面的加载速度。而相比 Preload， Prefetch 的浏览器兼容性不太乐观

### preload

对于一些比较重要的资源，我们可以通过 Preload 方式进行预加载，即在资源使用之前就进行加载，而不是在用到的时候才进行加载，这样可以使资源更早地到达浏览器。具体使用方式如下:

```js
<link rel="preload" as="script" href="index.js">
```

> 声明 href 和 as 属性，分别表示资源地址和资源类型

## 参考文档

- [异步加载 js 方式-async/defer](http://niaogege.cn/2021/04/10/%E5%89%8D%E7%AB%AF%E5%9F%BA%E7%A1%80-%E5%BC%82%E6%AD%A5%E5%8A%A0%E8%BD%BDjs%E6%96%B9%E5%BC%8F-async-defer/)
- [浏览器的渲染：过程与原理](https://zhuanlan.zhihu.com/p/29418126)
- [再谈 DOMContentLoaded 与渲染阻塞—分析 html 页面事件与资源加载](https://zhuanlan.zhihu.com/p/37144221)
- [你不知道的 DOMContentLoaded](https://zhuanlan.zhihu.com/p/25876048)
