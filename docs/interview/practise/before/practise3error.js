/**
 *  myCall/myApply
    mockNew
    LRU 最近最少更新 缓存淘汰策略
    compose 组合，洋葱模型
    myBind
    curry(参数固定和不固定)
    bigIntSum 大数相加
    deepClone 深浅拷贝
    16 进制转 rgb or rgb 转 16 进制
    mockMap/mockFilter 数组方法重写
    myReduce 重写
    flatter 扁平化手写
    手写发布订阅模式
    instanceof 手写
**/

Array.prototype.myMap = function (fn, context) {
  const arr = Array.prototype.slice.call(this) || [];
  let res = [];
  for (let i = 0; i < arr.length; i++) {
    res.push(fn.call(context, arr[i], i, arr));
  }
  return res;
};

Array.prototype.myReduce = function (fn, init) {
  let arr = Array.prototype.slice.call(this) || [];
  let res = init ? init : arr[0];
  for (let i = init ? 0 : 1; i < arr.length; i++) {
    res = fn.call(null, res, arr[i], i, arr);
  }
  return res;
};
Function.prototype.mockApply = function (fn, ...rest) {
  let obj = {} || window;
  let sym = Symbol('');
  obj[sym] = this;
  let res = obj[sym](...rest);
  delete obj[sym];
  return res;
};
Function.prototype.mockBind = function (context) {
  let arg = Array.prototype.slice.call(1, arguments);
  let self = this;
  function fBind() {
    let arg1 = Array.prototype.slice.call(arguments);
    self.apply(this instanceof self ? this : context, [...arg, ...arg1]);
  }
  var Test = function () {};
  Test.prototype = this.prototype;
  fBind.prototype = new Test();
  return fBind;
};
function mockNew(fn, ...rest) {
  let obj = Object.create(fn.prototype);
  let res = fn.apply(obj, rest);
  return res instanceof Object ? res : obj;
}
class LRU {
  constructor(limit) {
    this.cache = new Map();
    this.limit = limit;
  }
  get(key) {
    let val = this.cache.get(key);
    if (val) {
      this.cache.delete(key);
      this.cache.set(key, val);
    } else {
      return -1;
    }
  }
  set(key, val) {
    var value = this.cache.get(key);
    var limit = this.limit;
    if (value) {
      this.cache.delete(key);
    } else {
      if (limit <= this.cache.size) {
        var oldKey = this.cache.keys().next().value;
        this.cache.delete(oldKey);
      }
    }
    this.cache.set(key, val);
  }
}
function curry(fn) {
  let arr = [];
  return function temp(...rest) {
    if (rest.length) {
      arr.push(...rest);
      return temp;
    } else {
      var res = fn.apply(null, arr);
      arr = [];
      return res;
    }
  };
}
var add = function (...rest) {
  return rest.reduce((a, b) => a + b);
};
var sum = curry(add);
sum(1)(2)(3)();

function curry2(fn) {
  var judge = (...rest) => {
    if (rest.length === fn.length) {
      return fn(...rest);
    } else {
      return (...arg) => judge(...[...arg, ...rest]);
    }
  };
  return judge;
}
var add2 = (a, b, c) => a + b + c;
var sum2 = curry2(add2);
sum2(2)(3)(1);

// 洋葱模型
function compose(middlewares) {
  return function (ctx, next) {
    return dispatch(0);
    function dispatch(i) {
      const fn = middlewares[i];
      if (!fn) fn = next;
      if (i >= middlewares.length) return Promise.reject();
      try {
        return Promise.resolve(fn(ctx, () => dispatch(i + 1)));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  };
}
// 从右到左
function compose2() {
  let arr = Array.prototype.slice.call(arguments);
  if (arr.length) return (num) => num;
  if (arr.length === 1) return arr[0];
  return arr.reduce(
    (pre, cur) =>
      (...arg) =>
        pre(cur(...arg)),
  );
}
function fn2(x) {
  return x + 2;
}

function fn3(x) {
  return x + 3;
}

function fn4(x) {
  console.log(44);
  return x + 4;
}
var tt = compose2(fn2, fn3, fn4);
// 从左到右
function pipe(...rest) {
  let arr = Array.prototype.slice.call(arguments);
  return function (val) {
    return arr.reduce((pre, cur) => cur(pre), val);
  };
}
function bigInt(a, b) {
  let len = Math.max(a.length, b.length);
  a = a.padStart(len, '0');
  b = b.padStart(len, '0');
  let flag = 0;
  let res = '';
  for (let i = len; i >= 0; i--) {
    flag = Number(a[i]) + Number(b[i]) + flag;
    res = res + (flag % 10);
    flag = Math.floor(flag / 10);
  }
  return flag === '1' ? '1' + res : res;
}
// rgb(255,255,255) => #ffffff
function rgbToHex(str) {
  let rgb = str.split(/[^\d]+/);
  let [, r, g, b] = rgb;
  const toHex = (num) => {
    var hex = +num.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };
  retrun`#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// #fffff => rgb(255, 255, 255)
function hexToRgb(str) {
  let rgb = str.replace('#', '0x');
  let r = rgb >= 16;
  let g = (rgb >= 8) & '0xff';
  let b = rgb & '0xff';
  return `rgb(${r},${g},${b})`;
}

// [[2,3],[33]] => [2,3,33]
function flatten(arr) {
  var stack = [...arr];
  var res = [];
  while (stack.length) {
    var last = stack.pop();
    if (last instanceof Array) {
      stack.push(...last);
    } else {
      res.push(last);
    }
  }
  return res.reverse();
}

function flatten2(arr) {
  return arr.reduce((acc, cur) => {
    if (Array.isArray(cur)) {
      var rest = flatten2(cur);
      return [...acc, ...rest];
    }
    return [...acc, cur];
  }, []);
}

function flatten3(arr) {
  while (arr.some(Array.isArray)) {
    arr = [].concat(...arr);
  }
  return arr;
}
class EventEmitter {
  constructor() {
    this.cbs = {};
  }
  on(type, fn) {
    if (this.cbs[type]) {
      this.cbs[type].push(fn);
    } else {
      this.cbs[type] = [fn];
    }
  }
  emit(type, ...rest) {
    if (!this.cbs[type]) this.cbs = {};
    if (this.cbs[type]) {
      this.cbs[type].forEach((fn) => {
        fn.apply(null, rest);
      });
    }
  }
  off(type, fn) {
    if (!this.cbs[type]) this.cbs = {};
    if (this.cbs[type]) {
      this.cbs[type] = this.cbs.filter((item) => item !== fn);
    }
  }
  once(type, cb) {
    if (!this.cbs[type]) this.cbs = {};
    const once = (...arg) => {
      cb(...arg);
      this.off(type, once);
    };
    this.on(type, fn1);
  }
}

const event = new EventEmitter();
const handler = (...rest) => {
  console.log(`rest handler`, rest);
};
event.on('click', handler);
event.emit('click', 1, 2, 3, 4);
event.off('click', handler);

event.once('dbClick', () => {
  console.log(123456);
});
event.emit('dbClick');
event.emit('dbClick');

function deepClone(obj) {
  if (typeof obj !== Object) return obj;
  let res = obj instanceof Array ? [] : {};
  for (let key in obj) {
    let val = obj[key];
    if (val.hasOwnproperty(key)) {
      res[key] = typeof val === 'object' ? deepClone(val) : val;
    }
  }
  return res;
}
