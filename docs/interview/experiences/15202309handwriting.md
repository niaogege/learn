---
title: 202309手写汇总(3)
order: 15
group:
  order: 0
  title: interview
nav:
  order: 3
  title: 'interview'
  path: /interview
---

> 08 因为结婚事宜 八月份只积累了 35 道

> 09 再接再厉。争取在加 20 道

> 还账 1120

```js
/**
 * 1.手写简易requestIdleCallback/cancelIdleCallback
 * 2.手写observe
 * 3.[手写useIntersection/useIntersectionObserver](https://www.30secondsofcode.org/react/s/use-intersection-observer/)
 * 4.禁止别人调试代码
 * 5.Promise.finally手写
 * 6.用js实现二叉树的定义和基本操作
 * 7.密码校验，要求包含大小写字母，数字，长度为6，至少满足三个条件
 * 8.用es5实现let和const
 * 9.用Promise实现每隔一秒输出1/2/3
 * 10.树转数组
 * 11.数组转树
 * 12.使用Promise封装异步加载图片的方法
 * 13.拼接Url参数和解析url参数
 * 14.实现一个类，其实例阔以链式调用，有一个sleep方法，一段时间之后在后续调用
 * 15.使用css 实现三角形
 * 16.使用css 实现无线循环的动画
 * 17.虚拟滚动？
 * 18.[请求超时重试?](https://github.com/xiumubai/coding/blob/main/promise/timeoutFail.js)
 * 19.校验html是否合法
 * 20.实现数组的旋转
 * 21.三数之和
 * 22.连续正整数之和
 * 23.手写ts版方法调用的注解
 * 24.自定义迭代器遍历斐波那契数列
 * 25.生成扑克牌的所有序列
 * 26.解析二维码
 * 27.react中的浅比较
 * 28.获取设备电池信息
 * 29.js实现一个可移除的监听器
 * 30.如何自定义一个事件，使某一个对象能够捕获到？
 * 31.如何实现一个 ORM 类似的 find 链式调用
 * 32.实现一个区间内的随机数
 * 33.实现阶乘(迭代/递归)
 * 34.FileReader使用
 * 35.取消请求
 * 36.将数字转换成汉语的输出，输入为不超过 10000 亿的数字
 * 37.两个字符串对比, 得出结论都做了什么操作, 比如插入或者删除
 * 38.给一个字符串, 找到第一个不重复的字符
 * 39.一个赛场中有5条赛道，现在有25匹马，在没有定时器的前提下最少跑多少圈可以角逐出前三名？
 * 40.vue模板解析
 * 41.增加数组原型 group 方法
 * 42.Vue 中的响应式机制是如何实现的？请手写代码来实现数据劫持（数据劫持即数据变化时触发回调函数）的简单示例
 * 43.算法：实现一个函数，将给定的十进制数转换为 36 进制表示
 * 44.useState hook
 * 45.判断一个二叉树是否对称，即左子树和右子树是否镜像对称
 * 46.给定一组乱序的区间，合并重叠的区间并返回结果。
 * 47.多叉树, 获取每一层的节点之和
 * 48.按照版本号由小到大排序
 * 49.【代码题】实现一个拼手气抢红包算法
 * 50.
 */
```

## 1.手写 requestIdleCallback

requestIdleCallback 是一个可以在**浏览器空闲时期被调用的函数**，这使开发者能够在主事件循环上执行后台和低优先级工作，而不会影响延迟关键事件，如动画和输入响应

```js
var handle = window.requestIdleCallback(cb[,options])
```

手写简单版：

维护一个队列，将在浏览器空闲时间内执行。它属于 Background Tasks API[2]，你可以使用 setTimeout 来模拟实现:

```ts
export const requestIdleCallback =
  (typeof self !== 'undefined' &&
    self.requestIdleCallback &&
    self.requestIdleCallback.bind(window)) ||
  function (cb) {
    let start = Date.now();
    return self.setTimeout(function () {
      cb({
        didTimeout: false,
        timeRemaining: function () {
          // () => 1
          return Math.max(0, 50 - (Date.now() - start));
        },
      });
    }, 1);
  };

export const cancelIdleCallback =
  (typeof self !== 'undefined' &&
    self.cancelIdleCallback &&
    self.cancelIdleCallback.bind(window)) ||
  function (id) {
    return clearTimeout(id);
  };
```

在 rIC 中执行任务时需要注意以下几点：

- 执行重计算而非紧急任务
- 空闲回调执行时间应该小于 50ms，最好更少
- 空闲回调中不要操作 DOM，因为它本来就是利用的重排重绘后的间隙空闲时间，重新操作 DOM 又会造成重排重绘

