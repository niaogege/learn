---
title: 手写js
order: 1
group:
  order: 1
  title: Basic
  path: /interview/js
nav:
  order: 3
  title: 'interview'
  path: /interview
---

> 基本的不能再基本了，如果不熟悉，那就多写几遍 熟能生巧

## 实现 const/let

## 手写 Object.create()

创建一个新对象，将传入的对象作为原型(使用现有的对象来提供新创建对象的\***\*proto\*\***)

```js
function create(o) {
  function F() {}
  F.prototype = o;
  return new F();
}
var o = create(null);
console.log(o);
// Test
var person = {
  name: 'cpp',
};
var obj = create(person);
console.log(obj.name);
console.log(person.isPrototypeOf(obj));
```

## new 手写

- 创建一个空对象-> Object.create()，将空对象的隐式原型指向构造函数的原型链 con.prototype
- 使用 apply 改变 this 指向 apply(obj, rest)
- 返回该对象(如果无返回值或者返回一个非对象，则返回 obj 否则返回一个新创建的对象)

```js
function Obj(name) {
  this.name = name;
  console.log('当前上下文是', this);
}
var instance = new Obj('cpp');
console.log(instance);

function newObj(fn, ...rest) {
  var obj = Object.create(fn.prototype);
  var res = fn.apply(obj, rest);
  return res instanceof Object ? res : obj;
}
var instance2 = newObj(Obj, 'cpp');
console.log(instance2, '222');
```

## instanceof 手写

instanceof 用于检测构造函数的 **prototype** 是否出现在某个实例对象的原型链上，运算符左侧是实例对象 右侧是构造函数

```js
// first
function myIntanceof(l, r) {
  l = Object.getPrototypeOf(l);
  while (true) {
    if (l === null) return false;
    if (l === r.prototype) return true;
    l = Object.getPrototypeOf(l);
  }
  return false;
}

// second
function myInstanceof(l, r) {
  return r.prototype.isPrototypeOf(l);
}

var obj = {};
console.log(obj instanceof Object);
```

## curry 函数柯里化

将一个多参数的函数转化为多个嵌套的单参数函数

### 第一种 参数固定(有局限，形参个数固定)

```js
// first
function curry(fn) {
  const judge = (...arg) => {
    if (fn.length === arg.length) {
      return fn(...arg);
    } else {
      return (...args) => judge(...args, ...arg);
    }
  };
  return judge;
}
var add = (a, b, c) => a + b + c;
var sum = curry(add);
sum(1)(2)(3);

function curry2(fn) {
  const judge = (...arg) => {
    if (fn.length === arg.length) {
      return fn(...arg);
    } else {
      return judge.bind(null, ...arg);
    }
  };
  return judge;
}
var add = (a, b, c) => a + b + c;
var sum = curry2(add);
sum(1)(2)(3);
```

### 第二种 参数不固定

```js
var curry = (fn) => {
  var arr = [];
  return function judge(...arg) {
    if (arg.length) {
      arr.push(...arg);
      return judge;
    } else {
      var value = fn.apply(this, arr);
      arr = [];
      return value;
    }
  };
};
var add = (...rest) => rest.reduce((a, b) => a + b, 0);
var sum = curry(add);
sum(1)(12)(3)();
```

## compose 函数组合

```js
function compose(...rest) {
  if (!rest) return (arg) => arg;
  if (rest.length === 1) return (arg) => rest[0](arg);
  return rest.reduce((a, b) => {
    return (args) => a(b(args));
  });
}
var double = (x) => x * 2;
var three = (x) => x * 3;
var sum = compose(double, three);
sum(10); // 60
```

## 手写发布订阅模式

### 手写发布订阅，实现下面的功能

```js
const event = new EventEmitter();

const handle = (...rest) => {
  console.log(rest);
};

event.on('click', handle);

event.emit('click', 1, 2, 3, 4);

event.off('click', handle);

event.emit('click', 1, 2);

event.once('dbClick', () => {
  console.log(123456);
});
event.emit('dbClick');
event.emit('dbClick');
```

```js
class EventEmitter {
  constructor() {
    this.events = {};
  }
  // 注册
  on(type, cb) {
    if (this.events[type]) {
      this.events[type].push(cb);
    } else {
      this.events[type] = [cb];
    }
  }
  // 卸载
  off(type, cb) {
    if (!this.events[type]) return false;
    this.events[type] = this.events[type].filter((event) => event != cb);
    return true;
  }
  // emit执行
  emit(type, ...rest) {
    this.events[type] && this.events[type].forEach((listen) => listen.apply(this, rest));
  }
  // 只执行一次 执行一次之后取消事件
  // 注册事件
  once(type, cb) {
    function fn() {
      cb();
      this.off(type, fn);
    }
    this.on(type, fn);
  }
}
```

## 深浅拷贝

```js
// 深拷贝
function deepClone(data) {
  if (typeof data !== 'object' || data === null) return obj;
  var target = Array.isArray(data) ? [] : {};
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      target[key] = typeof data[key] === 'object' ? deepClone(data[key]) : data[key];
    }
  }
  return target;
}
var obj = {
  age: 31,
  hobby: ['shufa', 'fit'],
};
var copy = deepClone(obj);
obj.age = 32;
console.log(copy.age); // 31

// shallowCopy 浅拷贝
function shallowCopy(data) {
  if (typeof data !== 'object' || data === null) return obj;
  var target = Array.isArray(data) ? [] : {};
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      target[key] = data[key];
    }
  }
  return target;
}
```

## 节流和防抖

### 节流

