---
title: 四种异步之Promise(2)-面试题并发限制
order: 10
group:
  order: 1
  title: js Basic
  path: /interview/js
nav:
  order: 3
  title: 'interview'
  path: /interview
---

并发限制，看了 N 篇文章，感觉都没说清楚并发限制的具体业务场景以及实现并发限制之后怎么在实践当中运用，结合自己实际编码过程中，我想限制并发请求目前有这几种业务场景

- 同一个请求方法，url 参数不同，比如几十张图片同时去请求
- 不同的请求方式以及逻辑处理，比如 p1,p2 这种，利用 Promise.all(promises)容易导致并发说超过浏览器并发限制
- 还有一种就是请求并发限制之后，不需要处理后续请求之后的结果

并发限制 不是指发完两个请求在继续发后面两个请求，这是理解上的偏差并发限制 2 个，主要是指同时执行的任务个数，一开始确实是同时发 2 个请求，但是这俩请求不一定能同时返回，如果有一个立马返回了，所以要最大限度利用并发的能力，一旦有一个任务完成(Promise.race()) 这时候立马从候补任务列表里添加，不断循环往复，直到所有的请求结束,所有请求结束后返回一个 Promise,

### 实现方案一：ES7 async/await + Promise.race() + Promise.all

输入：

```js
{
  max: 3; // 并发限制个数
  arr: []; // url列表
  cb: () => {}; // 执行回调函数
}
```

普通 es7 实现

```js

```

输出： Promise.all 保存所有 resolve 结果实现过程

```js
const asyncPool = async (max, arr, cb) => {
  var ret = []; // 存储所有的异步任务
  var executing = new Set(); //  正在执行的promise异步任务
  for (let item of arr) {
    var p = Promise.resolve().then(() => {
      cb(item);
    });
    ret.push(p); // 收集resolve值返回给调用方
    executing.add(p);
    const clean = () => {
      executing.delete(p);
    };
    p.then(clean).catch(clean);
    // 当前正在执行的异步任务大于等于并发的时候
    if (executing.size >= max) {
      await Promise.race(executing); // 较快的任务先执行
    }
  }
  return Promise.all(ret);
};
// 测试下
var request1 = (n) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
      console.log(n);
    }, n);
  });
};
var arr = [6000, 1000, 2000, 5000, 2000];
const dealPool = async () => {
  var p1 = await asyncPool(2, arr, request1);
};
dealPool();
```

#### 缺点

只能是同一个请求异步方法被传入，这种场景就限制了只能是参数的不同，其他都是业务逻辑都是一样的，假设有 2 个不同的异步请求，这种方式就不能很好的兼容

### es6 实现方式

```js
var timeOut = (i) =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      resolve(i);
      console.log(i, 'CPP');
    }, i),
  );
var arr = [6000, 1000, 2000, 5000, 2000];
dealPool2(2, arr, timeOut);
function dealPool2(max, arr, fn) {
  let len = arr.length;
  let ret = [];
  const executing = new Set();
  let i = 0;
  const enqueue = () => {
    // 循环终止
    if (i === len) {
      return Promise.resolve();
    }
    const item = arr[i++];
    const p = Promise.resolve(item).then(() => fn.call(null, item));
    ret.push(p);
    executing.add(p);
    const clean = () => {
      executing.delete(p);
    };
    p.then(clean).catch(clean);
    var r = Promise.resolve();
    if (max <= executing.size) {
      r = Promise.race(executing);
    }
    return r.then(() => enqueue());
  };
  return enqueue().then(() => Promise.all(ret));
}
```

### es9 方式

```js
async function* asyncPool(concurrency, iterable, iteratorFn) {
  const executing = new Set();
  async function consume() {
    const [promise, value] = await Promise.race(executing);
    executing.delete(promise);
    return value;
  }
  for (const item of iterable) {
    // Wrap iteratorFn() in an async fn to ensure we get a promise.
    // Then expose such promise, so it's possible to later reference and
    // remove it from the executing pool.
    const promise = (async () => await iteratorFn(item, iterable))().then((value) => [
      promise,
      value,
    ]);
    executing.add(promise);
    if (executing.size >= concurrency) {
      yield await consume();
    }
  }
  // 确保所有正在执行的异步任务都resolve调
  while (executing.size) {
    yield await consume();
  }
}
// 使用
var timeOut = (i) =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      resolve(i);
    }, i),
  );
var arr = [1000, 1000, 3000, 3000, 2000, 4000];
for await (const value of asyncPool(2, arr, timeOut)) {
  console.log(value, 'value-CPP');
}
```

### 参考

- [async-pool](https://github.com/rxaviers/async-pool)
- [JavaScript 中如何实现并发控制？](https://mp.weixin.qq.com/s/yWOPoef9ixuSBWApZQhjIg)

### 其他请求方式

```js
function dealLimitQuest(urls, max, cb) {
  const len = urls.length;
  const queue = [];
  const res = []; // 存储结果
  let i = 0;
  const handleRequest = (url) => {
    const req = fetch(url).then((res) => {
      let length = res.push(res);
      if (length < len && i + 1 < len) {
        queue.shift();
        handleRequest(urls[++i]);
      } else {
        if (typeof cb === 'function') {
          cb(res);
        }
      }
    });
    if (res.push(req) < max) {
      handleRequest(urls[++i]);
    }
  };
  handleRequest(urls[++i]);
}
const fetch = (url) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('123');
    }, 2000);
  });
```
