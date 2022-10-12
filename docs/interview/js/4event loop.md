---
title: event loop
order: 4
group:
  order: 1
  title: js Basic
  path: /interview/js
nav:
  order: 3
  title: 'interview'
  path: /interview
---

我们都知道，

- javascript 是一门单线程语言
- **Event Loop**是 js 的执行机制, 事件循环也是 js 实现异步的一种方式
- 只要主线程空了，就会去读取 "任务队列 task queue"，这就是 JavaScript 的运行机制
- js 单线程又是如何实现异步的呢? **通过事件循环**

JS 的执行机制是

- 首先判断 js 代码是同步还是异步,同步就进入主进程,异步就进入 **event table 事件注册表**
- 异步任务在 **event table** 中注册函数,当满足触发条件后,会推入 **event queue** 事件队列里，比如 setTimeout(fn, delay)中的 delay 后才会被推入 event queue
- 同步任务进入主线程后一直执行,直到主线程空闲时,才会去 **event queue** 中查看是否有可执行的异步任务,如果有就推入主进程中
- event queue 其实还分为 **mircoTask / macroTask**,微任务也是一个队列，但是微任务中的任务不是一个一个放入执行栈，而是当执行栈清空的时候会执行所有的微任务，同样是执行栈清空的时候，才会执行宏任务队列中的第一个宏任务

## 浏览器进程相关

### 浏览器多多进程架构

- 浏览器主进程(负责协调、主控，只有一个) 负责浏览器界面显示，与用户交互。如前进，后退等负责各个页面的管理，创建和销毁其他进程将 Renderer 进程得到的内存中的 Bitmap，绘制到用户界面上网络资源的管理，下载等
- 渲染进程(浏览器内核, Renderer 进程，内部是多线程的) 默认每个 Tab 页面一个进程，互不影响。主要作用为页面渲染，脚本执行，事件处理等
- GPU 进程最多一个，用于 3D 绘制等

- 第三方插件进程

### 浏览器多进程的优势

相比于单进程浏览器，多进程有如下优点：

- 避免单个 page crash 影响整个浏览器
- 避免第三方插件 crash 影响整个浏览器
- 多进程充分利用多核优势
- 方便使用沙盒模型隔离插件等进程，提高浏览器稳定性

### 渲染进程是多线程的

页面的渲染，JS 的执行，事件的循环，都在这个渲染进程内进行。接下来重点分析这个进程里的各个线程

- GUI 渲染线程 1.负责渲染浏览器界面，解析 HTML，CSS，构建 DOM 树和 RenderObject 树，布局和绘制等。 2.当界面需要重绘（Repaint）或由于某种操作引发回流(reflow)时，该线程就会执行 3.GUI 渲染线程与 JS 引擎线程是互斥的

- JS 引擎线程(天真的我以为这个等同于 GUI) 1.JS 内核，负责处理 Javascript 脚本程序。（例如 V8 引擎） 2.JS 引擎线程负责解析 Javascript 脚本，运行代码。 3.JS 引擎一直等待着任务队列中任务的到来，然后加以处理，一个 Tab 页（**renderer 进程**）中无论什么时候都只有**一个 JS 线程**在运行 JS 程序

- 事件触发线程 1.归属于浏览器而不是 JS 引擎，用来**控制事件循环**（可以理解，JS 引擎自己都忙不过来，需要浏览器另开线程协助） 2.当 JS 引擎执行代码块如 setTimeOut 时（也可来自浏览器内核的其他线程,如鼠标点击、AJAX 异步请求等），会将对应任务添加到事件线程中 3.当对应的事件符合触发条件被触发时，该线程会把事件添加到待处理队列的队尾，等待 JS 引擎的处理注意，由于 JS 的单线程关系，所以这些待处理队列中的事件都得排队等待 JS 引擎处理（**当 JS 引擎空闲时才会去执行**）

- 定时触发器线程传说中的 setInterval 与 setTimeout 所在线程浏览器定时计数器并不是由 JavaScript 引擎计数的,（因为 JavaScript 引擎是单线程的, 如果处于阻塞线程状态就会影响记计时的准确）因此通过单独线程来计时并触发定时（计时完毕后，添加到事件队列中，等待 JS 引擎空闲后执行）

- 异步 http 请求线程在 在连接后是通过浏览器新开一个线程请求将检测到状态变更时，如果设置有回调函数，异步线程就产生状态变更事件，将这个回调再放入事件队列中。再由 JavaScript 引擎执行。

## 进程和进程之间通信

如果自己打开任务管理器，然后打开一个浏览器，就可以看到：任务管理器中出现了两个进程（一个是主控进程，一个则是打开 Tab 页的渲染进程）， 然后在这前提下，看下整个的过程：(简化了很多)

- Browser 进程收到用户请求，首先需要获取页面内容（譬如通过网络下载资源），随后将该任务通过 **RendererHost** 接口传递给 Render 进程
- Renderer 进程的 Renderer 接口收到消息，简单解释后，交给渲染线程 renderer，然后开始渲染
- 渲染线程接收请求，加载网页并渲染网页，这其中可能需要 **Browser** 进程获取资源和需要 **GPU** 进程来帮助渲染
- 当然可能会有 JS 线程操作 DOM（这样可能会造成回流并重绘）
- 最后 Render 进程将结果传递给 Browser 进程
- Browser 进程接收到结果并将结果绘制出来

