---
title: css面试题
order: 0
group:
  order: 0
  title: css
  path: /interview/css
nav:
  order: 3
  title: 'interview'
  path: /interview
---

## 汇总

- 0.盒模型
- 1.flex
- 2.BFC
- 3.如何清除浮动
- 4.怎么让一个 div 水平垂直居中
- 5.分析比较 opacity: 0、visibility: hidden、display: none 优劣和适用场景
- 6.使用 css 实现无线循环的动画
- 7.如何解决移动端 Retina 屏 1px 像素问题
- 8.介绍下重绘和回流（Repaint & Reflow），以及如何进行优化
- 9.涉及 css 的性能优化
- 10.已知如下代码，如何修改才能让图片宽度为 300px ？注意下面代码不可修改。
- 11.说说 CSS 选择器以及这些选择器的优先级
- 12.link 和@import 区别
- 13.如何将文字超出元素的部分变成省略号（...）
- 14.伪元素和伪类的区别
- 15.position

## 盒模型

它描述了网页中的元素是如何被呈现和布局的。每个元素被看作一个矩形盒子，这个盒子由内容区域、内边距、边框和外边距组成。

- 标准盒模型：盒子总宽度计算公式为：width + padding + border + margin

box-sizing: content-box

- IE 怪异盒模型：盒子总宽度计算公式为： width + margin,这里的 width 包含内容区域、内边距和边框的宽度(width = content + padding + border) box-sizing: border-box

## [1.flex 相关](https://juejin.cn/post/7245898637779157052?searchId=20240303201006D84B025A45E38C950F5F#heading-10)

Flexbox 布局也叫弹性盒子布局。它决定了元素如何在页面上排列，使它们能在不同的屏幕尺寸和设备下可预测地展现出来，更简便、完整、响应式地实现各种页面布局。它的主要思想是使父元素能够调整子元素的宽度、高度、排列方式，从而更好的适应可用的布局空间。

采用 Flex 布局的元素，称为 Flex 容器，简称 容器， 它的所有**子元素**自动成为容器成员，称为 Flex 项目（flex item），简称"项目"。

容器默认存在两根轴: 水平的主轴（main axis）和垂直的交叉轴（cross axis）。主轴的开始位置（与边框的交叉点）叫做 main start，结束位置叫做 main end；交叉轴的开始位置叫做 cross start，结束位置叫做 cross end。项目默认沿主轴排列。单个项目占据的主轴空间叫做 main size，占据的交叉轴空间叫做 cross size。

### 容器属性

以下 6 个属性设置在容器上。

flex-direction flex-wrap flex-flow justify-content align-items align-content

### 项目属性

以下 6 个属性设置在项目上。

order flex-grow flex-shrink flex-basis flex align-self

### flex 属性常用用法

- flex: 1 代表什么

```css
flex-grow: 1;
flex-shrink: 1;
flex-basis: 0%;
```

- flex: auto 代表什么

```css
flex-grow: 1;
flex-shrink: 1;
flex-basis: auto;
```

- flex: 0 代表

```css
flex-grow: 0;
flex-shrink: 1;
flex-basis: 0%;
```

- flex-grow: 定义项目的**放大**比例，默认 0，即使存在剩余空间也不放大
- flex-shrink: 定义项目的**缩小**比例，默认 1，即如果空间不足该项目将缩小
- flex-basis: **在分配多余的空间之前，项目占据的主轴空间**，浏览器根据这个属性计算主轴是否有剩余空间，默认值 auto,即项目的本来大小

### flex 交叉轴上如何对齐

**align-content** 属性定义了**多根轴线**的对齐方式。如果项目只有一根轴线，该属性不起作用。 .box { align-content: flex-start | flex-end | center | space-between | space-around | stretch; }

> content-center => align-content:center

**align-items** 属性定义项目在交叉轴上如何对齐 .box { align-items: flex-start | flex-end | center | baseline | stretch; }

> items-center => align-items:center

**align-self**属性允许单个项目有与其他项目不一样的对齐方式，可覆盖 align-items 属性 .item { align-self: auto | flex-start | flex-end | center | baseline | stretch; }

> self-center => align-self:center

### flex 布局优缺点

## 2.BFC，介绍下 BFC、IFC、GFC 和 FFC

块级格式化上下文，是 web 页面盒模型布局里的 css 渲染模式，指一个独立的渲染区域或指一个**隔离的独立容器**。

> 这块太重要了！！！什么是 BFC,如何触发 BFC,Block Formate Context 块级格式化上下文,一个独立的渲染区域或指一个隔离的独立容器

