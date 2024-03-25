/**
 * 1.轮转数组
 * 2.移动零
 * 3.单词搜索
 * 4.数字转汉字
 * 5.划分字母区间
 * 6.旋转图像
 * 7.堆排序
 * 8.平衡二叉树
 * 9.观察者模式
 * 10.实现setInterval
 */
// 3

function backTop() {}

function mockSetInterval(fn, delay, ...arg) {
  let start = Date.now();
  let timer, now;
  let loop = () => {
    timer = requestAnimationFrame(loop);
    now = Date.now();
    if (now - start >= delay) {
      fn.apply(this, arg);
      cancelAnimationFrame(timer);
      start = now;
    }
  };
  requestAnimationFrame(loop);
}
let test = () => console.log('111');
mockSetInterval(test, 1000);

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
