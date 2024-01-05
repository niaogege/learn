---
title: 202308手写汇总(2)
order: 14
group:
  order: 0
  title: interview
nav:
  order: 3
  title: 'interview'
  path: /interview
---

> 0808 再接再厉 在背出 50 道题

> 0821 再接再厉 不忘初心 还有最后 20 道题

```js
/**
 * 1.链表相交
 * 2.盛最多水的容器
 * 3.有效的括号
 * 4.实现ES6的Class
 * 5.实现ES6的Extend
 * 6.使用reduce实现数组flat方法
 * 7.[寄生组合式继承](https://mp.weixin.qq.com/s/8-vWM7WMqZYMnw_pe7CXhg)
 * 8.实现 repeat 方法
 * 9.once 函数 跟 memo函数差不多
 * 10.TS练习体操之Equal<A, B>
 * 11.滚动到底部懒加载数据Hooks实现
 * 12.TS练习之Pick<T, K>
 * 13.图片懒加载实现
 * 14.是否存在循环引用
 * 15.找出数组中出现次数最多的数字，如[1,2,1,2,3],打印出1和2，出现的次数是2；[1,2,5,5,5],打印5，出现的次数是3
 * 16.手写ts版Awaited<T>
 * 17.setInterval 实现 setTimeout / setTimeout 实现 setInterval
 * 18.手写虚拟DOM
 * 19.如何实现(a == 1 && a == 2 && a == 3)？
 * 20.实现数组中的findIndex/find/include
 * 21.[实现对象中的entries/fromEntries/assign](https://mp.weixin.qq.com/s/S-7w8KgG0R5mdFIcCT0Keg)
 * 22.二叉树的最小深度/最大深度(https://programmercarl.com/)
 * 23.TS手写IndexToUnion索引转联合类型
 * 24.TS手写Unique 去重
 * 25.[手写axios以及核心组件拦截器](https://mp.weixin.qq.com/s/nmKU-Z1Ewc75HH0NxgvcCw)
 * 26.手写Object.create()的实现
 * 27.写一个通用的事件侦听器函数
 * 28.怎么实现一个sleep
 * 29.对象数组去重
 * 30.查找字符串中出现最多的字符和个数
 * 31.实现一个 immutable!!
 * 32.惰性函数
 * 33.使用睡眠函数实现红绿灯代码，红灯2秒，黄灯1秒，绿灯3秒，循环改变颜色。
 * 34.1s后输出1 2s后输出2 3s后输出3
 * 35.TS手写联合转交叉
 * 36.TS实现内置函数Parameters和ReturnTypes
 * 37.滚动到页面顶部
 * 38.滚动到元素位置
 * 39.偏函数
 * 40.如何实现上拉加载下拉刷新
 * 41.私有变量的实现
 * 42.洗牌算法
 * 43.单例模式
 * 44.观察者模式
 * 45.工厂模式
 * 46.装饰器
 * 47.代理模式
 * 48.实现异步并行函数
 * 49.实现异步串行函数
 * 50.手机号脱敏
 * 51.实现对象的Object.freeze
 * 52.数组连续子集进行切分
 */
```

## 1.[链表相交](https://leetcode.cn/problems/intersection-of-two-linked-lists-lcci/description/)

```js
// 给你两个单链表的头节点 headA 和 headB ，请你找出并返回两个单链表相交的起始节点。如果两个链表没有交点，返回 null 。
// 图示两个链表在节点 c1 开始相交：
// 题目数据 保证 整个链式结构中不存在环。

/**
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode}
 */
var getIntersectionNode = function (headA, headB) {
  let cur = headA;
  let set = new Set();
  while (cur) {
    set.add(cur);
    cur = cur.next;
  }
  cur = headB;
  while (cur) {
    if (set.has(cur)) {
      return cur;
    }
    cur = cur.next;
  }
  return null;
};
```

## 2.[盛最多水的容器](https://leetcode.cn/problems/container-with-most-water/)

```js
var maxArea = function (height) {
  var len = height.length;
  var max = 0;
  var left = 0,
    right = len - 1;
  while (left <= right) {
    max = Math.max(max, Math.min(height[right], height[left]) * (right - left));
    // 想不到左边和右边的高度比较
    if (height[right] > height[left]) {
      left++;
    } else {
      right--;
    }
  }
  return max;
};
```

