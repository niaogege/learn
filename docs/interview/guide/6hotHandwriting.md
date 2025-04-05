---
title: 202311手写汇总(4)-HotWriting
order: 16
group:
  order: 0
  title: guide
  path: /interview/guide
nav:
  order: 3
  title: 'interview'
  path: /interview
---

> 面试前的 easy 20240302

> 写了不下 10 遍，so what?

> 练习的不是手写，而是对于这份工作的热爱

> base 50 middle 30 hard 20 total 100

# 最热的手写,没有之一,没有准备好，就不要出去面试

## 1.apply/call

```js
Function.prototype.myApply = function (context, rest) {
  let obj = new Object(context) || window;
  let sys = Symbol('apply');
  obj[sys] = this;
  let res = obj[sys](...rest);
  delete obj[sys];
  return res;
};
```

## 2.bind

```js
Function.prototype.myBind = function (context) {
  let self = this;
  let arg = Array.prototype.slice.call(arguments, 1);
  let bindFn = function () {
    let arg1 = Array.prototype.slice.call(arguments);
    // bind后的函数构造函数调用 this指向当地new出来的对象
    // 普通函数调用 this指向context
    self.apply(this instanceof self ? this : conext, [...arg, ...arg1]);
  };
  let BridgeFn = function () {};
  BridgeFn.prototype = this.prototype;
  bindFn.prototype = new BridgeFn();
  return bindFn;
};
```

## 3.new

```js
function mockNew(fn, ...rest) {
  let target = Object.create(fn.prototype);
  let res = fn.apply(tagget, rest);
  return res instanceof Object ? res : target;
}
```

## 4.compose 洋葱模型实现

```js
function compose(mw) {
  return (ctx, next) => {
    return dispath(0);
    function dispatch(i) {
      let fn = mw[i];
      if (i == mw.length) fn = next;
      // 当 fn 为空的时候，就会开始执行 next() 后面部分的代码
      if (!fn) {
        return Promise.resolve();
      }
      try {
        return Promise.resolve(fn(ctx, () => dispatch(i + 1)));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  };
}
```

## 5.instanceof 实现

```js
function mockInstanceOf2(l, r) {
  l = Object.getPrototypeOf(l);
  while (l) {
    if (l == r.prototype) {
      return true;
    }
    l = Object.getPrototypeOf(l);
  }
  return false;
}
function mockInstanceOf(l, r) {
  return r.prototype.isPrototypeOf(l);
}
```

## 6.reduce/map 实现

```js
Array.prototype.mockReduce = function (fn, init) {
  let arr = [];
  let res = init ? init : arr[0];
  let startIndex = init ? 0 : 1;
  for (let i = startIndex; i < arr.length; i++) {
    res = fn.call(this, res, arr[i], i, arr);
  }
  return res;
};

Array.prototype.mockMap = function (fn, context) {
  let arr = this || [];
  let res = [];
  for (let i = 0; i < arr.length; i++) {
    res.push(fn.call(context, arr[i], i, arr));
  }
  return res;
};
```

## 7.redux 中的 pipe 和 compose 组合

```js
// 从右到左
const compose = (...funs) => {
  if (funs.length == 0) {
    return (...arg) => arg;
  }
  if (funs.length == 1) return funs(0);
  return funs.reduce((pre, cur) => {
    return (...arg) => pre(cur(...arg));
  });
};
// 从左到右
const pipe = (...funs) => {
  if (funs.length == 0) {
    return (...arg) => arg;
  }
  if (funs.length == 1) return funs(0);
  return (...arg) => {
    return funs.reduce((a, b) => {
      return b(a);
    }, arg);
  };
};
```

## 8.深浅拷贝

```js
function deepClone(obj) {
  if (typeof obj != 'object') return obj;
  let res = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      res[key] = typeof obj[key] == 'object' ? deepClone(obj[key]) : obj[key];
    }
  }
  return res;
}
```

## 9.节流和防抖

```js
function debounce(fn, delay) {
  let timer;
  return function (...rest) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, rest);
      timer = null;
    }, delay);
  };
}
function throttle(fn, delay) {
  let pre;
  return function (...rest) {
    let now = new Date().getTime();
    if (now - pre > delay) {
      fn.apply(this, rest);
      pre = now;
    }
  };
}
```

## 10.选择排序/插入排序

