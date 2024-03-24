---
title: 202311手写汇总(5)-HotWriting
order: 17
group:
  order: 0
  title: interview
nav:
  order: 3
  title: 'interview'
  path: /interview
---

> 面试前的 HotWriting 热门手写

### 1.curry 函数柯里化

### 2.偏函数/惰性函数

### 3.16 进制和颜色字符串进行转换

### 4.二分查找

### 5.手写驼峰转化

### 6.手写 vue 版 render

### 7.千分位分割以及包含小数点的分割

### 8.实现一个 node 异步函数的 promisify

### 9.封装一个类使对象可以被 for of 遍历

### 10.URL 参数解析

### 11.setTimeout 实现 setInterval

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

### 12.实现 Object.create

```js
function mockCreate(target) {
  function F() {}
  F.prototype = target;
  return new F();
}
```

### 13.实现 Object.assign

```js

```

### 14.实现 es6 Class

```js
function mockClass(con, proto) {}
```

### 15.实现 es6 extends

```js
function mockExtends(child, parent, staticProps) {}
```

### 16.实现数组转对象

```js
function objToArray(obj: Record<string, Obj>): FormatItem[] {
  // 补全此处代码
  throw new Error('功能待实现');
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

### 17.缓存函数

```js
function memoryFn(fn) {
  let cache = {};
  return (...rest) => {
    let key = JSON.stringify(rest);
    return cache[key] || (cache[key] = fn(...rest));
  };
}
```

### 18.函数重载

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

### 19.请求超时重试机制

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

### 20.封装方法取消请求

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
