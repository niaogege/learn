---
title: 202311手写汇总(4)-easyWriting
order: 16
group:
  order: 0
  title: interview
nav:
  order: 3
  title: 'interview'
  path: /interview
---

> 面试前的 easy 20240302

> 写了不下 10 遍，so what?

> 练习的不是手写，而是对于这份工作的热爱

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
      return a(b);
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

## 23.红绿灯问题

```js

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

## 25.数组转树

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
  format = format.replace(/yyyy/, year);
  format = format.replace(/MM/, mon);
  format = format.replace(/dd/, day);
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

## 30.模拟实现虚拟 dom 实现

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

## 32.图片懒加载
