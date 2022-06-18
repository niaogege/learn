---
title: 初识axios
order: 0
group:
  title: axios
  order: 0
  path: /read-code/axios
nav:
  order: 1
  title: 'read-code'
  path: /read-code
---

## 总览

看到过 2019 年某一位大佬封装过 ts 版本的 axios，说的比较通透，值得学习[使用 Typescript 重构 axios](https://www.cnblogs.com/wangjiachen666/p/11234163.html) 使用 axios -> 封装实用的拦截器 -> 手写乞丐版 axios

> 202105 面试的时候取消请求如何取消，底层原理是啥

- axios(config)和 axios.get()或 axios.post 有上什么区别呢？

都是调用 Axios.prototype.request,写法上的不同

- 如何对一个请求进行取消,源码是怎么封装的

- 适配器是啥，axios 两种适配器分别有啥用

- 手写一个乞丐版的 axios

> 任何东西都是从使用开始，逐渐加深了解，不然你去看源码看个寂寞

- 源码里封装的 tool

### axios 值得借鉴的地方

- 处理多个拦截器时采用队列的数据+Promise 的链式调用

多个拦截器的时候如何保证，先是请求拦截器，然后说真正的请求，最后再是响应拦截器，如何保证顺序

- 发送请求函数的处理逻辑

在之前的章节中有提到过，axios 在处理发送请求的 dispatchRequest 函数时，没有当做一个特殊的函数来对待，而是采用一视同仁的方法，将其放在队列的中间位置，从而保证了队列处理的一致性，提高了代码的可阅读性。

- 适配器 Adapter 的处理逻辑

在 adapter 的处理逻辑中，axios 没有把 http 和 xhr 两个模块（一个用于 Node.js 发送请求，另一个则用于浏览器端发送请求）当成自身的模块直接在 dispatchRequest 中直接饮用，而是通过配置的方法在 default.js 文件中进行默认引入。这样既保证了两个模块间的低耦合性，同时又能够为今后用户需要自定义请求发送模块保留了余地。取消 HTTP 请求的处理逻辑

- 利用回调函数灵活暴露参数在取消 HTTP 请求的逻辑中，axios 巧妙的使用了一个 Promise 来作为触发器，将 resolve 函数通过 callback 中参数的形式传递到了外部。这样既能够保证内部逻辑的连贯性，也能够保证在需要进行取消请求时，不需要直接进行相关类的示例数据改动，最大程度上避免了侵入其他的模块。

## 参考

- [前端网红框架的插件机制全梳理（axios、koa、redux、vuex）](https://mp.weixin.qq.com/s/V9IrtLA4CW5jnUO-YKzXLg)
- [面试官不要再问我 axios 了？我能手写简易版的 axios](https://mp.weixin.qq.com/s/nmKU-Z1Ewc75HH0NxgvcCw)
- [如何实现一个 HTTP 请求库——axios 源码阅读与分析](https://mp.weixin.qq.com/s/6qcYQ-ak5aIWBfE26NfYig)

- [手写 axios](https://mp.weixin.qq.com/s/L3w5puhwFz38wjpCuCxxJg)
