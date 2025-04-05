/*
 * 19.反转链表
 * 20.手写Promise
 * 21.手写vue版render
 * 22.手写数字的千分位分割法
 * 23.实现一个 node 异步函数的 promisify
 * 24.封装一个类使对象可以被 for of 遍历
 * 25.删除链表一个节点
 * 26.手写async/await
 * 27.手写pipe/redux中的compose
 * 28.Promise.all/any/race/allSettled
 * 29.手写并发控制器!!!
 * 30.手写ajax
 * 31.手写jsonp
 */

Array.prototype.myMap = function (fn, context) {
  let arr = [];
  let len = this.length;
  for (let i = 0; i < len; i++) {
    // 必须确保i在数组里
    if (i in this) {
      arr[i] = fn.call(context, this[i], i, this);
    }
  }
  return arr;
};

Promise.prototype.myAll = function (arr) {
  return new Promise((resolve, reject) => {
    let ans = [];
    if (arr.length === 0) {
      resolve(ans);
      return;
    }
    for (let [index, item] of arr.entries()) {
      return Promise.resolve(item).then(
        (res) => {
          ans[index] = res;
          if (arr.length - 1 === index) {
            resolve(ans);
          }
        },
        (err) => {
          reject(err);
        },
      );
    }
  });
};

function all(arr) {
  return new Promise((resolve, reject) => {
    let res = [];
    if (arr.length == 0) {
      resolve(res);
    }
    let len = arr.length;
    arr.forEach((promise, index) => {
      Promise.resolve(promise).then((data) => {
        res[index] = data;
        len--;
        if (len == 0) {
          resolve(res);
        }
      }, reject);
    });
  });
}
// name:{{name}},age{{age}}
// data {name: 'cpp', }
function render(str, data) {
  let reg = /\{\{(\w+)\}\}/gi;
  if (reg.test(str)) {
    let key = reg.exec(str)[1];
    str = str.replace(reg, data[key]);
    return render(str, data);
  }
  return str;
}

function myBind(context) {
  if (typeof this !== 'function') {
    throw new Error('');
  }
  let self = this;
  let arg = Array.prototype.slice.call(arguments, 1);
  let bindFn = function () {
    let arg2 = Array.prototype.slice.call(arguments);
    return self.apply(this instanceof self ? this : context, [...arg, ...arg2]);
  };
  let bridgeFn = function () {};
  bridgeFn.prototype = this.prototype;
  bindFn.prototype = new bridgeFn();
  return bindFn;
}

// 1000 -> 1,000
function thsound(str) {
  return str.replace(/(?!^)(?=(\d{3})+$)/g, ',');
}
thsound('1000');
// return str.replace(/(?=(\d{3})+$)/g, ',');

fs.readFile('test.js', function (err, data) {
  if (!err) {
    console.log(data);
  } else {
    console.log(err);
  }
});
// 把回调函数转成Promise形式
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
function mockPromisify(fn) {
  return (...arg) => {
    new Promise((resolve, reject) => {
      arg.push((err, param) => {
        if (err) {
          reject(err);
        } else {
          resolve(param);
        }
      });
      fn.call(this, ...arg);
      // Reflect.apply(fn, this, arg);
      // (error, ...params) => {
      //   if (error) {
      //     reject(error);
      //   } else {
      //     arg.push(...params);
      //   }
      //   resolve(fn.apply(this, arg));
      // };
    });
  };
}
function promisify(func) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      const callback = (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      };
      func.call(this, ...args, callback);
    });
  };
}

mockPromisify();

function mockAsync(fn) {
  return (...arg) => {
    return new Promise((resolve, reject) => {
      let next = (...arg1) => {
        let val = fn.apply(this, arg1);
        let asynFn;
        try {
          [];
        } catch (e) {}
      };
      return next();
    });
  };
}

