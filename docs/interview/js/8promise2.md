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

### 01.Promise 构造函数是同步执行的，promise.then 中的函数是异步执行的。

```js
const promise = new Promise((resolve, reject) => {
  console.log(1);
  resolve();
  console.log(2);
});
promise.then(() => {
  console.log(3);
});
console.log(4);
// 1 2 4 5
// 仔细看下问，输出打印顺序
function sleep(fn, delay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(fn());
    }, delay);
  });
}
function red() {
  console.log('red');
}
function yellow() {
  console.log('yellow');
}
function green() {
  console.log('green');
}

function main() {
  return new Promise((resolve) => {
    sleep(red, 2000);
    resolve();
  })
    .then(() => {
      return sleep(yellow, 1000);
    })
    .then(() => {
      return sleep(green, 3000);
    })
    .then(() => {
      main();
    });
}
main();
// yellow
// red
// green
```

### 02.理解 js 执行机制

```js
const first = () =>
  new Promise((resolve, reject) => {
    console.log(3);
    let p = new Promise((resolve, reject) => {
      console.log(7);
      setTimeout(() => {
        console.log(5);
        resolve(6);
      }, 0);
      resolve(1);
    });
    resolve(2);
    p.then((arg) => {
      console.log(arg);
    });
  });

first().then((arg) => {
  console.log(arg);
});
console.log(4);

// 3 7 4 1 2 5
```

解析：

这道题主要理解 js 执行机制。

第一轮事件循环，先执行宏任务，主 script，new Promise 立即执行，输出 3，执行 p 这个 new Promise 操作，输出 7，发现 setTimeout，将回调函数放入下一轮任务队列（Event Quene），p 的 then，暂且命名为 then1，放入微任务队列，且 first 也有 then，命名为 then2，放入微任务队列。执行 console.log(4),输出 4，宏任务执行结束。

再执行微任务，执行 then1,输出 1，执行 then2,输出 3.

第一轮事件循环结束，开始执行第二轮。第二轮事件循环先执行宏任务里面的，也就是 setTimeout 的回调，输出 5 ，但 resolve(6)不会生效，因为 p 的 Promise 状态一旦改变就不会再变化了。

### 03

```js
const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('success');
  }, 1000);
});
const promise2 = promise1.then(() => {
  throw new Error('error!!!');
});

console.log('promise1', promise1);
console.log('promise2', promise2);

setTimeout(() => {
  console.log('promise1', promise1);
  console.log('promise2', promise2);
}, 2000);
/**
promise1 Promise {<pending>}
promise2 Promise {<pending>}

Uncaught (in promise) Error: error!!!
at <anonymous>

promise1 Promise {<fulfilled>: 'success'}
promise2 Promise {<rejected>: Error: error!!!
at <anonymous>:7:9}
 */
```

### 04

```js
Promise.resolve(1)
  .then((res) => {
    console.log(res);
    return 2;
  })
  .catch((err) => {
    return 3;
  })
  .then((res) => {
    console.log(res);
  });
// 1 2
```

promise 可以链式调用。提起链式调用我们通常会想到通过 return this 实现，不过 Promise 并不是这样实现的。**promise 每次调用 .then 或者 .catch 都会返回一个新的 promise**，从而实现了链式调用。

### 05.

```js
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log('once');
    resolve('success');
  }, 1000);
});

const start = Date.now();
promise.then((res) => {
  console.log(res, Date.now() - start);
});
promise.then((res) => {
  console.log(res, Date.now() - start);
});
```

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

**Promise.then** 或者 **Promise.catch** 的参数期望是函数，传入非函数则会发生值穿透。

```js
Promise.resolve(1).then().then(2).then(22).then(Promise.resolve(3)).then(console.log);
// 1

Promise.resolve(22).then().then(Promise.reject(3)).then(console.log);
// 22
// Uncaught(in Promise) 3
```

### Nodejs 中事件循环中涉及到的 Promise

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

process.nextTick 和 promise.then 都属于 **microtask**，而 setImmediate 属于 宏任务 macrotask，在事件循环的 check 阶段执行。事件循环的每个阶段（macrotask）之间都会执行 microtask，事件循环的开始会先执行一次 microtask。

### 参考

- [Promise 练习题](https://mp.weixin.qq.com/s/xa-lvWw3VT4ABN07v8RomA)
