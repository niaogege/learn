---
title: 202311手写汇总(5)-MiddleWriting
order: 17
group:
  order: 0
  title: guide
  path: /interview/guide
nav:
  order: 3
  title: 'interview'
  path: /interview
---

> 面试前的 HotWriting 热门手写

## 1.curry 函数柯里化

### 1.1 实现函数无限累加,执行 valueOf 时返回结果

```js
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
```

### 1.2 固定参数累加

```js
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
```

### 1.3 实现无固定参数累加

> add(1)(1)(1)() // 3

```js
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
```

## 2.偏函数/惰性函数

### 2.1 偏函数

偏函数用于固定一个函数的一个或多个参数，并返回一个可以接收剩余参数的函数,接下来实现 partial？

```js
function url(scheme, domain, path) {
  return `${scheme}://${domain}/${path}`;
}
const myGithubPath = partial(url, 'https', 'github.com');
const profilePath = myGithubPath('semlinker/semlinker');
const awesomeTsPath = myGithubPath('semlinker/awesome-typescript');
// https://github.com/semlinker/semlinker
// https://github.com/semlinker/awesome-typescript
function partial() {}
```

### 2.2 惰性函数

所谓的惰性载入就是当第 1 次根据条件执行函数后，在第 2 次调用函数时，就不再检测条件，直接执行函数。要实现这个功能，我们可以在第 1 次条件判断的时候，在满足判断条件的分支中覆盖掉所调用的函数，实现一个封装事件监听器函数

```js
function addHandler(ele, type, handler) {}
```

## 3.16 进制和颜色字符串进行转换

## 4.二分查找

```js
function binarySearch(arr, target) {
  let len = arr.length;
  let l = 0;
  let r = len - 1;
  while (l <= r) {
    let base = l + Math.floor((r - l) / 2);
    if (arr[base] == target) {
      return base;
    } else if (arr[base] > target) {
      r = base - 1;
    } else {
      l = base + 1;
    }
  }
  return -1;
}
```

### 搜索旋转排序数组

题目： 给你 旋转后 的数组 nums 和一个整数 target ，如果 nums 中存在这个目标值 target ，则返回它的下标，否则返回 -1 。

- 输入：nums = [4,5,6,7,0,1,2], target = 0
- 输出：4

```js
var search = function (arr, target) {
  if (!arr.length) return -1;
  let len = arr.length;
  let l = 0;
  let r = len - 1;
  while (l <= r) {
    let base = l + Math.floor((r - l) / 2);
    if (arr[base] == target) return base;
    // arr[base] arr[l] arr[r]
    if (arr[base] >= arr[l]) {
      if (target >= arr[l] && target < arr[base]) {
        r = base - 1;
      } else {
        l = base + 1;
      }
    } else {
      if (target > arr[base] && target <= arr[r]) {
        l = base + 1;
      } else {
        r = base - 1;
      }
    }
  }
  return -1;
};
```

## 5.手写驼峰转化

```js
// first
function strTo(str) {
  return str.replace(/[-|_|@]([\w])/g, (_, p) => p.toUpperCase());
}
strTo('cpp-name');
// second
function strTo2(str, mark = '-') {
  let res = '';
  let arr = str.split(mark);
  let name = arr[1];
  res = arr[0] + name[0].toUpperCase() + name.slice(1);
  return res;
}
strTo2('cpp-name');
```

## 6.手写 vue 版 render

```js
function render(str, data) {
  let reg = /\{\{(\w+)\}\}/;
  if (reg.test(str)) {
    let key = reg.exec(str)[1];
    str = str.replace(reg, data[key]);
    return render(str, data);
  }
  return str;
}
render('{{msg}}::{{name}}', {
  msg: 'info',
  name: 'cpp',
});

