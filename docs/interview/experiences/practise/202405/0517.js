// 还好，不是绝症，天无绝人之路，都是自己的选择，怨不得别人，从现在开始默写到5月29日，一边默写，一边复习基础知识 当时就应该提出 换个地方，而不是坐以待毙，现在有点后悔，当时早点说就好了
/**
 * 1.apply/call
 * 2.bind
 * 3.new
 * 4.compose 洋葱模型实现
 * 5.instanceof 实现
 * 6.reduce/map 实现
 * 7.redux 中的 pipe 和 compose 组合
 * 8.深浅拷贝
 * 9.节流和防抖
 * 10.选择排序/插入排序
 * 11.LRU
 * 12.发布订阅模式
 * 13.手写 Promise/Promise.all/race/allSetted
 * 14.async/awit
 * 15.请求并发限制
 * 16.ajax
 * 17.jsonp
 * 18.手写虚拟 dom
 * 19.对象/数组去重
 * 20.大数相加
 */

function removeDup(arr) {}

function mockVirtualDom() {}

function mokckJsonp(url, cb) {}

function mockAjax(url, options) {}

async function limitRequest(arr, limit, fn) {
  let res = [];
  let queue = [];
  for (let item of arr) {
    let p1 = Promise.resolve(item).then((val) => fn(val));
    res.push(p1);
    if (arr.length >= limit) {
      let p2 = p1.then((val) => {
        const index = queue.indexOf(p2);
        return queue.splice(index, 1);
      });
      queue.push(p2);
      if (queue.length >= limit) {
        await Promise.race(queue);
      }
    }
  }
  return Promise.all(res);
}

function mockGenerator(fn) {
  return (...rest) => {
    const G = fn.apply(this, rest);
    return step('next');
    function step(key, val) {
      return new Promise((resolve, reject) => {
        let res = {};
        try {
          res = G[key](val);
        } catch (e) {
          reject(e);
        }
        const { done, value } = res;
        if (done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(
            (data) => {
              return step('next', data);
            },
            (err) => {
              return step('throw', err);
            },
          );
        }
      });
    }
  };
}
class Promise {
  constructor(excutor) {
    this.data = undefined;
    this.cbs = [];
    const resolve = (res) => {
      setTimeout(() => {
        this.data = res;
        this.cbs.forEach((cb) => cb(res));
      });
    };
    excutor(resolve);
  }
  then(onFulfilled) {
    return new Promise((resolve) => {
      this.cbs.push(() => {
        let res = onFulfilled(this.data);
        if (res instanceof Promise) {
          res.then(resolve);
        } else {
          resolve(res);
        }
      });
    });
  }
  static all(arr) {
    return new Promise((resolve, reject) => {
      let res = [];
      for (let [key, item] of Object.e(arr)) {
        Promise.resolve(item).then(
          (val) => {
            if (key + 1 == arr.length) {
              resolve(res);
            } else {
              res[key] = val;
            }
          },
          (err) => {
            reject(err);
          },
        );
      }
    });
  }
  // 最原始的
  static allSettled(arr) {
    return new Promise((resolve, reject) => {
      let res = [];
      for (let [key, item] of Object.e(arr)) {
        Promise.resolve(item).then(
          (val) => {
            if (key + 1 === arr.length) {
              resolve(arr);
            } else {
              res.push({
                value: val,
                status: 'fullfilled',
              });
            }
          },
          (err) => {
            if (key + 1 === arr.length) {
              resolve(arr);
            } else {
              res.push({
                reason: err,
                status: 'rejected',
              });
            }
          },
        );
      }
    });
  }
  static allSettled(arr) {
    return this.all(
      arr.map((item) => {
        Promise.resolve(item).then(
          (val) => {
            return {
              value: val,
              status: 'fullfilled',
            };
          },
          (err) => {
            return {
              reason: err,
              status: 'rejected',
            };
          },
        );
      }),
    );
  }
}

