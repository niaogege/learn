/**
 * 1.instanceOf
 * 2.bind
 * 3.超时重传机制
 * 4.Promise.finally
 * 5.reduce
 * 6.二叉树中的最大路径和
 * 7.对称二叉树
 * 8.最大深度和最小深度
 * 9.重排链表
 * 10.最小路径和
 * 11.树转数组
 * 12.数组转树
 */

function tryAgain(fn, time) {}

class Promise {
  static finally(cb) {
    return this.then(
      (val) => Promise.resolve(cb()).then(() => val),
      (err) => Promise.resolve(cb()).then(() => err),
    );
  }
}
Promise.finally(() => {});

function mockNew(fn, ...rest) {
  let target = Object.create(fn.prototype);
  let res = fn.apply(target, rest);
  return res instanceof Object ? res : target;
}

function mockApply(con, ...rest) {
  con = new Object(con) || window;
  let sys = Symbol('');
  con[sys] = this;
  let res = con[sys](...rest);
  delete con[sys];
  return res;
}

function mockBind(con, ...rest) {
  const self = this;
  const arg1 = Array.prototype.slice.call(arguments, 1);
  let bridgeFn = () => {
    const arg2 = Array.prototype.slice.call(arguments);
    self.apply(this instanceof self ? this : con, [...arg1, ...arg2]);
  };
  let BFn = function () {};
  BFn.prototype = this.prototype;
  bridgeFn.prototype = new BFn();
  return bridgeFn;
}

function Name(name) {
  return name;
}
var instance1 = mockNew(Name, name);

function mocinstanceOf(l, r) {
  return r.prototype.isPrototypeOf(l);
}

// 输入：grid = [[1,3,1],[1,5,1],[4,2,1]]
// 输出：7
// 解释：因为路径 1→3→1→1→1 的总和最小。

function water(arr) {
  if (!arr.length) return 0;
  let sum = 0;
  let stack = [0];
  const len = arr.length;
  for (let i = 1; i < len; i++) {
    let cur = arr[i]; // 后
    if (cur < arr[stack.slice(-1)]) {
      stack.push(i);
    } else {
      while (cur && cur > arr[stack.slice(-1)]) {
        let top = stack.pop(); // 中
        let last = stack.slice(-1); // 前
        let w = i - last - 1;
        let h = Math.min(cur, arr[last]) - arr[top];
        sum += w * h;
      }
      stack.push(i);
    }
  }
  return sum;
}

function insertLink(A, B) {
  let s = new Set();
  let cur = A;
  while (cur) {
    s.add(cur);
    cur = cur.next;
  }
  cur = B;
  while (cur) {
    if (s.has(cur)) {
      return cur;
    }
    cur = cur.next;
  }
  return null;
}

class LRU {
  constructor(limit) {
    this.limit = limit;
    this.cache = new Map();
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
    const size = this.cache.size;
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else {
      if (size >= this.limit) {
        const oldKey = this.cache.keys().next().value;
        this.cache.delete(oldKey);
      }
    }
    this.cache.set(key, val);
  }
}

Array.prototype.mockReduce = function (fn, init) {};

function mockInstanceOf(l, r) {
  let l = Object.getPrototypeOf(l);
  while (l) {
    // XXXX
    if (l == r.prototype) {
      return true;
    }
    l = Object.getPrototypeOf(l);
  }
  return false;
}

function secondInstanceof(l, r) {
  return r.prototype.isPrototypeOf(l);
}
