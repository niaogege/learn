---
title: 202307手写汇总
order: 13
group:
  order: 0
  title: interview
nav:
  order: 3
  title: 'interview'
  path: /interview
---

> 有些可能 code 会有问题，欢迎找我修正

> 0801 40 道手写题 先拿 40 道题目练练手,八月目标是 100 道

> 0805 50 道题

```js
/**
 * 1.myCall/myApply
 * 2.mockNew
 * 3.LRU 最近最少更新 缓存淘汰策略
 * 4.compose 组合，koa洋葱模型
 * 5.myBind
 * 6.curry(参数固定和不固定)
 * 7.bigIntSum 大数相加
 * 8.deepClone 深浅拷贝
 * 9.16进制转 rgb or rgb 转 16 进制
 * 10.mockMap/mockFilter 数组方法重写
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
 * 21.手写vue版render
 * 22.手写数字的千分位分割法
 * 23.实现一个 node 异步函数的 promisify
 * 24.封装一个类使对象可以被 for of 遍历
 * 25.删除链表一个节点
 * 26.手写async/await
 * 27.手写pipe/redux中的compose
 * 28.Promise.all/any/race/allSettled
 * 29.手写并发控制器!!!
 * 30.手写ajax
 * 31.手写jsonp
 * 32.[如何最快捷计算【白屏时间 FCP】和【首屏时间 LCP】](https://mp.weixin.qq.com/s/66_ssrmZpzeddm3FugiMFQ)
 * 33.URL参数解析
 * 34.手写去重
 * 35.useEvent
 * 36.useFetch 如何同时保持函数引用不变与访问到最新状态。
 * 37.链表是否有环？
 * 38.缓存memo函数
 * 39.手写函数重载
 * 40.二叉树前中后序遍历(迭代方式)
 * 41.冒泡排序和归并排序
 * 42.滑动窗口，无重复字符的最长子串
 * 43.实现一个带缓存斐波那契数列
 * 44.最大子序和
 * 45.实现简单的hash路由跟history路由
 * 46.二叉树的层序遍历
 * 47.二叉树前中后序遍历(递归方式)
 * 48.如何实现无限累加的一个函数
 * 49.手写NOSSR
 * 50.数组随机展示以及随机取一个数字展示
 * 51.字符串相乘
 * 52.0.2+0.1相加
 **/
```

## 1.myCall/myApply

```js
Function.prototype.myCall = function (context, ...rest) {
  var obj = new Object(context) || window;
  var sys = Symbol('');
  obj[sys] = this;
  var res = obj[sys](...rest);
  delete obj[sys];
  return res;
};
```

## 2.mockNew

```js
function mockNew(fn, ...rest) {
  var target = Object.create(fn.prototype);
  var res = fn.apply(target, rest);
  return res instanceof Object ? res : target;
}
function TT(name) {
  this.name = name;
}
var tt1 = new TT('cpp');
console.log(tt1);
var tt2 = mockNew(TT, 'cpp2');
console.log(tt2);
```

## 3.LRU 最近最少更新 缓存淘汰策略

```js
class LRU {
  constructor(limit) {
    this.cache = new Map();
    this.limit = limit;
  }
  get(key) {
    var val = this.cache.get(key);
    if (val || this.cache.has(key)) {
      this.cache.delete(key);
      this.cache.set(key, val);
    } else {
      return -1;
    }
  }
  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.limit <= this.cache.size) {
      var oldKey = this.cache.keys.value().next;
      this.cache.delete(oldKey);
    }
    this.cache.set(key, value);
  }
}
```

## 4.compose 组合，koa 洋葱模型

```js
function compose(middlewares) {
  return function (ctx, next) {
    return dispatch(i);
    function dispatch(i) {
      var fn = middlewares[i];
      if (i === middlewares.length) fn = next;
      // 当 fn 为空的时候，就会开始执行 next() 后面部分的代码
      if (!fn) return Promise.resolve();
      try {
        // 执行中间件，留意这两个参数，都是中间件的传参，第一个是上下文，第二个是 next 函数
        // 也就是说执行 next 的时候也就是调用 dispatch 函数的时候
        return Promise.resolve(fn(ctx, () => dispatch(i + 1)));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  };
}
```

## 5.myBind

**bind()** 方法会创建一个新函数。当这个新函数被调用时，bind() 的第一个参数将作为它运行时的 this，之后的一序列参数将会在传递的实参前传入作为它的参数。(来自于 MDN )

```js
Function.prototype.myBind = function (context, ...rest) {
  var self = this;
  var args = Array.prototype.slice.call(arguments, 1);
  var fbind =  function () {
    var bindArgs = Array.prototype.slice.call(arguments);
    // self.apply(context, args.concat(bindArgs));
     // 当作为构造函数时，this 指向实例，self 指向绑定函数，因为下面一句 `fbound.prototype = this.prototype;`，已经修改了 fbound.prototype 为 绑定函数的 prototype，此时结果为 true，当结果为 true 的时候，this 指向实例。
    // 当作为普通函数时，this 指向 window，self 指向绑定函数，此时结果为 false，当结果为 false 的时候，this 指向绑定的 context。
    self.apply(this instanceOf self ? this : context, args.concat(bindArgs))
  };
  var fBrifge = function() {}
  fBrifge.prototype = this.prototype
  fbind.prototype = new fBrideg()
  return fbind
};
```

## 6.两种 curry 柯里化函数

将一个多参数的函数转化为**多个嵌套**的单参数函数

