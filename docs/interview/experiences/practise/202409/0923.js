Array.prototype.mockMap = function (cb, context) {
  const arr = this || [];
  const res = [];
  for (let i = 0; i < arr.length; i++) {
    res.push(cb.call(context, arr[i], i));
  }
  return res;
};
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
 */

Function.prototype.myCall = function (context, args) {
  const con = context || window;
  const Key = Symbol('key');
  con[Key] = this;
  let res = {};
  res = con[Key](...args);
  delete con[Key];
  return res;
};
function Test() {}
var T1 = Test.call(this, []);
function mockNew(fn, con) {
  const target = Object.create(fn.prototype);
  var res = fn.call(target, con);
  return typeof res === 'object' ? res : target;
}
const TT2 = new Test();

class LRU {
  constructor(limit) {
    this.cache = new Map();
    this.limit = limit;
  }
  get(key) {
    if (this.cache.has(key)) {
      const v = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, v);
    }
    return -1;
  }
  set(key, val) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.limit) {
      const oldKey = this.cache.keys().next().value;
      this.cache.delete(oldKey);
    }
    this.cache.set(key, val);
  }
}

function compose(mds) {
  return function (con, next) {
    return dispatch(0);
    function dispatch(i) {
      let fn = mds[i];
      if (!fn) {
        return Promise.resolve(con);
      }
      if (i === mds.length) {
        fn = next;
      }
      try {
        return Promise.reseolve(fn(con, () => dispatch(i + 1)));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  };
}
