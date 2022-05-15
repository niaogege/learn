---
title: 异步加载Async/Defer
order: 3
group:
  order: 1
  title: js Basic
  path: /interview/js
nav:
  order: 3
  title: 'interview'
  path: /interview
---

问： 将 js 放在页面底部位置，并尽可能用 defer 或者 async 避免阻塞的 js 加载，或者问 为啥要将 js 放在页面底部位置

js 下载和解析是两个过程，默认情况下，js 下载和执行会阻塞 html 的解析当浏览器遇到 script 标签时，文档的解析将停止，并立即下载并执行脚本，脚本执行完毕后将继续解析文档。即 js 文件的下载和执行是与 html 文档解析同步进行，它会阻塞 html 文档的解析，如果控制得不好，在用户体验上就会造成一定程度的影响

划重点： async/defer 异步加载脚步中的异步只是相当于 html 文档解析来说的，默认情况下都是同步的，同步也就会有阻塞的问题

改变阻塞模式：defer 与 async

## 正常脚本的加载和解析

同步脚本（标签中不含 async 或 defer): ` <script src="***.js" charset="utf-8"></script>`

当 HTML 文档被解析时如果遇见（同步）脚本，则停止解析，先去加载脚本，然后执行，执行结束后继续解析 HTML 文档

## Async

async 脚本： `<script src="***.js" charset="utf-8" async></script>`

当 HTML 文档被解析时如果遇见 async 脚本，则在后台加载脚本，文档解析过程不中断。脚本加载完成后，文档停止解析，脚本执行，执行结束后文档继续解析.

## Defer

```js
<script src="***.js" charset="utf-8" defer></script>
```

当 HTML 文档被解析时如果遇见 defer 脚本，则在后台加载脚本，文档解析过程不中断，而等文档解析结束之后，defer 脚本执行

## 关键渲染路径

CRP: critical Render Path 指与当前用户操作有关的内容。例如用户刚刚打开一个页面，首屏的显示就是当前用户操作相关的内容，具体就是从浏览器收到 HTML、CSS 和 JavaScript 等资源并对其进行处理从而渲染出 Web 页面。

另一种大白话：关键渲染路径(Critical Rendering Path)是浏览器将 HTML，CSS 和 JavaScript 转换为屏幕上的像素所经历的步骤序列。优化关键渲染路径(CRP)可提高渲染性能。

## DOMContentLoaded 跟 load

DOMContentLoaded 事件本身不会等待 CSS 文件、图片、iframe 加载完成。

DOMContentLoaded 的触发时机是：加载完页面，解析完所有标签（不包括执行 CSS 和 JS），但是 JS 的执行，需要等待位于它前面的 CSS 加载（如果是外联的话）、执行完成，因为 JS 可能会依赖位于它前面的 CSS 计算出来的样式。所以：

- 如果页面中没有 script 标签，DOMContentLoaded 事件并没有等待 CSS 文件、图片加载完成。
- 如果页面中静态的写有 script 标签，DOMContentLoaded 事件需要等待 JS 执行完才触发。而且 script 标签中的 JS 需要等待位于其前面的 CSS 的加载完成。

### defer 与 DOMContentLoaded

结论： 先执行 defer 脚本 再触发 DOMContentLoaded,在 DOM、CSSOM 构建完毕，defer 脚本执行完成之后，DOMContentLoaded 事件触发。如果 script 标签中包含 defer，那么这一块脚本将不会影响 HTML 文档的解析，而是等到 HTML 解析完成后才会执行。而 DOMContentLoaded 只有在 defer 脚本执行结束后才会被触发。 所以这意味着什么呢？HTML 文档解析不受影响，等 DOM 构建完成之后 defer 脚本执行，但脚本执行之前需要等待 CSSOM 构建完成。在 DOM、CSSOM 构建完毕，defer 脚本执行完成之后，DOMContentLoaded 事件触发。

### DOMContentLoaded 与 onLoad

当 HTML 文档解析完成就会触发 DOMContentLoaded，而所有资源加载完成之后，load 事件才会被触发。

## 参考文档

- [异步加载 js 方式-async/defer](http://niaogege.cn/2021/04/10/%E5%89%8D%E7%AB%AF%E5%9F%BA%E7%A1%80-%E5%BC%82%E6%AD%A5%E5%8A%A0%E8%BD%BDjs%E6%96%B9%E5%BC%8F-async-defer/)
- [浏览器的渲染：过程与原理](https://zhuanlan.zhihu.com/p/29418126)
- [再谈 DOMContentLoaded 与渲染阻塞—分析 html 页面事件与资源加载](https://zhuanlan.zhihu.com/p/37144221)
- [你不知道的 DOMContentLoaded](https://zhuanlan.zhihu.com/p/25876048)
