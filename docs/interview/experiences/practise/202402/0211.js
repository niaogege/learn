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
  let res = [];
  while (stack.length) {
    let cur = stack.pop();
    if (Array.isArray(cur)) {
      stack.push(...cur);
    } else {
      res.push(cur);
    }
  }
  return res.reverse();
}
flatten([1, 2, 3, [4, 5, [6, 7]]]);

// 深层次对象扁平化
function flattenObj(obj, res = {}, path = '', isArray = false) {
  for (let [k, v] of Object.entries(obj)) {
    if (Array.isArray(v)) {
      let key = isArray ? `${path}[${k}]` : `${path}${k}.`;
      flattenObj(v, res, key, true);
    } else if (v instanceof Object) {
      let key = isArray ? `${path}[${k}].` : `${path}${k}.`;
      flattenObj(v, res, key, false);
    } else {
      let key = isArray ? `${path}[${k}]` : `${path}${k}.`;
      res[key] = v;
    }
  }
  return res;
}
flattenObj({ a: { b: { c: 1 } }, d: 2, e: [3, 4, 5] });

// {
//   a.b.c: 1,
//   a.d:2,
//   a.e: 3,
//   a.e: 4,
//   a.e: 5,
// }

// 13.手写发布订阅模式
class Emit {
  constructor() {}
}

// 14.instanceof 手写
function myInstanceOf(l, r) {
  l = l.__proto__;
  l = Object.getPrototypeOf(l);
  while (l) {
    if (l == r.prototype) {
      return true;
    }
    l = l.__proto__;
  }
  return false;
}

function swap(arr, i, j) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

// 15.手写选择排序和插入排序
function selectSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    let min = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[min] > arr[j]) {
        min = j;
      }
    }
    swap(arr, min, i);
  }
  return arr;
}

function insertSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let j = i;
    while (j >= 0 && arr[j - 1] > arr[j]) {
      swap(arr, j, j - 1);
      j--;
    }
  }
  return arr;
}
function swap(arr, i, j) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}
insertSort([11, 22, 333, 1, 2, 6666]);

// 16.手写二分法
function binarySearch(arr) {}

// 17.手写驼峰转换

// 18.手写防抖和节流

// 19.反转链表

// 20.手写Promise
