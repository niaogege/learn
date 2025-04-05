/*
 * 1.myCall/myApply
 * 2.mockNew
 * 3.LRU 最近最少更新 缓存淘汰策略
 * 4.compose 组合，koa洋葱模型
 * 5.myBind
 * 6.curry(参数固定和不固定)
 * 7.bigIntSum 大数相加
 * 8.deepClone 深浅拷贝
 * 9.16进制转 rgb or rgb 转 16 进制
 * 10.mockMap/mockFilter/push 数组方法重写
 * 11.promise 手写
 */

// rgb(255,255,255) => #ffffff
function rgbToHex(rgb) {
  var [_, r, g, b] = rgb.split(/\D+/gi);
  var toHex = (num) => {
    let str = (+num).toString(16);
    return str.length === 1 ? '0' + str : str;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
rgbToHex('rgb(255,255,255)');
// #ffffff -> rgb(255,255,255)
function hexToRgb(hex) {
  hex = hex.replace('#', '0x');
  let r = hex >> 16;
  let g = (hex >> 8) & 0xff;
  let b = hex & 0xff;
  return `rgb(${r},${g},${b})`;
}
hexToRgb('#ffffff');
// 调用该函数 传递参数列表 改变this指向
Function.prototype.myCall = function (context, ...params) {
  context = context || window;
  const sys = Symbol('myCall');
  context[sys] = this;
  var val = context[sys](...params);
  delete context[sys];
  return val;
};

// 返回一个新函数 传递参数列表 改变this 指向
Function.prototype.myBind = function (fn) {
  let arg = arguments.slice(1);
  let context = this;
  let protoFn = function () {
    let arg1 = [...arguments, ...arg];
    return typeof fn === '' ? context : [];
  };
  let bindFn = function () {};
  bindFn.prototype = protoFn;
  return new bindFn();
};

Function.prototype.myBind = function (context, ...rest) {
  let self = this;
  let arg = Array.prototype.slice.call(arguments, 1);
  let bridgeFn = function () {
    let arg1 = Array.prototype.slice.call(arguments);
    self.apply(this instanceof self ? this : context, arg.concat(arg1));
  };
  let tempFn = function () {};
  tempFn.prototype = this.prototype;
  bridgeFn.prototype = new tempFn();
  return bridgeFn;
};

Function.prototype.CppBind = function (context) {
  if (typeof this !== 'function') {
    throw new Error('');
  }
  var self = this;
  var args = Array.prototype.slice.call(arguments, 1);
  var fNop = function () {};
  var fBound = function () {
    var arg2 = Array.prototype.slice.call(arguments);
    self.apply(this instanceof self ? this : context, args.concat(arg2));
  };
  fNop.prototype = this.prototype;
  fBound.prototype = new fNop();
  return fBound;
};
var obj1 = { value: 42 };
function logValue(a, b) {
  console.log(this.value + a + b);
}

// const boundFunc = logValue.bind(obj1, 10); // 绑定 this 并预设第一个参数
// boundFunc(20); // 输出：42 + 10 + 20 = 72

var tt1 = logValue.CppBind(obj1, 10);
tt1(20);

function test() {
  console.log('cpp');
}
var obj = {};
obj.call(null, test);

function mockNew(fn, ...params) {
  const obj = Object.create(fn.prototype);
  var val = obj.call(this, ...params);
  return val instanceof 'object' ? val : obj;
}

class MockLRU {
  constructor(limit) {
    this.cache = new Map();
    this.limit = limit;
  }
  get(key) {
    let val = this.cache.get(key);
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    this.cache.set(key, val);
  }
  set(key, val) {
    const size = this.cache.size;
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (size >= this.limit) {
      let oldKey = this.cache.keys().next().value;
      this.cache.delete(oldKey);
    }
    this.cache.set(key, val);
  }
}

// 中间件组合
function compose(middlewares) {
  return (ctx, next) => {
    return dispatch(0);
    function dispatch(i) {
      let fn = middlewares[i];
      if (!fn) {
        return Promise.resolve();
      }
      if (i === middlewares.length) {
        fn = next;
      }
      try {
        return Promise.resolve(fn(ctx, () => dispatch(i + 1)));
      } catch (e) {
        return Promise.reject('error');
      }
    }
  };
}

Function.prototype.mockBind = function (context, ...params) {};

class MyPromise {
  value: any;
  cbs: any[];
  constructor(exeutor) {
    this.value = undefined;
    this.cbs = [];
    const resolve = (val) => {
      setTimeout(() => {
        this.value = val;
        this.cbs.forEach((cb) => cb(val));
      });
    };
    exeutor(resolve);
  }
  then(onFulfulled) {
    return new MyPromise((resolve) => {
      this.cbs.push(() => {
        const res = onFulfulled(this.value);
        if (res instanceof MyPromise) {
          res.then(resolve);
        } else {
          resolve(res);
        }
      });
    });
  }
}
var join = (a, b, c) => {
  return `${a}_${b}_${c}`;
};
// 参数不固定
function curry1(fn) {
  const temp = (...arg) => {
    if (fn.length === arg.length) {
      return fn.apply(this, arg);
    }
    return (...arg1) => fn(...arg1, ...arg);
  };
  return temp;
}
const curriedJoin = curry(join);
curriedJoin(1, 2, 3); // '1_2_3'
curriedJoin(1)(2, 3); // '1_2_3'
curriedJoin(1, 2)(3); // '1_2_3'
// 参数固定
function curry(fn) {
  let arr = [];
  return function temp(...arg1) {
    if (arg1.length) {
      arr.push(...arg1);
      return temp;
    } else {
      var val = fn.apply(null, arr);
      arr = [];
      return val;
    }
  };
}

function deepClone(obj) {
  if (typeof obj !== 'object') return obj;
  let val = obj instanceof Array ? [] : {};
  for (let k in obj) {
    if (obj.hasOwnProperty(k)) {
      let v = obj[k] instanceof Object ? deepClone(obj[k]) : obj[k];
      val[k] = v;
    }
  }
  return val;
}

function bigIntSum(a, b) {
  let len = Math.max(a.length, b.length);
  a = a.padStart(len, '0');
  b = b.padStart(len, '0');
  let res = '';
  let flag = 0;
  let i = len - 1;
  while (i >= 0) {
    flag = Number(a[i]) + Number(b[i]) + flag;
    res = (flag % 10) + res;
    flag = Math.floor(flag / 10);
    i--;
  }

  return flag === 1 ? '1' + res : res;
}
bigIntSum('111', '8888');

Array.prototype.mockMap = function (cb, context) {
  let arr = this || [];
  let res = [];
  for (let i = 0; i < arr.length; i++) {
    let val = cb.call(context, arr[i], i, arr);
    res.push(val);
  }
  return res;
};
[(1, 2, 3)].map((item) => {
  if (item > 1) {
    return item;
  }
});

/* 11.myReduce 重写
 * 12.flatter 数组和对象扁平化
 * 13.手写发布订阅模式
 * 14.instanceof 手写
 * 15.手写选择排序和插入排序
 * 16.手写二分法
 * 17.手写驼峰转换
 * 18.手写防抖和节流
 * 19.反转链表
 * 20.手写Promise
 * 21.手写vue版render
 */
Array.prototype.myReduce = function (fn, init) {
  let arr = this || [];
  let val = init ? init : arr[0];
  let startIndex = init ? 0 : 1;
  for (let i = startIndex; i < arr.length; i++) {
    val = fn.call(null, val, arr[i], i, arr);
  }
  return val;
};

function flatter(arr) {
  let stack = [...arr];
  let res = [];
  while (stack.length) {
    const item = stack.pop();
    if (Array.isArray(item)) {
      stack.push(...item);
    } else {
      res.push(item);
    }
  }
  return res.reverse();
}

let tt2 = [[1, 2, [3]]];
var tt3 = flatter(tt2); // [1,2,3]
console.log(tt3);

function flat(arr, depth = 1) {
  let stack = [...arr.map((item) => [item, depth])];
  let res = [];
  while (stack.length > 0) {
    let [top, dep] = stack.pop();
    if (Array.isArray(top) && dep > 0) {
      stack.push(...top.map((item) => [item, dep - 1]));
    } else {
      res.push(top);
    }
  }
  return res.reverse();
}

flat([1, 2, undefined, [3, 4, [5, 6, [7, 8, [9, 10]]]]], Infinity);
// please complete the implementation

class EventEmitter {
  events = new Map();
  subscribe(type, callback) {
    if (!this.events.has(type)) {
      this.events.set(type, new Set());
    }
    var subs = this.events.get(type);
    let cbObj = {
      cb: callback,
    };
    subs.add(cbObj);
    return {
      release: function () {
        subs.delete(cbObj);
        if (subs.size === 0) {
          // this.events.delete(type);
          delete this.events.type;
        }
      },
    };
  }
  emit(type, ...args) {
    const subs = this.events.get(type);
    if (subs) {
      subs.foreach((fn) => {
        fn.cb.apply(this, args);
      });
    }
  }
}

const emitter = new Emitter();
const sub1 = emitter.subscribe('event1', callback1);
const sub2 = emitter.subscribe('event2', callback2);
// 同一个callback可以重复订阅同一个事件
const sub3 = emitter.subscribe('event1', callback1);
emitter.emit('event1', 1, 2);

// 可以用来取消订阅。
sub1.release();
sub3.release();

class EVENT {
  constructor() {
    this.cbs = new Map();
  }
  subscribe(type, cb) {
    const cbs = this.cbs;
    if (!this.cbs.has(type)) {
      this.cbs.set(type, [cb]);
    } else {
      let before = this.cbs.get(type);
      this.cbs.set(type, [...before, cb]);
    }
    return {
      release() {
        cbs.get(type).map((item, index) => {
          if (item == cb) {
            cbs.get(type).splice(index, 1);
          } else {
            return item;
          }
        });
      },
    };
  }
  emit(type, ...args) {
    if (this.cbs.has(type)) {
      this.cbs.get(type).forEach((fn) => {
        fn.call(this, ...args);
      });
    }
  }
}

function mockInstanceof(l, r) {}

// 选择排序
function selectSort(arr) {}

// 插入排序
function insertSort(arr) {}

// 二分法
function twoSplit(arr) {}

// 手写驼峰转换
function transfaner(str) {
  return str.replace(/[_|@|-]([\w])/gi, (_, a) => (typeof a === 'string' ? a.toUpperCase() : ''));
}

var tt3 = transfaner('cpp_wmh'); // cppWmh
console.log(tt3, 'tt3');

function revertLink(node) {}