```js
// 参数不固定
function curryFn(fn) {
  var arr = [];
  return function temp(...rest) {
    if (rest.length) {
      arr.push(...rest);
      return temp;
    } else {
      var val = fn.apply(this, arr);
      arr = [];
      return val;
    }
  };
}
var sum = (...rest) => rest.reduce((pre, cur) => cur + pre, 0);
var getCurry = curryFn(sum);
getCurry(1)(2)(3)();
// 参数固定
function curryFn1(fn) {
  function temp(...rest) {
    if (rest.length === fn.length) {
      return fn.apply(this, rest);
    } else {
      return (...arg) => temp(...rest.concat(arg));
    }
  }
  return temp;
}

var sum1 = (a, b, c) => a + b + c;
var getCurry2 = curryFn1(sum1);
getCurry2(22)(11)(33);
```

## 7.bigIntSum 大数相加

```js
function bigIntSum(a, b) {
  var len = Math.max(a.length, b.length);
  a = a.padStart(len, 0);
  b = b.padStart(len, 0);
  var res = '';
  var flag = 0;
  for (let i = len - 1; i >= 0; i--) {
    flag = Number(a[i]) + Number(b[i]) + flag;
    res = (flag % 10) + res;
    flag = Math.floor(flag / 10);
  }
  return flag === 1 ? '1' + res : res;
}
bigIntSum('123', '123');
```

## 8.deepClone 深浅拷贝

```js
function deepClone(obj) {
  if (obj typeof !== 'Object') {
    return obj
  }
  var target = Array.isArray(obj) ? [] : {}
  for (let key in obj) {
    if(obj.hasOwnProperty(key)) {
      let item = obj[key]
      target[key] = item instanceof Object ? deepClone(item) : item
    }
  }
  return target
}
```

## 9.16 进制转 rgb or rgb 转 16 进制

```js
// test 20231227
function rgbToHex(str) {
  let arr = str.split(/\D+/); // [^\d]+
  let [, r, g, b] = arr;
  let toHex = (s) => {
    let hex = (+s).toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
rgbToHex('rgb(255,255,255');
// rgb(255,255,255) => #ffffff
function rgbToHex(str) {
  let rgbs = str.split(/[^\d]+/);
  let [, r, g, b] = rgbs;
  const toHex = (hex) => {
    var t = (+hex).toString(16);
    return t.length === 1 ? `0${t}` : t;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
rgbToHex('rgb(255,255,255)');

// #fffff => rgb(255,255,255)
function hexToRgb(str) {
  let rgb = str.replace('#', '0x');
  let r = rgb >> 16;
  let g = (rgb >> 8) & 0xff;
  let b = rgb & 0xff;
  return `rgb(${r},${g},${b})`;
}
hexToRgb('#ffffff');
```

## 10.mockMap/mockFilter 数组方法重写

```js
Array.prototype.mockMap = function (fn, context = window) {
  var arr = this;
  var res = [];
  for (let i = 0; i < arr.length; i++) {
    res.push(fn.call(context, arr[i], i, arr));
  }
  return res;
};

var sum = [1, 2, 3].map((e) => e * 2);
var sum2 = [11, 22, 33].mockMap((e) => e * 2);
console.log(sum, sum2);

Array.prototype.mockFilter = function (fn, context = window) {
  var arr = this;
  var res = [];
  for (let i = 0; i < arr.length; i++) {
    if (fn.call(context, arr[i], i, arr)) {
      res.push(arr[i]);
    }
  }
  return res;
};
var filter = [1, 2, 3].filter((e) => e > 1);
var filter2 = [1, 2, 3].mockFilter((e) => e > 1);
console.log(filter, filter2);
```

## 11.myReduce 重写!!

```js
var sum = [1, 2, 3].reduce((pre, cur) => cur + pre, 10);
console.log(sum);

Array.prototype.mockReduce = function (fn, init) {
  var arr = this;
  var res = init ? init : arr[0];
  for (let i = init ? 0 : 1; i < arr.length; i++) {
    res = fn.call(null, res, arr[i], i, arr);
  }
  return res;
};
var sum2 = [1, 2, 3].mockReduce((pre, cur) => pre + cur, 10);
console.log(sum2);
```

## 12.数组和对象 flatten

```js
// [[1,2,3,[4,5]]]
const flatten = (list, level = +Infinity) => {
  var stack = [...list];
  var res = [];
  let i = 0;
  while (stack.length) {
    var cur = stack.pop();
    if (Array.isArray(cur) && i < level) {
      i++;
      stack.push(...cur);
    } else {
      res.push(cur);
    }
  }
  return res.reverse();
};
const array = [1, [2, [3, 4, [5]], 3], -4];
const list1 = flatten(array);
const list2 = flatten(array, 2);
console.log(list1); // [1, 2, 3, 4, 5, 3, -4]
console.log(list2); // [1, 2, 3, 4, [5], 3, -4]
function myFlatten1(arr) {
  return arr.reduce((pre, cur) => {
    return pre.concat(Array.isArray(cur) ? myFlatten(cur) : cur);
  }, []);
}

function myFlatten2(arr) {
  return arr.reduce((pre, cur) => {
    if (Array.isArray(cur)) {
      const other = myFlatten2(cur);
      return [...pre, ...other];
    }
    return [...pre, cur];
  }, []);
}
flatten([1, 2, [3, 4, [5, 9]]]);

// 对象扁平化
```

## 13.手写发布订阅模式