> [之前的总结](https://segmentfault.com/n/1330000039381496?token=d77bb6fa735222585c3c098255ec65fe)

### 如何创建 BFC

- 浮动元素 float 除了 none 以外的值
- 定位元素,position(absolute, fixed)
- overflow 除了 **visible** 以外的值(hidden/scroll/auto)
- display 为下列其中一个(inline-block/table-cell/tabel-caption) / flex /gird
- html 就是属于一个 BFC
- 弹性元素（display 为 flex 或 inline-flex 元素的直接子元素）
- 网格元素（display 为 grid 或 inline-grid 元素的直接子元素）

### BFC 有哪些特点

- Box 垂直方向的距离由 margin 决定。属于同一个 BFC 的两个相邻 Box 的 margin 会发生重叠
- BFC 区域不会跟 Float 区域重叠
- 计算 BFC 高度时，浮动元素也参与其中
- BFC 就是页面的一个独立容器，容器里面的子元素不会影响外面的元素

### BFC 阔以解决的实际问题

- 不和浮动元素重叠 (BFC 的区域不会与 float box 重叠)
- 清除元素内部浮动 (计算 BFC 的高度时，浮动元素也参与计算)
- 防止垂直 margin 重叠 (Box 垂直方向的距离由 margin 决定。属于同一个 BFC 的两个相邻 Box 的 margin 会发生重叠)

### IFC

Inline Formate Context 行内格式化上下文

## 3.如何清除浮动

- 套路 1: 给浮动元素的父元素**添加高度**（扩展性不好）
- 套路 2: **clear:both**; 父级元素的最后一个子元素增加一个冗余元素，而且必须是块级元素，否则会无效

```html
<div class="parent">
  <div class="child"></div>
  <div class="child"></div>
  <div class="child"></div>
  <div style={{
    clear: 'both'
  }}></div>
</div>
```

- 伪元素清除浮动给浮动元素的父元素添加一个 clearFix class，然后给这个 class 添加一个：after 伪元素 ,实现元素末尾添加一个看不见的块元素来清理浮动。这是通用的清理浮动方案，推荐使用

```html
<div class="parent clearFix">
  <div class="child"></div>
  <div class="child"></div>
  <div class="child"></div>
</div>
```

```css
.clearFix {
  zoom: 1;
}
.clearfix: afetr {
  content: '';
  display: block;
  clear: both;
}
```

- 给父元素使用 overflow:hidden; 利用 BFC,这种方案让父容器形成了 BFC（块级格式上下文），而 BFC 可以包含浮动，通常用来**解决浮动父元素高度坍塌**的问题。 BFC 的主要特征:

- BFC 容器是一个隔离的容器，和其他元素互不干扰；所以我们可以用触发两个元素的 BFC 来解决垂直边距折叠问题。
- BFC 不会重叠浮动元素
- BFC 可以包含浮动,这可以清除浮动。

## 4.怎么让一个 div 水平垂直居中

```js
div {
  display: grid;
  place-items: center;
}
```

## 5.分析比较 opacity: 0、visibility: hidden、display: none 优劣和适用场景。

- visibility 设置 hidden 会隐藏元素，但是其位置还存在与页面文档流中，不会被删除，所以会触发浏览器渲染引擎的重绘
- display 设置了 none 属性会隐藏元素，且其位置也不会被保留下来，所以会触发浏览器渲染引擎的回流和重绘。
- opacity 会将元素设置为透明，但是其位置也在页面文档流中，不会被删除，所以会触发浏览器渲染引擎的重绘

## 6.使用 css 实现无线循环的动画

想要实现 CSS 动画的无限循环，其实主要就是要使用 **animation-iteration-count** 这个属性，将其设置为 **infinite**，动画就会一直循环播放

```html
<image class="anima" mode="widthFix" @click="nav" src="@/static/1_btn.png"></image>
```

```css
.anima {
  animation-name: likes; // 动画名称
  animation-direction: alternate; // 动画在奇数次（1、3、5...）正向播放，在偶数次（2、4、6...）反向播放。
  animation-timing-function: linear; // 动画执行方式，linear：匀速；ease：先慢再快后慢；ease-in：由慢速开始；ease-out：由慢速结束；ease-in-out：由慢速开始和结束；
  animation-delay: 0s; // 动画延迟时间
  animation-iteration-count: infinite; //  动画播放次数，infinite：一直播放
  animation-duration: 1s; // 动画完成时间
}

@keyframes likes {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(0.9);
  }
  50% {
    transform: scale(0.85);
  }
  75% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}
```

## 7.如何解决移动端 Retina 屏 1px 像素问题

## 8.介绍下重绘和回流（Repaint & Reflow），以及如何进行优化

[【面试系列一】如何回答如何理解重排和重绘](https://mp.weixin.qq.com/s/x7Z4kHxgtTK4GtemqyOy5Q)

> 跟关键渲染路径有什么关系？

**关键渲染路径**(Critical Rendering Path)是浏览器将 HTML，CSS 和 JavaScript 转换为屏幕上的像素所经历的步骤序列。优化关键渲染路径(CRP)可提高渲染性能。

大致步骤是这样：在解析 HTML 时会创建 DOM，HTML 可以请求 JavaScript，而 JavaScript 反过来，又可以更改 DOM。HTML 包含或请求样式，依次来构建 CSSOM。

浏览器引擎将 DOM/CSSOM 两者结合起来以创建 Render Tree (渲染树)，Layout(布局)确定页面上所有内容的大小和位置，确定布局后，将像素 Paint (绘制)到屏幕上。

优化关键渲染路径可以缩短首次渲染的时间。了解和优化关键渲染路径对于确保重排和重绘可以每秒 60 帧的速度进行

重排(Reflow)：元素的 **位置发生变动** 时发生重排，也叫回流。此时在 Layout 布局 阶段，**计算每一个元素在设备视口内的确切位置和大小**。当一个元素位置发生变化时，其父元素及其后边的元素位置都可能发生变化，代价极高。

重绘(Repaint): 元素的 **样式发生变动** ，但是位置没有改变。发生在关键渲染路径中的 **Paint** 阶段，**将渲染树中的每个节点转换成屏幕上的实际像素**，这一步通常称为绘制或栅格化。

## 9.涉及 css 的性能优化

- 减少 DOM 树渲染时间（譬如降低 HTML 层级、标签尽量语义化等等）
- 减少 CSSOM 树渲染时间（降低选择器层级等等）
- 减少 HTTP 请求次数及请求大小
- **将 css 放在页面开始位置**
- 将 js 放在页面底部位置，并尽可能用 **defer** 或者 **async** 避免阻塞的 js 加载，确保 DOM 树生成完才会去加载 JS [defer/async](../interview/jsBasic/jsDeferAsync.md)
- **用 link 替代@import**(why?@import 引入的 css 需要等到页面全部被加载完，延迟了 CSSOM 生成的时间，link 下载就加载即刻生成 CSSOM,)
- 如果页面 css 较少，尽量使用内嵌式
- 为了减少白屏时间，页面加载时先快速生成一个 DOM 树

## 10.已知如下代码，如何修改才能让图片宽度为 300px ？注意下面代码不可修改。

`<img src="1.jpg" style="width:480px!important;”>`

## 11.说说 CSS 选择器以及这些选择器的优先级

- !important
- 内联样式（1000）
- ID 选择器（0100）
- 类选择器/属性选择器(href/src/title/target) /伪类选择器（0010）hover
- 元素选择器(p/span)/伪元素选择器（0001）(:afrer/before)
- 关系选择器(兄弟 后代 A + B 紧邻组合)/通配符选择器（0000）

## 12.link 和@import 区别

- 从属关系区别：link 是 HTML 方式， @import 是 CSS 方式即 @import 是 CSS 提供的语法规则，只有导入样式表的作用；link 是 HTML 提供的标签，不仅可以加载 CSS 文件，还可以定义 RSS、rel 连接属性等。

- 加载顺序: css 资源加载时，link 并行加载，@import 浏览器必须下载 CSS 文件来发现导入的资源，然后在渲染之前发起另一个请求来下载它。@import 会降低渲染速度 (link 最大限度支持并行下载，@import 过多嵌套导致串行下载，出现 FOUC)

- 兼容性: 浏览器对 link 支持早于@import，link 作为标签不存在兼容性，@import 是 CSS2.1 才有的语法，故只可在 IE5+ 才能识别

- DOM 可控性区别，可以通过 JS 操作 DOM ，插入 link 标签来改变样式；由于 DOM 方法是基于文档的，无法使用@import 的方式插入样式

## 13.如何将文字超出元素的部分变成省略号（...）

- 单行超出

```css
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
```

- 多行超出

```css
.mul {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
```

## 14.伪元素和伪类的区别

伪元素: 用于创建一些不在文档树中的元素，并为其添加样式。比如说，我们可以通过:before 来在一个元素前增加一些文本，并为这些文本添加样式。虽然用户可以看到这些文本，但是这些文本实际上不在文档树中。

伪类: 用于给已有元素处于的某个状态时，为其添加对应的样式，这个状态是根据用户行为而动态变化的,比如：hover

## 15.Position

- static：无特殊定位，对象遵循正常文档流。**top，right，bottom，left 等属性不会被应用**。
- relative：对象遵循正常文档流，但将依据 top，right，bottom，left 等属性在**正常文档流中偏移位置**。而其层叠通过 z-index 属性定义。
- absolute：对象脱离正常文档流，使用 top，right，bottom，left 等属性进行绝对定位。**相当于最近一层定位不是 static 的父级**，如果父级没有定位，则相当于 html,而其层叠通过 z-index 属性定义。
- fixed：对象脱离正常文档流，使用 top，right，bottom，left 等属性以**窗口为参考点**进行定位，当出现滚动条时，对象不会随着滚动。而其层叠通过 z-index 属性定义。
- sticky：具体是类似 relative 和 fixed，在 viewport 视口滚动到阈值之前应用 relative，滚动到阈值之后应用 fixed 布局，由 top 决定。

## 参考

- [面试题汇总](https://juejin.cn/post/6844903885488783374#heading-58)
- [清除浮动](https://juejin.cn/post/6844903710980571149#heading-3)
