---
title: 四种异步之Promise
order: 7
group:
  order: 1
  title: js Basic
  path: /interview/js
nav:
  order: 3
  title: 'interview'
  path: /interview
---

面试常考题，手写 Promise 以及相关 api

JavaScript 中存在很多异步操作,Promise 将异步操作队列化，按照期望的顺序执行，返回符合预期的结果。可以通过链式调用多个 Promise 达到我们的目的。

Promise 是一个拥有 then 函数的对象或者方法,

Promise 对象用于表示一个异步操作的最终完成 (或失败)及其结果值。

## Promise 核心理念

### 异步状态

Promise 理解为承诺，承诺一段时间后会给出结果，如果给出结果了就是成功状态，如果规定时间内没有给出结果就是失败状态

一个 promise 必须有一个 **then** 方法用于处理状态改变

### 状态说明

Promise 包含**pending、fulfilled、rejected**三种状态

pending 指初始等待状态，初始化 promise 时的状态 resolve 指已经解决，将 promise 状态设置为 fulfilled reject 指拒绝处理，将 promise 状态设置为 rejected promise 是生产者，通过 resolve 与 reject 函数告之结果 promise 非常适合需要一定执行时间的异步任务

- 状态一旦改变将不可更改，如果没有调用 resolve 或者 reject 方法 status 将会一直保持 pending 状态,当调用 resolve 或者 reject 方法将更改状态

```js
let resolveP = null;
var p1 = new Promise((resolve) => {
  resolveP = resolve;
  console.log(11);
});
console.log(p1);
```

- promise 创建时即立即执行即同步任务，then 会放在**异步微任务**中执行，需要等同步任务执行后才执行。

### then

一个 Promise 需要 then 函数访问 promise 结果，then 用于定义当 promise 状态发生改变时的处理

then 方法必须**返回** promise，用户返回或系统自动返回第一个函数在 **resolved** 状态时执行，即执行 resolve 时执行 then 第一个函数处理成功状态第二个函数在 **rejected** 状态时执行，即执行 reject 时执行第二个函数处理失败状态，该函数是可选的两个函数都接收 promise **传出**的值做为参数也可以使用 catch 来处理失败的状态如果 then 返回 promise ，下一个 then 会在当前 promise 状态改变后执行，支持链式调用

#### 语法说明

then 的语法如下，onFulfilled 函数处理 fulfilled 状态， onRejected 函数处理 rejected 状态

onFulfilled 或 onRejected 不是函数将被忽略两个函数只会被调用一次 onFulfilled 在 promise 执行成功时调用 onRejected 在 promise 执行拒绝时调用 `Promise.then(onFulfilled, onRejected)`

### 手写较为正常一点的 Promise

> 但始终有一句没能深刻理解 res.then(resolve, reject)

今天又来看这个知识点，想想为啥我写不出来 axios 这种牛逼的 http 有下列 API [Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)