```js
function swap(arr, i, j) {
  let tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
}
function selectSort(arr) {
  let min;
  for (let i = 0; i < arr.length; i++) {
    min = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[min] > arr[j]) {
        min = j;
      }
    }
    swap(arr, min, i);
  }
  return arr;
}
selectSort([11, 2, 11, 444, 2, 333, 4, 555]);
function insertSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let j = i;
    while (j > 0 && arr[j - 1] > arr[j]) {
      swap(arr, j - 1, j);
      j--;
    }
  }
  return arr;
}
insertSort([11, 2, 11, 444, 2, 333, 4, 555]);
```

## 11.LRU

```js
class LRU {
  constructor(limit) {
    this.cache = new Map();
    this.limit = limit;
  }
  get(key) {
    if (this.cache.has(key)) {
      let val = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, val);
    }
    return -1;
  }
  set(key, val) {
    let size = this.cache.size;
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (size >= this.limit) {
      let oldKey = this.cache.keys().next().value;
      this.cache.delete(oldKey);
    }
    this.cache.set(key, val);
  }
}
```

## 12.发布订阅模式

```js
class EventEmitter {
  constructor() {
    this.events = {}
  }
  on(type, fn){
    if(this.events[type] this.events[type].length) {
      this.events[type].push(fn)
    } else {
      this.events[type] = [fn]
    }
  }
  emit(type, ...rest){
    if(this.events[type] this.events[type].length) {
      this.events[type].apply(this, rest)
    }
  }
  off(type, fn){
    if(this.events[type] this.events[type].length) {
      this.events[type].filter((item) => item != fn)
    }
  }
  once(type, fn){
    let oneFn = (...rest) => {
      fn(...rest)
      this.off(type, oneFn)
    }
    this.on(type, oneFn)
  }
}
```

## 13.手写 Promise/Promise.all/race/allSetted

```js
class Promise {
  data = undefined;
  status = 'pending';
  static onFulfilled = 'fulfilled';
  static onRejected = 'rejected';
  onFulfilledCbs = [];
  onRejectedCbs = [];
  constructor(exe) {
    const resolve = (val) => {
      setTimeout(() => {
        this.data = val;
        this.status = Promise.onFulfilled;
        this.onFulfilledCbs.forEach((cb) => cb(val));
      });
    };
    const reject = (res) => {};
    exe(resolve, reject);
  }
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled == 'function' ? onFulfilled : (e) => e;
    onRejected = typeof onRejected == 'function' ? onRejected : (e) => e;
    let p2 = new Promise((resolve, reject) => {
      if (this.status === 'pending') {
        this.onFulfilledCbs.push(() => {
          try {
            let x = onFulfilled(this.data);
            this.parsePromise(p2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
        this.onRejectedCbs.push(() => {
          try {
            let x = onRejected(this.data);
            this.parsePromise(p2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      }
      if (this.status === Promise.onFulfilled) {
        try {
          let x = onFulfilled(this.data);
          this.parsePromise(p2, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      }
      if (this.status === Promise.onRejected) {
        try {
          let x = onRejected(this.data);
          this.parsePromise(p2, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      }
    });
    return p2;
  }
  parsePromise(promise, x, resolve, reject) {
    if (x == promise) {
      reject(new TypeError('error'));
    }
    try {
      if (x instanceof Promise) {
        x.then(resolve);
      } else {
        resolve(x);
      }
    } catch (e) {
      reject(e);
    }
  }
  static resolve(item) {
    return new Promise((resolve, reject) => {
      if (item instanceof Promise) {
        item.then(resolve);
      } else {
        resolve(item);
      }
    });
  }
  // 好难记！！
  static finally(cb) {
    // return Promise.resolve(cb()).then((val) => val);
    return this.then(
      (res) => {
        return Promise.resolve(cb()).then(() => res);
      },
      (err) => {
        return Promise.resolve(cb()).then(() => err);
      },
    );
  }
  all(arr) {
    return new Promise((resolve, reject) => {
      let ans = [];
      for (let [key, val] of arr.entries()) {
        Promise.resolve(val).then(
          (res) => {
            ans[key] = res;
            if (key == arr.length - 1) {
              resolve(ans);
            }
          },
          (err) => {
            reject(err);
          },
        );
      }
    });
  }
}
var p1 = new Promise((resolve) => {
  resolve('cpp');
});
p1.then((val) => console.log(val)).finally(() => {
  console.log('finally');
});
```

## 14.async/awit

