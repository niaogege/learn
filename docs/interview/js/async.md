---
title: 四种异步
order: 3
group:
  order: 1
  title: js Basic
  path: /interview/js
nav:
  order: 3
  title: 'interview'
  path: /interview
---

## info asynchronization 和 synchronization

如何理解同步和异步？

> 个人理解：一件一件事做，按续就班，每件事都是先后顺序来做，这个叫同步，sync,而异步则是，做一件事的同时为阔以做其他事，比如中午吃饭，我先把米煮了，煮米的过程我阔以择菜，这个煮米的过程就是异步的

所谓同步(synchronization)，简单来说，就是顺序执行，指的是同一时间只能做一件事情，只有目前正在执行的事情做完之后，才能做下一件事情。

同步操作的优点在于做任何事情都是依次执行，井然有序，不会存在大家同时抢一个资源的问题。同步操作的缺点在于会阻塞后续代码的执行。如果当前执行的任务需要花费很长的时间，那么后面的程序就只能一直等待。从而影响效率，对应到前端页面的展示来说，比如 css 解析会造成页面渲染的阻塞，大大影响用户体验。

所谓异步(Asynchronization)，指的是当前代码的执行不影响后面代码的执行。当程序运行到异步的代码时，会将该异步的代码作为任务放进任务队列，而不是推入主线程的调用栈。等主线程执行完之后，再去任务队列里执行对应的任务即可。因此，异步操作的优点就是：不会阻塞后续代码的执行。

### js 中异步的应用场景

开篇讲了同步和异步的概念，那么在 JS 中异步的应用场景有哪些呢？

- 定时任务：setTimeout、setInterval
- 网络请求：ajax 请求、动态创建 img 标签的加载
- 事件监听器：addEventListener (发布订阅模式)

> 对于 setTimeout、setInterval、addEventListener 这种异步场景，不需要我们手动实现异步，直接调用即可。但是对于 ajax 请求、node.js 中操作数据库这种异步，就需要我们自己来实现了~

## callback 回调函数

```js
function ajax({ url, success }) {
  const config = {
    url,
    type: 'GET',
    async: true,
    success,
  };
  let xhr = new XMLHttpRequest();
  xhr.open(config.type, config.url, config.async);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        let res = JSON.parse(xhr.responseText);
        success(res);
      }
    }
  };
  xhr.send();
}
// 使用
ajax({
  url: '/api/getData',
  success: function (res) {
    console.log(res);
  },
});
```

为了解决回调地狱的问题，提出了 Promise、async/await、generator 的概念。

## promise

```js
// 手写promise
class Promise {
  constructor(executor) {
    this.data = undefined;
    this.cbs = [];
    const resolve = (val) => {
      setTimeout(() => {
        this.data = val;
        this.cbs.forEach((fn) => fn(val));
      });
    };
    executor(resolve);
  }
  then(onfulfilled) {
    return new Promise((resolve, reject) => {
      this.cbs.push(() => {
        const res = onfulfilled(this.data);
        if (res instanceof Promise) {
          res.then(resolve);
        } else {
          resolve(res);
        }
      });
    });
  }
}
```

Promise 包含 pending、fulfilled、rejected 三种状态

- pending 指初始等待状态，初始化 promise 时的状态
- resolve 指已经解决，将 promise 状态设置为 fulfilled
- reject 指拒绝处理，将 promise 状态设置为 rejected
- promise 是生产者，通过 resolve 与 reject 函数告之结果
- promise 非常适合需要一定执行时间的异步任务
- 状态一旦改变将不可更改

> 如何理解 Promise 的异步链式调用 或者说怎么实现这种异步链式调用如何理解 Promise.then()里的异步嵌套

1.Promise 中的 then 是链式调用执行的，所以 then 也要返回 Promise 才能实现 2.状态只能改变一次，且一旦改变就不可更改，调用`resolve`方法是 status 会更改成`fulfilled`,调用内部的`reject`方法会更改成`rejected` 3.then 处理状态的改变，then(onfulfilled, onrejected)中的 onfulfilled 用来处理成功的状态，onrejected 用来处理错误的状态，而两个方法都是用户自定义传入的，then 里的阔以采用 setTimeout 来模拟异步宏任务 4.构造函数中的 cbs 保存 pending 状态时处理函数，当状态改变时循环调用,且将 then 方法的回调函数加入 cbs 数组中，用于异步执行 5. 想不通，then 里如果返回的是 Promise 类型，需要如何处理这种

```js
then((res) => {
  console.log('res', res);
  return new Promise((resolve) => {
    resolve('cpp');
  });
});
```

手写 Promise 里基本都是这种写法

```js
then(onFulfilled) {
  return new Promise((resolve) => {
    this.cbs.push(() => {
      var val = onFulfilled(this.value)
      if (val instanceof Promise) {
        val.then(resolve, reject) // 这句话怎么理解
      } else {
        resolve(val)
      }
    })
  })
}
```

