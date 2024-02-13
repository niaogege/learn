/**
 * 1.myCall/myApply
 * 2.mockNew
 * 3.LRU 最近最少更新 缓存淘汰策略
 * 4.compose 组合，koa洋葱模型
 * 5.myBind
 * 6.curry(参数固定和不固定)
 * 7.bigIntSum 大数相加
 * 8.deepClone 深浅拷贝
 * 9.16进制转 rgb or rgb 转 16 进制
 * 10.mockMap/mockFilter 数组方法重写
 */

// function myCall(target, ...rest) {
//   let target = window;
//   var sym = Symbol('');
//   sym['fn'] = this;
//   let obj = sym['fn'](target, ...rest);
//   delete sym['fn'];
//   return obj;
// }

function myCall(context, ...rest) {
  const obj = new Object(context) || window;
  const sys = Symbol('');
  obj[sys] = this;
  let res = obj[sys](...rest);
  delete obj[sys];
  return res;
}

function mockNew(fn, ...rest) {
  var target = Object.create(fn.prototype);
  var obj = fn.apply(target, rest);
  return obj instanceof 'Object' ? obj : target;
}

class LRU {
  constructor(count) {
    this.size = count;
    this.cache = new Map();
  }
  get(key) {
    if (this.cache.has(key)) {
      let val = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, val);
    } else {
      return -1;
    }
  }
  set(key, val) {
    const size = this.cache.size;
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else {
      if (this.size <= size) {
        const oldKey = this.cache.keys().next().value;
        this.cache.delete(oldKey);
      }
    }
    this.cache.set(key, val);
  }
}

function compose(middlewares) {
  return (ctx, next) => {
    return dispatch(1);
    function dispatch(i) {
      let fn = middlewares[i];
      if (!fn) {
        return Promise.reject('error');
      }
      if (i == middlewares.length) {
        fn = next;
      }
      try {
        // 有点遗忘
        // return Promise.resolve().then((res) => dispatch.bind(ctx, i + 1));
        return Promise.resolve(fn(ctx, () => dispatch(i + 1)));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  };
}

function myBind(context) {
  const self = this;
  var arg = Array.prototype.slice.call(arguments, 1);
  var fBind = (...rest) => {
    let args = [...arg, ...rest];
    return self.apply(this instanceof self ? this : context, args);
  };
  var fBridge = function () {};
  fBridge.prototype = this.prototype;
  fBind.prototype = new fBridge();
  return fBind;
}

// 参数不限
function curry(fn) {
  let arr = [];
  return function temp(...rest) {
    if (rest.length) {
      arr.push(...rest);
      return temp;
    } else {
      const val = fn.apply(this, arr);
      arr = [];
      return val;
    }
  };
}

var sum = (arr) => arr.reduce((a, b) => a + b);
var fn = curry(sum);
fn(1)(2)(3)(4)();

// 参数有限
function curry2(fn) {
  let temp = (...rest) => {
    if (fn.length == rest.length) {
      return fn.apply(this, rest);
    }
    return (...arg) => temp(...arg, ...rest);
  };
  return temp;
}
var sum = (a, b, c) => a + b + c;

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
  return flag == '1' ? 1 + res : res;
}
bigIntSum('111', '222');

function deepClone(obj) {
  if (typeof obj != 'object') return obj;
  let res = obj instanceof Array ? [] : {};
  for (let [k, val] of Object.entries(obj)) {
    if (obj.hasOwnProperty(k)) {
      res[k] = typeof val == 'object' ? val : deepClone(val);
    }
  }
  return res;
}

// #ffffff => rgb(255,255,255) 16进制转rgb
function toRgb(str) {
  str = str.replace('#', '0x');
  var r = str >> 16;
  var g = (str >> 8) & 0xff;
  var b = str & 0xff;
  return `rgb(${r}, ${g}, ${b})`;
}
toRgb('#ffffff');
// rgb转16进制 => #ffffff
// rgb(255,255,255) => #ffffff
function toHex(str) {
  var [, r, g, b] = str.split(/\D+/);
  var toHex = (hex) => {
    hex = (+hex).toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
toHex('rgb(255,255,255');

Array.prototype.mockMap = function (fn, context) {
  var arr = this || [];
  let res = [];
  for (let i = 0; i < arr.length; i++) {
    res.push(fn.call(context, arr[i], i, arr));
  }
  return res;
};