```js
function mockGeneratorAsync(fn) {
  return (...rest) => {
    let gFN = fn.apply(this, rest);
    return new Promise((resolve, reject) => {
      step('next');
      function step(key, arg) {
        let res;
        try {
          res = gFN[key](...arg);
        } catch (e) {
          reject(e);
        }
        const { done, value } = res;
        if (done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(
            (ans) => {
              return step('next', ans);
            },
            (err) => {
              return step('throw', err);
            },
          );
        }
      }
    });
  };
}
```

## 15.请求并发限制

```js
async function LimitRequest(arr, limit, fn) {
  let queue = [];
  let ans = [];
  for (let item of arr) {
    let p1 = Promise.resolve(item).then((val) => fn(val));
    ans.push(p1);
    if (arr.length >= limit) {
      let p2 = p1.then(() => {
        return queue.splice(queue.indexOf(p2), 1);
      });
      // 保存正在执行的异步任务
      queue.push(p2);
      if (queue.length >= limit) {
        // 等待较快的任务执行
        await Promise.race(queue);
      }
    }
  }
  return Promise.all(ans);
}
```

## 16.ajax

```js
function mockAjax(url, option) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === xhr.DONE) {
        if (xhr.status == 200) {
          resolve(xhr.responseText);
        } else {
          reject(xhr.responseText);
        }
      }
    };
    xhr.send();
  });
}
```

## 17.jsonp

```js
function mockJsonp(url) {
  return new Promise((resolve, reject) => {
    let fnName = 'jsonp' + new Date().getTime();
    let script = document.createElement('script');
    script.src = url + '?cb=' + fnName;
    script.defer = true;
    document.body.appendChild(script);
    window[fnName] = function (val) {
      resolve(val);
      document.body.removeChild(script);
      delete window[fnName];
    };
  });
}
```

### 18.手写虚拟 dom

```js
function mockRender(vnode, parent) {
  let mount = parent ? el => parent.appendChild(el) : el => el;
  if(type vnode.type == 'string') {
    mount(document.createTextNode(vnode.type))
  } else {
    let dom = mount(document.createElement(vnode.type))
    // 设置prop属性
    if(vnode.props) {
      Object.keys(vnode.props).forEach((key) => {
        let val = vnode.props[key]
        dom.setAttribute(key, val)
      })
    }
    // 遍历子节点
    if(vnode.children) {
      vnode.children.forEach((child) => {
        docuemnt.appendChild(mockRender(child, parent))
      })
    }
    return dom
  }
}
```

## 19.对象/数组去重

```js

```

## 20.大数相加

```js
function bigNumAdd(a, b) {
  let len = Math.max(a.length, b.length);
  a = a.padStart(len, '0');
  b = b.padStart(len, '0');
  let res = '';
  let flag = 0;
  let i = len - 1;
  while (i >= 0) {
    flag = Number(a[i]) + Number(b[i]) + flag;
    res = (flag % 10) + res;
    flag = Math.floor(flag / 10);
    i--;
  }
  return flag == '1' ? '1' + res : res;
}
bigNumAdd('22', '100');
```

## 21.数组/对象扁平化

```js
// 为啥面试一变化就做不出来呢
function flatten(arr, depth) {
  let stack = [...arr];
  let start = 1;
  let ans = [];
  while (stack.length) {
    let cur = stack.pop();
    if (Array.isArray(cur) && start < depth) {
      stack.push(...cur);
      start++;
    } else {
      ans.push(cur);
    }
  }
  return ans.reverse();
}
function flattenObj(obj, res = {}, path = '', isArray = false) {
  for (let [key, val] of Object.entries(obj)) {
    if (Array.isArray(val)) {
      let tmp = isArray ? `${path}[${key}]` : `${path}${key}`;
      flattenObj(val, res, tmp, true);
    } else if (typeof val == 'object') {
      let tmp = isArray ? `${path}[${key}].` : `${path}${key}.`;
      flattenObj(val, res, tmp, false);
    } else {
      let tmp = isArray ? `${path}[${key}]` : `${path}${key}`;
      res[tmp] = val;
    }
  }
  return res;
}
flattenObj({
  test: {
    name: [1, 2, 3],
    age: 'cpp',
  },
});
```

## 22.lodash.get/set

```js
function lodashGet(obj, path, defaultVal = 'undefiend') {
  let paths = path.replace((/\[(\d+)\]/g, '.$1')).split('.');
  let res = obj;
  for (let p of paths) {
    res = res[p];
    if (!res) {
      return defaultVal;
    }
  }
  return res;
}
var test = {
  obj: {
    cpp: {
      name: 'cdp',
    },
  },
  other: [
    {
      name: 'wmh',
    },
  ],
};
lodashGet(test, 'obj.cpp.name');
lodashGet(test, 'other[0].name');
function lodashSet(obj, path, val) {}
```