## 3.[有效的括号](https://leetcode.cn/problems/valid-parentheses/)

```js
function isValid(str) {
  var m = new Map([
    [')', '('],
    ['}', '{'],
    [']', '['],
  ]);
  let res = [];
  for (let i of str) {
    var comp = m.get(i);
    var last = res.slice(-1)[0];
    if (comp && comp === last) {
      res.pop();
    } else {
      res.push(i);
    }
  }
  return res.length === 0;
}
isValid('()');
```

## 4.实现 ES6 的 Class

```js
function defineProperties(target, obj) {
  for (let key in obj) {
    Object.defineProperty(target, key, {
      value: obj[key],
      writable: true,
      configurable: true,
      enumerable: false,
    });
  }
}

function mockClass(con, obj, staticProps) {
  obj && defineProperties(con, obj);
  staticProps && defineProperties(con, defineProperties);
  return con;
}
function Person(name) {
  this.name = name
}
var createClass = mockClass(Person, {
  getName: () => {
    return this.name
  }
}
```

## 5.[实现 ES6 的 Extend](https://mp.weixin.qq.com/s/8FmjffUnWx49LsyJn28XdA)

```js
function mockExtend(child, parent, staticProps) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      configurable: true,
      enumerable: false,
      value: child,
      writable: true,
    },
  });
  // 用 Object.setPrototypeOf 继承静态属性和静态方法
  if (parent) {
    Object.setPrototypeOf(child, parent);
  }
  for (let k in staticProps) {
    child.prototype[k] = staticProps[k];
  }
}
```

## 6.使用 reduce 实现数组 flat 方法

```js
function mockReduceFlat(arr) {
  return arr.reduce((pre, cur) => {
    if (Array.isArray(cur)) {
      var res = mockReduceFlat(cur);
      return [...res, ...pre];
    }
    return [...pre, cur];
  }, []);
}
function mockFlat(arr) {
  return arr.reduce((pre, cur) => {
    return pre.concat(Array.isArray(cur) ? mockFlat(cur) : cur);
  }, []);
}
var test = [1, 2, [3, 4]];
mockReduceFlat(test);
mockFlat(test);
```

## 7.[寄生组合式继承](https://mp.weixin.qq.com/s/8-vWM7WMqZYMnw_pe7CXhg)

