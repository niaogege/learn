---
title: 如何设计请求/响应拦截器
order: 1
group:
  title: axios
  order: 0
  path: /node/axios
nav:
  order: 1
  title: 'node'
  path: /node
---

面试官问你，如何才能设计出像 **Axios** 这样牛皮的请求和响应拦截器? 能不能简单手写其中的原理

```js
// 适配器
var dispatch = (config) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('cpp', config);
    }, 1000);
  });
};
function request(config) {
  var promise;
  var interceptor = {
    request: [
      (config) => {
        console.log(config, 'request config');
        return config;
      },
      (err) => {
        console.log(err);
      },
    ],
    response: [
      (res) => {
        console.log(res, 'response res');
        return res;
      },
      (err) => {
        console.log(err);
      },
    ],
  };
  var chain = [dispatch, null];
  chain.unshift(...interceptor.request);
  chain = chain.concat(interceptor.response);
  promise = Promise.resolve(config);
  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }
  return promise;
}
request({
  name: 'CPP REQUEST',
  url: 'api/get/data',
}).then((res) => {
  console.log(res, 'LAST RES');
});
// 打印结果
// request config
// response res
// cpp LAST RES
```

之前一直不是特别能理解拦截器的核心实现原理，也就是下面这几段代码

```js
while (chain.length) {
  promise = promise.then(chain.shift(), chain.shift());
}
return promise;
```

突然某一个时刻想通了，其实这也是巧妙利用了 Promise 核心异步链式调用，把上面几行代码改成这样估计都能理解了

```js
var dispatch = (config) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('cpp', config);
    }, 1000);
  });
};
function request(config) {
  var promise;
  var interceptor = {
    request: [
      (config) => {
        console.log(config, 'request config');
        return config;
      },
      (err) => {
        console.log(err);
      },
    ],
    response: [
      (res) => {
        console.log(res, 'response res');
        return res;
      },
      (err) => {
        console.log(err);
      },
    ],
  };
  var chain = [dispatch, null];
  chain.unshift(...interceptor.request);
  chain = chain.concat(interceptor.response);
  promise = Promise.resolve(config);
  // while (chain.length) {
  //   promise = promise.then(chain.shift(), chain.shift());
  // }
  return promise
    .then(chain.shift(), chain.shift())
    .then(chain.shift(), chain.shift())
    .then(chain.shift(), chain.shift());
}
request({
  name: 'CPP REQUEST',
  url: 'XX s s',
}).then((res) => {
  console.log(res, 'LAST RES');
});
// 打印结果
// request config
// response res
// cpp LAST RES
```
