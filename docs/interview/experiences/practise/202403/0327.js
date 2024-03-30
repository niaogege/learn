/**
 * 1.轮转数组
 * 2.移动零
 * 3.单词搜索
 * 4.数字转汉字
 * 5.划分字母区间
 * 6.旋转图像
 * 7.合并排序
 * 8.平衡二叉树
 * 9.观察者模式
 * 10.实现setInterval
 * 11.完全二叉树的节点个数
 * 12.零钱兑换
 */

/**
 * @param {string} s
 * @return {number[]}
 */
var partitionLabels = function (s) {
  let m = new Map();
  let ans = [];
  for (let i = 0; i < s.length; i++) {
    let cur = s[i];
    m.set(cur, i);
  }
  let left = 0;
  let right = 0;
  for (let i = 0; i < s.length; i++) {
    let cur = s[i];
    right = Math.max(right, m.get(cur));
    if (i == right) {
      ans.push(right - left + 1);
      left = i + 1;
    }
  }
  return ans;
};

var countNodes = function (root) {
  let queue = [root];
  let count = 0;
  while (queue.length) {
    let len = queue.length;
    for (let i = 0; i < len; i++) {
      let cur = queue.shift();
      count++;
      if (cur.left) {
        queue.push(cur.left);
      }
      if (cur.right) {
        queue.push(cur.right);
      }
    }
  }
  return count;
};

class Subject {
  constructor() {
    this.observers = [];
  }
  addObserver(observer) {
    this.observers.push(observer);
  }
  removeObserver(ob) {
    this.observers = this.observers.filter((cb) => cb != ob);
  }
  notify(state) {
    this.observers.forEach((ob) => ob.update(state));
  }
}
class Observer {
  constructor(name) {
    this.name = name;
  }
  update(state) {
    console.log(this.name + 'update::' + state);
  }
}
let ob1 = new Observer('cpp');
let ob2 = new Observer('wmh');
let sub = new Subject();
sub.addObserver(ob1);
sub.addObserver(ob2);
sub.notify('This is one sub');
sub.notify('This is two sub');
function numToHan(str) {
  let isLof = false;
  if (+str < 0) {
    isLof = true;
  }
  let res = [];
  if (isLof) {
    res.push('负');
  }
  let units = ['', '万', '亿'];
  let len = str.length;
  for (let i = len - 1; i >= 0; i -= 4) {
    let cur = toHan(str.slice(Math.max(0, i - 4), i));
    res.push(cur);
  }
  for (let i = 0; i < res.length; i++) {
    res[i] += units[i];
  }
  return res.reverse().join('');
}

function toHan(str) {
  str = '' + str;
  let res = '';
  let len = str.length;
  let units = ['', '十', '百', '千'];
  let nums = '零一二三四五六七八九';
  for (let i = 0; i < len; i++) {
    let cur = str[i];
    if (cur != '0') {
      if (i >= 1 && str[i - 1] == 0) {
        res += nums[0];
      }
      res += nums[cur] + units[len - i - 1];
    }
  }
  if (str.length == 2 && str[0] == '1') {
    res = res.slice(1);
  }
  return res;
}
numToHan('123456');
let mockInterval = {
  timer: null,
  setInterval: function (cb, delay, ...arg) {
    let start = Date.now();
    let now;
    let loop = () => {
      this.timer = requestAnimationFrame(loop);
      now = Date.now();
      if (now - start >= delay) {
        cb.apply(this, arg);
        start = now;
      }
    };
    requestAnimationFrame(loop);
  },
  clearInterval: function () {
    cancelAnimationFrame(this.timer);
  },
};

let count = 1;
let test = () => console.log(count++);
mockInterval.setInterval(test, 2000);

function rotate(arr, k) {}
let curry = (fn) => {
  let tmp = (...rest) => {
    if (rest.length == fn.length) {
      return fn.apply(this, rest);
    } else {
      return (...arg) => tmp(...arg, ...rest);
    }
  };
  return tmp;
};
let sum = (a, b, c, d) => {
  return a + b + c + d;
};
let add = curry(sum);
add(1)(2)(3)(4); //10

function add() {
  let arr = Array.prototype.slice.call(arguments);
  let tmp = (...rest) => {
    if (rest.length) {
      arr.push(...rest);
      return tmp;
    } else {
      return arr.reduce((a, b) => a + b);
    }
  };
  return tmp;
}
add(1)(2)(3)(4)();

function add(num) {}

function sum() {
  let arr = Array.prototype.slice.call(arguments);
  let tmp = (...rest) => {
    arr.push(...rest);
    return tmp;
  };
  tmp.valueOf = function () {
    return arr.reduce((a, b) => a + b);
  };
  return tmp;
}
sum(1, 2, 3, 4).valueOf();
sum(1)(2)(3)(4)(5)(6).valueOf();

// 分治
function mergeSort(arr) {
  let merge = (l, r) => {
    let i = 0,
      j = 0;
    let res = [];
    while (i < l.length && j < r.length) {
      if (r[j] > l[i]) {
        res.push(r[j++]);
      } else {
        res.push(l[i++]);
      }
    }
    while (i < l.length) {
      res.push(l[i++]);
    }
    while (j < r.length) {
      res.push(r[j++]);
    }
    return res;
  };
  let sort = (arr) => {
    if (arr.length == 1) return arr;
    let mid = Math.floor(arr.length / 2);
    let left = arr.slice(0, mid);
    let right = arr.slice(mid);
    return merge(mergeSort(l), mergeSort(r));
  };
  return sort(arr);
}

function toHanzi(s) {
  s = '' + s;
  let str = '';
  let units = ['', '十', '百', '千'];
  let nums = '零一二三四五六七八九'.split('');
  let len = s.length;
  for (let i = 0; i < len; i++) {
    let cur = s[i];
    if (cur != '0') {
      if (i > 0 && s[i - 1] == '0') {
        str += nums[0];
      }
      str += nums[cur] + units[len - i - 1];
    }
  }
  if (s.length == 2 && s[0] == '1') {
    str = str.slice(1);
  }
  return str;
}
toHanzi('123');