> 来自[寄生组合式继承](https://segmentfault.com/a/1190000009389979#item-7)

```js
function inherit(child, parent) {
  var prototype = Object.create(parent.prototype);
  prototype.constructor = child;
  child.prototype = prototype;
}
```

## [8.实现 repeat 方法](https://mp.weixin.qq.com/s/8-vWM7WMqZYMnw_pe7CXhg)

```js
function repeat(fn, nums, timer) {
  var num = 0;
  return async (arg) => {
    while (num < nums) {
      await wait(fn, timer, arg);
      num++; // 先执行再加+1
    }
  };
}
function wait(fn, timer, name) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(fn(name));
    }, timer);
  });
}
var repeatFn = repeat(console.log, 4, 1000);
// 函数调用四次，每次间隔 1s 打印 hello
repeatFn('hello');
```

## 9.once 函数 跟 memo 函数差不多

```js
function memo(fn) {
  var cache = {}
  return (...rest) => {
    var args= JSON.stringify(rest)
    return cache[args] || cache[args] = fn.apply(this, rest)
  }
}

let complexCalc = (a, b) => {
  // 执行复杂的计算
};

let memoCalc = memorize(complexCalc);
memoCalc(666, 888);
memoCalc(666, 888); // 从缓存中获取

const once = (fn) => {
  let res, isFirst = true
  return function (...args) {
    if (!isFirst) return res
    res = fn.call(this, ...args)
    isFirst = false
    return res
  }
}
const f = (x) => x;
const onceF = once(f);
//=> 3
onceF(3);
//=> 3
onceF(4);
```

另一种实现方式

```js
// 实现一个只执行一次的函数
// 闭包
function once(fn) {
  let called = false;
  return function _once() {
    if (called) {
      return _once.value;
    }
    called = true;
    _once.value = fn.apply(this, arguments);
  };
}

//ES6 的元编程 Reflect API 将其定义为函数的行为
Reflect.defineProperty(Function.prototype, 'once', {
  value() {
    return once(this);
  },
  configurable: true,
});
```

## 10.TS 练习体操之 Equal

```ts
type isEqual<A, B = A> = (<T>(arg: A) => T extends A ? 1 : 2) extends <T>(
  arg: B,
) => T extends B ? 1 : 2
  ? true
  : false;
type E11 = isEqual<1, 2>; // false
type E12 = isEqual<'string', string>; // false
type E13 = isEqual<string, string>; // true
```

## 11.滚动到底部懒加载数据 Hooks 实现

```js
const useLazyBottom = (fn) => {
  // 判断到底部
  // 滚动的距离
  const scrollH = window.scrollTop || document.documentElement.scrollTop;
  // 视图的高度
  const clientH = window.innerHeight || document.body.clientHeight;
  // 滚动的总距离
  const scrollAllH = document.documentElement.scrollHeight;
  if (scrollH + clientH > scrollAllH) {
    fn.apply(this, arguments);
  }
};

export default useLazyBottom;
```

## 12.TS 练习之 Pick

```ts
type PickMy<T, K extends keyof T> = {
  [P in K]?: T[P];
};
type PickMy1<T, K> = {
  [P in keyof T as P extends K ? P : T[P] extends {} ? P : never]: T[P];
};

type P1 = {
  name: string;
  age?: number;
};
type P2 = PickMy1<P1, 'name'>;
```

## 13.图片懒加载

```js
function lazyLoadImg(imgs) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const { target, intersectionRatio } = entry;
      if (intersectionRatio > 0) {
        target.src = target.dataset.src;
        observer.unobserve(target);
      }
    });
  });
  imgs.forEach((img) => {
    observer.observe(img);
  });
}
```

## 18.[手写虚拟 DOM](https://mp.weixin.qq.com/s/S-7w8KgG0R5mdFIcCT0Keg)

> 阔以理解成对象转 DOM

```js
function render(vnode, parent) {
  var mount = parent ? (el) => parent.appendChild(el) : (el) => el;
  if (typeof vnode === 'string') {
    return mount(document.createTextNode(vnode));
  } else {
    var dom = mount(document.createElement(vnode.type));
    // props
    Object.keys(vnode.props).forEach((key) => {
      var val = vnode.props[key];
      dom.setAttribute(key, val);
    });
    // child
    vnode.children.forEach((child) => {
      document.appendChild(render(child, parent));
    });
    return dom;
  }
}
render(Vnode, docuemnt.getElementById('app'));
var node = {
  tagName: 'div',
  children: [
    {
      tagName: 'span',
      children: [
        {
          tagName: 'a',
          children: [],
        },
      ],
    },
  ],
};
// 真实dom转对象
const dom2tree = (node) => {
  const obj = {};
  obj.tag = node.tagName;
  obj.children = [];
  node.childNodes.forEach((child) => {
    obj.children.push(dom2tree(child));
  });
  return obj;
};
dom2tree(node);
```

## 21 手写 Object.assign

```js
var cpp = {
  name: 'cpp',
};
var obj = { age: 33 };
var target = Object.assign({ hobby: 'learn' }, cpp, obj);
console.log(target, 'target');

// 手写Object.assign()
function myAssign(target, ...source) {
  if (!target) {
    throw new TypeError('can not be null');
  }
  let res = Object(target);
  source.forEach((obj) => {
    if (obj) {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          res[key] = obj[key];
        }
      }
    }
  });
  return res;
}
Object.myAssign = myAssign;
```

## 23 TS 手写 IndexToUnion 索引转联合类型

```ts
type NN1 = {
  age: number;
  name: string;
};
// expected
type NN2 =
  | {
      age: number;
    }
  | {
      name: string;
    };

type IndexToUnion<T> = {
  [P in keyof T]: {
    [K in P]: T[K];
  };
}[keyof T];

type NN3 = IndexToUnion<NN1>;
const tt3: NN3 = { age: '22' };
```

## 25 axios 以及拦截器

```js
// 添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  },
);
```

移除拦截器

```js
const myInterceptor = axios.interceptors.request.use(function () {
  /*...*/
});
axios.interceptors.request.eject(myInterceptor);
```

## 26. Object.create()

```js
/**
 * ES5 Object.create 的模拟实现，将传入的对象作为创建的对象的原型,阔以理解成对传入对象的浅复制缺点：引用类型的原型属性会被实例共享
 * @param target
 * @returns
 */
function MyObject(target) {
  function F() {}
  F.prototype = target;
  return new F();
}
```

## 27.[写一个通用的事件侦听器函数](https://mp.weixin.qq.com/s/uKPVedfQkgEPYoRUtwyeQQ)

```js
const EventUtils = {
  // 视能力分别使用dom0||dom2||IE方式 来绑定事件
  // 添加事件
  addEvent: function (element, type, handler) {
    if (element.addEventListener) {
      element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
      element.attachEvent('on' + type, handler);
    } else {
      element['on' + type] = handler;
    }
  },
  // 移除事件
  removeEvent: function (element, type, handler) {
    if (element.removeEventListener) {
      element.removeEventListener(type, handler, false);
    } else if (element.detachEvent) {
      element.detachEvent('on' + type, handler);
    } else {
      element['on' + type] = null;
    }
  },
  // 获取事件目标
  getTarget: function (event) {
    return event.target || event.srcElement;
  },
  // 获取 event 对象的引用，取到事件的所有信息，确保随时能使用 event
  getEvent: function (event) {
    return event || window.event;
  },
  // 阻止事件（主要是事件冒泡，因为 IE 不支持事件捕获）
  stopPropagation: function (event) {
    if (event.stopPropagation) {
      event.stopPropagation();
    } else {
      event.cancelBubble = true;
    }
  },
  // 取消事件的默认行为
  preventDefault: function (event) {
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
  },
};
```

## 28.怎么实现一个 sleep

```js
function sleep(fn, timer) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(fn());
    }, timer);
  });
}
```

## 29.对象数组去重

```js
const responseList = [
  { id: 1, name: '树哥' },
  { id: 2, name: '黄老爷' },
  { id: 3, name: '张麻子' },
  { id: 1, name: '黄老爷' },
  { id: 2, name: '张麻子' },
  { id: 3, name: '树哥' },
  { id: 1, name: '树哥' },
  { id: 2, name: '黄老爷' },
  { id: 3, name: '张麻子' },
];

function uniqueArrayObject(arr, id) {
  var res = [];
  var m = new Map();
  for (let item of arr) {
    if (m.has(item[id])) {
      continue;
    } else {
      res.push(item);
      m.set(item[id], item[name]);
    }
  }
  return res;
}

uniqueArrayObject(responseList, 'id');
// [{ id: 1, name: '树哥' },{ id: 2, name: '黄老爷' },{ id: 3, name: '张麻子' }]
```

## 30.查找字符串中出现最多的字符和个数

```js
function maxCount(str) {
  var arr = str.split('').sort();
  var max = 0;
  var m = new Map();
  let maxStr = '';
  for (let i of arr) {
    if (m.has(i)) {
      var len = m.get(i);
      m.set(i, len + 1);
      max = Math.max(max, len + 1);
    } else {
      m.set(i, 1);
    }
  }
  for (let [key, val] of m.entries()) {
    if (max === val) {
      maxStr = key;
    }
  }
  return {
    maxStr,
    max,
  };
}
maxCount('abcabcabcbbccccc');
```

> 新奥面试的时候问过 202105

## 32.实现一个 immutable

> 暂时放弃

## 32.惰性函数

我们现在需要写一个 foo 函数，这个函数返回首次调用时的 Date 对象，注意是首次。

```js
var foo = function () {
  var t = new Date();
  foo = () => {
    return t;
  };
  return foo();
};
foo();
```

由于不同浏览器之间存在一些兼容性问题，这导致了我们在使用一些 Web API 时，需要进行判断. 所谓的惰性载入就是当第 1 次根据条件执行函数后，在第 2 次调用函数时，就不再检测条件，直接执行函数。要实现这个功能，我们可以在第 1 次条件判断的时候，在满足判断条件的分支中覆盖掉所调用的函数，具体的实现方式如下所示：

```js
function addHandler(ele, type, handler) {
  if (ele.addEventListener) {
    addHandler = function (ele, type, handler) {
      ele.addEventListener(type, handler, false);
    };
  } else if (ele.attachEvent) {
    addHandler = function (ele, type, handler) {
      ele.attachEvent('on' + type, handler);
    };
  } else {
    addHandler = function (ele, type, handler) {
      ele['on' + type] = handler;
    };
  }
  return addHandler(ele, type, handler);
}
```

## 33.红灯 3 秒亮一次，黄灯 2 秒亮一次，绿灯 1 秒亮一次；如何让三个灯不断交替重复亮灯？

要求：用 Promise 实现

```js
function red() {
  console.log('red');
}
function green() {
  console.log('green');
}
function yellow() {
  console.log('yellow');
}

function sleep(fn, delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(fn());
    }, delay);
  });
}

function main() {
  return Promise.resolve()
    .then(() => {
      return sleep(red, 3000);
    })
    .then(() => {
      return sleep(yellow, 2000);
    })
    .then(() => {
      return sleep(green, 2000);
    })
    .then(() => main());
}
main();

// 第二种方式
async function main2() {
  while (true) {
    await sleep(red, 3000);
    await sleep(yellow, 2000);
    await sleep(green, 2000);
  }
}
```

## 34.1s 后输出 1 2s 后输出 2 3s 后输出 3

```js
function waitOutput() {
  var arr = [1, 2, 3];
  return arr.reduce((pre, x) => {
    return pre.then(() => {
      return new Promise((r) => {
        setTimeout(() => {
          r(console.log(x));
        }, 1000);
      });
    });
  }, Promise.resolve());
}
waitOutput();
```

## 35 联合转交叉类型

```ts
type Fork = { name: string } | { age: number };
type Fork2 = {
  name: string;
  age: number;
};

type UnionToFork<T> = (T extends T ? (x: T) => unknown : never) extends (x: infer R) => unknown
  ? R
  : never;
type Fork3 = UnionToFork<Fork>;
const fork3: Fork3 = { name: 'ccc', age: 222 };
```

## 36.TS 实现内置函数 Parameters 和 ReturnType

```ts
const fnTest = (name: string, age: number): string => name + 'cpp';
type MockParameters<T extends (...args: any) => any> = T extends (...args: infer P) => any
  ? P
  : never;
type P01 = MockParameters<typeof fnTest>; // [name: string, age: number]
type P02 = Parameters<typeof fnTest>;
type MockReturnTypes<T extends (...args: any) => any> = T extends (...args: any) => infer R
  ? R
  : any;
type R01 = MockReturnTypes<typeof fnTest>; // string
type R02 = ReturnType<typeof fnTest>; // string
```

## 37.滚动到页面顶部

```js
function scrollTop {
  var height = document.documentElement.scrollTop || document.body.scrollTop
  if (height > 0) {
    window.requestAnimationFrame(scrollTop)
    window.scrollTo(0, height-height/8)
  }
}
```

## 38.滚动到元素位置*scrollIntoView*

```js
function smoothScroll(ele) {
  document.querySelector(ele).scrollIntoView({
    behavior: 'smooth',
  });
}
```

## 39.偏函数

在计算机科学中，偏函数应用（Partial Application）是指固定一个函数的某些参数，然后产生另一个更小元的函数。而所谓的元是指函数参数的个数，比如含有一个参数的函数被称为一元函数。偏函数应用（Partial Application）很容易与函数柯里化混淆，它们之间的区别是：

- 偏函数应用是**固定一个函数的一个或多个参数**，并返回一个可以接收剩余参数的函数；
- 柯里化是将函数转化为多个嵌套的一元函数，也就是每个函数只接收一个参数。

了解偏函数的使用

```js
function url(scheme, domain, path) {
  return `${scheme}://${domain}/${path}`;
}
const myGithubPath = partial(url, 'https', 'github.com');
const profilePath = myGithubPath('semlinker/semlinker');
const awesomeTsPath = myGithubPath('semlinker/awesome-typescript');
// https://github.com/semlinker/semlinker
// https://github.com/semlinker/awesome-typescript
```

实现一个偏函数：偏函数用于固定一个函数的**一个或多个参数**，并返回一个可以接收剩余参数的函数。基于上述的特点，我们就可以自己实现一个 partial 函数：

```js
function partial(fn) {
  let arg = [].slice.call(arguments, 1);
  return function () {
    var newArgs = arg.concat([].slice.call(arguments));
    return fn.apply(this, newArgs);
  };
}

