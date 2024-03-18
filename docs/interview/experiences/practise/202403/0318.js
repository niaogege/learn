/**
 * 1.不忘初心
 * 2.k个一组链表反转
 * 3.用队列模拟栈
 * 4.用栈模拟队列
 * 5.手写Promise(100行)
 * 6.二叉树层序遍历
 * 7.promisify
 * 8.复原ip地址
 * 9.二叉树展开链表
 * 10.删除链表的倒数第 N 个结点
 */

function revertIp(s) {
  let ans = [];
  let backTrack = (path, start) => {
    if (path.length == 4 && start == s.length) {
      ans.push(path.slice().join('.'));
      return;
    }
    // 如何分割呢
    for (let i = start; i < s.length; i++) {
      let cur = s.slice(start, i + 1);
      if (+cur > 255 || cur.length > 3) continue;
      if (cur[0] == '0' && cur.length > 1) continue;
      path.push(cur);
      backTrack(path, i + 1);
      path.pop();
    }
  };
  backTrack([], 0);
  return ans;
}
revertIp('25525511135');

// promisify 是把一个 node 中的 api 转换成 promise 的写法。 在 node 版本 12.18 以上，已经支持了原生的 promisify 方法：const fs = require('fs').promises。
function Promisify(fn) {
  return (...arg) => {
    return new Promise((resolve, reject) => {
      arg.push((error, ...rest) => {
        if (error) {
          reject(error);
        }
        resolve(rest);
      });
      fn.apply(this, arg);
    });
  };
}

Function.prototype.myCall = function (context, ...rest) {
  const con = new Object(context) || window;
  const sys = Symbol('');
  con[sys] = this;
  let res = con[sys](...rest);
  delete con[sys];
  return res;
};

function mockNew(fn, ...rest) {
  let target = Object.create(fn.prototype);
  let res = fn.apply(target, rest);
  return res instanceof Object ? res : target;
}