React 的**时间分片**便是基于类似 rIC 而实现，然而因为 rIC 的兼容性及 50ms 流畅问题,react 自制实现了一个 **scheduler** 调度器

## 2.手写观察者模式 Observer

观察者模式：一个对象（观察者**Observer**）订阅另一个对象（主题**Subject**），当主题被激活的时候，触发观察者里面的事件。

```js
// 哈哈 不知道咋写
// 被观察者
class Subject {
  constructor(name) {
    this.name = name;
    this.observers = [];
    this.state = 'init';
  }
  addObserver(observer) {
    this.observers.push(observer);
  }
  // 主题通知观察者改变状态
  notify(newstate) {
    this.state = newstate;
    this.observers.forEach((o) => o.update(newstate));
  }
}
// 观察者
class Observer {
  constructor(name) {
    this.name = name;
  }
  update(state) {
    console.log(`${this.name} Say:: ${state}`);
  }
}

var sub = new Subject('iphone');
var watcher1 = new Observer('wmh');
var watcher2 = new Observer('cpp');
// 观察者订阅主题(被观察者)
sub.addObserver(watcher1);
sub.addObserver(watcher2);

sub.notify('change new Iphone');

// wmh Say:: change new Iphone
// cpp Say:: change new Iphone
```

## 3.手写 useIntersection/useIntersectionObserver

```js
const useIntersectionObserver = (ref, options) => {
  const [isVisible, setIsVisible] = React.useState(false);
  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      observer.unobserve(ref.current);
    };
  }, []);
  return isVisible;
};
// 使用
const ref = React.useRef();
const onScreen = useIntersectionObserver(ref, { threshold: 0.5 });
```

## [4.禁止别人调试代码](https://mp.weixin.qq.com/s/sPcTqe5EU1KN-wZqXOsObw)

```js
// base version
(() => {
  function forbidden() {
    setInterval(() => {
      debugger;
    }, 50);
  }
  try {
    forbidden();
  } catch (e) {}
})();
// 2.0 version
(() => {
  function forbidden() {
    setInterval(() => {
      Function('debugger')();
    }, 50);
  }
  try {
    forbidden();
  } catch (e) {}
})();
// last version
(() => {
  function block() {
    (function() {return false}
    ['constructor']('debugger')
    ['call']())
  }
  try {block()}.catch(e){}
})()
```

## 5.Promise.finally 手写

```js
class MyPromise {
  constructor(exe) {
    this.data = null;
    this.cbs = [];
    const resolve = (res) => {
      setTimeout(() => {
        this.data = res;
        this.cbs.forEach((cb) => cb(res));
      });
    };
    exe(resolve);
  }

  then(onResolve) {
    return new MyPromise((resolve) => {
      this.cbs.push(() => {
        const res = onResolve(this.data);
        if (res instanceof MyPromise) {
          res.then(resolve);
        } else {
          resolve(res);
        }
      });
    });
  }
  // MyPromise.resolve
  static resolve(res) {
    return new MyPromise((resolve, reject) => {
      if (res instanceof MyPromise) {
        res.then(resolve, reject);
      } else {
        resolve(res);
      }
    });
  }
  // Promise.reject
  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }
  // Promise.all(arr)
  static all(arr) {
    let res = [];
    return new Promise((resolve, reject) => {
      for (let i = 0; i < arr.length; i++) {
        var p1 = arr[i];
        Promise.resolve(p1).then(
          (val) => {
            res[i] = val;
            if (i === arr.length - 1) {
              resolve(res);
            }
          },
          (err) => {
            reject(err);
          },
        );
      }
    });
  }
  finally(cb) {
    return this.then(
      (res) => {
        return MyPromise.resolve(cb()).then(() => res);
      },
      (err) => {
        return MyPromise.resolve(cb()).then(() => err);
      },
    );
  }
}
var p1 = new Promise((resolve, reject) => {
  resolve('111');
});
p1.then((res) => {
  console.log(res);
}).finally(() => {
  console.log('finally');
});
```

## 6.用 js 实现二叉树的定义和基本操作

## 7.密码校验，要求包含大小写字母，数字，长度为 6，至少满足三个条件

## 8.用 es5 实现 let 和 const

```js
// let 在 es6 出现以前我们一般使用无限接近闭包的形式或者立即执行函数的形式来定义不会被污染的变量。
(function () {
  var a = 'cpp';
  console.log(a);
})();
// const 声明一个只读的常量。一旦声明，常量的值就不能改变
function mockConst(key, val) {
  window.key = val;
  Object.defineProperty(window, key, {
    value: val,
    writable: false,
    enumerable: false,
    configurable: false,
  });
}
mockConst('obj', { i: 1 }); //定义obj
console.log('obj');
obj.i = 3; //可以正常给obj的属性赋值
```