```js
class PromiseTest {
  static PENDING = 'pending';
  static FULFILLED = 'fulfilled';
  static REJECTED = 'rejected';
  constructor(executor) {
    this.status = PromiseTest.PENDING;
    this.value = undefined;
    this.cbs = [];
    try {
      executor(this.resolve.bind(this), this.reject.bind(this));
    } catch (e) {
      this.reject(e);
    }
  }
  // pending异步
  resolve(value) {
    if (this.status === PromiseTest.PENDING) {
      setTimeout(() => {
        this.status = PromiseTest.FULFILLED;
        this.value = value;
        this.cbs.forEach((fn) => fn.onFulfilled(value));
      });
    }
  }
  // pending异步
  reject(value) {
    if (this.status === PromiseTest.PENDING) {
      setTimeout(() => {
        this.status = PromiseTest.REJECTED;
        this.value = value;
        this.cbs.forEach((fn) => fn.onRejected(value));
      });
    }
  }
  then(onFulfilled, onRejected) {
    if (typeof onFulfilled !== 'function') {
      onFulfilled = (val) => val;
    }
    if (typeof onRejected !== 'function') {
      onRejected = (res) => res;
    }
    let p1 = new PromiseTest((resolve, reject) => {
      if (this.status === PromiseTest.PENDING) {
        this.cbs.push({
          onFulfilled: (value) => {
            try {
              this.parse(p1, onFulfilled(value), resolve, reject);
            } catch (e) {
              reject(e);
            }
          },
          onRejected: (value) => {
            try {
              this.parse(p1, onFulfilled(value), resolve, reject);
            } catch (e) {
              reject(e);
            }
          },
        });
      }
      if (this.status === PromiseTest.FULFILLED) {
        setTimeout(() => {
          try {
            this.parse(p1, onFulfilled(this.value), resolve, reject);
          } catch (e) {
            let res = onRejected(e);
            reject(res);
          }
        });
      }
      if (this.status === PromiseTest.REJECTED) {
        setTimeout(() => {
          try {
            this.parse(p1, onFulfilled(this.value), resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      }
    });
    return p1;
  }
  parse(p1, res, resolve, reject) {
    if (p1 === res) {
      throw new TypeError('Chaining cycle detected for promise');
    }
    try {
      if (res instanceof PromiseTest) {
        res.then(resolve, reject);
      } else {
        resolve(res);
      }
    } catch (e) {
      reject(e);
    }
  }
  static resolve(val) {
    return new PromiseTest((resolve, reject) => {
      if (val instanceof PromiseTest) {
        val.then(resolve, reject);
      } else {
        resolve(val);
      }
    });
  }
  static reject(res) {
    return new PromiseTest((resolve, reject) => {
      reject(res);
    });
  }
  static all(arr = []) {
    let result = [];
    return new PromiseTest((resolve, reject) => {
      for (let [index, item] of arr.entries()) {
        PromiseTest.resolve(item).then(
          (res) => {
            result.push(res);
            if (index === arr.length - 1) {
              resolve(result);
            }
          },
          (err) => {
            reject(err);
          },
        );
      }
    });
  }
  static race(arr = []) {
    return new PromiseTest((resolve, reject) => {
      for (let [index, item] of arr.entries()) {
        PromiseTest.resolve(item).then(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          },
        );
      }
    });
  }
}
// demo
let p3 = new PromiseTest((resolve, reject) => {
  resolve('p1');
  console.log('start');
})
  .then(
    (res) => {
      console.log(res, 'then1');
      return 'Cpp then';
    },
    (err) => {
      console.log(err);
    },
  )
  .then(
    (res) => {
      console.log(res, 'then2');
      return 'CPP then2';
    },
    (err) => {
      console.log(err);
    },
  )
  .then((res) => {
    console.log(res, 'then3');
  });
```

### promise 异常捕获

```js
var p1 = new Promise((resolve, reject) => {
  reject('p1 is rejected');
});
p1.then((res) => {
  console.log('p1 then');
  return new Promise((resolve, reject) => {
    resolve('p1 return resolve');
  });
})
  .then((res) => {
    console.log('p1 then then:', res);
  })
  .catch((err) => {
    console.log('p1 catch:', err);
  });
```

## generator

## async/await

> async/await 的目的为了简化使用基于 promise 的 API 时所需的语法。async/await 的行为就好像搭配使用了生成器 generator 和 promise。

## 一些可能涉及到的问题

### 串行接口两个接口，如何保证第二个接口的正常发送

```js
var p1 = new Promise((resolve, rejece) => {
  reject('123');
});
var p2 = new Promise((resolve, reject) => {
  resolve('p2');
});
```

### 接口什么时候会 canceled

## 参考

- [js 四种异步解决方案](https://mp.weixin.qq.com/s/eHB1eDwEt93FzSmsX4BSzg)
- [mdn/async](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function)

- [后盾人手写 promise](https://doc.houdunren.com/js/17%20Promise%E6%A0%B8%E5%BF%83.html#%E8%B5%B7%E6%AD%A5%E6%9E%84%E5%BB%BA)
