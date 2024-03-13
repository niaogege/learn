/**
 * 1.MockInterator
 * 2.Promise.allSttled
 * 3.生成扑克牌的所有序列
 * 4.拼手气抢红包
 * 5.环路检测
 * 6.写一个自定义事件
 * 7.写一个发布订阅,需要支持on、once、off、emit
 * 8.函数柯里化
 * 9.最长回文子串
 * 10.用栈实现队列
 * 11.反转链表
 * 12.实现一个小方块跟随鼠标移动
 * 13.翻转二叉树
 * 14.数字千分位
 * 15.实现基本的字符串压缩功能。比如，字符串aabcccccaaa会变为a5b1c5
 * 16.封装一个函数，接收多个promise，其中只要有一个promise resolve或者reject了，那它整体就resolve了
 */

function curry1(fn) {
  let arr = [];
  return function temp(...rest) {
    if (rest.length) {
      arr.push(...rest);
      return temp;
    } else {
      let res = fn.apply(this, arr);
      arr = [];
      return res;
    }
  };
}
function curry2(fn) {
  var temp = (...rest) => {
    if (rest.length == fn.length) {
      return fn.apply(this, rest);
    } else {
      return (...arg) => temp(...arg, ...rest);
    }
  };
  return temp;
}
sum(1)(2)(3)(4).valueOf(); //10
function sum(...rest) {
  let add = (...arg) => sum(...arg, ...rest);
  add.valueOf = () => rest.reduce((a, b) => a + b);
  return add;
}

class MyQueue {
  constructor() {
    this.stackIn = [];
    this.stackOut = [];
  }
  static push(x) {
    this.stackIn.push(x);
  }
  static pop() {
    if (this.stackOut.length == 0) {
      while (this.stackIn.length) {
        this.stackOut.push(this.stackIn.pop());
      }
    }
    return this.stackOut.pop();
  }
  static peek() {
    const x = this.pop();
    this.stackOut.push(x);
    return x;
  }
  static empty() {
    return !this.stackIn.length && !this.stackOut.length;
  }
}
function scale(str) {
  let m = new Map();
  for (let s of str) {
    if (m.has(s)) {
      m.set(s, m.get(s) + 1);
    } else {
      m.set(s, 1);
    }
  }
  let ans = '';
  for (let [k, val] of m.entries()) {
    ans += k + val;
  }
  return ans;
}
scale('aabcccccaaa');

function thousand(str) {
  return str.replace(/(?!^)(?=(\d{3})+$)/g, ',');
}
thousand('123456789');

function swap(arr, i, j) {
  let temp = arr[i];
  arr[i] = j;
  j = temp;
}

function reverseTree(root) {
  if (root == null) return root;
  let temp = reverseTree(root.left);
  root.left = reverseTree(root.right);
  root.right = temp;
  return root;
}

function reverseNode(node) {
  let pre;
  let cur = node;
  while (cur) {
    let next = cur.next;
    cur.next = pre;
    pre = cur;
    cur = next;
  }
  return pre;
}

var longestPalindrome = function (s) {
  let len = s.length;
  let dp = new Array(len).fill().map(() => new Array(len).fill(false));
  let begin = 0;
  let max = 0;
  for (let i = len - 1; i >= 0; i--) {
    for (let j = i; j < len; j++) {
      if (s[j] == s[i]) {
        if (j - i <= 1) {
          dp[i][j] = true;
        } else {
          dp[i][j] = dp[i + 1][j - 1];
        }
      }
      if (dp[i][j] && j - i + 1 > max) {
        max = j - i + 1;
        begin = i;
      }
    }
  }
  return s.slice(begin, begin + max);
};
longestPalindrome('abcbe');

class EventEmitter {
  constructor() {
    this.events = {};
  }
  on(type, fn) {
    if (this.events[type] && this.events[type].length) {
      this.events[type].push(fn);
    } else {
      this.events[type] = [fn];
    }
  }
  off(type, fn) {
    if (this.events[type] && this.events[type].length) {
      this.events[type] = this.events[type].filter((item) => item != fn);
    }
  }
  emit(type, ...rest) {
    if (this.events[type] && this.events[type].length) {
      this.events[type].forEach((fn) => fn(...rest));
    }
  }
  once(type, fn) {
    const oneFn = (...rest) => {
      fn(...rest);
      this.off(type, oneFn);
    };
    this.on(type, oneFn);
  }
}

function customEvent() {
  const btn = document.getElementById('btn');
  let event = new Event('cpp', {});
  btn.addEventListener('cpp', function () {});
  btn.dispatchEvent(event); // 触发
}

function redPacket(money, num) {
  let remain = money;
  let ans = [];
  for (let i = 0; i < num - 1; i++) {
    let min = 0.1;
    let max = Math.floor((remain / num) * 2 * 100) / 100;
    let cur = Math.round(Math.random() * max * 100) / 100;
    cur = cur < min ? min : cur;
    ans.push(cur);
    remain = Math.round((remain - cur) * 100) / 100;
  }
  ans.push(remain);
  return ans;
}
redPacket(10, 4);
class Promise {
  static allSettled(arr) {
    return Promise.all(
      arr.map((item) => {
        return Promise.resolve(item).then(
          (res) => ({
            status: 'fullfilled',
            value: res,
          }),
          (err) => ({
            status: 'rejected',
            reason: err,
          }),
        );
      }),
    );
  }
}

class MockInterator {
  constructor(obj) {
    this.len = Object.keys(obj);
    this.obj = obj;
    this.index = 0;
  }
  [Symbol.iterator]() {
    return this;
  }
  next() {
    return this.index < this.len
      ? {
          done: false,
          value: this.obj[this.index++],
        }
      : {
          done: true,
          value: undefined,
        };
  }
}