## 9.用 Promise 实现每隔一秒输出 1/2/3

```js
// 只输出一次就行
var arr = [1, 2, 3];
arr.reduce((p, c) => {
  return p.then(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(console.log(c));
      }, 1000);
    });
  });
}, Promise.resolve());

const arr = [1, 2, 3];
arr.reduce(
  (p, x) => p.then(() => new Promise((r) => setTimeout(() => r(console.log(x)), 1000))),
  Promise.resolve(),
);
// 循环输出
function sleep(fn, delay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(fn());
    }, delay);
  });
}
function sayOne() {
  console.log(1);
}
function sayTwo() {
  console.log(2);
}
function sayThree() {
  console.log(3);
}
async function main2() {
  while (true) {
    await sleep(sayOne, 1000);
    await sleep(sayTwo, 1000);
    await sleep(sayThree, 1000);
  }
}
main2();
```

## 10.树转数组

```js
const listTree = [
  {
    id: 1,
    name: '部门1',
    pid: 0,
    children: [
      {
        id: 2,
        name: '部门1-1',
        pid: 1,
        children: [
          {
            id: 4,
            name: '部门1-1-1',
            pid: 2,
            children: [],
          },
        ],
      },
      {
        id: 3,
        name: '部门1-2',
        pid: 1,
        children: [
          {
            id: 5,
            name: '部门1-2-1',
            pid: 3,
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: 6,
    name: '部门2',
    pid: 0,
    children: [
      {
        id: 7,
        name: '部门2-1',
        pid: 6,
        children: [],
      },
    ],
  },
  {
    id: 8,
    name: '部门3',
    pid: 0,
    children: [],
  },
];
// BFS
function loop2(tree, childName = 'children') {
  let queen = [...tree];
  const res = [];
  while (queen.length) {
    const first = queen.shift();
    if (first[childName]) {
      queen.push(...first[childName]);
      delete first[childName];
    }
    res.push(first);
  }
  return res;
}
loop2(listTree);

// DFS
function treeToArr(tree) {
  var res = [];
  getTreeToArr(tree, res);
  return res;
}
function getTreeToArr(tree, res) {
  for (let item of tree) {
    if (item.children) {
      getTreeToArr(item.children, res);
      delete item.children;
    }
    res.push(item);
  }
  return res;
}
```

## 11.数组转树

```js
// 示例数组
const inputArray = [
  { id: 1, parentId: null, name: 'Node 1' },
  { id: 2, parentId: 1, name: 'Node 1.1' },
  { id: 3, parentId: 1, name: 'Node 1.2' },
  { id: 4, parentId: 2, name: 'Node 1.1.1' },
  { id: 5, parentId: null, name: 'Node 2' },
  { id: 6, parentId: 5, name: 'Node 2.1' },
];

function getChild(arr, res, pid) {
  for (let item of arr) {
    if (item.parentId === pid) {
      var newItem = {
        ...item,
        children: [],
      };
      res.push(newItem);
      getChild(arr, newItem.children, item.id);
    }
  }
}
// 递归 DFS
function arrToTree(arr, pid = null) {
  var res = [];
  getChild(arr, res, pid);
  return res;
}
arrToTree(inputArray);
// BFS
function mapArrToTree(arr) {
  var res = [];
  var map = {};
  for (let item of arr) {
    var id = item.id;
    var pid = item.parentId;
    if (!map[id]) {
      map[id] = {
        children: [],
      };
    }
    map[id] = {
      ...item,
      children: map[id]['children'],
    };
    var temp = map[id];
    if (pid === null) {
      res.push(temp);
    } else {
      map[pid].children.push(temp);
    }
  }
  return res;
}
mapArrToTree(inputArray);
```

## 12.使用 Promise 封装异步加载图片的方法

```js
function loadImg(src, cb) {
  var img = document.createComment('img');
  img.src = src;
  img.onload = (con) => cb(null, con);
  img.onerror = (err) => cb(err);
  document.appendChild(img);
}
function promiseLoadImg(src) {
  return new Promise((resolve, reject) => {
    loadImg(src, (err, con) => {
      if (err) {
        reject(err);
      }
      resolve(con);
    });
  });
}
promiseLoadImg('http://www.baidu.com')
  .then((res) => {
    console.log(res);
  })
  .then((err) => {
    console.log(err);
  });
// 两者合二为一
function LoadImg(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = function () {
      resolve(img);
    };
    img.onerror = function () {
      reject(new Error('Could not load image at'));
    };
    img.src = url;
  });
}
```

## 13.拼接 Url 参数和解析 url 参数