发布订阅模式：订阅者把自己想要订阅的事件注册到调度中心，当发布者发布事件到调度中心（就是该事件被触发），再由调度中心统一调度订阅者注册到调度中心的处理代码。

发布订阅模式跟观察者模式很像，他们其实都有发布者和订阅者，但是他们是有区别的

1.观察者模式的发布和订阅是互相依赖的

2.发布订阅模式的发布和订阅是不互相依赖的，因为有一个统一调度中心

```js
class Event {
  constructor() {
    this.events = {}
  }
  on(type, fn) {
    if (this.events[type]) {
      this.events[type].push(fn)
    } else {
      this.events[type] = [fn]
    }
  }
  emit(type. ...rest) {
    const task = this.events[type].slice()
    if (task) {
      task.forEach((fn) => fn.apply(this, rest))
    }
  }
  off(type, fn) {
    if (this.events[type] && !fn) {
      this.events[type] = []
    } else (fn) {
      this.events[type].filter((x) => x !== fn)
    }
  }
  once(type, cb) {
    const fn = () => {
      cb()
      this.off(type, fn)
    }
    this.on(type, fn)
  }
}
const eventBus = new Event()
// 组件1
eventBus.on(('event'), (val) => {
  console.log(val)
})
// 组件2
eventBus.emit('event', 'param')
```

## 14.instanceof 手写

```js
// 用于检测构造函数的原型是否在某一个实例的原型链上
function mockInstanceof(l, r) {
  l = Object.getPrototypeOf(l); // l.__propto__
  while (l) {
    if (l === r.prototype) {
      return true;
    }
    l = Object.getPrototypeOf(l); // l.__propto__
  }
  return false;
}
function mockInstanceof(l, r) {
  return r.prototype.isPrototypeOf(l);
}
```

## 15.手写选择排序和插入排序

选择排序跟冒泡排序区别：

冒泡排序是不停的交换元素，而选择排序只需要在每一轮交换一次。

```js
// 选择排序是将最小的元素存放在数组起始位置，再从剩下的未排序的序列中寻找最小的元素，然后将其放到已排序的序列后面。以此类推，直到排序完成。
function selectSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    let min = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[min] > arr[j]) {
        min = j;
      }
    }
    var temp = arr[i];
    arr[i] = arr[min];
    arr[min] = temp;
  }
  return arr;
}
selectSort([11, 222, 11, 2, 3, 0, 8, 6]);

// [5,4,1]
// cur = 4
// i=1 pre = 0
// arr[0] > arr[1] => 5>4
// arr[1] = arr[0]=5
// pre = 0-1 = -1
// arr[0] = 4
// 插入排序
// 对于未排序的数据，在已排序的序列中从后往前扫描，找到相应的位置进行插入，保持已排序序列中元素一直有序。
function inserSort(arr) {
  var pre, cur;
  for (let i = 1; i < arr.length; i++) {
    pre = i - 1;
    cur = arr[i];
    while (pre >= 0 && arr[pre] > cur) {
      arr[pre + 1] = arr[pre];
      pre--;
    }
    arr[pre + 1] = cur;
  }
  return arr;
}
inserSort([11, 222, 11, 2, 3, 0, 8, 6]);
// 时间复杂度: O(n^2)
// 空间复杂度: O(1)

// 此种方式比之前都好理解
function insertSort2(arr) {
  for (let i = 1; i < arr.length; i++) {
    let j = i;
    while (j > 0 && arr[j - 1] > arr[j]) {
      swap(arr, j, j - 1);
      j--;
    }
  }
  return arr
}
function swap(arr, i, j) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}
insertSort2([22, 111, 2, 3, 4, 55, 1]);

// 希尔排序
function shellSort(arr) {
  //没有math的库，但是可以用js原生的parseInt!
  for (let gap = parseInt(nums.length / 2); gap > 0; gap = parseInt(gap / 2)) {
    //循环2是有几组要排序【错！】
    //循环2是从第gap个元素，逐个对其所在组进行直接插入排序操作
    //分组的意义不是专门分组比较，直接顺延往后走就行，而是分组的是比较对象
    //已排序的还是在前面，比较的还是和前面的比较
    //除了多一层gap变化的循环，内层的变化只是比较的间隔变大，由-1变-gap
    for (let i = gap; i < nums.length; i++) {
      let j = i - gap;
      let min = nums[i];
      for (j >= 0; j = j - gap) {
        if (min >= nums[j]) {
          break;
        }
        nums[j + gap] = nums[j];
        //min的值在最内层循环的不变，是插入排序！寻找的是j位置！
      }
      nums[j + gap] = min;
    }
  }
  return nums;
}
shellSort([22, 111, 2, 3, 4, 55, 1]);
```

## [16.手写二分法查找](https://leetcode.cn/problems/binary-search/description/)

```js
// 输入: nums = [-1,0,3,5,9,12], target = 9
// 输出: 4
// 解释: 9 出现在 nums 中并且下标为 4
function binary(arr, target) {
  arr.sort((a, b) => a - b);
  var start = 0;
  var end = arr.length - 1;
  while (start <= end) {
    var mid = start + Math.floor((end - start) / 2);
    if (arr[mid] > target) {
      end = mid - 1;
    } else if (arr[mid] < target) {
      start = mid + 1;
    } else {
      return mid;
    }
  }
  return -1;
}
binary([-1, 0, 3, 5, 9, 12], 9);

// 旋转数组中的查找
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function (nums, target) {
  var len = nums.length;
  let start = 0;
  let end = nums.length - 1;
  let n = nums.length;
  if (n === 1) {
    return nums[0] === target ? 0 : -1;
  }
  while (start <= end) {
    var mid = Math.floor((end - start) / 2) + start;
    if (nums[mid] === target) {
      return mid;
    }
    if (nums[0] <= nums[mid]) {
      if (nums[0] <= target && target < nums[mid]) {
        end = mid - 1;
      } else {
        start = mid + 1;
      }
    } else {
      if (nums[mid] < target && target <= nums[n - 1]) {
        start = mid + 1;
      } else {
        end = mid - 1;
      }
    }
  }
  return -1;
};
```