class EventEmitter {
  constructor() {
    this.events = {};
  }
  on(type, fn) {
    if (this.events && this.events[type].length) {
      this.events[type].push(fn);
    } else {
      this.events.type = [fn];
    }
  }
  emit(type, ...rest) {
    if (this.events && this.events[type] && this.events[type].length) {
      this.events[type].forEach((fn) => fn(...rest));
    }
  }
  off(type, fn) {
    if (this.events[type] && this.events[type].length) {
      this.events[type] = this.events[type].filter((rfn) => rfn != fn);
    }
  }
  once(type, fn) {
    let infn = (...rest) => {
      fn(...rest);
      this.off(type, infn);
    };
    this.on(type, infn);
  }
}

class LRU {
  constructor(limit) {
    this.limit = limit;
    this.cache = new Map();
  }
  get(key) {
    if (this.cache.has(key)) {
      let val = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, val);
    }
    return -1;
  }
  set(key, val) {
    let size = this.cache.size;
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (size >= this.limit) {
      let oldKey = this.cache.values().next().value;
      this.cache.delete(oldKey);
    }
    this.cache.set(key, val);
  }
}

// selectSort
function selectSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    let min = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[min] > arr[j]) {
        min = j;
      }
    }
    let tem = arr[min];
    arr[min] = arr[i];
    arr[i] = tem;
  }
  return arr;
}
selectSort([11, 22, 111, 2, 11, 44, 3]);
// inserSort
function insertSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let j = i;
    while (j > 0 && arr[j - 1] > arr[j]) {
      let tmp = arr[j];
      arr[j] = arr[j - 1];
      arr[j - 1] = tmp;
      j--;
    }
  }
  return arr;
}
insertSort([11, 22, 111, 2, 11, 44, 3]);
// 节流 频率变低 时间戳版
function throttle(fn, delay) {
  let pre = 0;
  return (...arg) => {
    let now = new Date().getTime();
    if (now - pre > delay) {
      fn.apply(this, arg);
      pre = now;
    }
  };
}

// 防抖
function debounce(fn, delay) {
  let timer = null;
  return (...arg) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, arg);
      timer = null;
    }, delay);
  };
}

function deepClone(obj) {
  if (typeof obj != 'object') {
    return obj;
  }
  let res = obj instanceof Array ? [] : {};
  for (let key in obj) {
    let item = obj[key];
    res[key] = typeof item == 'object' ? deepClone(item) : item;
  }
  return res;
}

function composeReduce(fns) {
  if (fns.length == 0) {
    return (arg) => arg;
  }
  if (fns.length == 1) {
    return fns[1];
  }
  return fns.reduce((a, b) => {
    return (...arg) => a(b(...arg));
  });
}

function pipeReduce(fns) {
  if (fns.length == 0) {
    return (arg) => arg;
  }
  if (fns.length == 1) {
    return fns[1];
  }
  return (...arg) => {
    return fns.reduce((a, b) => b(a), arg);
  };
}

Array.prototype.mockMap = function (fn, context) {
  let arr = this || [];
  let res = [];
  for (let i = 0; i < arr.length; i++) {
    res.push(fn.call(context, arr[i], i, arr));
  }
  return arr;
};

function mockInstanceof(l, r) {
  l = Object.getPrototypeOf(l);
  while (l) {
    if (l === r.prototype) {
      return true;
    }
    l = Object.getPrototypeOf(l);
  }
  return false;
}

function compose(middlewares) {
  return (ctx, next) => {
    return dispatch(0);
    function dispatch(i) {
      let fn = middlewares[i];
      if (!fn) {
        fn = next;
      }
      if (i >= middlewares.length) {
        return Promise.resolve();
      }
      try {
        return Promise.resolve(fn(ctx, () => dispatch(i + 1)));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  };
}

Function.prototype.apply = function (context, ...param) {
  let Obj = new Object(context) || window;
  let sys = Symbol('');
  Obj[sys] = this;
  let res = Obj[sys](...param);
  delete Obj[sys];
  return res;
};

Function.prototype.bind = function () {};

function mockNew(fn, ...param) {
  let obj = Object.create(fn.prototype);
  let res = fn.apply(obj, param);
  return typeof res == 'object' ? res : obj;
}