```js
PromiseTest.prototype.then(onFulfilled, onRejected);
PromiseTest.prototype.finally(fn);
PromiseTest.prototype.catch(onRejected);
PromiseTest.resolve(value);
PromiseTest.reject(reason);
PromiseTest.all(iterable);
PromiseTest.any(iterable);
PromiseTest.race(iterable);
PromiseTest.allSettled(iterable);
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
    // 状态一旦改变就不能在变
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
    // 状态一旦改变就不能在变
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
      // 处理定时器 new Promise((resolve) => setTimeout(() => resolve('cpp')))
      // 需要一个队列保存构造函数中的同步函数
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
        // then方法是微任务 暂时由queueMicrotask代替
        queueMicrotask(() => {
          try {
            this.parse(p1, onFulfilled(this.value), resolve, reject);
          } catch (e) {
            let res = onRejected(e);
            reject(res);
          }
        });
      }
      if (this.status === PromiseTest.REJECTED) {
        queueMicrotask(() => {
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
  // 抽离成方法
  parse(p1, res, resolve, reject) {
    if (p1 === res) {
      throw new TypeError('Chaining cycle detected for promise');
    }
    try {
      // 如果返回值是Promise
      // 如果返回值是promise对象，返回值为成功，新promise就是成功
      // 如果返回值是promise对象，返回值为失败，新promise就是失败
      // 谁知道返回的promise是失败成功？只有then知道 则相当于Promise.then(resolve, reject)
      if (res instanceof PromiseTest) {
        res.then(resolve, reject);
      } else {
        // 返回值是非promise对象 新的promise对象就是成功 直接返回值
        resolve(res);
      }
    } catch (e) {
      reject(e);
    }
  }
  // catch() 方法返回一个Promise，并且处理拒绝的情况
  catch(onRejected) {
    return this.then(null, onRejected);
  }
  // Promise.resolve()
  // 实例化一个解决(fulFilled)的Promise
  static resolve(val) {
    return new PromiseTest((resolve, reject) => {
      if (val instanceof PromiseTest) {
        val.then(resolve, reject);
      } else {
        resolve(val);
      }
    });
  }
  // Promise.reject
  // 实例化一个失败的rejected的Promise 并抛出一个异步错误
  static reject(res) {
    return new PromiseTest((resolve, reject) => {
      reject(res);
    });
  }
  // Promise.all()
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
  // Promise.any() 如果有一个Promise 成功则返回
  // 如果都失败则rejected
  static any(arr = []) {
    return new PromiseTest((resolve, reject) => {
      const len = arr.length;
      if (len === 0) {
        return resolve([]);
      }
      for (let [index, item] of arr.entries()) {
        PromiseTest.resolve(item).then(
          (res) => {
            return resolve(res);
          },
          (err) => {
            if (len === index + 1) {
              reject(new TypeError('AggregateError: All promises were rejected'));
            }
          },
        );
      }
    });
  }
  // Promise.race()
  // 返回一个合成的Promise实例，返回最先解决的或者拒接的Promise实例返回值
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
  // Promise.allSettled
  // 返回一个合成的promise 不过是要等到所有的promise都已经处理完成，不管是失败还是成功，其返回一个对象数组，每个对象有对应的promise结果
  static allSettled(arr = []) {
    return new PromiseTest((resolve, reject) => {
      let len = arr.length;
      let res = [];
      if (len === 0) return resolve(res);
      for (let [index, item] of arr.entries()) {
        PromiseTest.resolve(item).then(
          (res) => {
            res[index] = {
              value: res,
              status: 'fulfilled',
            };
            if (index + 1 === len) {
              resolve(res);
            }
          },
          (err) => {
            res[index] = {
              status: 'rejected',
              reason: err,
            };
            if (index + 1 === len) {
              resolve(res);
            }
          },
        );
      }
    });
  }
  // the second try
  static allSettled2(arr = []) {
    let promiseArr = [...arr];
    return PromiseTest.all(
      promiseArr.map((item) => {
        Promise.resolve(item).then(
          (res) => {
            return {
              status: 'fulfilled',
              value: res,
            };
          },
          (err) => {
            return {
              status: 'rejected',
              reason: err,
            };
          },
        );
      }),
    );
  }
  // finally 原型上的
  // finally() 方法返回一个Promise。在promise结束时，无论结果是fulfilled或者是rejected，都会执行指定的回调函数。这为在Promise是否成功完成后都需要执行的代码提供了一种方式
  finally(cb) {
    return this.then(
      (val) => PromiseTest.resolve(cb()).then(() => val),
      (err) => PromiseTest.resolve(cb()).then(() => throw err),
    );
  }
}

if (typeof window.queueMicrotask !== 'function') {
  window.queueMicrotask = function (callback) {
    Promise.resolve()
      .then(callback)
      .catch((e) =>
        setTimeout(() => {
          throw e;
        }),
      );
  };
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

## 参考

- [后盾人](https://doc.houdunren.com/js/15%20Promise.html#promise)
- [看了就会，手写 Promise 原理，最通俗易懂的版本！！！](https://juejin.cn/post/6994594642280857630#heading-2)
- [童欧巴 Promise](https://juejin.cn/post/6907673648216145928#heading-19)
- [涛哥](https://segmentfault.com/a/1190000039275224)
- [如何中断 Promise？](https://juejin.cn/post/6847902216028848141)
- [Promise 练习题](https://mp.weixin.qq.com/s/xa-lvWw3VT4ABN07v8RomA)