> 二分查找通过不断将搜索范围减半，迅速找到目标值或确认其不存在。这使得它成为在有序数组中寻找值的最快方式之一。请注意，前提是数组必须有序，否则二分查找将不适用。

## 17.手写驼峰转换

```js
function chartUppercase(str) {
  return str.replace(/[-|@|_]([\w])/g, (m, p) => {
    return p.toUpperCase();
  });
}
chartUppercase('cpp-wmh'); // cppWmh
function chartUppercase2(str) {
  var arr = str.split('-');
  for (let i = 1; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substring(1);
  }
  return arr.join('');
}
chartUppercase2('hello-cpp');
```

## 18.手写防抖和节流

防抖：防止抖动，单位时间内事件触发会被重置，避免事件被触发多次。代码实现重在清零 clearTimeout。防抖可以比作等电梯，只要有一个人进来，就需要再等一会儿。业务场景有避免登录按钮多次点击的重复提交。

节流：控制流量，单位时间内事件只能触发一次，与服务器端的限流 (Rate Limit) 类似。代码实现重在一定的时间段内执行一次。节流可以比作过红绿灯，每等一个红灯时间就可以过一批。

```js
// 一段时间内多次触发只会执行一次 控制执行次数 应用场景： 防抖提交
function debounce(fn, delay) {
  var timer = null;
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
// 节流 执行频率变低 应用场景：拖拽画布或者拖拽窗口
function throttle(fn, delay) {
  var cur = 0;
  return (...rest) => {
    var exeTime = new Date().getTime();
    if (exeTime - cur > delay) {
      fn.apply(this, rest);
      cur = exeTime;
    }
  };
}
function throttle2(fn, delay) {
  let timer = null;
  return (...rest) => {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, rest);
        timer = null;
      }, delay);
    }
  };
}
```

## 19.反转链表

```js
var node = {
  val: 1,
  next: {
    val: 2,
    next: {
      val: 3,
      next: {
        val: 4,
        next: null,
      },
    },
  },
};
function revserLink(node) {
  var cur = node;
  var pre = null;
  while (cur) {
    var next = cur.next;
    cur.next = pre;
    pre = cur;
    cur = next;
  }
  return pre;
}
revserLink(node);
```

## 20.手写 Promise

```js
class MockPromise {
  constructor(exeFn) {
    this.data = undefined;
    this.cbs = [];
    const resolve = function (val) {
      setTimeout(() => {
        this.data = val;
        this.cbs.forEach((cb) => cb());
      });
    };
    exeFn(resolve);
  }
  then(onFulfilled, onReject) {
    return new MockPromise((resolve) => {
      this.cbs.push(() => {
        var val = onFullfilled(this.data);
        if (val instanceof MockPromise) {
          val.then(resolve);
        } else {
          resolve(val);
        }
      });
    });
  }
}
```

## 21.手写 vue 版 render

```js
function render(str, data) {
  var reg = /\{\{(\w+)\}\}/;
  if (reg.test(str)) {
    var key = reg.exec(str)[1];
    str = str.replace(reg, data[key]);
    return render(str, data);
  }
  return str;
}
render('name:{{name}},age:{{age}}', { name: 'cpp', age: 30 });
```

## 22.千分位分割以及包含小数点的分割

```js
function thousand(str) {
  return str.replace(/(?!^)(?=(\d{3})+$)/g, ',');
}
thousand('123456789');
//有小数点
var num2 = '123456789.1234';
num2.replace(/(?!^)(?=(\d{3})+\.)/g, ',');
// '123,456,789.1234'

function thousand(str) {
  let ans = [];
  str = str.split('').reverse();
  for (let i = 0; i < str.length; i++) {}
}
```

## 23.实现一个 node 异步函数的 promisify

promisify 作用是把**回调函数转成 promise 形式**

```js
// 输入：
// 原有的callback调用
fs.readFile('test.js', function (err, data) {
  if (!err) {
    console.log(data);
  } else {
    console.log(err);
  }
});
// 输出：
// promisify后
var readFileAsync = promisify(fs.readFile);
readFileAsync('test.js').then(
  (data) => {
    console.log(data);
  },
  (err) => {
    console.log(err);
  },
);
// node端的错误回调变成promise形式
function Promisify(fn) {
  return (...rest) => {
    return new Promise((resolve, reject) => {
      // rest.push((err, ...val) => {
      //   if (val) {
      //     resolve(val);
      //   } else {
      //     reject(err);
      //   }
      // });
      // fn.apply(this, rest);
      // rest[0] 约等于 test.js
      fn(rest[0], (err, ...val) {
        if (err) {
          reject(err)
        } else {
          resolve(val)
        }
      })
    });
  };
}
```

## 24.封装一个类使对象可以被 for of 遍历