## 23.场景应用题, 红绿灯问题

```js
function red() {
  console.log('red 1000');
}
function green() {
  console.log('green 2000');
}
function yellow() {
  console.log('yellow 3000');
}
function mockDelay(fn, timer) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(fn());
    }, timer);
  });
}
function main() {
  return Promise.resolve()
    .then(() => mockDelay(red, 1000))
    .then(() => mockDelay(green, 2000))
    .then(() => mockDelay(yellow, 3000))
    .then(() => main());
}
main();
```

## 24.实现每隔 1 秒打印 1/2/3/4

```js
function print(n) {
  for (let i = 1; i <= n; i++) {
    // first
    setTimeout(() => {
      console.log(i);
    }, i * 1000);
    // second
    (function (i) {
      setTimeout(() => {
        console.log(i);
      }, i * 1000);
    })(i);
  }
}
print(4);
```

## 25.数组转树(dfs/bfs)

```js
// arr => tree
// 示例数组
var inputArray = [
  { id: 1, parentId: null, name: 'Node 1' },
  { id: 2, parentId: 1, name: 'Node 1.1' },
  { id: 3, parentId: 1, name: 'Node 1.2' },
  { id: 4, parentId: 2, name: 'Node 1.1.1' },
  { id: 5, parentId: null, name: 'Node 2' },
  { id: 6, parentId: 5, name: 'Node 2.1' },
];
function arrToTree(arr) {
  let res = [];
  let dfs = (arr, res, parentId) => {
    for (let item of arr) {
      if (parentId == item.parentId) {
        let obj = {
          children: [],
          ...item,
        };
        res.push(obj);
        dfs(arr, obj.children, item.id);
      }
    }
  };
  dfs(arr, res, null);
  return res;
}
arrToTree(inputArray);

// BFS
function arrToTreeBfs(arr) {
  let res = [];
  arr.forEach((item) => {
    let parent = arr.find((node) => node.id == item.parentId);
    if (parent) {
      parent.children = parent.children || [];
      parent.children.push(item);
    } else {
      res.push(item);
    }
  });
  return res;
}
arrToTreeBfs(inputArray);
```

## 26.树转数组

```js
// tree => arr
var listTree = [
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
];
function treeToArrDFS(arr) {
  let res = [];
  let dfs = (arr, res) => {
    for (let item of arr) {
      if (item.children && item.children.length) {
        dfs(item.children, res);
      }
      delete item.children;
      res.push(item);
    }
  };
  dfs(arr, res);
  return res;
}
treeToArrDFS(listTree);
function treeToArrBFS(arr) {
  let queue = [...arr];
  let res = [];
  while (queue.length) {
    let len = queue.length;
    for (let i = 0; i < len; i++) {
      let cur = queue.shift();
      if (cur.children && cur.children.length) {
        queue.push(...cur.children);
      }
      delete cur.children;
      res.push(cur);
    }
  }
  return res;
}
```

## 27.日期格式化

```js
// 实现日期格式话
// dateFormat(new Date("2024-02-01"), "yyyy/MM/dd"); // 2024/02/01
function dateFormat(date, format) {
  let day = date.getDate();
  let mon = date.getMonth() + 1;
  let year = date.getFullYear();
  format = format.replace(/yyyy/i, year);
  format = format.replace(/MM/i, mon);
  format = format.replace(/dd/i, day);
  return format;
}
dateFormat(new Date('2024-02-20'), 'yyyy/MM/dd');
```

## 28.数组[1,2,3],每隔一秒打印一个数字

```js
function print(arr) {
  return arr.reduce((pre, cur) => {
    return pre.then(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(console.log(cur));
        }, 1000);
      });
    });
  }, Promise.resolve());
}
print([1, 2, 3, 4]);
```

## 29.手写类型判断函数

> 如果是 null，直接返回 String(null)；基本类型和函数，直接使用 typeof；其它引用类型，使用 Object.prototype.toString.call。

```js
function getType(val) {
  let type = '';
  if (val == null) return null;
  if (typeof val !== 'object') {
    return typeof val;
  } else {
    let vals = Object.prototype.toString.call(val);
    return vals.slice(8, -1).toLowerCase();
  }
}
getType([]); // array
getType({}); // object
getType(Promise.resolve()); // promise
```

