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