// 简单复习下 curry
function curry(fn) {
  return function temp(...arg) {
    if (fn.length === arg.length) {
      return fn.apply(this, arg);
    }
    return (...args) => temp(...args, ...arg);
  };
}
```

## 40. 下拉刷新和上拉加载

```js
// 上拉加载 即滚动到底部进行加载
function scrollPage() {
  var scrollHeight = document.body.scrollHeight || document.documentElement.scrollHeight; // 文档内容的总高度
  var scrollBarTop = document.body.scrollTop || document.documentElement.scrollTop; // 滚动条的滚动距离
  const distance = 50; // 距离底部还有50的时候 加载下一页
  var clientHeight = window.innerHeight;
  if (scrollBarTop + clientHeight + distance >= scrollHeight) {
    console.log('toBottom');
  }
}
window.addEventListener('scroll', scrollPage);
window.removeEventListener('scroll', scrollPage);
```

### 下拉刷新的本质是页面本身置于顶部时，用户下拉时需要触发的动作

```html
<main>
  <p class="refreshText"></p>
  <ul id="refreshContainer">
    <li>111</li>
    <li>222</li>
    <li>333</li>
    <li>444</li>
    <li>555</li>
    ...
  </ul>
</main>
```

```js
// 1.监听touchstart事件，记录初始的值
var _element = document.getElementById('refreshContainer'),
  _refreshText = document.querySelector('.refreshText'),
  _startPos = 0, // 初始的值
  _transitionHeight = 0; // 移动的距离