## 30.实现虚拟 dom

```js
function mockRender(node, parent) {}
let vNode = {
  type: 'div',
  props: {},
  children: [
    {
      type: 'span',
      props: {},
      children: [],
    },
  ],
};
mockRender(vNode, docuement.getElementById('#app'));
```

## 31.实现观察模式

```js
class Subject {
  constructor(name) {
    this.name = name;
    this.obsList = [];
  }
  addOb(observer) {
    this.obsList.push(observer);
  }
  removeOb(observer) {
    this.obsList = this.obsList.filter((cb) => cb != observer);
  }
  notify(...arg) {
    this.obsList.forEach((fn) => fn.update(...arg));
  }
}
class Observer {
  constructor(name) {
    this.name = name;
  }
  update(arg) {
    console.log(this.name + 'update:' + arg);
  }
}
let ob1 = new Observer('cpp');
let ob2 = new Observer('wmh');
let Sub = new Subject('sub');
Sub.addOb(ob1);
Sub.addOb(ob2);
Sub.notify('test1');
```

## 32.图片懒加载

```js
function lazyLoadImg(imgs, options) {
  let Observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const { target, intersectionRatio } = entry;
      if (intersectionRatio > 0 && target) {
        const trueUrl = target.dataset.src;
        target.src = trueUrl;
        target.onerror = function (err) {
          // 错误的时候展示默认图片
          if (e.type == 'error') {
            target.src = options.defaultImg;
          }
        };
        Observer.unobserve(target);
      }
    });
  });
  imgs.forEach((img) => Observer.observe(img));
}
```

## 33.实现简单 hash 路由

```js
class Route {
  constructor() {
    this.routes = [];
    this.currentHash = '';
    this.freshRoute = this.freshRoute.bind(this);
    window.addEventListener('load', this.freshRoute, false);
    window.addEventListener('hashchange', this.freshRoute, false);
  }
  // 存储
  storeRoute(path, cb) {
    this.routes[path] = cb || function () {};
  }
  // 刷新
  freshRoute() {
    this.currentHash = location.hash.slice(1) || '/';
    this.routes[this.currentHash]();
  }
}
```

## 34.实现加减乘除链式调用, 类似 jQuery 式用法

## 35.场景应用题，实现 Array.prototype.flatMap

```js
var array1 = [1, 4, 9, 16];
// pass a function to map
var map1 = array1.flatMap((x) => (x === 1 ? [] : [x * 2]));

console.log(map1);
// expected output: Array [8, 18, 32]

Array.prototype.mockFlatMap = function (fn, context) {
  let arr = this || [];
  let res = [];
  for (let i = 0; i < arr.length; i++) {
    let remain = fn.call(this, arr[i], i, arr);
    if (Array.isArray(remain)) {
      // 递归  +
      res.push(...remain.mockFlatMap((x) => x));
    } else {
      res.push(remain);
    }
  }
  return res;
};
var map2 = array1.mockFlatMap((x) => (x === 1 ? [] : [x * 2]));
console.log(map2); // [8,18,32]
var test2 = [1, 2, 1];
var result = test2.flatMap((num) => (num === 2 ? [2, 2] : 1));
// Expected output: Array [1, 2, 2, 1]
console.log(result);
var res2 = test2.mockFlatMap((num) => (num === 3 ? [2, 2] : 1));
console.log(res2); // [1,1,1]
```

## 36.场景应用题，实现 Array.prototype.group,自定义分类

```js
var array = [1, 2, 3, 4, 5]; // sorted
// expected
var result = {
  bigger: [4, 5],
  smaller: [1, 2, 3],
};
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

## 37.判断两个数组内容是否相同

```js
function isSameArr(a, b) {
  if (a.length != b.length) return false;
  let m = new Map();
  // a塞到m
  for (let item of a) {
    if (m.has(item)) {
      m.set(item, m.get(item) + 1);
    } else {
      m.set(item, 1);
    }
  }
  for (let item of b) {
    let val = m.get(item);
    if (val == undefined || val < 1) return false;
    m.set(item, val - 1);
  }
  return true;
}
```

## 38.实现 (5).add(3).minus(2) 功能

```js
Number.prototype.add = function (n) {
  return this.valueOf() + n;
};
Number.prototype.minus = function (n) {
  return this.valueOf() - n;
};
// test
(5).add(3).minus(2);
```

## 39.场景应用题,要求设计 LazyMan 类，实现以下功能

> [要求设计 LazyMan 类，实现以下功能](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/98)

```js
LazyMan('Tony');
// Hi I am Tony