[Generator](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c95264880c274584b55cc60d74e8a9f0~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

```js
class MockIterator {
  constructor(obj) {
    this.obj = obj;
    this.len = Object.keys(obj).length;
    this.i = 0;
  }
  [Symbol.iterator]() {
    return this;
  }
  next() {
    if (this.i < this.len) {
      return {
        done: false,
        value: this.obj[this.i++],
      };
    } else {
      return {
        done: true,
        value: undefined,
      };
    }
  }
}
var test = {
  0: 'cpp',
  1: '33',
  length: 2,
};
for (let item of new MockIterator(test)) {
  console.log(item);
}

const arr = ['a', 'b', 'c'];

// (1) 使用 for-of 循环
for (const element of arr) {
  console.log(element);
}

// (2) 手动循环
let iterator = arr[Symbol.iterator]();
while (true) {
  let result = iterator.next();
  if (result.done) break;
  console.log(result.value);
}
```

## 25.删除链表的一个节点

a. [只是删除其中的一个子节点](https://leetcode.cn/problems/delete-node-in-a-linked-list/submissions/210061020/)

```js
function deletenode(node) {
  node.val = node.next.val;
  node.next = node.next.next;
}
```

b.[2487. 从链表中移除节点](https://leetcode.cn/problems/remove-nodes-from-linked-list/)

c.[剑指 Offer 18. 删除链表的节点](https://leetcode.cn/problems/shan-chu-lian-biao-de-jie-dian-lcof/)

```js
/**
 * 给定单向链表的头指针和一个要删除的节点的值，定义一个函数删除该节点。返回删除后的链表的头节点。
 * 示例： 输入: head = [4,5,1,9], val = 5
输出: [4,1,9]
解释: 给定你链表中值为 5 的第二个节点，那么在调用了你的函数之后，该链表应变为 4 -> 1 -> 9.
 * @param {ListNode} head
 * @param {number} val
 * @return {ListNode}
 * 节点next指针直接指向下下一个节点
 */
var deleteNode = function (head, val) {
  var dummy = {
    val: null,
    next: head,
  };
  var cur = dummy;
  while (cur.next) {
    if (cur.next.val === val) {
      cur.next = cur.next.next;
      continue;
    }
    cur = cur.next;
  }
  return dummy.next;
};
```

## 26.手写 async/await

async/await 语法糖就是使用**Generator 函数+自动执行器**来运作的，注意只要实现 async 函数就是实现一个 Generator 函数+执行器的语法糖

```js
function mockAsync(fn) {
  return (...rest) => {
    var asyncFn = fn(...rest);
    return new Promise((resolve, reject) => {
      step('next');
      function step(key, ...name) {
        var genRes;
        try {
          genRes = asyncFn[key](...name);
        } catch (e) {
          reject(e);
        }
        const {value, done} = genRes
        if (done) {
            return resolve(value);
          } else {
            return Promise.resolve(value).then(
                (res) => {
                  return step('next', res);
                },
                (err) => {
                  return step('throw', err);
                },
              ),
          }
      }
    });
  };
}
var getData = () => new Promise((resolve) => setTimeout(() => resolve('data'), 1000));
var test = mockAsync(function* testG() {
  const data = yield getData();
  console.log('data1: ', data);
  const data2 = yield getData();
  console.log('data2: ', data2);
  return 'success';
});
test().then((res) => console.log(res, 'cpp'));
```

## 27.手写 pipe/redux 中的 compose

```js
function ten(x) {
  console.log('11');
  return x;
}
function twoTen(x) {
  console.log('22');
  return x * 2;
}
function threeTen(x) {
  console.log('33');
  return x * 3;
}
// 从左到右执行
function pipe(...rest) {
  if (!rest) return (x) => x;
  if (rest.length === 1) return rest[0];
  return (arg) => {
    return rest.reduce((pre, cur) => cur(pre), arg);
  };
}
var pipeFn = pipe(ten, twoTen, threeTen);
// 从右到左执行
// redux源码
function compose(...funcs) {
  if (funcs.length === 0) {
    return (arg) => arg;
  }
  if (funcs.length === 1) {
    return funcs[0];
  }
  return funcs.reduce(
    (a, b) =>
      (...args) =>
        a(b(...args)),
  );
}
var fn = compose(ten, twoTen, threeTen);
fn(10);
```

## 28.Promise.all/any/race/allSettled

```js
class MyPromise {
  static all(arr) {
    return new Promise((resolve, reject) => {
      var res = [];
      for (let [index, item] of arr.entries()) {
        Promise.resolve(item).then(
          (val) => {
            if (index === arr.length - 1) {
              resolve(res);
            }
            res[index] = val;
          },
          (err) => {
            reject(err);
          },
        );
      }
    });
  }
  static race(all) {
    return new Promise((resolve, reject) => {
      var res = [];
      for (let [index, item] of arr.entries()) {
        Promise.resolve(item).then(
          (val) => {
            resolve(val);
          },
          (err) => reject(err),
        );
      }
    });
  }

  // 两种方式
  // 只有等到所有 Promise 实例都返回结果落定时，不管是解决(fulfilled)还是拒绝(rejected)，合成的 Promise 才会结束。一旦结束，状态总是 fulfille
  static allSettled(all) {
    return Promise.all(
      all.map((item) => {
        return Promise.resolve(item).then(
          (val) => {status: 'fulfilled', value: val},
          (err) => {status: 'rejected', value: err},
        );
      }),
    );
  }

  static allSettled(arr) {
    return new Promise((resolve, reject) => {
      let count = 0;
      let res = [];
      for ([index, item] of all.entries()) {
        Promise.resolve(item).then(
          (res) => {
            if (index === arr.length - 1) {
              resolve(res);
            }
            res[index] = {
              value: res,
              status: 'fulfilled',
            };
          },
          (err) => {
            if (index === arr.length - 1) {
              resolve(res);
            }
            res[index] = {
              value: err,
              status: 'rejected',
            };
          },
        );
      }
    });
  }
}
```

## 29.请求并发控制

```js
async function pool(array, limit, iteratorFn) {
  var res = []; // 存放结果
  var arr = []; // 存储当前正在执行的异步任务
  for (let i = 0; i < array.length; i++) {
    // 调用iteratorFn函数创建异步任务
    var p1 = Promise.resolve().then(() => iteratorFn(array[i], array));
    // 保存新的异步任务
    res.push(p1);
    // Limit值小于或等于总任务个数时，进行并发控制
    if (array.length >= limit) {
      // 当任务完成后，从正在执行的任务数组中移除已完成的任务
      var p2 = p1.then(() => arr.splice(arr.indexOf(p2), 1));
      // 保存正在执行的异步任务
      arr.push(p2);
      if (arr.length >= limit) {
        // 等待较快的任务执行
        await Promise.race(arr);
      }
    }
  }
  return Promise.all(res);
}
```

## 30.手写 ajax

```js
function mockAjax(url, cb) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === xhr.DONE && xhr.status === 200) {
        cb(resolve(xhr.responseText));
      }
    };
    xhr.send();
  });
}
```

## 31.手写 jsonp

```js
// 如何调用？
function mockJsonp(url, cb) {
  var funName = '?cb=' + Math.random().toString().slice(2);
  var script = document.createElement('script');
  script.src = url + funName;
  script.async = true;
  document.body.appendChild(script);
  window[funName] = function (data) {
    cb(data);
    delete window[funName];
    document.body.removeChild(script);
  };
}
mockJsonp('http://xx', (res) => {
  console.log(res);
});

// 动态加入脚本 并执行回调函数
function loadScript(url, callback) {
  const node = document.createElement('script');
  node.setAttribute('type', 'text/javascript');
  node.defer = true;
  node.src = url;
  node.addEventListener('load', () => {
    callback && callback();
  });
  document.body.appendChild(node);
}
```

## 33.URL 参数解析

```js
function parseUrlParams(url = location.search) {
  var queryQarams = new URLSearchParams(url);
  var obj = {};
  for (let [key, val] of queryQarams.entries()) {
    obj[key] = val;
  }
  return obj;
}
parseUrlParams('?name=cpp&age=31&hobby=writing');
// {name: 'cpp', age: '31', hobby: 'writing'}
```

## 34.手写去重

```js
function removeDup(arr) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}
removeDup([1, 33, 44, 99, 11]);
```

## 35.useEvent

封装事件处理函数,在组件多次 render 时保持引用一致,函数内始终能获取到最新的 props 与 state

```js
import { useCallback, useRef, useLayoutEffect } from 'react';
function useEvent(fn) {
  const handleRef = useRef();
  useLayoutEffect(() => {
    handleRef.current = fn;
  });
  return useCallback((...arg) => {
    handleRef && handleRef.current(...arg);
  });
}
```

## 36.useFetch

```js

```

## 37.链表是否有环？

```js
// 链表是否有环 快慢指针
function hasCycle(head) {
  var slow = head;
  var fast = head;
  while (slow && fast && fast.next) {
    if (slow == fast) {
      return true;
    }
    slow = slow.next;
    fast = fast.next.next;
  }
  return false;
}
// 哈希表
function hasCycle(node) {
  var m = new Map();
  var cur = node;
  while (cur) {
    if (m.has(cur)) {
      return true;
    }
    m.set(cur, cur.value);
    cur = cur.next;
  }
  return false;
}
```

## 38.缓存函数

```js
var memorize = function (fn) {
  const cache = {};
  return function (...args) {
    const _args = JSON.stringify(args);
    return cache[_args] || (cache[_args] = fn.apply(this, args));
  };
};
var add = function (a, b) {
  console.log('函数缓存');
  return a + b;
};
var addFn = memorize(add);
var a1 = addFn(2, 6);
var a2 = addFn(2, 6);
var a3 = addFn(2, 6);
console.log(a1, a2, a3);
// 函数缓存
//8 8 8
```

## 39.手写函数重载

参数数量或者类型不一样，同名函数定义多次

```js
function heavyLoad(obj, name, fn) {
  var oldFn = obj[name];
  obj[name] = function (...rest) {
    if (rest.length === fn.length) {
      fn.apply(this, rest);
    } else {
      oldFn.apply(this, rest);
    }
  };
}
var test = { name: 'cpp' };
heavyLoad(test, 'show', () => {
  console.log('show one');
});
heavyLoad(test, 'show', (a, b) => {
  console.log('show two', a, b);
});
test.show();
test.show('wmh', 'cpp');
```

## 40.二叉树前中后序遍历(迭代方式)

```js
// 前序 根左右
function preOrder(node, res = []) {
  if (!node) return res;
  var stack = [node];
  while (stack.length) {
    var cur = stack.pop();
    res.push(cur.val);
    cur.right && stack.push(cur.right);
    cur.left && stack.push(cur.left);
  }
  return res;
}
// 中序 左根右
function inOrder(node, res = []) {
  if (!node) return res;
  var stack = [];
  var root = node;
  while (root || stack.length) {
    if (root) {
      stack.push(root.left);
      root = root.left;
    } else {
      root = stack.pop();
      res.push(cur.val);
      root = root.right;
    }
  }
  return res;
}
// 后序 左右根
function postOrder(node) {
  if (!node) return res;
  var stack = [node];
  while (stack.length) {
    var cur = stack.pop();
    res.push(cur.val);
    cur.left && stack.push(cur.left);
    cur.right && stack.push(cur.right);
  }
  return res.reverse();
}
```

## 41.冒泡排序和归并排序和计数排序

[计数排序](https://leetcode.cn/problems/sort-an-array/solutions/174838/shi-er-chong-pai-xu-suan-fa-bao-ni-man-yi-dai-gift/)

```js
function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        var temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}
bubbleSort([11, 3, 44, 1, 99, 7]);
// 归并排序 ??
// 分治法典型应用，分治算法思想很大程度上是基于递归的，也比较适合用递归来实现
// 顾名思义，分而治之。一般分为以下三个过程：
// 分解：将原问题分解成一系列子问题。
// 解决：递归求解各个子问题，若子问题足够小，则直接求解。
// 合并：将子问题的结果合并成原问题。
// 归并排序就是将待排序数组不断二分为规模更小的子问题处理，再将处理好的子问题合并起来，这样整个数组就都有序了。

var mergeSort = (arr) => {
  const merge = (right, left) => {
    var res = [];
    let i = 0,
      j = 0;
    while (i < left.length && j < right.length) {
      if (right[j] > left[i]) {
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
  const sort = (arr) => {
    if (arr.length === 1) return arr;
    var mid = Math.floor(arr.length / 2);
    var left = arr.slice(0, mid);
    var right = arr.slice(mid);
    return merge(mergeSort(left), mergeSort(right));
  };
  return sort(arr);
};
mergeSort([33, 11, 3, 4, 66, 1]);

// 计数排序
function countingSort(arr, maxValue) {
  let bucket = new Array(maxValue + 1),
    sortedIndex = 0;
  let arrLen = arr.length,
    bucketLen = maxValue + 1;
  for (var i = 0; i < arrLen; i++) {
    if (!bucket[arr[i]]) {
      bucket[arr[i]] = 0;
    }
    bucket[arr[i]]++;
  }
  for (var j = 0; j < bucketLen; j++) {
    while (bucket[j] > 0) {
      arr[sortedIndex++] = j;
      bucket[j]--;
    }
  }
  return arr;
}
countingSort([22, 111, 2, 3, 4, 55, 1], 122);
```

## 42.[滑动窗口，无重复字符的最长子串](https://leetcode.cn/problems/longest-substring-without-repeating-characters/)

```js
var lengthOfLongestSubstring = function (s) {
  var max = 0;
  var res = [];
  for (let item of s) {
    var index = res.indexOf(item);
    if (index > -1) {
      res.splice(0, index + 1);
    } else {
      res.push(item);
    }
    max = Math.max(max, res.length);
  }
  return max;
};
lengthOfLongestSubstring('pwwkew'); // kew
```

## 43.实现一个带缓存斐波那契数列

```js
function fibonce(n) {
  if (n <= 1) return 1;
  if (n === 2) return n;
  return fibonce(n - 1) + fibonce(n - 2);
}
fibonce(3);
```

## 44.最大子序和

```js
// 输入：nums = [-2,1,-3,4,-1,2,1,-5,4]
// 输出：6
// 解释：连续子数组 [4,-1,2,1] 的和最大，为 6 。
function maxSumChild(arr) {
  var max = 0;
  var sum = 0;
  for (let item of arr) {
    if (sum > 0) {
      sum = sum + item;
    } else {
      sum = item;
    }
    max = Math.max(max, sum);
  }
  return max;
}
maxSumChild([-2, 1, -3, 4, -1, 2, 1, -5, 4]);
```

## 45.实现简单的 hash 路由跟 history 路由!!!

> 这个是最难的！！！

### HashRouter

浏览器地址上 # 后面的变化，是可以被监听的，浏览器为我们提供了原生监听事件 **hashchange** ，它可以监听到如下的变化：

- 点击 a 标签，改变了浏览器地址
- 浏览器的前进后退行为
- 通过 **window.location.hash** 属性，改变当前页面展示

```html
<!DOCTYPE html>
<html lang="en">
  <body>
    <div>
      <ul>
        <li><a href="#/page1">page1</a></li>
        <li><a href="#/page2">page2</a></li>
      </ul>
      <!--渲染对应组件的地方-->
      <div id="route-view"></div>
    </div>
  </body>
  <script>
    // 第一次加载的时候，不会执行 hashchange 监听事件，默认执行一次
    // DOMContentLoaded 为浏览器 DOM 加载完成时触发
    window.addEventListener('DOMContentLoaded', load);
    window.addEventListener('hashchange', hashChange);
    let routerView = '';
    function load() {
      routerView = document.getElementById('route-view');
      hashChange();
    }
    function hashChange() {
      switch (location.hash) {
        case '#/page1':
          routerView.innerText = 'this is Page1';
          break;
        case '#/page2':
          routerView.innerText = 'this is Page2';
          break;
        default:
          routerView.innerText = 'this is Page default';
      }
    }
  </script>
</html>
```

### HistoryRouter

问题：

- a 标签的点击事件也是不会被 popstate 事件监听
- 调用 **history.pushState()** 或者 **history.replaceState()** 不会触发 popstate 事件

方案：

- 遍历 a 标签得到 href 中的 url 地址
- 通过**pushState** 去改变浏览器的 **location.pathname** 属性值
- 通过监听**popstate**事件(浏览器的前进后退)，手动执行回调函数，匹配相应路由

```html
<!DOCTYPE html>
<html lang="en">
  <body>
    <div>
      <ul>
        <li><a href="./page1">page1</a></li>
        <li><a href="./page2">page2</a></li>
      </ul>
      <div id="route-view"></div>
    </div>
  </body>
  <script>
    // 第一次加载的时候，不会执行 hashchange 监听事件，默认执行一次
    // DOMContentLoaded 为浏览器 DOM 加载完成时触发
    window.addEventListener('DOMContentLoaded', load);
    window.addEventListener('popstate', popStateChange);
    let routerView = '';
    function load() {
      routerView = document.getElementById('route-view');
      popStateChange();
      var aList = document.querySelectorAll('a[href]');
      aList.forEach((e) => {
        e.addEventListener('click', function (target) {
          target.preventDefault();
          var href = e.getAttribute('href');
          // pushstate方法能改变浏览器url pathName 且不会刷新页面
          history.pushState(null, '', href);
          // popstate事件只能监听到手动点击浏览器的前进或者返回
          popStateChange();
        });
      });
    }
    function popStateChange() {
      const lastPathName = location.pathname.split('/').pop();
      switch (lastPathName) {
        case 'page1':
          routerView.innerText = 'this is Page1';
          break;
        case 'page2':
          routerView.innerText = 'this is Page2';
          break;
        default:
          routerView.innerText = 'this is Page default';
      }
    }
  </script>
</html>
```

## 46.二叉树的层序遍历

```js
var node = {
  val: 1,
  left: {
    val: 2,
    left: null,
    right: {
      val: 3,
      left: null,
      right: null,
    },
  },
  right: {
    val: 4,
    left: null,
    right: {
      val: 5,
      left: {
        val: 6,
        left: null,
        right: null,
      },
      right: {
        val: 7,
        left: null,
        right: null,
      },
    },
  },
};

// 层序遍历
function levelOrder(node) {
  if (!node) return [];
  var queue = [node];
  var res = [];
  while (queue.length) {
    var arr = [];
    const len = queue.length;
    for (let i = 0; i < len; i++) {
      var last = queue.shift();
      last && arr.push(last.val);
      if (last.left) {
        queue.push(last.left);
      }
      if (last.right) {
        queue.push(last.right);
      }
    }
    res.push(arr);
  }
  return res;
}
levelOrder(node);
```

## 47.二叉树前中后序遍历(递归方式)

```js
// 前序 根左右
function preOrder(node) {
  var res = [];
  const dfs = (node) => {
    if (node) {
      res.push(node.val);
      dfs(node.left);
      dfs(node.right);
    }
  };
  dfs(node);
  return res;
}
// 中序 左根右
function inOrder(node) {
  var res = [];
  const dfs = (node) => {
    if (node) {
      dfs(node.left);
      res.push(node.val);
      dfs(node.right);
    }
  };
  dfs(node);
  return res;
}
// 后序 左右根
function postOrder(node) {
  var res = [];
  const dfs = (node) => {
    if (node) {
      dfs(node.left);
      dfs(node.right);
      res.push(node.val);
    }
  };
  dfs(node);
  return res;
}
```

## [48.如何实现无限累加的一个函数?](https://mp.weixin.qq.com/s/Bh5pGQoZBjdc-h5ukbp7HQ)

> 题目给个示例最好

```js
sum(1, 2, 3).valueOf(); //6
sum(2, 3)(2).valueOf(); //7
sum(1)(2)(3)(4).valueOf(); //10
sum(2)(4, 1)(2).valueOf(); //9
sum(1)(2)(3)(4)(5)(6).valueOf(); // 21
function sum(...rest) {
  // var res;
  // var add = (...arg) => {
  //   if (arg.length === rest.length) {
  //     res = rest.reduce((a, b) => a + b);
  //   }
  //   return (...arg1) => add(...[...arg1, ...arg]);
  // };
  // return {
  //   valueOf: add(),
  // };
  var add = (...arg) => sum(...arg, ...rest);
  add.valueOf = () => rest.reduce((a, b) => a + b);
  return add;
}
sum(1, 2, 3).valueOf();
```

还有一种类型差不多

```js
console.log(sum(1, 2)(3)()); // 6
console.log(sum(1, 2, 4)(4)()); // 11
function sum(...args) {
  let arr = [...args];
  return function temp(...arg) {
    if (arg.length) {
      arr.push(...arg);
      return temp;
    } else {
      let val = arr.reduce((a, b) => a + b, 0);
      arr = [];
      return val;
    }
  };
}
console.log(sum(1, 2)(3)());
```

## 49.NoSSR

```js
import { useEffect, useState } from 'react';

const NoSSR = (props) => {
  const { children } = props;
  const [init, setInit] = useState(false);
  useEffect(() => {
    setInit(true);
  }, []);
  if (init) {
    return <>{children}</>;
  } else {
    return null;
  }
};
```

## 50.数组随机展示以及随机取一个数字展示

```js
// 随机展示一个数字
var arr = [1, 2, 3, 4, 5, 6];
function randomDisplay(arr) {
  return arr[Math.floor(arr.length * Math.random())];
}
randomDisplay(arr);

// 打乱数组
function sanLuanArr(arr) {
  return arr.sort(() => 0.5 - Math.random());
}

function sanLunArr2(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i - 1));
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}
sanLunArr2(arr);
sanLuanArr(arr);
```

## 参考

- [handwriting](https://github.com/xiumubai/coding/tree/main)
