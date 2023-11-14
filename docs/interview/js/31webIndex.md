---
title: H5 APM系统性能指标
order: 31
group:
  order: 1
  title: js Basic
  path: /interview/js
nav:
  order: 3
  title: 'interview'
  path: /interview
---

[PerformanceNavigationTiming](https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceNavigationTiming/timestamp-diagram.svg)

## 常用指标说明

- [前端性能优化技术指标](https://www.developers.pub/article/1141491)

- FCP: First contentful paint 首次内容绘制 这个指标用于记录页面首次绘制**文本、图片、非空白 Canvas 或 SVG 的**时间。

- LCP: largest contentful Paint 最大内容绘制，用于记录视窗内**最大的元素绘制的时间**，该时间会随着页面渲染变化而变化，因为页面中的最大元素在渲染过程中可能会发生改变

- FID: first input delay 首次输入延迟，记录在 FCP 和 TTI 之间用户首次与页面交互时响应的延迟

- TTI: time to interactive 首次可交互时间，测量页面**所有资源加载成功**并能够可靠地快速响应用户输入的时间

- TBT: total block time 阻塞总时间，记录在 FCP 到 TTI 之间所有长任务的阻塞时间总和

- CLS: cumulative layout shift 累计布局偏移，**记录了页面上非预期的位移波动**

Time To First Byte (TTFB) ：**发出页面请求到接收到应答数据第一个字节所花费的时间**；

First Paint (FP) ：第一个像素对用户可见的时间。

First Contentful Paint (FCP)： 第一条内容可见所需的时间。

Largest Contentful Paint (LCP) ：加载页面主要内容所需的时间。

Time To Interactive (TTI)： 页面变为交互并可靠响应用户事件的时间。

关键指标：

- LCP 代表了页面的速度指标，虽然还存在其他的一些体现速度的指标，但是上文也说过 LCP 能体现的东西更多一些。一是指标实时更新，数据更精确，二是代表着页面最大元素的渲染时间，通常来说页面中最大元素的快速载入能让用户感觉性能还挺好。

- FID 代表了页面的交互体验指标，毕竟没有一个用户希望触发交互以后页面的反馈很迟缓，交互响应的快会让用户觉得网页挺流畅。

- CLS 代表了页面的稳定指标，尤其在手机上这个指标更为重要。因为手机屏幕挺小，CLS 值一大的话会让用户觉得页面体验做的很差。

## H5 可用性指标

### 白屏率

通过站内白屏检测，检测时长超过过 5s 的比例，代表页面打开发生白屏的几率,越低越好

### 秒开率

通过站内白屏检测，检测时长不超过过 1s 的比例，代表多少用户可以在 1s 内打开页面，越高越好

### 异常率

上报异常数量/PV，代表异常出现的频率，越低越好

播放异常率如果页面中存在播放功能，接入通用播放器后，则会有播放异常率指标播放异常数量/播放次数，表示用户播放遇到异常发生的几率，越低越好

## H5 性能指标

![H5 性能指标](https://imagev2.xmcdn.com/storages/f74b-audiofreehighqps/75/85/GMCoOSMI-veeAAK9zQJpmkZ5.png)

1.dns 解析时间(dns) dns 解析时间(dns)，反映了 dns 解析花费的时间，越短越好优化方案：dns 预解析

2.TCP 连接时间(tcp) tcp 连接时间(tcp)，反映了 tcp 连接花费的时间，越短越好

3.首字节时间(TTFB) TTFB（Time To First Byte）首字节时间，包含了发送请求到服务器，服务器处理请求并生成响应，服务器响应内容发送到浏览器的时间。只测试浏览器收到第一个字节的时间。这里的第一个字节不是内容，而是 HTTP 头的第一个字节。意义：可以相对的提供 DNS 查询，服务器响应，SSL 认证，重定向等花费时间的参考。

4.内容传输时间(contentTime) 内容传输时间(contentTime)，代表了 HTML 下载所用时间. 意义：可以一定程度上反映出 HTML 文件的大小。

5.DOM 解析完毕时间(domContentLoad) DOM 解析完毕时间(domContentLoad)，表明页面 domContentLoad 事件的时间(从页面开始加载至 domContentLoad 事件触发)

6.DOM 解析时间(domComplete) DOM 解析时间(domComplete)，表明页面 DOM 解析所花费的时间(HTML 下载完至 domContentLoad 事件被触发)

7.首次内容绘制 (FCP) 首次内容绘制 (FCP)标记的是浏览器渲染来自 DOM 第一位内容的时间点，该内容可能是文本、图像、SVG 甚至`<canvas>` 元素。

8.资源加载时间(resourceLoad) 资源加载时间(resourceLoad)，表示了页面 domContentLoad 事件触发之后至页面 onLoad 事件触发中加载外部资源(图片，CSS 等)所花费的时间

9.页面完全加载(load) 页面完全加载(load)，表示页面从开始加载至 onload 事件触发的时间，越短越好

## 如何计算 FCP 和 LCP

### 白屏时间计算 FCP

白屏时间指的是，从网页开始加载，到你网页第一个字节出现，这段时间称为 白屏时间，也叫 First Content Paint，也就是第一次内容渲染出来的时候，简称 FCP

### LCP

首屏时间指的是，从网页加载，到你网页第一屏渲染完成，这段时间称为 首屏时间，很多项目都是用 Larget Content Paint 来衡量，也就是最大内容渲染出来的时候，简称 LCP

### 区别

其实也就是 FCP、LCP 的区别

FCP： 第一个字节渲染出来的时间，这时候用户看不到主体网页结构 LCP： 最大内容渲染出来的时间，这时候用户已经能看到主体网页的结构了

### 如何计算

如何计算网页开始加载的时间呢？我们可以通过 `performance.timing.navigationStart`去获取到 网页开始加载的时间

```js
1. 计算白屏时间
const navigationStart = performance.timing.navigationStart;
let FCP = 0;
const observer = new PerformanceObserver(function (list, obj) {
  const entries = list.getEntries();
  entries.forEach((entry) => {
    if (entry.name === 'first-contentful-paint') {
      // 计算 FCP
      FCP = Math.max(entry.startTime - navigationStart, 0);
      console.log(FCP, 'fcp');
      // 计算完立即取消监听
      observer.disconnect();
    }
  });
});
observer.observe({
  type: 'paint', // paint
  buffered: true,
});
```

### 计算最大内容绘制时间 LCP

```js
const navigationStart = performance.timing.navigationStart;
let LCP = 0;
const observer = new PerformanceObserver(function (list, obj) {
  const entries = list.getEntries();
  entries.forEach((entry) => {
    LCP = Math.max(entry.startTime - navigationStart, 0);
    console.log(LCP, 'LCP');
    // 计算完立即取消监听
    observer.disconnect();
  });
});
observer.observe({
  type: 'largest-contentful-paint',
  buffered: true,
});
```

## 参考

- [如何计算 FCP 白屏时间和 LCP 首屏渲染，或者叫最大内容渲染](https://mp.weixin.qq.com/s/66_ssrmZpzeddm3FugiMFQ)
- [Navigation Timing API](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance_API/Navigation_timing)
