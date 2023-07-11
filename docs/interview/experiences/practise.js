/**
 1.myCall/myApply
 2.mockNew
 3.LRU 最近最少更新 缓存淘汰策略
 4.compose 组合，洋葱模型
 5.myBind
 6.curry(参数固定和不固定)
 7.bigIntSum 大数相加
 8.deepClone 深浅拷贝
 9.16进制转rgb or rgb转16进制
 10.mockMap/mockFilter 数组方法重写
 11.mockMap
 //////////
 12.mockReduce
 13.pipe
 14.ajax
 15.EventEmitter
 16.flatten/mockFlat
 */

Function.prototype.myCall = function (context, ...rest) {
  context = Object(context) || window;
  var sys = Symbol();
  context[sys] = this;
  var res = context[sys](...rest);
  delete context[sys];
  return res;
};

Function.prototype.myApply = function (context, rest) {
  context = Object(context) || window;
  var sys = Symbol();
  context[sys] = this;
  var res = context[sys](...rest);
  delete context[sys];
  return res;
};

function myNew(fn, ...rest) {
  var target = Object.create(fn.prototype);
  var res = fn.apply(target, rest);
  return res instanceof Object ? res : target;
}

class LRU {
  constructor(limit) {
    this.cache = new Map();
    this.limit = limit;
  }
  get(key) {
    if (this.cache.has(key)) {
      const val = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, val);
    } else {
      return -1;
    }
  }
  set(key, val) {
    const limit = this.limit;
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else {
      if (this.cache.size >= limit) {
        const oldKey = this.cache.keys().next().value;
        this.cache.delete(oldKey);
      }
    }
    this.cache.set(key, val);
  }
}

function compose(middlewares) {
  return (ctx, next) => {
    return dispatch(0);
    function dispatch(i) {
      let fn = middlewares[i];
      if (i === middlewares.length) fn = next;
      if (!fn) return Promise.resolve();
      try {
        return Promise.resolve(fn(ctx, dispatch.bind(null, i + 1)));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  };
}

Function.prototype.myBind = function (context) {
  var self = this;
  var arg = Array.prototype.slice.call(arguments, 1);
  var fBind = function () {
    var args = Array.prototype.slice.call(arguments);
    self.apply(this instanceof self ? this : context, [...arg, ...args]);
  };
  var Bridge = function () {};
  Bridge.prototype = this.prototype;
  fBind.prototype = new Bridge();
  return fBind;
};
// 参数固定
function curry(fn) {
  var judge = (...rest) => {
    if (fn.length === rest.length) {
      fn.apply(null, rest);
    }
    return (...arg) => judge(...[...arg, ...rest]);
  };
  return judge;
}
var sum = (a, b, c) => a + b + c;
var m = curry(sum);
m(1)(2)(3);

// 参数不固定
function curry2(fn) {
  var arr = [];
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
var sum = (...rest) => rest.reduce((a, b) => a + b, 0);
var m1 = curry2(sum);
m1(1)(2)(3)();

// 大数相加
function bigIntSum(a, b) {
  var len = Math.max(a.length, b.length);
  a = a.padStart(len, 0);
  b = b.padStart(len, 0);
  var res = '';
  var flag = 0;
  for (let i = len - 1; i >= 0; i--) {
    flag = Number(a[i]) + Number(b[i]) + flag;
    res = (flag % 10) + res;
    flag = Math.floor(flag / 10);
  }
  res = flag === 1 ? '1' + res : res;
  return res;
}

// 深浅拷贝
function deepClone(obj) {
  if (typeof obj !== 'object') return obj;
  var res = obj instanceof Array ? [] : {};
  for (let key in obj) {
    var val = obj[key];
    if (obj.hasOwnproperty(key)) {
      res[key] = typeof val === 'object' ? deepClone(val) : val;
    }
  }
  return res;
}

// #ffffff => rgb(255,255,255)
function hexToRgb(str) {
  var rgb = str.replace('#', '0x');
  var r = rgb >> 16;
  var g = (rgb >> 8) & '0xff';
  var b = rgb & '0xff';
  return `rgb(${r}, ${g}, ${b})`;
}

hexToRgb('#00FF00'); //'rgb(0, 255, 0)'

// 'rgb(0, 255, 0)' => #00FF00

function rgbToHex(str) {
  var rgb = str.split(/[^\d]+/);
  var [, r, g, b] = rgb;
  var toHex = (num) => {
    var hex = (+num).toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
rgbToHex('rgb(0,255,0)'); // #00ff00