_element.addEventListener(
  'touchstart',
  function (e) {
    _startPos = e.touches[0].pageY; // 记录初始位置
    _element.style.position = 'relative';
    _element.style.transition = 'transform 0s';
  },
  false,
);
// 2.监听touchmove移动事件，记录滑动差值
_element.addEventListener(
  'touchmove',
  function (e) {
    // e.touches[0].pageY 当前位置
    _transitionHeight = e.touches[0].pageY - _startPos; // 记录差值
    if (_transitionHeight > 0 && _transitionHeight < 60) {
      _refreshText.innerText = '下拉刷新';
      _element.style.transform = 'translateY(' + _transitionHeight + 'px)';
      if (_transitionHeight > 55) {
        _refreshText.innerText = '释放更新';
      }
    }
  },
  false,
);
// 3.监听touchend离开的事件
_element.addEventListener(
  'touchend',
  function (e) {
    _element.style.transition = 'transform 0.5s ease 1s';
    _element.style.transform = 'translateY(0px)';
    _refreshText.innerText = '更新中...';
    // todo...
  },
  false,
);
```

## [41. 私有变量的实现](https://segmentfault.com/a/1190000017171866)

```js
// 例子 4-3
const Example = (function () {
  var _private = Symbol('private');
  class Example {
    constructor() {
      this[_private] = 'private';
    }
    getName() {
      return this[_private];
    }
  }

  return Example;
})();

