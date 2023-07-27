/**
 * 20230725 
1.手写Promise
2.手写rgbToHex 和 hexToRgb
3.手写驼峰转换
4.手写instanceof
5.手写防抖和节流
6.手写二分法
7.手写反转链表
9.手写render模板
10.手写bind
11. 手写选择排序和插入排序
*/

class MyPromise {
  constructor(exe) {
    this.data = undefined;
    this.cbs = [];
    const resolve = (val) => {
      setTimeout(() => {
        this.data = val;
        this.cbs.forEach((cb) => cb(val));
      });
    };
    exe(resolve);
  }
  then(onFulfilled) {
    return new MyPromise((resolve) => {
      this.cbs.push(() => {
        const res = onFulfilled(this.data);
        if (res instanceof MyPromise) {
          res.then(resolve);
        } else {
          resolve(res);
        }
      });
    });
  }
}
var p1 = new MyPromise((resolve) => {
  setTimeout(() => {
    resolve('cpp');
  }, 500);
})
  .then((res) => {
    console.log(res, 'res');
    return new MyPromise((resolve) => {
      setTimeout(() => {
        resolve('cpp2');
      }, 500);
    });
  })
  .then(console.log);

// #ffffff => rgb(255, 255,255)
function hexToRgb(str) {
  var hex = str.replace('#', '0x');
  var r = hex >> 16;
  var g = (hex >> 8) & '0xff';
  var b = hex & '0xff';
  return `rgb(${r},${g},${b})`;
}
hexToRgb('#ffffff');
// rgb(255, 255,255) => #fffff
function rgbToHex(str) {
  var hex = str.split(/[^\d]+/);
  console.log(hex, 'hex');
  var [, r, g, b] = hex;
  var toHex = function (val) {
    var Hex = (+val).toString(16);
    return Hex.length === 1 ? `0${Hex}` : Hex;
  };
  console.log(toHex(r), 'toHex(r)');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
rgbToHex('rgb(255,255,255)');

// cpp-wmh - cppWmh
function toUppercase(str) {
  return str.replace(/[-|_|@]([\w])/g, (match, p) => p.toUpperCase());
}
toUppercase('cpp-wmh');
// mock instanceof
/**
console.log([1, 2] instanceof Array); // true
mockInstanceof([1, 2], Array); // true
 */
function MyInstanceof(l, r) {
  while (l) {
    if (l === r.prototype) {
      return true;
    }
    l = l.__proto__; // or l = Object.getPrototypeOf(l)
  }
  return false;
}

function throttle(fn, timer) {
  let date = 0;
  return (...rest) => {
    var now = new Date().getTime();
    if (now - date >= timer) {
      fn.apply(this, rest);
      date = now;
    }
  };
}

function debounce(fn, delay) {
  let timer = null;
  return (...rest) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, rest);
      timer = null;
    }, delay);
  };
}
// 二分法 返回目标值的索引
function binary(arr, target) {
  let start = 0;
  let end = arr.length - 1;
  while (start <= end) {
    var base = start + Math.floor(end - start / 2);
    if (arr[base] > target) {
      right = base - 1;
    } else if (arr[base] < target) {
      left = base + 1;
    } else {
      return base;
    }
  }
  return -1;
}
/**
 * 
输入: render({{msg}}-{{name}}, {msg: 'chendap', name: 'wmh'}) 输出: 'chendap-wmh'
 */
function render(str, data) {
  var reg = /\{\{(\w+)}\}/;
  if (reg.test(str)) {
    var name = RegExp.$1.trim();
    str = str.replace(reg, data[name]);
    return render(str, data);
  }
  return str;
}
render(`{{msg}}-{{name}}`, { msg: 'chendap', name: 'wmh' });
// 反转链表
function reverseLink(head) {
  var link = head;
  var pre = {
    next: null,
    value: undefined,
  };
  while (link) {
    var next = link.next;
    link.next = pre;
    pre = link;
    link = next;
  }
  return pre;
}
Function.prototype.myApply = function (context, ...rest) {
  context = context || window;
  var sym = Symbol();
  context[sym] = this;
  var res = context[sym](...rest);
  delete context[sym];
  return res;
};

function sayName() {}
sayName.apply(this, 'cpp');
Function.prototype.myBind = function (context) {
  var self = this;
  var arg = Array.prototype.slice.call(arguments, 1);
  var fBound = function () {
    var arg2 = Array.prototype.slice.call(arguments);
    self.apply(this instanceof self ? this : context, [...arg, ...arg2]);
  };
  var fBridge = function () {};
  fBridge.prototype = this.prototype;
  fBound.prototype = new fBridge();
  return fBound;
};

// 插入排序
// 从后往前开始遍历，有小的就替换
// 从1开始遍历拿到当前元素与前面的元素进行两两比较，如果前面的元素大于当前元素，进行交换，不断循环直到未排序的元素为空
function insertSort(arr) {
  var len = arr.length;
  var pre;
  for (let i = 1; i < len; i++) {
    pre = i - 1;
    while (pre >= 0 && arr[pre] > arr[i]) {
      arr[pre + 1] = arr[pre];
      pre--;
    }
    arr[pre + 1] = arr[i];
  }
}
insertSort([22, 3, 111]);
