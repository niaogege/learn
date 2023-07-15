Array.prototype.myMap = function (fn, context) {};

Array.prototype.myReduce = function (fn, init) {};
Function.prototype.mockApply = function (fn, ...rest) {};
Function.prototype.mockBind = function (fn, ...rest) {};
function mockNew(fn, context) {}
class LRU {
  constructor(limit) {
    this.cache = new Map();
    this.limit = limit;
  }
  get(key) {}
  set(key, val) {}
}
function curry(fn) {}
var add = function (...rest) {
  return rest.reduce((a, b) => a + b);
};
// 洋葱模型
function compose(middlewares) {
  return function (ctx, next) {
    return dispatch(0);
    function dispatch(i) {}
  };
}
// 从左到右
function compose2(...rest) {}
// 从右到左
function pipe(...rest) {}
function bigInt(a, b) {}
function rgbToHex(str) {}
function hexToRgb(str) {}