var ex = new Example();

console.log(ex.getName()); // private
console.log(ex.name); // undefined
```

## 42.洗牌算法 Shuffle Algorithm, 用于随机排列或打乱数组或列表中的元素顺序，以产生随机性

```js
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    // // 生成 0 到 i 之间的随机索引
    const j = Math.floor(Math.random() * (i - 1));
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}
shuffleArray([1, 2, 3, 4, 5]);
```

## 43.单例模式

单例模式通俗点说就是：**定义一个类，生成一个实例，并且整个项目仅此这一个实例** 相信大家在项目中都封装使用过 Axios 吧我们会先定义封装一个请求的实例然后暴露出去

```js
// utils/request
class HttpRequest {
   instance: AxiosInstance;
  constructor(options: CreateAxiosOptions) {
    this.instance = axios.create(options)
  }
  get() {...}
  post() {...}
  put() {...}
  delete() {...}
}
// 生成一个实例
const request = new HttpRequest({})

// 全局仅用这么一个请求实例
export default request
```

然后在项目中各处去使用这一个请求实例

```js
import request from 'utils/request';
const fetchData = (url) => {
  return request.get(url);
};
```

另一种实现方式: 用闭包和 Proxy 属性拦截

```js
function getSingleInstance(func) {
  let instance;
  let handler = {
    construct(target, args) {
      if (!instance) instance = Reflect.construct(func, args);
      return instance;
    },
  };
  return new Proxy(func, handler);
}
```

## 44.观察者模式

通俗点讲就是：定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知

我们平时使用的框架 Vue，它的响应式就是基于观察者模式去做的，下面是简单展示一下它的原理

```js
class Subject {
  count: number;
  observers: any[];
  constructor() {
    this.count = 0;
    this.observers = [];
  }
  getCount() {
    return this.count;
  }
  setCount(count: number) {
    // 设置值之后通知更新
    this.count = count;
    this.notify();
  }
  notify() {
    this.observers.forEach((o) => {
      o.update();
    });
  }
  push(o) {
    this.observers.push(o);
  }
}

