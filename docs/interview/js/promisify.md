---
title: Promisify手写
order: 5
group:
  order: 1
  title: js Basic
  path: /interview/js
nav:
  order: 3
  title: 'interview'
  path: /interview
---

面试官问： 实现一个 node 异步函数的 **promisify**

promisify 作用是把回调函数转成 promise 形式？

> 没太理解，具体业务场景是啥 0520 看下示例就明白了

```js
// 输入：
// 原有的callback调用
fs.readFile('test.js', function (err, data) {
  if (!err) {
    console.log(data);
  } else {
    console.log(err);
  }
});
// 输出：
// promisify后
var readFileAsync = promisify(fs.readFile);
readFileAsync('test.js').then(
  (data) => {
    console.log(data);
  },
  (err) => {
    console.log(err);
  },
);
```