function mockAsync(fn) {
  return (...arg) => {
    var asyncFn = fn.apply(this, arg);
    return new Promise((resolve, reject) => {
      step('next');
      function step(key, ...param) {
        var genRes;
        try {
          genRes = asyncFn[key](...param);
        } catch (e) {
          reject(e);
        }
        const { value, done } = genRes;
        if (done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(
            (res) => {
              return step('next', res);
            },
            (err) => {
              step('throw', err);
            },
          );
        }
      }
    });
  };
}

var getData = () => new Promise((resolve) => setTimeout(() => resolve('data'), 1000));
var test = mockAsync(function* testG() {
  const data = yield getData();
  console.log('data1: ', data);
  const data2 = yield getData();
  console.log('data2: ', data2);
  return 'success';
});
test().then((res) => {
  console.log(res, 'cpp');
});

class MockIteror {
  constructor(obj) {
    this.length = Object.keys(obj).length;
    this.value = obj;
    this.index = 0;
  }
  [Symbol.iterator]() {
    return this;
  }
  next() {
    if (this.index < this.length) {
      return {
        value: this.value[this.index++],
        done: false,
      };
    } else {
      return {
        done: true,
        value: undefined,
      };
    }
  }
}

// 控制并发
function asyncPool(limit, arr, fn) {}

function mockPipe(fn) {}

const middleware = new Middleware();
// throw an error at first function
middleware.use((req, next) => {
  req.a = 1;
  throw new Error('sth wrong');
  // or `next(new Error('sth wrong'))`
});
// since error occurs, this is skipped
middleware.use((req, next) => {
  req.b = 2;
});
// since error occurs, this is skipped
middleware.use((req, next) => {
  console.log(req);
});
// since error occurs, this is called
middleware.use((error, req, next) => {
  console.log(error);
  console.log(req);
});
// Error: sth wrong
// {a: 1}
middleware.start({});

class Middleware {
  mds = [];
  /**
   * @param {MiddlewareFunc} func
   */
  use(func) {
    this.mds.push(func);
  }

  /**
   * @param {Request} req
   */
  start(req) {
    let self = this;
    return (function (error, ctx, next) {
      return dispatch(1);
      function dispatch(i) {
        let fn = self.mds[i];
        if (!fn) Promise.resolve();
        if (i == self.mds.length) return (fn = next);
        try {
          return Promise.resolve(fn(ctx, () => dispatch(i + 1)));
        } catch (e) {
          return Promise.reject('error');
        }
      }
    })();
  }
}

class Middleware {
  constructor() {
    this.cbs = [];
    this.errs = [];
  }
  use(func) {
    if (func.length === 2) {
      this.cbs.push(func);
    } else {
      this.errs.push(func);
    }
  }
  start(req) {
    let idx = 0;
    let errIdx = 0;
    let self = this;
    next();
    function next(error) {
      let args = [req, next];
      let func;
      if (error) {
        func = self.errs[errIdx++];
        args.unshift(error);
      } else {
        func = this.cbs[idex++];
      }
      try {
        func && func(...args);
      } catch (e) {
        nexr(e);
      }
    }
  }
}
class Middleware {
  constructor() {
    this.mds = [];
    this.rq = null;
  }
  use(func) {
    this.mds.push(func);
  }
  start(req) {
    this.req = req;
    this.next();
  }
  next = (err) => {
    const toExecute = this.mds.shift();
    try {
      if (toExecute.length == 2) {
        if (!err) {
          toExecute(this.req, this.next);
        }
        this.next(err);
      } else {
        toExecute(err, this.req, this.next);
      }
    } catch (e) {
      this.next(e);
    }
  };
}

// 1->2->3->4
// 4->3->2->1
function revertLink(node) {
  let pre = null;
  let cur = node;
  while (cur) {
    let next = cur.next;
    cur.next = pre;
    pre = cur;
    cur = next;
  }
  return pre;
}

function transform(str) {
  return str.replace(/(?!^)(?=(\d{3})+$)/gi, ',');
}
transform('1234');
