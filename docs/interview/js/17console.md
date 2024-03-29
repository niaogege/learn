---
title: 常考的打印题
order: 17
group:
  order: 1
  title: Basic
  path: /interview/js
nav:
  order: 3
  title: 'interview'
  path: /interview
---

## 0.赋值表达式,输出下面的打印

```js
let obj = { num1: 111 };

obj.child = obj = { num2: 222 };

console.log(obj.child); // 输出？
console.log(obj); // ?
```

判断对象是否存在循环引用？

```js
function isCycle(obj) {
  let cache = new Set();
  let dfs = (obj) => {
    let values = Object.values(obj);
    for (let val of values) {
      if (cache.has(val)) {
        return true;
      }
      if (val == null || typeof val != 'object') continue;
      m.add(val);
      if (dfs(val)) {
        return true;
      }
      return false;
    }
  };
  return dfs(obj);
}
```

## 1.注意前面的+

```js
function f1() {
  var sum = 0;
  function f2() {
    sum++;
    return f2;
  }
  f2.valueOf = function () {
    return sum;
  };
  f2.toString = function () {
    return sum + '';
  };
  return f2;
}
console.log(+f1()); // 0
console.log(+f1()()); // 1
console.log(+f1()()()); // 2
```

## 函数作用域相关

```js
var foo = 1;
function fn() {
  foo = 3;
  return;
  function foo() {
    // todo
  }
}
fn();
console.log(foo); // 1
```

另一个

```js
var foo;
function fn() {
  foo = 3;
  return;
  function foo() {
    // todo
  }
}
fn();
console.log(foo); // 3
```

## 事件循环相关 输出打印顺序

### requestAnimationFrame 和 requestIdleCallback

```js
console.log('1');
setTimeout(() => {
  console.log('2');
}, 0);
requestAnimationFrame(() => {
  console.log('3');
});
requestIdleCallback(() => {
  console.log('4');
});
new Promise((resolve) => {
  console.log('5');
}).then((value) => {
  console.log(value);
});
async function a() {
  console.log(await '7');
}
a();
console.log('8');
// 1 5 8 7 undefined 2 3 4 最后 2 3 4 也可能是324
```

> requestIdleCallback 空闲时调用 时机最后 requestAnimationFrame 1 秒刷新 16 次，跟当前刷新频率相关，有可能后执行

async 跟 Promise 哪个顺序先？还要看 Promise 中的 resolve 了吗

```js
new Promise((resolve) => {
  console.log('p1');
  resolve('cpp');
}).then((val) => {
  console.log(val, 'undefined');
});
console.log('not');
async function b() {
  console.log(await 'await');
}
b();
console.log('end');
//p1 not end  cpp await
```

### 如果去掉 resolve 呢

```js
new Promise((resolve) => {
  console.log('p1');
  // resolve('cpp');
}).then((val) => {
  console.log(val, 'undefined');
});
console.log('not');
async function b() {
  console.log(await 'await');
}
b();
console.log('end');
// p1 not end await
```

### 如果去掉 **await** 呢

```js
new Promise((resolve) => {
  console.log('p1');
  resolve('cpp');
}).then((val) => {
  console.log(val, 'undefined');
});
console.log('not');
async function b() {
  console.log('await');
}
b();
console.log('end'); // p1 not await end cpp undefined
```

## 事件循环相关打印 2

```js
setTimeout(function () {
  console.log('1');
}, 0);
async function async1() {
  console.log('2');
  const data = await async2();
  console.log('3');
  return data;
}
async function async2() {
  return new Promise((resolve) => {
    console.log('4');
    resolve('async2的结果');
  }).then((data) => {
    console.log('5');
    return data;
  });
}
async1().then((data) => {
  console.log('6');
  console.log(data);
});
new Promise(function (resolve) {
  console.log('7');
  //   resolve()
}).then(function () {
  console.log('8');
});
// 2 4 7    8 1
```

## await/Promise

睁大眼睛看看有啥区别

> 想不到 async/await 比 Promise 要难理解

