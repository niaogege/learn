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

面试官问你，如何才能设计出像 Axios 这样的请求和响应拦截器? 能不能手写其中的原理

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
