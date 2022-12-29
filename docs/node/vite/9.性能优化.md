---
title: vite项目进行性能优化笔记
order: 9
group:
  title: vite
  order: 4
  path: /node/vite
nav:
  order: 5
  title: 'node'
  path: /node
---

主要是笔记，来源于[三元大佬文章](https://juejin.cn/book/7050063811973218341/section/7066612739912761352?enter_from=course_center)

对于项目的加载性能优化而言，常见的优化手段可以分为下面三类:

- 网络优化。包括 HTTP2、DNS 预解析、Preload、Prefetch 等手段。
- 资源优化。包括构建产物分析、资源压缩、产物拆包、按需加载等优化方式。
- 预渲染优化，本文主要介绍服务端渲染(SSR)和静态站点生成(SSG)两种手段。

## 网络优化

### Http2

http1.x 存在对头堵塞问题，同一个 TCP 管道中**同一时刻只能处理一个 HTTP 请求**，也就是说如果当前请求没有处理完，其它的请求都处于阻塞状态，另外浏览器对于同一域名下的**并发请求数量都有限制**，比如 Chrome 中只允许 6 个请求并发。因此，在 HTTP 1.1 协议中，队头阻塞和请求排队问题很容易成为网络层的性能瓶颈。而 HTTP 2 的诞生就是为了解决这些问题，它主要实现了如下的能力：

- 多路复用。将数据分为多个二进制帧，多个请求和响应的数据帧在**同一个 TCP 通道**进行传输，解决了之前的队头阻塞问题。而与此同时，在 HTTP2 协议下，浏览器不再有同域名的并发请求数量限制，因此请求排队问题也得到了解决。
- 服务端推送。可以让某些资源能够提前到达浏览器，比如对于一个 html 的请求，通过 HTTP 2 我们可以同时将相应的 js 和 css 资源推送到浏览器，省去了后续请求的开销。

### DNS 预解析

浏览器在向跨域的服务器发送请求时，首先会进行 DNS 解析，将服务器域名解析为对应的 IP 地址。我们通过 dns-prefetch 技术将这一过程提前，降低 DNS 解析的延迟时间，具体使用方式如下:

```js
<!-- href 为需要预解析的域名 -->
<link rel="dns-prefetch" href="https://fonts.googleapis.com/">
```

一般情况下 **dns-prefetch**会与**preconnect** 搭配使用，前者用来解析 DNS，而后者用来建立与服务器的连接，建立 TCP 通道及进行 TLS 握手，进一步降低请求延迟。使用方式如下所示:

```js
<link rel="preconnect" href="https://fonts.gstatic.com/" crossorigin>
<link rel="dns-prefetch" href="https://fonts.gstatic.com/">
```

### Preload/Prefetch

对于一些比较重要的资源，我们可以通过 Preload 方式进行预加载，即在资源使用之前就进行加载，而不是在用到的时候才进行加载，这样可以使资源更早地到达浏览器。具体使用方式如下:

```js
<link rel="preload" href="style.css" as="style">
<link rel="preload" href="main.js" as="script">
```

其中我们一般会声明 href 和 as 属性，分别表示资源地址和资源类型。Preload 的浏览器兼容性也比较好，目前 90% 以上的浏览器已经支持与普通 script 标签不同的是，对于原生 ESM 模块，浏览器提供了**modulepreload**来进行预加载:

```js
<link rel="modulepreload" href="/src/app.js" />
```

仅有 70% 左右的浏览器支持这个特性，不过在 Vite 中我们可以通过配置一键开启 modulepreload 的 Polyfill，从而在使所有支持原生 ESM 的浏览器(占比 90% 以上)都能使用该特性，配置方式如下:

```js
export default {
  build: {
    polyfillModulePreload: true,
  },
};
```

除了 Preload，Prefetch 也是一个比较常用的优化方式，它相当于告诉**浏览器空闲的时候去预加载其它页面的资源**，比如对于 A 页面中插入了这样的 link 标签:

```js
<link rel="prefetch" href="https://B.com/index.js" as="script">
```

这样浏览器会在 A 页面加载完毕之后去加载 B 这个域名下的资源，如果用户跳转到了 B 页面中，浏览器会直接使用预加载好的资源，从而提升 B 页面的加载速度。

## 资源优化

## 预渲染

预渲染是当今比较主流的优化手段，主要包括服务端渲染(SSR)和静态站点生成(SSG)这两种技术。
