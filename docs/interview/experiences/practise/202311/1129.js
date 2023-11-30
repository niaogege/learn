/**
 * 1.禁止调试代码
 * 2.惰性函数
 * 3.偏函数
 * 4.mockBind
 * 5.有效的括号
 * 6.函数重载
 * 7.合并两个有序数组
 * 8.二叉树完整路径之和
 * 9.二分查找
 * 10.归并排序
 */

function mergerSort(arr) {
  var merge = (left, right) => {
    var res = [];
    var i = 0,
      j = 0;
    while (i < left.length && j < right.length) {
      if (left[i] < right[j]) {
        res.push(left[i++]);
      } else {
        res.push(right[j++]);
      }
    }
    while (i < left.length) {
      res.push(left[i++]);
    }
    while (j < right.length) {
      res.push(right[j++]);
    }
    return res;
  };
  var sort = (arr) => {
    if (arr.length < 2) return arr;
    var mid = Math.floor(arr.length / 2);
    var left = arr.slice(0, mid);
    var right = arr.slice(mid);
    return merge(mergerSort(left), mergerSort(right));
  };
  return sort(arr);
}

mergerSort([111, 22, 3, 1, 22, 333]);

// This
// ttt
// (() => {
//   var test = () => {
//     setInterval(() => {
//       Function('debugger');
//     }, 50);
//   };
//   try {
//     test();
//   } catch (e) {}
// })();

Function.prototype.mockBind = function (context) {
  var arg = Array.prototype.slice.call(arguments, 1);
  var self = this;
  var fnBridge = function () {};
  var bindFn = function () {
    var arg2 = [].concat(arg);
    // 构造函数调用 为 true 的时候 this 指向实例 也就是通过new方式调用,因为下面一句 `fbound.prototype = this.prototype;`，已经修改了 fbound.prototype 为 绑定函数的 prototype
    // 普通函数调用 为false 的时候 this 指向window self指向绑定函数，此时结果为 false，当结果为 false 的时候，this 指向绑定的 context
    self.apply(this instanceof self ? this : context, arg2);
  };
  fnBridge.prototype = this.prototype;
  bindFn.prototype = new fnBridge();
  return bindFn;
};

/**
 *
 * @param {偏函数} obj
 * @param {*} name
 * @param {*} fn
 */
function url(scheme, domain, path) {
  return `${scheme}://${domain}/${path}`;
}
// 偏函数
function partial(fn) {
  var arg = [].slice.call(arguments, 1);
  return function () {
    var arg2 = arg.concat([].slice.call(arguments));
    return fn.apply(this, arg2);
  };
}
const myGithubPath = partial(url, 'https', 'github.com');
const profilePath = myGithubPath('semlinker/semlinker');
const awesomeTsPath = myGithubPath('semlinker/awesome-typescript');
console.log(profilePath, 'profilePath');

function heavyLoad(obj, name, fn) {
  var oldFn = obj[name];
  obj[name] = function (...arg) {
    if (fn.length === arg.length) {
      fn.apply(this, arg);
    } else {
      oldFn(...arg);
    }
  };
}

var target = {};
heavyLoad(target, 'show', function () {
  console.log('null');
});
heavyLoad(target, 'show', function (a, b) {
  console.log(a, b);
});

target.show();
target.show('ab', 'ab');

var merge = function (nums1, m, nums2, n) {
  for (i = m; i < m + n; i++) {
    nums1[i] = nums2[i - m];
  }
  nums1.sort((a, b) => a - b);
};
