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
 */
```

## 1.手写 requestIdleCallback

requestIdleCallback 是一个可以在**浏览器空闲时期被调用的函数**，这使开发者能够在主事件循环上执行后台和低优先级工作，而不会影响延迟关键事件，如动画和输入响应

```js
var handle = window.requestIdleCallback(cb[,options])
```

手写简单版：

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

## 2.手写 observe

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
  // 改变被观察者的状态
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
// 订阅观察者
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
function loop(tree) {
  let node = tree;
  if (!node.length) return [];
  var res = [];
  for (let i = 0; i < node.length; i++) {
    var item = node[i];
    res.push({
      id: item.id,
      name: item.name,
      pid: item.pid,
    });
    if (item.children) {
      const last = loop(item.children);
      if (Array.isArray(last)) {
        res.push(...last.flat());
      } else {
        last && res.push(last);
      }
    }
  }
  return res;
}
loop(listTree);

// BFS
function loop2(tree, childName = 'children') {
  let queen = [];
  const res = [];
  queen = queen.concat(tree);
  while (queen.length) {
    const first = queen.shift();
    if (first[childName]) {
      queen = queen.concat(first[childName]);
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

## 26.解析二维码

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

## 参考