LazyMan('Tony').sleep(10).eat('lunch');
// Hi I am Tony
// 等待了10秒...
// I am eating lunch

LazyMan('Tony').eat('lunch').sleep(10).eat('dinner');
// Hi I am Tony
// I am eating lunch
// 等待了10秒...
// I am eating diner

LazyMan('Tony').eat('lunch').eat('dinner').sleepFirst(5).sleep(10).eat('junk food');
// Hi I am Tony
// 等待了5秒...
// I am eating lunch
// I am eating dinner
// 等待了10秒...
// I am eating junk food
```

```js
class LazyManClass {
  constructor(name) {
    this.name = name;
    this.queue = [];
    console.log(`Hi I am ${name}`);
    setTimeout(() => {
      this.next();
    }, 0);
  }

  sleepFirst(time) {
    const fn = () => {
      setTimeout(() => {
        console.log(`等待了${time}秒...`);
        this.next();
      }, time);
    };
    this.queue.unshift(fn);
    return this;
  }

  sleep(time) {
    const fn = () => {
      setTimeout(() => {
        console.log(`等待了${time}秒...`);
        this.next();
      }, time);
    };
    this.queue.push(fn);
    return this;
  }

  eat(food) {
    const fn = () => {
      console.log(`I am eating ${food}`);
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

function LazyMan(name) {
  return new LazyManClass(name);
}
```

## 40.实现 SWR(stale-while-revalidate)机制

一种由 HTTP RFC 5861 推广的 HTTP 缓存失效策略

```js
let cache = new Map();
async function swr(cacheKey, fetcher, cacheTime) {
  let data = cache.get(cacheKey) || { value: null, time: 0, promise: null };
  cache.set(cacheKey, data);
  const isStaled = Date.now() - data.time > cacheTime;
  if (isStaled && !data.promise) {
    data.promise = fetcher()
      .then((val) => {
        data.value = val;
        data.time = Date.now();
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        data.promise = null;
      });
  }
  if (data.promise && !data.value) {
    await data.promise;
  }
  return data.value;
}
function MockPromise() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('cpp');
    });
  });
}
const test = await MockPromise();
swr('cache', MockPromise, 1000);
```

## 41.如何实现 shallow 浅比较

```js

```

## 42.如何自定义一个事件，使某一个对象能够捕获到？

```js

```

## 43.实现一个 node 异步函数的 promisify

promisify 作用是把回调函数转成 promise 形式？

即调用该回调函数的时候有 2 个参数，第一个是错误信息，其次才是真正要返回的内容，Promisify 就是把第二个参数转化为 promise

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
function promisify(fn) {
  return (...arr) =>
    new Promise((resolve, reject) => {
      arr.push((err, ...val) => {
        if (err) {
          reject(err);
        } else {
          resolve(val);
        }
      });
      fn.apply(this, arr);
      // Reflect.apply(fn, this, arr);
    });
}
```

## 44.实现字符串压缩

```js
// abbccccaaa->a1b2c4a3
function compressWord(str) {
  let res = '';
  let arr = [];
  for (let i = 0; i < str.length; i++) {
    let cur = str[i];
    const index = arr.indexOf(cur);
    if (arr.length && index < 0) {
      res += arr[0] + arr.length;
      arr = [];
    }
    arr.push(cur);
  }
  if (arr.length) {
    res += arr[0] + arr.length;
  }
  return res;
}
compressWord('abbccccaaa');
```

## 45.TS 练习 Equal<A, B>

## 46.TS 练习嵌套 Awaited<T>

```ts
type MockAwaited<T extends Promise<unknown>> = T extends Promise<infer P>
  ? P extends Promise<unknown>
    ? MockAwaited<P>
    : P
  : T;
```

## 47.TS 练习根据 xx 类型提取类型的对象 FunctionKeys<T, Function>

> 关键词 as 映射

```ts
type TTP1 = {
  name: string;
  getName: () => void;
  age: number;
};
type FunctionKeys<T, F> = {
  [P in keyof T as T[P] extends F ? P : never]: T[P];
};
type Fun1 = FunctionKeys<TTP1, number>;
```

## 48.TS 练习索引类型转联合类型：IndexToUnion

```ts

```

## 49.TS 练习独一无二类型：Unique

```ts

```

## 50.TS 练习联合类型转交叉类型：UnionToIntersection

```ts

```