## 渲染进程中各线程之间的关系

### GUI 渲染线程与 JS 引擎线程互斥

由于 JavaScript 是可操纵 DOM 的，如果在修改这些元素属性同时渲染界面（即 JS 线程和 GUI 线程同时运行），那么渲染线程前后获得的元素数据就可能不一致了。

因此为了防止渲染出现不可预期的结果，浏览器设置 GUI 渲染线程与 JS 引擎为互斥的关系，当 JS 引擎执行时 GUI 线程会被挂起， GUI 更新则会被保存在一个队列中等到 JS 引擎线程空闲时立即被执行。

### JS 阻塞页面加载

从上述的互斥关系，可以推导出，JS 如果执行时间过长就会阻塞页面。

譬如，假设 JS 引擎正在进行巨量的计算，此时就算 GUI 有更新，也会被保存到队列中，等待 JS 引擎空闲后执行。然后，由于巨量计算，所以 JS 引擎很可能很久很久后才能空闲，自然会感觉到巨卡无比。

所以，要尽量避免 JS 执行时间过长，这样就会造成页面的渲染不连贯，导致页面渲染加载阻塞的感觉。

### WebWorker，JS 的多线程？

前文中有提到 JS 引擎是单线程的，而且 JS 执行时间过长会阻塞页面，那么 JS 就真的对 cpu 密集型计算无能为力么？

所以，后来 HTML5 中支持了 Web Worker。阔以这样理解：

- 创建 Worker 时，JS 引擎向浏览器申请开一个子线程（子线程是浏览器开的，完全受主线程控制，而且不能操作 DOM）
- JS 引擎线程与 worker 线程间通过特定的方式通信（**postMessage API**，需要通过序列化对象来与线程交互特定的数据）

## 浏览器渲染过程

### 浏览器输入 url，浏览器主进程接管，开一个**下载线程**，

然后进行 http 请求（略去 DNS 查询，IP 寻址等等操作），然后等待响应，获取内容，随后将内容通过**RendererHost**接口转交给 Renderer 进程

### 浏览器渲染流程开始

浏览器器内核拿到内容后，渲染大概可以划分成以下几个步骤：

- 解析 html 建立 dom 树(DOM Tree)
- 解析 css 构建 cssom 树(CSSOM Tree)
- 两者合并成 render 树
- 布局 render 树（Layout/reflow），负责各元素尺寸、位置的计算(重排/回流)，样式计算和布局定位
- 绘制 render 树（paint），绘制页面像素信息(重绘)，图层绘制
- 浏览器会将各层的信息发送给**GPU**，GPU 会将各层合成，显示在屏幕上，合成显示

在 CSS 属性改变时，重渲染会分为“回流”、“重绘”和“直接合成”三种情况，分别对应从“布局定位”/“图层绘制”/“合成显示”开始，再走一遍上面的流程。

元素的 CSS 具体发生什么改变，则决定属于上面哪种情况：

- 回流（又叫重排）：元素位置、大小发生变化导致其他节点联动，需要重新计算布局；
- 重绘：修改了一些不影响布局的属性，比如颜色；
- 直接合成：合成层的 transform、opacity 修改，只需要将多个图层再次合并，而后生成位图，最终展示到屏幕上；

### 普通图层和复合图层

浏览器渲染的图层一般包含两大类：**普通图层**以及**复合图层** 首先，普通文档流内可以理解为一个复合图层（这里称为默认复合层，里面不管添加多少元素，其实都是在同一个复合图层中）

其次，absolute 布局（fixed 也一样），虽然可以脱离普通文档流，但它仍然属于默认复合层。

然后，可以通过硬件加速的方式，声明一个新的复合图层，它会单独分配资源 （当然也会脱离普通文档流，这样一来，不管这个复合图层中怎么变化，也不会影响默认复合层里的回流重绘）

可以简单理解下：GPU 中，各个复合图层是单独绘制的，所以互不影响，这也是为什么某些场景硬件加速效果一级棒

### 如何变成复合图层（硬件加速）

将该元素变成一个复合图层，就是传说中的硬件加速技术

最常用的方式：**translate3d**、**translateZ**

- opacity 属性/过渡动画（需要动画执行的过程中才会创建合成层，动画没有开始或结束后元素还会回到之前的状态）
- will-chang 属性（这个比较偏僻），一般配合 opacity 与 translate 使用（而且经测试，除了上述可以引发硬件加速的属性外，其它属性并不会变成复合层），

## 从 Event Loop 谈 JS 的运行机制

## 事件循环进阶：macrotask 与 microtask

## 参考

- [JS 运行机制最全面的一次梳理](https://mp.weixin.qq.com/s/cJEMlXv0wPPXs5KV_0Smag)
- [图解搞懂 JavaScript 引擎 Event Loop](https://juejin.cn/post/6844903553031634952)