<!-- 频繁触发的事件时，一段固定时间内延迟执行执行， -->

每间隔 N 秒只执行一次，频率变少主要应用场景 比如说浏览器缩放大小/滚动事件

```js
function throttle(fn, delay) {
  var timeout = null;
  return function (...rest) {
    if (!timeout) {
      timeout = setTimeout(() => {
        fn.apply(this, delay);
        timeout = null;
      }, delay);
    }
  };
}
```

### 防抖

触发事件 N 秒后函数只能执行一次，如果在 N 秒又触发事件，则需要重新计时，主要应用场景：提交按钮

```js
function debounce(fn, delay) {
  let timer = null
  return function(...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
```

### 两者区别

- 防抖 采用异步线程 setTimeout 进行**延迟执行**，多次触发之后执行一次，典型场景就是防止多次提交的按钮
- 节流 每间隔多少秒执行一次，使之**频率变低**，典型场景：滚动事件

## 扁平化 flatter

### 递归

```js
function mockFlatten(res) {
  return res.reduce((acc, cur) => {
    if (Array.isArray(cur)) {
      var anther = mockFlatter(cur);
      return [...acc, ...anther];
    }
    return [...acc, cur];
  }, []);
}
// test
var test = [1, 2, [3, 4], 7, 8];
mockFlatten(test);
```

### 栈的方式

```js
function mockFlatten2(res) {
  var stack = [...res];
  var arr = [];
  while (stack.length) {
    var cur = stack.pop(); // 最后一个的先出来 栈顶
    if (Array.isArray(cur)) {
      stack.push(...cur);
    } else {
      arr.push(cur);
    }
  }
  return arr.reverse();
}
var test = [1, 2, 3, [4, 5]];
mockFlatten2(test);
```

### 迭代和展开运算符

```js
function mockFlatten(arr = []) {
  while (arr.some(Array.isArray)) {
    arr = [].concat(...arr);
  }
  return arr;
}
```

## 实现一个反向的 flatten

```js
function reverseFlatten(max, arr) {
  var n = 0;
  var res = arr.reduce(
    (pre, cur) => {
      if (pre[n].length <= max) {
        pre[n].push(cur);
      }
      if (pre[n].length === max) {
        ++n;
        pre[n] = [];
      }
      return pre;
    },
    [[]],
  );
  return res.filter((n) => n.length);
}
var arr = [1, 2, 3, 4, 5, 6, 7];
reverseFlatten(3, arr);
// [[1,2,3], [4,5,6], [7]]
```

## 实现一个对象版的 flatten

面试官问:如何实现对象的扁平化

```js
const obj = {
 a: {
      b: 1,
      c: 2,
      d: {e: 5}
    },
 b: [1, 3, {a: 2, b: 3}],
 c: 3
}

flatten(obj) 结果返回如下
// {
//  'a.b': 1,
//  'a.c': 2,
//  'a.d.e': 5,
//  'b[0]': 1,
//  'b[1]': 3,
//  'b[2].a': 2,
//  'b[2].b': 3
//   c: 3
// }
```

## 手写 map

```js
Array.prototype.mockMap = function (fn, context) {
  var arr = Array.prototype.slice.call(this) || [];
  var res = [];
  for (let i = 0; i < arr.length; i++) {
    res.push(fn.call(context, arr[i], i, arr));
  }
  return res;
};
var test = [1, 2, 3];
test.mockTest((item) => item * 2); // [2,4,6]
```

## 手写 Array.prototype.reduce

```js

```

## 手写乞丐版 ajax

```js
function ajax({ url, success }) {
  const config = {
    url,
    type: 'GET',
    async: true,
    success,
  };
  let xhr = new XMLHttpRequest();
  xhr.open(config.type, config.url, config.async);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        let res = JSON.parse(xhr.responseText);
        success(res);
      }
    }
  };
  xhr.send();
}
// 使用
ajax({
  url: '/api/getData',
  success: function (res) {
    console.log(res);
  },
});
```

## 手写 setTimeout/setInterval

```js
function setTimeout(fn, delay) {}
function setIntetval(fn, delay) {}
```

## 0521

手写 curry1,再次失败了 add(1)(2)(3)(4) 0521 第二次尝试写 固定参数

```js
function curry(fn) {
  function judge(...arg) {
    if (fn.length === arg.length) {
      return fn.apply(null, arg);
    } else {
      return (...args) => judge(...args, ...arg);
    }
  }
  return judge;
}

var sum = (a, b, c) => a + b + c;
var add = curry(sum);
add(1)(2)(3);
// 参数不固定
function curry2(fn) {
  var res = [];
  function judge(...arg) {
    if (arg.length) {
      res.push(...arg);
      return judge;
    } else {
      var val = fn.apply(null, res);
      res = [];
      return val;
    }
  }
  return judge;
}
var sum = (...rest) => rest.reduce((a, b) => a + b);
var add = curry2(sum);
add(1)(2)(3)(4)();
```

手写 curry2(1)(2)(3)()

## 手写题按类排序

面试官： [{ price: 1, size: 2 }, { price: 2, size: 2 }, { price: 1, size: 1 }]] 依次按照 price、size 降序排序

```js
function sort(arr) {
  return arr
}
sort(
   [{ price: 1, size: 2 }, { price: 2, size: 2 }, { price: 1, size: 1 }]]
)
```

## 参考

- [常见的手写题](https://mp.weixin.qq.com/s/Vbe33lJoj7CxZD-hDadKyg)
- [手写-实现一个对象的 flatten 方法](https://juejin.cn/post/7004638318843412493#heading-28)