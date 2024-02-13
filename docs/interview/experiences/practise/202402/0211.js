/**
 * 11.myReduce 重写
 * 12.flatter 数组和对象扁平化
 * 13.手写发布订阅模式
 * 14.instanceof 手写
 * 15.手写选择排序和插入排序
 * 16.手写二分法
 * 17.手写驼峰转换
 * 18.手写防抖和节流
 * 19.反转链表
 * 20.手写Promise
 */

function myCall(context, ...rest) {
  var obj = new Object(context) || window;
  var sys = Symbol('');
  obj[sys] = this;
  var res = obj[sys](...rest);
  delete obj[sys];
  return res;
}

function myBind(context, ...rest) {
  let self = this;
  let arg = Array.prototype.slice.call(arguments, 1);
  let fBridge = function (...rest) {
    let arg2 = [...arg, ...rest];
    self.apply(this instanceof self ? this : context, arg2);
  };
  let bridgeFn = function () {};
  bridgeFn.prototype = this.prototype;
  fBridge.prototype = new bridgeFn();
  return fBridge;
}

Array.prototype.myReduce = function (fn, init) {};

function flatten(arr) {
  let stack = [...arr];
}

function flattenObj(obj) {}
