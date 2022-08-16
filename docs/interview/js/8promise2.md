---
title: 四种异步之Promise(2)-面试题
order: 8
group:
  order: 1
  title: js Basic
  path: /interview/js
nav:
  order: 3
  title: 'interview'
  path: /interview
---

### 批量发请求

```js
function httpRequest(url, options) {
  // 真实的网络请求省略
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(url, '11');
    });
  });
}

class NetManager {
  constructor(concurrency) {
    this.max = concurrency;
    this.queue = [];
    this.len = 0;
  }
  request(url, data) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        url,
        data,
        resolve,
        reject,
      });
      this._processNext();
    });
  }
  _processNext(url, data) {
    if (this.len >= this.max) {
      return;
    }
    var obj = this.queue.shift();
    if (obj) {
      this.len++;
      const p = httpRequest(url, {});
      p.finally(() => {
        this.len--;
        this._processNext();
      });
      p.then(obj.resolve, obj.reject);
    }
  }
}
function queueGenerate() {
  var res = [];
  for (let i = 0; i < 10; i++) {
    var pN = new Promise((resolve) => {
      setTimeout(() => {
        resolve(i);
      }, 1000);
    });
    res.push(pN);
  }
  return res;
}
var instance = new NetManager(3);
instance.request(url, {});
```

### 如何优雅中断 Promise

- 中断调用链

```js
var p1 = new Promise((resolve) => {
  setTimeout(() => {
    resolve(1);
  }, 500);
});
p1.then((res) => res)
  .then(() => {}) // ？
  .catch(() => {
    console.log('catch');
  })
  .finally((res) => {
    console.log(res, 'finally');
  });
```

面试官：改变上面代码，不打印`finally`

```js
var p1 = new Promise((resolve) => {
  setTimeout(() => {
    resolve(1);
  }, 500);
});
p1.then((res) => res)
  .then(() => new Promise((resolve, reject) => {}))
  .catch(() => {
    console.log('catch');
  })
  .finally((res) => {
    console.log(res, 'finally');
  });
```

在 **then 语句里返回一个永远 pending 的 Promise 即可**

- 中断 Promise

注意这里是中断而不是终止，因为 Promise 无法终止

这个中断的意思是：在合适的时候，把 pending 状态的 promise 给 **reject** 掉。例如一个常见的应用场景就是希望给网络请求设置超时时间，一旦超时就就中断，我们这里用定时器模拟一个网络请求

```js
function timeWrapper(p, timeout = 2000) {
  const wait = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('中断');
    }, timeout);
  });
  return Promise.race([p, wait]);
}
// 随机模拟返回数据
var p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('得到服务端数据');
  }, 3000);
});
var res = timeWrapper(p1, 2000);
res
  .then((res) => {
    console.log(res);
  })
  .catch((e) => {
    console.warn(e);
  });
```

封装下，用户能手动中断请求，主要是要暴露出来阔以中断请求的 rejected

```js
function abortQuest(p) {
  var abort;
  const wait = new Promise((resolve, reject) => {
    abort = reject; // important
  });
  var res = Promise.race([p, wait]);
  res.abort = abort;
  return res;
}
// 使用
// 随机模拟返回数据
var p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('前端得到服务端数据');
  }, 3000);
});
var req = abortQuest(p1);
req.then((e) => console.log(e, 'req res')).catch((e) => console.log(e));
setTimeout(() => {
  req.abort('用户手动取消请求');
}, 2000);
console.log(req); // rejected
```

### Promise 值穿透

Promise.then 或者 Promise.catch 的参数期望是函数，传入非函数则会发生值穿透。

```js
Promise.resolve(1).then().then(2).then(22).then(Promise.resolve(3)).then(console.log);
// 1

Promise.resolve(22).then().then(Promise.reject(3)).then(console.log);
// 22
// Uncaught(in Promise) 3
```

### 事件循环中涉及到的 Promise

```js
process.nextTick(() => {
  console.log('nextTick');
});
Promise.resolve().then(() => {
  console.log('then');
});
setImmediate(() => {
  console.log('setImmediate');
});
console.log('end');
// console
// end
// nextTick
// then
// setImmediate
```

process.nextTick 和 promise.then 都属于 microtask，而 setImmediate 属于 宏任务 macrotask，在事件循环的 check 阶段执行。事件循环的每个阶段（macrotask）之间都会执行 microtask，事件循环的开始会先执行一次 microtask。