class Observer {
  constructor(name: string, sub: Subject) {
    this.name = name;
    this.subject = sub;
    this.subject.push(this);
  }
  update() {
    console.log(`${this.name} 变了 ${this.subject.getCount()}`);
  }
}

const sub = new Subject();
// 观察一号
const observer1 = new Observer('一号', sub);
// 观察二号
const observer2 = new Observer('二号', sub);

sub.setCount(1);
// 一号 变了 1
// 二号 变了 1
```

另一种实现方式

```js
const queuedObservers = new Set();

const observe = (fn) => queuedObservers.add(fn);
const observable = (obj) => new Proxy(obj, { set });

function set(target, key, value, receiver) {
  const result = Reflect.set(target, key, value, receiver);
  queuedObservers.forEach((observer) => observer());
  return result;
}
```

## 45.工厂模式

工厂模式通俗点说就是：更方便地去创建实例

大家开发中应该使用过 axios.create 这个方法吧？这其实就是工厂模式的实践之一

我简单分析一下 axios.create 的原理（不一定跟源码一模一样）,**axios.create**每次返回的都是一个全新的实例

```js
class Axios {}
class Fatory {
  create() {
    return new Axios();
  }
}
var axios = new Fatory();
export default axios;

// 使用部分;
import axios from 'axios';
// 创建很多实例
const httpRequest1 = axios.create();
const httpRequest2 = axios.create();
```

## 46.装饰器模式

装饰器模式通俗点说就是：定义一个类，在不改这个类的前提下，给这个类拓展功能

```js
class Man {
  say() {
    console.log('我是普通人');
  }
}
class Man2SuperMan {
  man: Man;
  constructor(man) {
    this.man = man;
  }
  say() {
    this.man.say();
    console.log('我变成超人啦！');
  }
}

const man = new Man();
const superMan = new Man2SuperMan(man);
man.say();
// 我是普通人
superMan.man();
// 我是普通人
// 我变成超人啦！
```

## 47.代理模式

代理模式通俗易懂点说就是：**为对象提供一种代理，便以控制对这个对象的访问，不能直接访问目标对象**

最好的实践场景就是 ES6 Proxy

```js
const handler = {
  get: function (obj, prop) {
    return prop in obj ? obj[prop] : 7;
  },
};

const p = new Proxy({}, handler);
p.a = 1;
p.b = undefined;

console.log(p.a, p.b); // 1, undefined
console.log('c' in p, p.c); // false, 7
```

## 48.异步串行

```js
var p1 = (name) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('p1' + name);
      resolve('p1' + name);
    }, 1000);
  });
};
var p2 = (name) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('p2' + name);
      resolve('p2' + name);
    }, 2000);
  });
};

var p3 = (name) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('p3' + name);
      resolve('p3' + name);
    }, 1000);
  });
};

