---
title: 取消请求AbortController
order: 2
group:
  title: axios
  order: 0
  path: /read-code/axios
nav:
  order: 1
  title: 'read-code'
  path: /read-code
---

面试官：如何取消一个已经发出去的 xhr?

- xhr 如何取消请求
- fetch 中如何取消请求
- axios 中如何取消请求

## 普及一个 DOM API:[AbortController api](https://developer.mozilla.org/zh-CN/docs/Web/API/AbortController)

AbortController 接口表示一个控制器对象，允许你根据需要**中止一个或多个 Web** 请求。

你可以使用 **AbortController.abort** 构造函数创建一个新的 AbortController。使用 AbortSignal 对象可以完成与 DOM 请求的通信。

通过 AbortCtroller 创造的实例，具有两个属性

- signal 标记在 _fetch/ xhr_ 请求上的标记
- 实例含有 **abort()** 方法

我们先使用 AbortController() 构造函数创建一个控制器，然后使用 **AbortController.signal**属性获取其关联 AbortSignal 对象的引用。

当一个 fetch request 初始化，我们把 AbortSignal 作为一个选项传递到到请求对象（如下 { signal }）。这将 signal 和 controller 与这个 fetch request 相关联，然后允许我们通过调用 **AbortController.abort()** 中止请求

## xhr 中的取消请求：xhr.abort()

```js
function testAbort() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      console.log(xhr.response);
    }
  };
  xhr.send();
  xhr.abort();
}
```

如果该请求已被发出，XMLHttpRequest.abort() 方法将终止该请求。当一个请求被终止，它的 readyState 将被置为 **XMLHttpRequest.UNSENT** (0)，并且请求的 status 置为 0。

## fetch 中如何取消请求,使用 AbortController()

> AbortController 文档见 AbortSignal - MDN (opens new window)[https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal]，它不仅可以取消 Fetch 请求发送，同样也可以取消事件的监听(通过 addEventListener 的第三个参数 signal 控制)

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

[Axios Cancellation](https://axios-http.com/docs/cancellation) Axios 适配器有两种，分别是基于 dom 的 xhr 请求和 node 端原生的 http 请求(node 端的 http.js)，细看了下浏览器端的 xhr.js 中的取消请求，这里面有版本区别，目前官网上已建议**v0.22.0**之后，采用 **AbortController** 这种方式取消 axios 途径发出的 xhr 请求

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

v0.22.0 之前是通过**CancelToken**的两种方式取消，我猜是因为可取消的 **promises proposal** 方案被撤销了

### Before v0.22.0 第一种：axios.CancelToken.source();

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

### Before v0.22.0 第二种：传递可执行函数给 CancelToken 构造函数

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

首先用户侧需要传取消请求的一个配置项 cancelToken，初始化的时候，CancelToken 类会生成一个 cancelToken 实例，这个实例需要传一个执行函数，通过这个执行函数能得到当前 Promise 中的 resolve,也就是暴露给用户侧的

```js
cancel();
```

只用当用户侧手动取消了请求，才会执行到 xhr 里的取消请求,也就是利用 Promise 的 then 来取消用户侧发的 xhr,

```js
if (config && config.cancelToken) {
  // 只有resolved的时候才能取消请求
  // 相当于new CancelToken()
  config.cancelToken.promise.then(function onCanceled(res) {
    if (!xhr) return;
    xhr.abort();
    xhr = null;
  });
}
```

源码里则比这更复杂，因为可能存在多个取消请求，所以在收集 cancelToken 的时候，采用老套的发布订阅模式，什么时候订阅，什么时候发布呢

- 订阅初始化的时候订阅，也就是在得到配置的时候，生成 CancelToken 实例的时候订阅

```js
//  CancelToken
CancelToken.prototype.subscribe = function subscribe(listener) {
  if (this.reason) {
    listener(this.reason);
    return;
  }

  if (this._listeners) {
    this._listeners.push(listener);
  } else {
    this._listeners = [listener];
  }
};
// xhr.js

if (config.cancelToken || config.signal) {
  // Handle cancellation
  // eslint-disable-next-line func-names
  onCanceled = function (cancel) {
    if (!request) {
      return;
    }
    reject(!cancel || (cancel && cancel.type) ? new CanceledError() : cancel);
    request.abort();
    request = null;
  };

  config.cancelToken && config.cancelToken.subscribe(onCanceled); // 订阅

  if (config.signal) {
    config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
  }
}
```

什么时候触发订阅函数呢

```js
function CancelToken(executor) {
  var token = this;
  // eslint-disable-next-line func-names
  this.promise.then(function (cancel) {
    if (!token._listeners) return;
    var i;
    var l = token._listeners.length;
    console.log('BEFORE 执行监听函数');
    for (i = 0; i < l; i++) {
      token._listeners[i](cancel);
    }
    token._listeners = null;
  });
}
```

## 参考文档

- [Axios 取消请求你会，但是 Fetch 取消请求你就不会了吧？](https://mp.weixin.qq.com/s/vF04Kd3dCF3AiLk9dVnQow)
- [面试官：请手写一个带取消功能的延迟函数，axios 取消功能的原理是什么](https://mp.weixin.qq.com/s/d7fkvM2AA6ffjYfkwXLg9A)