```js
async function async1() {
  console.log('async1 start')
  await new Promise(resolve => {
    console.log('promise1')
  })
  console.log('async1 success')
  return 'async1 end'
}
console.log('srcipt start')
async1().then(res => console.log(res))
console.log('srcipt end')
// srcipt start
// async1 start
// promise1
// srcipt end
// async1 success
// async1 end

// 正确答案
srcipt start
async1 start
promise1
srcipt end
```

Promise 里如果没有 resolve,导致的结果就是该 Promise 一直处于 pending 状态，所以会导致后面的都走不到改造上面的，打印就完全变样了，This is Why?

```js
async function async1() {
  console.log('async1 start');
  await new Promise((resolve) => {
    console.log('promise1');
    resolve('CPP');
  });
  console.log('async1 success');
  return 'async1 end';
}
console.log('srcipt start');
async1().then((res) => console.log(res));
console.log('srcipt end');
// srcipt start
// async1 start
// promise1
// srcipt end
// async1 success
// async1 end
```

### Promise

如果 resolve 参数是一个 promise ，将会改变 promise 状态。比如下面例子中，a 中 resolve(b),而 b 又是一个 promise,导致的结果则是 a 的状态将被变成 b 的状态

```js
var b = new Promise((resolve) => (window.resolve = resolve)); // pending
var a = new Promise((resolve) => resolve(b));
a.then(() => console.log('a'));
b.then(() => console.log('b'));
resolve();
console.log(b, a);
// b
// a
```

当 Promise 被 resolve 作为参数传递时，需要等待 Promise 执行完才能继续执行，即下面的 a 需要等到 _b_ resolved 执行完成

因为 a 的 resolve 返回了 b 的 Promise,所以此时 a 的 then 方法已经是 b 的 then 了，所以 a 和 b then 中均输出了 'b cpp' 和 'a cpp'

```js
var b = new Promise((resolve) => (window.resolve = resolve)); // pending
var a = new Promise((resolve) => resolve(b));
a.then((res) => console.log('a', res));
b.then((res) => console.log('b', res));
resolve('cpp');
console.log(b, a);
// b cpp
// a cpp
```

```js
var b = new Promise((resolve) => (window.resolve = resolve)); // pending
var c = new Promise((resolve) => {});
var a = new Promise((resolve) => resolve(c));
a.then(() => console.log('a'));
b.then(() => console.log('b'));
resolve();
// b
```

```js
var b = new Promise((resolve) => (window.resolve = resolve)); // pending
var a = new Promise((resolve) => resolve(b));
var c = a.then(() => console.log('a'));
var d = b.then(() => console.log('b'));
resolve();
console.log(a, b, c, d);
// b
// a
```

```js
var p1 = new Promise((resolve) => resolve('cpp'));
var p2 = new Promise((resolve) => resolve(p1));
var p3 = p2.then((res) => console.log('p2then ', res));
var p4 = p1.then((res) => console.log('p1then ', res));
console.log(p1, p2, p3, p4);
```

```js
var p1 = new Promise((resolve) => (window.resolve = resolve));
var p2 = new Promise((resolve) => {
  setTimeout(() => {
    resolve('p2');
  });
});
var p3 = p2.then((res) => console.log('p2then ', res));
var p4 = p1.then((res) => console.log('p1then ', res));
resolve('nima');
console.log(p1, p2, p3, p4);
```

## 数值转换

```js
var box = {
  valueOf() {
    console.log('调用了valueOf');
    return 'abc';
  },
  toString() {
    console.log('调用了toString');
    return '123';
  },
};
console.log(Number(box));
// 调用了valueOf
// NaN
```

以及

```js
var box = {
  valueOf() {
    console.log('调用了valueOf');
    return {};
  },
  toString() {
    console.log('调用了toString');
    return '123';
  },
};
console.log(Number(box));
// 调用了valueOf
// 调用了toString
// 123
```

转换规则如下：

- 如果 valueOf 存在，且返回“基本类型”数据，返回 valueOf 的结果。
- 如果 toString 存在，且返回“基本类型”数据，返回 toString 的结果。报错。