render('{{msg}}::{{name}}', {
  name: 'cpp',
  msg: 'info',
});
```

## 7.千分位分割以及包含小数点的分割

```js
function thousand(str) {
  return str.replace(/(?!^)(?=(\d{3})+$)/g, ',');
}
thousand('123456789');
```

## 8.

## 9.封装一个类使对象可以被 for of 遍历

## 10.URL 参数解析

## 11.setTimeout 实现 setInterval

```js
function mockSetInterval(fn, delay) {
  let timer;
  let timerFn = () => {
    fn();
    timer = setTimeout(timerFn, delay);
  };
  setTimeout(timerFn, delay);
  return {
    clean: clearTimeout(timer),
  };
}
```

## 12.实现 Object.create

```js
function mockCreate(target) {
  function F() {}
  F.prototype = target;
  return new F();
}
```

## 13.实现 Object.assign

```js
var cpp = {
  name: 'cpp',
};
var obj = { age: 33 };
var target = Object.assign({ hobby: 'learn' }, cpp, obj);
console.log(target, 'target'); // 合并
function MyAssign(target, ...source) {
  if (!target) {
    throw new TypeError('can not be null');
  }
  let res = Object(target);
  source.forEach((item) => {
    if (item) {
      for (let key in item) {
        if (item.hasOwnProperty(key)) {
          res[key] = item[key];
        }
      }
    }
  });
  return res;
}
Object.MyAssign = MyAssign;
```

## 14.实现 es6 Class

```js
function mockClass(con, proto, staticProps) {
  proto && defineProperties(con.prototype, proto);
  staticProps && defineProperties(con, staticProps);
  return con;
}
function defineProperties(obj, target) {
  for (let key in target) {
    Object.defineProperty(obj, key, {
      value: target[key],
      configurable: true,
      writable: true,
      enumerable: false,
    });
  }
}
```

## 15.实现 es6 extends

```js
function mockExtends(Child, Parent, staticProps) {
  let proto = Object.create(Parent.prototype);
  proto.constructor = Child;
  Child.prototype = proto;
  // 继承静态方法
  Parent && Object.setPrototypeOf(Child, Parent);
  for (let key in staticProp) {
    Child.prototype[key] = staticProp[key];
  }
}
```

## 16.实现数组转对象

```js
function objToArray(obj) {
  // 补全此处代码
  let ans = [];
  for (let [k, val] of Object.entries(obj)) {
    let key = Reflect.ownKeys(val)[0];
    let data = {
      key: k,
      op: key,
      value: val[key],
    };
    ans.push(data);
  }
  return ans;
}
console.log(
  objToArray({
    key1: {
      op1: 'value1',
    },
    key2: {
      op2: 'value2',
    },
  }),
);
// result示例
// [
//     {key: 'key1', op: 'op1', value: 'value1'},
//     {key: 'key2', op: 'op2', value: 'value2'}
// ]
```

## 17.缓存函数

```js
function memoryFn(fn) {
  let cache = {};
  return (...rest) => {
    let key = JSON.stringify(rest);
    return cache[key] || (cache[key] = fn(...rest));
  };
}
```

## 18.函数重载

```js
function addMethod(obj, name, fn) {
  let oldFn = obj[name];
  obj[name] = function () {
    let res = Array.from(arguments);
    if (rest.length == fn.length) {
      fn.apply(this, rest);
    } else if (typeof fn == 'function') {
      oldFn.apply(this, rest);
    }
  };
}
var person = { userName: 'bear鲍的小小熊' };
addMethod(person, 'show', function () {
  console.log(this.userName + '---->' + 'show1');
});
addMethod(person, 'show', function (str) {
  console.log(this.userName + '---->' + str);
});
addMethod(person, 'show', function (a, b) {
  console.log(this.userName + '---->' + (a + b));
});
person.show();
person.show('bkl');
person.show(10, 20);
```

## 19.请求超时重试机制

```js
function failed(timer) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(console.log('failed::' + timer));
    }, timer);
  });
}
function commonAjax(timer) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(console.log('success::' + timer));
    }, timer);
  });
}
function retryQuest(fn, num = 1) {
  let count = 1;
  async function request() {
    let p;
    try {
      p = await Promise.race([fn(2000), failed(1000)]);
      return p;
    } catch (e) {
      if (count <= num) {
        count++;
        request();
      } else {
        console.log('retry finish');
      }
    }
  }
  return request();
}
retryQuest(commonAjax, 3);
```

## 20.封装方法取消请求

```js
/**
 * p: promise
 */
function cancelPromise(p) {
  let abort;
  let p1 = new Promise((resolve, reject) => (abort = reject));
  let p2 = Promise.race([p1, p]);
  p2.abort = abort;
  return p2;
}
```

## 21.手写数组 API(push)

```js
Array.prototype.mockPush = function () {
  let arr = this || [];
  let len = arguments.length;
  for (let i = 0; i < len; i++) {
    arr[arr.length] = arguments[i];
  }
  return arr.length;
};
let arr = [1, 2, 3, 4];
arr.push(5, 6);
console.log(arr, 'arr');
```

## 22.改造 forEach，使其可终止遍历

```js
Array.prototype.mockForEach = function (fn, context) {
  let arr = this || [];
  let flag = false;
  for (let i = 0; i < arr.length; i++) {
    flag = fn.call(context, arr[i], i, arr);
    if (flag) {
      break;
    }
  }
};
let arr = [1, 2, 3, 4, 5];
arr.mockForEach((item, i, arr) => {
  console.log(item, i, arr);
  if (item == 3) {
    return true;
  }
});
```

## 23.回到顶部

```js
function backTop() {
  let top = document.body.scrollTop || document.documentElement.scrollTop;
  if (top > 0) {
    requestAnimationFrame(backTop);
    window.scrollTo(0, top - top / 8);
  }
}
```

## 24.实现验证码倒计时

```js

```

## 25.利用正则筛选只包含大小写字母的字符串

```js
const arr = ['Abc', 'DeF', '123', '_ghI'];

const filteredArr = arr
  .filter((item) => /^[a-zA-Z]+$/.test(item))
  .map((item) => item.toUpperCase());

console.log(filteredArr); // ["ABC", "DEF"]
```

## 26.使用 js 生成 1-10000 的数组

```js
function gen(n) {
  return Array.from({ length: n }, (v, k) => k + 1);
}
gen(100);
```

## 27.

## 28.

## 29.

## 30.