```js
// 拼接url参数
function objectToQueryString(obj) {
  const params = new URLSearchParams();
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      params.append(key, obj[key]);
    }
  }
  return params.toString();
}
objectToQueryString({ name: 'cpp', size: 100 });
// 解析url参数
function parseQueryString(key) {
  var queryString = location.search;
  var paramsString = new URLSearchParams(queryString);
  if (paramsString.has(key)) {
    return paramsString.get(key);
  }
  return paramsString;
}
parseQueryString('uid');
```

## 14.实现一个类，其实例阔以链式调用，有一个 sleep 方法，一段时间之后在后续调用

?? 没太搞懂

> https://juejin.cn/post/7299357176928354313#heading-2

```js
const boy = new PlayBoy('cpp');
boy.sayHi().sleep(2000).playA('王者').sleep(1000).play('code');
// 大家好我是Tom
// 1s 之后
// 我在玩王者
// 2s 之后
// 我在玩跳一跳
class PlayBoy {
  constructor(name) {
    this.name = name;
    this.queue = []; // 队列存放事务
    setTimeout(() => {
      this.next();
    }, 0);
    return this;
  }
  sayHi() {
    const fn = () => {
      console.log('大家好 我是：' + this.name);
      this.next();
    };
    this.queue.push(fn);
    return this;
  }
  sleep(num) {
    const fn = () => {
      setTimeout(() => {
        this.next();
      }, num);
    };
    this.queue.push(fn);
    return this;
  }
  play(name) {
    const fn = () => {
      console.log('我在玩' + name);
      this.next();
    };
    this.queue.push(fn);
    return this;
  }
  next() {
    const fn = this.queue.shift();
    fn && fn();
  }
}
```

## 15.使用 css 生成三角形

```css
.triangle {
  width: 0;
  height: 0;
  border-left: 50px solid transparent; /* 左边的边 */
  border-right: 50px solid transparent; /* 右边的边 */
  border-bottom: 100px solid #3498db; /* 底边，可以设置成你想要的颜色 */
}
```

## 16.使用 css 实现无线循环的动画

想要实现 CSS 动画的无限循环，其实主要就是要使用 **animation-iteration-count** 这个属性，将其设置为 **infinite**，动画就会一直循环播放

```html
<image class="anima" mode="widthFix" @click="nav" src="@/static/1_btn.png"></image>
```

```css
.anima {
  animation-name: likes; // 动画名称
  animation-direction: alternate; // 动画在奇数次（1、3、5...）正向播放，在偶数次（2、4、6...）反向播放。
  animation-timing-function: linear; // 动画执行方式，linear：匀速；ease：先慢再快后慢；ease-in：由慢速开始；ease-out：由慢速结束；ease-in-out：由慢速开始和结束；
  animation-delay: 0s; // 动画延迟时间
  animation-iteration-count: infinite; //  动画播放次数，infinite：一直播放
  animation-duration: 1s; // 动画完成时间
}

@keyframes likes {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(0.9);
  }
  50% {
    transform: scale(0.85);
  }
  75% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}
```

## 17.虚拟滚动？固定高度跟不固定高度两者方式实现

## 18.[请求超时重试?](https://github.com/xiumubai/coding/blob/main/promise/timeoutFail.js)

```js
function fn(val, timer = 2000) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(val);
      console.log('fn count', val);
    }, timer);
  });
}

function fail(timer) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('error');
      new Error('Request timeout');
    }, timer);
  });
}
/**
 * fn 需要执行的函数
 * limit 重试次数
 * timer 超时等待时间
 */
function retryRequest(fn, limit, timer) {
  let retryCount = 0;
  async function quest() {
    try {
      // 真正的请求fn和超时设置的方法进行竞速
      return await Promise.race([fn(retryCount), fail(timer)]);
    } catch (e) {
      retryCount = retryCount + 1;
      if (retryCount <= limit) {
        console.log(`Retry #${retryCount}`);
        return quest();
      } else {
        console.log('limit max retry count');
      }
    }
  }
  return quest();
}
retryRequest(fn, 3, 1000);
```

## 19.校验 html 是否合法

## [20.实现数组的轮转](https://leetcode.cn/problems/rotate-array/)

```js
// 示例用法
const array = [1, 2, 3, 4, 5]; // 4 5 1 2 3
const k = 2;
const rotatedArray = rotateArray(inputArray, k);
console.log(rotatedArray); // 输出: [4, 5, 1, 2, 3]

