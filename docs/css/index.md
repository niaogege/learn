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

## 1.flex 相关

### 常用用法

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

- flex-grow: 定义项目的放大比例，默认 0，即使存在剩余空间也不放大
- flex-shrink: 定义项目的缩小比例，默认 1，即如果空间不足该项目将缩小
- flex-basis: 在分配多余的空间之前，项目占据的主轴空间，浏览器根据这个属性计算主轴是否有剩余空间，默认值 auto,即项目的本来大小

### flex 交叉轴上如何对齐

**align-content** 属性定义了**多根轴线**的对齐方式。如果项目只有一根轴线，该属性不起作用。 .box { align-content: flex-start | flex-end | center | space-between | space-around | stretch; }

> content-center => align-content:center

**align-items** 属性定义项目在交叉轴上如何对齐 .box { align-items: flex-start | flex-end | center | baseline | stretch; }

> items-center => align-items:center

**align-self**属性允许单个项目有与其他项目不一样的对齐方式，可覆盖 align-items 属性 .item { align-self: auto | flex-start | flex-end | center | baseline | stretch; }

> self-center => align-self:center

### flex 布局优缺点

## 2.BFC， 介绍下 BFC、IFC、GFC 和 FFC

块级格式化上下文，是 web 页面盒模型布局里的 css 渲染模式，指一个独立的渲染区域或指一个隔离的独立容器。

> 这块太重要了！！！什么是 BFC,如何触发 BFC,Block Formate Context 块级格式化上下文,一个独立的渲染区域或指一个隔离的独立容器

> [之前的总结](https://segmentfault.com/n/1330000039381496?token=d77bb6fa735222585c3c098255ec65fe)

### 如何创建 BFC

- 浮动元素 float 除了 none 以外的值
- 定位元素,position(absolute, fixed)
- overflow 除了 visible 以外的值(hidden/scroll/auto)
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

## 3.float 如何清除浮动

## 4.怎么让一个 div 水平垂直居中

```js
div {
  display: grid;
  place-items: center;
}
```

## 5.分析比较 opacity: 0、visibility: hidden、display: none 优劣和适用场景。

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

关键渲染路径(Critical Rendering Path)是浏览器将 HTML，CSS 和 JavaScript 转换为屏幕上的像素所经历的步骤序列。优化关键渲染路径(CRP)可提高渲染性能。

大致步骤是这样：在解析 HTML 时会创建 DOM，HTML 可以请求 JavaScript，而 JavaScript 反过来，又可以更改 DOM。HTML 包含或请求样式，依次来构建 CSSOM。

浏览器引擎将 DOM/CSSOM 两者结合起来以创建 Render Tree (渲染树)，Layout(布局)确定页面上所有内容的大小和位置，确定布局后，将像素 Paint (绘制)到屏幕上。

优化关键渲染路径可以缩短首次渲染的时间。了解和优化关键渲染路径对于确保重排和重绘可以每秒 60 帧的速度进行

重排(Reflow)：元素的 **位置发生变动** 时发生重排，也叫回流。此时在 Layout 布局 阶段，**计算每一个元素在设备视口内的确切位置和大小**。当一个元素位置发生变化时，其父元素及其后边的元素位置都可能发生变化，代价极高。

重绘(Repaint): 元素的 **样式发生变动** ，但是位置没有改变。此时在关键渲染路径中的 **Paint** 阶段，**将渲染树中的每个节点转换成屏幕上的实际像素**，这一步通常称为绘制或栅格化。

## 9.涉及 css 的性能优化

- 减少 DOM 树渲染时间（譬如降低 HTML 层级、标签尽量语义化等等）
- 减少 CSSOM 树渲染时间（降低选择器层级等等）
- 减少 HTTP 请求次数及请求大小
- 将 css 放在页面开始位置
- 将 js 放在页面底部位置，并尽可能用 **defer** 或者 **async** 避免阻塞的 js 加载，确保 DOM 树生成完才会去加载 JS [defer/async](../interview/jsBasic/jsDeferAsync.md)
- 用 link 替代@import(why?@import 引入的 css 需要等到页面全部被加载完，延迟了 CSSOM 生成的时间，link 下载就加载即刻生成 CSSOM,)
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

## 11.link 和@import 区别

## 参考

- [面试题汇总](https://juejin.cn/post/6844903885488783374#heading-58)
- [清除浮动](https://juejin.cn/post/6844903710980571149#heading-3)
