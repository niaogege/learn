---
title: 取消请求AbortController
order: 2
group:
  title: axios
  order: 0
  path: /node/axios
nav:
  order: 1
  title: 'node'
  path: /node
---

## 取消请求方式

面试官：如何取消一个已经发出去的 xhr?

### [AbortController api](https://developer.mozilla.org/zh-CN/docs/Web/API/AbortController])

AbortController 接口表示一个控制器对象，允许你根据需要**中止一个或多个 Web** 请求。

你可以使用 **AbortController.AbortController**() 构造函数创建一个新的 AbortController。使用 AbortSignal 对象可以完成与 DOM 请求的通信。

通过 AbortCtroller 创造的实例，具有两个属性

- signal 标记在 _fetch/ xhr_ 请求上的标记
- 实例含有 **abort()** 方法

我们先使用 AbortController() 构造函数创建一个控制器，然后使用 **AbortController.signal**属性获取其关联 AbortSignal 对象的引用。

当一个 fetch request 初始化，我们把 AbortSignal 作为一个选项传递到到请求对象（如下 { signal }）。这将 signal 和 controller 与这个 fetch request 相关联，然后允许我们通过调用 **AbortController.abort()** 中止请求，如下第二个事件监听函数。

```js
const controller = new AbortController();
let signal = controller.signal;
const downloadBtn = document.querySelector('.download');
const abortBtn = document.querySelector('.abort');

downloadBtn.addEventListener('click', fetchVideo);

abortBtn.addEventListener('click', function () {
  controller.abort();
  console.log('Download aborted');
});

function fetchVideo() {
  //...
  fetch(url, { signal })
    .then(function (response) {
      //...
    })
    .catch(function (e) {
      reports.textContent = 'Download error: ' + e.message;
    });
}
```

## axios 取消请求方式

[Axios Cancellation](https://axios-http.com/docs/cancellation) Axios 适配器有两种，分别是基于 dom 的 xhr 请求和 node 端原生的 http 请求(node 端的 http.js)，细看了下浏览器端的 xhr.js 中的取消请求，这里面有版本区别，目前官网上已建议**v0.22.0**之后，采用 AbortController 这种方式取消 axios 途径发出的 xhr 请求

```js
// 官网示例
const controller = new AbortController();

axios
  .get('/foo/bar', {
    signal: controller.signal,
  })
  .then(function (response) {
    //...
  });
// cancel the request
controller.abort();
```

v0.22.0 之前是通过**CancelToken**的两种方式取消，我猜是因为可取消的 promises proposal 方案被撤销了

### axios.CancelToken.source();

You can create a cancel token using the CancelToken.source factory as shown below:

```js
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios
  .get('/user/12345', {
    cancelToken: source.token,
  })
  .catch(function (thrown) {
    if (axios.isCancel(thrown)) {
      console.log('Request canceled', thrown.message);
    } else {
      // handle error
    }
  });
axios.post(
  '/user/12345',
  {
    name: 'new name',
  },
  {
    cancelToken: source.token,
  },
);
// cancel the request (the message parameter is optional)
source.cancel('Operation canceled by the user.');
```

### 传递可执行函数给 CancelToken 构造函数

You can also create a cancel token by passing an executor function to the CancelToken constructor:

```js
const CancelToken = axios.CancelToken;
let cancel;

axios.get('/user/12345', {
  cancelToken: new CancelToken(function executor(c) {
    // An executor function receives a cancel function as a parameter
    cancel = c;
  }),
});

// cancel the request
cancel();
```

> axios 源码比较清晰 可有着重研究学学

### CancelToken 是如何串联到 xhr 请求使之取消请求的

发布订阅模式

## 参考文档

- [Axios 取消请求你会，但是 Fetch 取消请求你就不会了吧？](https://mp.weixin.qq.com/s/vF04Kd3dCF3AiLk9dVnQow)
- [面试官：请手写一个带取消功能的延迟函数，axios 取消功能的原理是什么](https://mp.weixin.qq.com/s/d7fkvM2AA6ffjYfkwXLg9A)