// first 使用额外的数组
var rotate = function (nums, k) {
  var len = num.length;
  var arr = new Array(len);
  for (let i = 0; i < len; i++) {
    arr[(i + k) % len] = nums[i];
  }
  for (let i = 0; i < len; i++) {
    nums[i] = arr[i];
  }
};
//  second 数组翻转 双指针
var reverse = (nums, start, end) => {
  while (start < end) {
    var temp = nums[start];
    nums[start] = nums[end];
    nums[end] = temp;
    start = start + 1;
    end = end - 1;
  }
};
var rotate2 = (nums, k) => {
  k = k % nums.length;
  reverse(nums, 0, nums.length - 1);
  reverse(nums, 0, k - 1);
  reverse(nums, k, nums.length - 1);
  return nums;
};
rotate2([1, 2, 3, 4, 5, 6], 2);
//
```

## 21.三数之和

> 贼难的一道题

## 22.连续正整数之和

## 23.手写 ts 版方法调用的注解(装饰器)

```ts
// 统计方法调用时间的方法装饰器
function timeLog(target: any, name: string, descriptor: any) {
  var func = descriptor.value;
  const decoratedFn = function () {
    if (typeof func === 'function') {
      console.time(name);
      const res = func.apply(target, arguments);
      console.timeEnd(name);
      return res;
    }
  };
  descriptor.value = decoratedFn;
  return descriptor;
}
```

看看如何调用这个 timeLog 注解

```ts
// class Person {
//   @timeLog
//   say() {
//     console.log('hello');
//   }
// }
// const person1 = new Person();
// person1.say();
```

在写一个节流版的装饰器

```ts
const throttle3 = (timer: number) => {
  let prev: number;
  return (target: any, name: string, descriptor: any) => {
    var func = descriptor.value;
    if (typeof func === 'function') {
      descriptor.value = function () {
        let now = new Date().getTime();
        if (now - prev > timer) {
          func.apply(target, arguments);
          prev = now;
        }
      };
    }
  };
};
```

组件使用

```ts
// import throttle from 'throttle';
// class App extends React.Component {
//   componentDidMount() {
//     window.addEveneListener('scroll', this.scroll);
//   }
//   componentWillUnmount() {
//     window.removeEveneListener('scroll', this.scroll);
//   }
//   @throttle(50)
//   scroll() {}
// }
```

## 24.自定义迭代器遍历斐波那契数列(**Symbol.iterator**)

```js
var fibonacci = {
  [Symbol.iterator]() {
    let pre = 0;
    let cur = 1;
    return {
      next() {
        [pre, cur] = [cur, cur + pre];
        return {
          value: cur,
          done: false,
        };
      },
    };
  },
};

for (let num of fibonacci) {
  if (num > 100) break;
  console.log(num);
}

