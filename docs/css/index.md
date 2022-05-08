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

## BFC， 介绍下 BFC、IFC、GFC 和 FFC

这块太重要了！！！

## 怎么让一个 div 水平垂直居中

## 第 57 题：分析比较 opacity: 0、visibility: hidden、display: none 优劣和适用场景。

## 如何解决移动端 Retina 屏 1px 像素问题

## 介绍下重绘和回流（Repaint & Reflow），以及如何进行优化

[【面试系列一】如何回答如何理解重排和重绘](https://mp.weixin.qq.com/s/x7Z4kHxgtTK4GtemqyOy5Q)

> 跟关键渲染路径有什么关系？

关键渲染路径(Critical Rendering Path)是浏览器将 HTML，CSS 和 JavaScript 转换为屏幕上的像素所经历的步骤序列。优化关键渲染路径(CRP)可提高渲染性能。

大致步骤是这样：在解析 HTML 时会创建 DOM，HTML 可以请求 JavaScript，而 JavaScript 反过来，又可以更改 DOM。HTML 包含或请求样式，依次来构建 CSSOM。

浏览器引擎将 DOM/CSSOM 两者结合起来以创建 Render Tree (渲染树)，Layout(布局)确定页面上所有内容的大小和位置，确定布局后，将像素 Paint (绘制)到屏幕上。

优化关键渲染路径可以缩短首次渲染的时间。了解和优化关键渲染路径对于确保重排和重绘可以每秒 60 帧的速度进行

重排(Reflow)：元素的 **位置发生变动** 时发生重排，也叫回流。此时在 Layout 布局 阶段，**计算每一个元素在设备视口内的确切位置和大小**。当一个元素位置发生变化时，其父元素及其后边的元素位置都可能发生变化，代价极高。

重绘(Repaint): 元素的 **样式发生变动** ，但是位置没有改变。此时在关键渲染路径中的 **Paint** 阶段，**将渲染树中的每个节点转换成屏幕上的实际像素**，这一步通常称为绘制或栅格化。

## 涉及 css 的性能优化

- 减少 DOM 树渲染时间（譬如降低 HTML 层级、标签尽量语义化等等）
- 减少 CSSOM 树渲染时间（降低选择器层级等等）
- 减少 HTTP 请求次数及请求大小
- 将 css 放在页面开始位置
- 将 js 放在页面底部位置，并尽可能用 **defer** 或者 **async** 避免阻塞的 js 加载，确保 DOM 树生成完才会去加载 JS [defer/async](../interview/jsBasic/jsDeferAsync.md)
- 用 link 替代@import(why?@import 引入的 css 需要等到页面全部被加载完，延迟了 CSSOM 生成的时间，link 下载就加载即刻生成 CSSOM,)
- 如果页面 css 较少，尽量使用内嵌式
- 为了减少白屏时间，页面加载时先快速生成一个 DOM 树

## 已知如下代码，如何修改才能让图片宽度为 300px ？注意下面代码不可修改。

`<img src="1.jpg" style="width:480px!important;”>`

## 参考

- [面试题汇总](https://juejin.cn/post/6844903885488783374#heading-58)