// 异步串行
function asynSerial(...fns) {
  const [first, ...others] = fns;
  return (...args) => {
    return others.reduce((pre, cur) => {
      return Promise.resolve(pre).then((val) => cur(val));
    }, first(...args));
  };
}
var serial = asynSerial(p1, p2, p3);
serial('cpp');
```

## 49.异步并行

```js
var p1 = (name) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('p1' + name);
      resolve('p1' + name);
    }, 1000);
  });
};
var p2 = (name) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('p2' + name);
      resolve('p2' + name);
    }, 2000);
  });
};

var p3 = (name) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('p3' + name);
      resolve('p3' + name);
    }, 1000);
  });
};

// 异步并行
function asyncParaller(...fns) {
  return (...arg) => {
    const tasks = fns.map((fn) => fn(...arg));
    return Promise.all(tasks);
  };
}
var paraller = asyncParaller(p1, p2, p3);
paraller('wmh');
```

## 50.识别手机号且手机号脱敏

<!--
\w：匹配大小写字符、数字和下划线
\d：匹配数字
.：匹配除换行符外的所有字符
*：表示该符号前面的这个匹配规则需要匹配0次或无数次
[]：用于编写或的规则模式
{}：代表需要匹配的长度
+：表示该符号前面的这个匹配规则需要匹配1次或无数次
-->

```js
function sensitive(str) {
  return str.replace(/1[3-9]\d{9}/g, (phone) => {
    return phone.replace(phone.substring(3, 7), '****');
  });
}
sensitive('18788889999'); // 187****9999
function hiddenPhone(str) {
  return str.replace(/^(\d{3})\d{4}(\d{4})$/i, '$1****$2');
}
hiddenPhone('18799998888');
function thounsand(str) {
  return str.replace(/(?!^)(?=(\d{3})+$)/, ',');
}
thounsand('1878888999');
```

## 51.实现对象的 **Object.freeze**

```js
function mockFreze(obj) {
  if (obj instanceof Object) {
    Object.seal(obj);
    for (let key in obj) {
      if (obj.hasOwnproperty(key)) {
        Object.defineProperty(obj, key, {
          writable: false,
        });
        mockFreze(obj[key]); // 递归
      }
    }
  }
}
```

## 52.实现模版字符串解析

```js
var template = `
<div>
    <% if(name){ %>
        <span>%= name =%</span>
    <% } %>
    %= age =%
<div>`;
let str = rander(template, { name: '小明', age: 18 });
// 解析完成 str <div> <span>小明</span>18<div>

function parseTemplateString(templateString, data) {
  // 使用正则表达式在模板字符串中查找所有 ${...} 的实例
  const regex = /${(.*?)}/g;
  // 使用 replace() 方法将每个 ${...} 的实例替换为数据对象中相应的值
  const parsedString = templateString.replace(regex, (match, key) => {
    // 使用 eval() 函数来评估 ${...} 中的表达式，并从数据对象中返回相应的值
    return eval(`data.${key}`);
  });
  return parsedString;
}
```

## 52.数组连续子集进行切分

```js
var getConsecutiveArrays = (arr, size) =>
  size > arr.length ? [] : arr.slice(size - 1).map((_, i) => arr.slice(i, size + i));
getConsecutiveArrays([1, 3, 4, 5, 8], 2);
// [1, 3] [3, 4] [4, 5] [5, 8]
```

## 参考

- [面试官不要再问我 axios 了？我能手写简易版的 axios](https://mp.weixin.qq.com/s/nmKU-Z1Ewc75HH0NxgvcCw)
- [一文帮你搞定 90% 的 JS 手写题](https://mp.weixin.qq.com/s/uKPVedfQkgEPYoRUtwyeQQ)
- [前端手写并理解面试常考 code 的思路和运行过程](https://mp.weixin.qq.com/s/Z9tiY0bbpwmEqLEtKmDWOg)
- [前端设计模式](https://mp.weixin.qq.com/s/9UNJG0MJrAsYKjQK4MAoyg)
- [这些高阶的函数技术，你掌握了么](https://juejin.cn/post/6892886272377880583?searchId=20231128205315E68CD3641D010A87C8E3#heading-9)
- [前端面试必须掌握的手写题：进阶篇](https://juejin.cn/post/7299357176928354313#heading-7)