class MockIterator {
  constructor(obj) {
    this.len = Object.keys(obj).length;
    this.i = 0;
    this.obj = obj;
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
```

## 25.生成扑克牌的所有序列

```js
var cards = {
  suits: ['♣️', '♦️', '♥️', '♠️'],
  court: ['J', 'Q', 'K', 'A'],
  [Symbol.iterator]: function* () {
    for (let suit of this.suits) {
      for (let i = 2; i <= 10; i++) {
        yield suit + i;
      }
      for (let c of this.court) {
        yield suit + c;
      }
    }
  },
};
var arr = [...cards];
console.log(arr);
```

## 26.用原生 JS 实现解析二维码

```js
function parseQrcode() {
  if ('BarcodeDetector' in window) {
    // 创建检测器
    var barcodeDetector = new BarcodeDetector({
      // formats 是检测的条码格式类型
      formats: ['qr_code'],
    });
    const eleImg = document.querySelector('img');
    barcodeDetector
      .detect(eleImg)
      .then((barcodes) => {
        barcodes.forEach((barcode) => {
          console.log('解析结果是：' + barcode.rawValue);
        });
      })
      .catch((e) => {
        console.log(`解析出错${e}`);
      });
  }
}
```

## 27.shallow 浅比较

```js
function shallow(obj1, obj2) {
  if (obj1 == obj2) return true;
  if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;
  for (let key in obj1) {
    if (obj1[key] !== obj2[key]) return false;
  }
  return true;
}
```

## 28.获取设备电池信息(**navigator.getBattery**)

```js
// 将返回一个 Promise 对象，它会解析为一个 BatteryManager 对象，我们可以使用它来读取设备的电池属性。
navigator.getBattery().then(function (battery) {
  // 获取设备电量剩余百分比
  var level = battery.level; //最大值为1,对应电量100%
  console.log('Level: ' + level * 100 + '%');

  // 获取设备充电状态
  var charging = battery.charging;
  console.log('充电状态: ' + charging);

  // 获取设备完全充电需要的时间
  var chargingTime = battery.chargingTime;
  console.log('完全充电需要的时间: ' + chargingTime);

  // 获取设备完全放电需要的时间
  var dischargingTime = battery.dischargingTime;
  console.log('完全放电需要的时间: ' + dischargingTime);
});
```

## 29.js 实现一个可移除的监听器(**Controller.abort**)

```html
<body>
  <table id="outside">
    <tr>
      <td id="t1">one</td>
    </tr>
    <tr>
      <td id="t2">two</td>
    </tr>
  </table>
  <script>
    var controller = new Controller();
    function modify() {
      var t2 = document.getElementById('t2');
      var isFirstT2 = t2.firstChild.nodeValue === 'two';
      t2.firstChild.nodeValue = isFirstT2 ? 'two' : 'three';
      if (t2.firstChild.nodeValue === 'three') {
        controller.abort();
      }
    }
    var ele = documment.getElementById('outside');
    ele.addEvenetListener('clicl', modify, {
      signal: controller.signal,
    });
  </script>
</body>
```

## 30.如何自定义一个事件，使某一个对象能够捕获到？

> 自定义事件需要使用 el.dispatchEvent(event) 方法来触发事件。

```html
<button type="button" id="btn">点我</button>
<script>
  var btn = document.getElementById('btn');
  var eve = new Event('msg', {});
  btn.addEvenetListener(
    'msg',
    function (e) {
      console.log('hello');
    },
    false,
  );
  btn.dispatchEvent(eve); // hello
</script>
```

## 31.如何实现一个 ORM 类似的 find 链式调用

如下代码所示，使用 find 函数实现链式调用

```js
var data = [
  { userId: 8, title: 'title1' },
  { userId: 11, title: 'other' },
  { userId: 15, title: null },
  { userId: 19, title: 'title2' },
];

function find(data) {
  this.value = [];
  return {
    data,
    value: this.value,
    where(obj) {
      this.value = this.data.filter((item) => {
        if (obj.title.test(item.title)) {
          return item;
        }
      });
      return this;
    },
    orderBy(name, sign) {
      // 倒序
      if (sign === 'desc') {
        this.value.sort((a, b) => b[name] - a[name]);
      } else {
        this.value.sort((a, b) => a[name] - b[name]);
      }
      return this;
    },
    execute() {
      return this;
    },
  };
}

// 查找data中，符合where中条件的数据，并根据orderBy中的条件进行排序
var result = find(data)
  .where({
    title: /\d$/, // 这里意思是过滤出数组中，满足title字段中符合 /\d$/的项
  })
  .orderBy('userId', 'desc'); // 这里的意思是对数组中的项按照userId进行倒序排列

//=> 返回 [{ userId: 19, title: 'title2'}, { userId: 8, title: 'title1' }];
console.log(result);
```

## 32.实现一个区间内的随机数

```js
function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
getRandom(-3, -1);
```

## 33.实现阶乘(迭代/递归)

```js
// dfs 1*2*3
function count(n) {
  if (n <= 0) return 0;
  if (n == 1) return n;
  return n * count(n - 1);
}
count(3);

// bfs
function count(n) {
  if (n <= 0) return 0;
  if (n == 1) return n;
  let ans = 1;
  for (let i = 2; i <= n; i++) {
    ans = ans * i;
  }
  return ans;
}
count(3);
// 带有缓存
function factorial(n) {
  let m = new Map();
  let fn = (n) => {
    if (n <= 1) return 1;
    if (m.has(n)) return m.get(n);
    let res = n * fn(n - 1);
    m.set(n, res);
    return res;
  };
  return fn(n);
}
factorial(4);
```

## 34.FileReader 使用

```js
function uploadFile(file) {
  return new Promise((resolve, reject) => {
    let len = 0;
    let reader = new FileReader();
    reader.readAsText(file[len]);
    reader.onabort = function (e) {
      console.log('文件读取异常:', e);
    };
    reader.onerror = function (e) {
      console.log('文件读取错误:', e);
    };
    reader.onload = function (e) {
      if (e.target) {
        len++;
        reader.readAsText(file[len]);
        resolve({
          size: e.target.size,
        });
      }
    };
  });
}
```

## 35.取消请求 AbortController

```js
function cancelRequest(url) {
  const controller = new AbortContoller();
  const { siganl } = controller;
  fetch(url, { siganl }).then((res) => {
    return res.json();
  });
  setTimeout(() => {
    controller.abort({
      type: 'USER_ABORT_ACTION',
      msg: '用户终止了操作',
    });
  }, 2000);
}
```

## [36.将数字转换成汉语的输出，输入为不超过 10000 亿的数字](https://www.nowcoder.com/practice/6eec992558164276a51d86d71678b300)

```js
// trans(123456) —— 十二万三千四百五十六
function trans(n) {
  let isLosf = n < 0;
  n = Math.abs(n).toString();
  let len = n.length;
  let res = [];
  let units = ['', '万', '亿'];
  for (let i = len; i > 0; i -= 4) {
    let item = numToCn(n.slice(Math.max(0, i - 4), i));
    res.push(item);
  }
  console.log(res, 'res11');
  for (let i = 0; i < res.length; i++) {
    res[i] = res[i] + units[i];
  }
  console.log(res, 'res22');
  if (isLosf) {
    res.push('负');
  }
  return res.reverse().join('');
}
function numToCn(n) {
  n = n.toString();
  let units = ['', '十', '百', '千'];
  let nums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  let len = n.length;
  let res = '';
  for (let i = 0; i < len; i++) {
    let num = n[i];
    if (num != '0') {
      if (i >= 1 && n[i - 1] == '0') res += nums[0];
      res += nums[num] + units[len - i - 1];
    }
  }
  if (len == 2 && n[0] == '1') {
    res = res.slice(1);
  }
  return res;
}
trans(123456);
```

## 37.两个字符串对比, 得出结论都做了什么操作, 比如插入或者删除

```js
pre = 'abcde123';
now = '1abc123';

// a前面插入了1, c后面删除了de
// 删除动作和添加动作
// 添加 位置和内容
// 删除 位置和内容
function diff(pre, now) {
  now = now.split('');
  let action = {
    delete: [],
    add: [],
  };
  let base = pre.split('');
  let i = 0;
  let j = 0;
  while (i < base.length && j < now.length) {
    if (base[i] == now[j]) {
      if (j > i) {
        action.add.push({
          cont: now.splice(i, j - i),
          index: base[i],
        });
        j = i;
      } else if (j < i && j >= 1) {
        action.delete.push({
          cont: base.splice(j, i - j),
          index: now[j - 1],
        });
        i = j;
      }
      i = i + 1;
      j = j + 1;
    } else if (base[i] != now[j]) {
      let index = now.indexOf(base[i]);
      if (index < 0) {
        i++;
      } else {
        j++;
      }
    }
  }
  console.log(action, 'action');
  return action;
}
diff('abcde123', '1abc123');
```

## 38.给一个字符串, 找到第一个不重复的字符

```js
// ababcbdsa;
// abcdefg;
function diff(a, b) {
  let len = Math.min(a.length, b.length);
  let index;
  for (let i = 0; i < len; i++) {
    if (a[i] !== b[i]) {
      index = i;
      break;
    }
  }
  return a[index];
}
diff('ababcbdsa', 'abcdefg');
```

## 39.一个赛场中有 5 条赛道，现在有 25 匹马，在没有定时器的前提下最少跑多少圈可以角逐出前三名？

## 40.vue 模板编译，正则解析

```js
// 输入: render(`{{msg}}-{{name}}`, {msg: 'chendap', name: 'wmh'}) 输出: 'chendap-wmh'

function render(template, data) {
  var reg = /\{\{(\w+)\}\}/;
  if (reg.test(template)) {
    const name = RegExp.$1.trim(); // name = reg.exec(template)[1]
    template = template.replace(reg, data[name]);
    return render(template, data);
  }
  return template;
}
// 测试
render(`{{msg}}-{{name}}`, { msg: 'chendap', name: 'wmh' }); // chendap-wmh
```

## 41.增加数组原型 group 方法,实现自定义分类

```js
// expected
var result = {
  bigger: [4, 5],
  smaller: [1, 2, 3],
};
var array = [1, 2, 3, 4, 5]; // sorted
Array.prototype.group = function (fn) {
  let arr = this || [];
  let res = {};
  for (let i = 0; i < arr.length; i++) {
    let val = fn.apply(this, [arr[i], i, this]);
    res[val] = res[val] ? [...res[val], arr[i]] : [arr[i]];
  }
  return res;
};
var res = array.group((num, index, array) => {
  return num > 3 ? 'bigger' : 'smaller';
});
console.log(res);
```

## 42.Vue 中的响应式机制是如何实现的？请手写代码来实现数据劫持（数据劫持即数据变化时触发回调函数）的简单示例

```js

```

## 43.算法：实现一个函数，将给定的十进制数转换为 36 进制表示

```js

```

## 44.useState hook

```js
const useState = (defaultVal) => {
  const val = useRef(defaultVal);
  const setVal = (newVal) => {
    if (typeof newVal === 'function') {
      val.current = newVal(val.current);
    } else {
      val.current = newVal;
    }
  };
  return [val, setVal];
};
export default useState;
```

## 45.判断一个二叉树是否对称，即左子树和右子树是否镜像对称

```js
// dfs
function isSym(root) {
  if (root == null) return true;
  var dfs = (left, right) => {
    if (left == null && right != null) {
      return false;
    } else if (left != null && right == null) {
      return false;
    } else if (left == null && right == null) {
      return true;
    } else if (left.val != right.val) {
      return false;
    }
    let outSide = dfs(left.left, right.right);
    let innerSide = dfs(left.right, right.left);
    return outSide && innerSide;
  };
  return dfs(root.left, root.right);
}
// bfs
function isSameBfs(root) {
  if (!root) return true;
  let queue = [root.left, root.right];
  while (queue.length) {
    let lefNode = queue.shift();
    let rightNode = queue.shift();
    if (rightNode == null && lefNode == null) {
      continue;
    }
    if (rightNode || lefNode || rightNode.val != lefNode.val) {
      return false;
    }
    queue.push(lefNode.left);
    queue.push(rightNode.right);
    queue.push(lefNode.right);
    queue.push(rightNode.left);
  }
  return true;
}
```

## 46.给定一组乱序的区间，合并重叠的区间并返回结果。

```js
outin: [
  [2, 4],
  [5, 6],
  [3, 9],
  [0, 6],
  [11, 15],
];
//expected [0, 9] [11, 15]
function merge(arr) {
  arr.sort((a, b) => a[0] - b[0]);
  let pre = arr[0];
  let res = [];
  for (let i = 1; i < arr.length; i++) {
    let cur = arr[i];
    if (cur[0] > pre[1]) {
      res.push(pre);
      pre = cur;
    } else {
      pre[1] = Math.max(pre[1], cur[1]);
    }
  }
  res.push(pre);
  return res;
}
merge([
  [2, 4],
  [5, 6],
  [3, 9],
  [0, 6],
  [11, 15],
]);
```

## 47.多叉树, 获取每一层的节点之和

```js
var res = layerSum({
  value: 2,
  children: [
    { value: 6, children: [{ value: 1 }] },
    { value: 3, children: [{ value: 2 }, { value: 3 }, { value: 4 }] },
    { value: 5, children: [{ value: 7 }, { value: 8 }] },
  ],
});

function layerSum(root) {
  var res = [];
  var dfs = (node, depth) => {
    if (node) {
      if (!res[depth]) {
        res[depth] = [];
      }
      res[depth].push(node.value);
      if (node.children) {
        node.children.forEach((child) => {
          dfs(child, depth + 1);
        });
        delete node.children;
      }
    }
  };
  dfs(root, 0);
  return res.map((item) => item.reduce((a, b) => a + b, 0));
}
console.log(res, 'res');

function layerSumBfs(root) {
  if (!root) return 0;
  let queue = [root];
  let res = [];
  while (queue.length) {
    let sum = 0;
    let len = queue.length;
    for (let i = 0; i < len; i++) {
      let first = queue.shift();
      sum += first.value;
      if (first.children) {
        first.children.forEach((child) => {
          queue.push(child);
        });
        delete first.children;
      }
    }
    res.push(sum);
  }
  return res;
}

function levelTra(root) {
  if (!root) return [];
  let queue = [root];
  let res = [];
  while (queue.length) {
    let len = queue.length;
    let arr = [];
    for (let i = 0; i < len; i++) {
      let cur = queue.shift();
      arr.push(cur.val);
      if (cur.left) {
        queue.push(cur.left);
      }
      if (cur.right) {
        queue.push(cur.right);
      }
    }
    res.push(arr);
  }
}
// 如果是二叉树的节点之和呢
var levelOrderDFS = function (root) {
  if (!root) return [];
  var res = [];
  var dfs = (root, depth) => {
    if (!root) return;
    if (!res[depth]) {
      res[depth] = [];
    }
    root.val != null && res[depth].push(root.val);
    if (root.left) {
      dfs(root.left, depth + 1);
    }
    if (root.right) {
      dfs(root.right, depth + 1);
    }
  };
  dfs(root, 0);
  return res;
};
```

## 48.按照版本号由小到大排序

```js
// 样例输入：versions = ['0.1.1', '2.3.3', '0.302.1', '4.2', '4.3.5', '4.3.4.5']
// 输出：['0.1.1', '0.302.1', '2.3.3', '4.3.4.5', '4.3.5']
function sortVersion(nums) {
  return nums.sort((a, b) => {
    a = a.split('.');
    b = b.split('.');
    let len = Math.max(a.length, b.length);
    for (let i = 0; i < len; i++) {
      let A = +a[i] || 0;
      let B = +b[i] || 0;
      if (A == B) continue;
      console.log(A - B, 'ab', A, B);
      return A - B;
    }
    return 0;
  });
}
sortVersion(['0.1.1', '2.3.3', '0.302.1', '4.2', '4.3.5', '4.3.4.5']);
```

## 49.【代码题】实现一个拼手气抢红包算法

## 50.

## 参考

- [字节跳动前端面经（3 年工作经验附详细答案）](https://mp.weixin.qq.com/s/MYfuUSNS7xIAT4RgZIMv0g)
