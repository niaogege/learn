/**
 * 1.addBigint
 * 2.hexToRgb
 * 3.rgbToHex
 * 4.mockNew
 * 5.myBind
 * 6.myCall/myApply
 * 7.LRU
 * 8.compose
 * 9.myMap
 * 10.deepClone
 * 11.curry/curry2
 */

function addBigint(a, b) {
  let len = Math.max(a.length, b.length);
  a = a.padStart(len, 0);
  b = b.padStart(len, 0);
  var flag = 0;
  let res = '';
  for (let i = len - 1; i >= 0; i--) {
    flag = Number(a[i]) + Number(b[i]) + flag;
    res = (flag % 10) + res;
    flag = Math.floor(flag / 10);
  }
  res = flag === 1 ? '1' + res : res;
  return res;
}

// #fffff => rgb(255, 255, 255)
function hexToRgb(str) {
  var rgb = str.replace('#', '0x');
  var r = rgb >= 16;
  var g = (rgb >= 8) & '0xff';
  var b = rgb & '0xff';
  return `rgb(${r}, ${g}, ${b})`;
}

// rgb(255,255,255) => #ffffff
function rgbToHex(str) {
  var rgb = str.split(/[^\d]+/);
  var [, r, g, b] = rgb;
  var toHex = (num) => {
    var hex = (+num).toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
rgbToHex('rgb(255,255,255)');

Function.prototype.mockNew = (fn, ...rest) => {
  var target = Object.create(fn.prototype);
  var res = fn.apply(target, rest);
  return res instanceof Object ? res : target;
};

Function.prototype.myBind = (context) => {
  var self = this;
  var arg = Array.prototype.slice.call(arguments, 1);
  var fBind = function () {
    var args = Array.prototype.slice.call(arguments);
    // 构造函数 this 指向示例
    // 普通函数调用 this 指向 window self 指向绑定函数
    self.apply(this instanceof self ? this : context, [...arg, ...args]);
  };
  var Bridge = function () {};
  Bridge.prototype = this.prototype;
  fBind.prototype = new Bridge();
  return fBind;
};

Function.prototype.myCall = (context, ...rest) => {
  context = context || window;
  var sym = Symbol();
  context[sym] = this;
  var res = context[sym](...rest);
  delete context[sym];
  return res;
};

class LRU {
  constructor(limit) {
    this.cache = new Map();
    this.limit = limit;
  }
  get(key) {
    if (this.cache.has(key)) {
      var val = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, val);
    } else {
      return -1;
    }
  }
  set(key, val) {
    var limit = this.limit;
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else {
      if (this.cache.size >= limit) {
        var oldKey = this.cache.keys().next().value;
        this.cache.delete(oldKey);
      }
    }
    this.cache.set(key, val);
  }
}

function compose(middlewares) {
  return (context, next) => {
    return dispatch(0);
    function dispatch(i) {
      var fn = middlewares[i];
      if (!fn) fn = next;
      if (middlewares.length >= i) return Promise.resolve();
      try {
        return Promise.resolve(fn.apply(context, () => dispatch(i + 1)));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  };
}

Array.prototype.myMap = function (fn, context) {
  var arr = Array.prototype.slice.call(this) || [];
  var res = [];
  for (let i = 0; i < arr.length; i++) {
    res.push(fn.call(context, arr[i], i, arr));
  }
  return res;
};

function deepClone(obj) {
  if (typeof obj !== 'object') return obj;
  var res = obj instanceof Array ? [] : {};
  for (let key in obj) {
    let val = obj[key];
    if (obj.hasOwnproperty(key)) {
      res[key] = val instanceof Object ? deepClone(val) : val;
    }
  }
  return res;
}

// 参数固定
// curry(1)(2)(3)
function curry(fn) {
  var judge = (...arg) => {
    if (arg.length === fn.length) {
      fn.apply(this, arg);
    }
    return (...args) => judge(...[...args, ...arg]);
  };
  return judge;
}

// 参数不固定
// curry(1)(2)(3)()
function curry2() {
  var arr = [];
  return function temp(...rest) {
    if (rest.length) {
      arr.push(...rest);
      return temp;
    } else {
      var res = fn.apply(this, arr);
      arr = [];
      return res;
    }
  };
}
