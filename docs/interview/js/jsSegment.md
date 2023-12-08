---
title: 代码片段和打印题
order: 10
group:
  order: 1
  title: Basic
  path: /interview/js
nav:
  order: 3
  title: 'interview'
  path: /interview
---

### check 数据类型

```js
function checkDataType(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1).toLocaleLowerCase();
}
checkDataType('chenpp');
```

### 手机脱敏

```js
// 展示前三位和后四位
function safe(str) {
  return str.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1****$2');
}
safe('18551602693');
```

### i++和++i

- 前缀版（++i）：操作符位于变量的前面，表示**先递增(递减)**，后执行语句；

- 后缀版（i++）：操作符位于变量的后面，表示**先执行语句**，后递增(递减)；

```js
var i = 0;
console.log(++i); // 先递增在执行console 1
var num = 0;
console.log(num++); // 先执行console 在递增 1

for (let i = 0; i < 5; i++) {
  console.log(i);
}
```

## 输出结果

```js
let a = 0,
  b = 0;
function fn(a) {
  fn = function fn2(b) {
    console.log(++a + b);
  };
  console.log(a++);
}
fn(1); // 1
fn(2); // 5
```

### 简介高效片段

```js
// 打乱数组
(function () {
  let arr = ['cpp', 'ww', 6, false];
  arr = arr.sort(() => 0.5 - Math.random());
  console.log(arr);
})();

// 随机选一个
(function () {
  let arr = ['cpp', 'ww', 6, false];
  const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
  return random(arr);
})();

(function () {
  let str = '320cpp980706wmh';
  const nums = str.replace(/\D/g, '');
  console.log(nums);
})();

(function () {
  let num = 43;
  const binaryNum = +num.toString(2); // 十进制
  const hexadecimalNum = +num.toString(16); // 十六进制
  console.log(binaryNum, hexadecimalNum);
})();

function isReverse(str1, str2) {
  const normalize = (str) => str.toLowerCase().normalize().split('').reverse().join('');
  return normalize(str1) === str2;
}
isReverse('cpp', 'ppc'); // true

/**
 * 判断两个字符串是否互相排列
 */
function isAnagram(str1, str2) {
  const normalize = (str) => str.toLowerCase().normalize('NFD').split('').sort().join('');
  return normalize(str1) === normalize(str2);
}
isAnagram('cpp', 'wmh'); // false
isAnagram('cpp', 'cpc'); // false
isAnagram('cpp', 'ppc'); // true

// rgb -> hex
function rgbToHex(r, g, b) {
  const toHex = (num) => {
    const hex = num.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
rgbToHex(255, 255, 255);

// hex -> rgb
// #ffffff => rgb(255, 255, 255)
function hexToRgb(str) {
  const rgb = str.replace('#', '0x');
  const r = rgb >> 16;
  const g = (rgb >> 8) & 0xff;
  const b = rgb & 0xff;
  return `rgb(${r},${g},${b})`;
}
var tt = hexToRgb('#ffffff');
console.log(tt);
```

随机生成颜色

```js
const randomColor = () => `${Math.random().toString(16).slice(-6)}`;
```

```js
var a = {};
a.value = 1;
var b = a;
b.value = 2;
console.log(a.value); // 2
```

事件源/句柄/事件句柄

```js
// 事件处理函数
oBtn.onclick = function () {};
// 事件源： oBtn
// 句柄: oBtn.onclick
// 事件句柄： oBtn.onclick=function(){}
```

### 原型

```js
function Animal() {
  this.type = 'animal';
}

function Dog() {
  this.name = 'dog';
}

Dog.prototype = new Animal();

var PavlovPet = new Dog();

console.log(PavlovPet.__proto__ === Dog.prototype);
console.log(Dog.prototype.__proto__ === Animal.prototype);
```

### 异步循环

```js
for (let i = 0; i < 3; i++) {
  const log = () => {
    console.log(i);
  };
  setTimeout(log, 100);
}
```

### numbers

```js
const length = 4;
const numbers = [];
for (var i = 0; i < length; i++);
{
  numbers.push(i + 1);
}
console.log(numbers);
```

### ++a 和 a++

```js
function foo() {
  let a = (b = 0);
  a++;
  return a;
}

foo();
console.log(typeof a); // undefined
console.log(typeof b); // number
```

## 如何正常解构对象里的属性值

在不知道 obj 的属性名 data 的前提下，解构出 name 属性

```js
var obj = {
  data: {
    name: 'cpp',
  },
};
let { [Reflect.ownKeys(obj)]: keys } = obj;
console.log(keys, '111'); // {name: 'cpp'}
console.log(Reflect.ownKeys(obj), '22');
```

```js
var obj = {
  data: {
    name: 'cpp'
  }
}

var {
[
  Reflect.ownKeys(key)
]: keys
} = {
  (
    {
      [Reflect.ownKeys(obj)]: key
    } = obj
  ), key
}
console.log(key, 'key') // {name: 'cpp'}
console.log(keys, 'keys') // cpp
```

### print(fb) 执行后打印什么

```js
function print(fb) {
  const b = 200;
  fb();
}
const b = 100;
function fb() {
  console.log(b); // 100
}
print(fb);

function create() {
  let a = 100;
  return function () {
    console.log(a);
  };
}
const fn = create();
const a = 200;
fn();
```

## [生成器函数打印](https://juejin.cn/post/7299696650896080922#heading-14)

```js
function* test(x) {
  const y = 2 * (yield x + 1);
  const z = yield y / 3;
  console.log('x', x, 'y', y, '2', z);
  return x + y + z;
}
const b = test(5);
console.log(b.next()); // 6
console.log(b.next(12)); // 2*12/3 = 8
console.log(b.next(13)); // 5+24+13 = 42

function asyncGenerator(fn) {
  return function (...rest) {
    let gFn = fn.apply(this, rest);
    return new Promise((resolve, reject) => {
      step('next');
      function step(key, ...arg) {
        let res;
        try {
          res = gFn[key](...arg);
          let { done, value } = res;
          if (done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(
              (val) => {
                return step('next', val);
              },
              (err) => step('throw', err),
            );
          }
        } catch (e) {
          reject(e);
        }
      }
    });
  };
}
```

长时间不复习 generator 函数，容易忘记,这是一个使用 **Generator** 函数的示例，该函数包含了 yield 表达式，允许你在迭代的过程中暂停执行，同时传递和接收值。在执行 Generator 函数时，通过调用其 next 方法，可以逐步执行 Generator 函数体内的代码。

让我们逐步解释这个过程：

```js
function* test(x) {
  // 第一次调用 next()，执行到第一个 yield 表达式
  const y = 2 * (yield x + 1);
  // 第二次调用 next(12)，将 12 传递给上一个 yield 表达式，计算 y，并执行到第二个 yield 表达式
  const z = yield y / 3;
  // 第三次调用 next(13)，将 13 传递给上一个 yield 表达式，计算 z，并执行到函数结束
  console.log('x', x, 'y', y, 'z', z);
  // 返回 x + y + z
  return x + y + z;
}

// 创建 Generator 对象，但不执行函数体
const b = test(5);

// 第一次调用 next()，开始执行 Generator 函数体，执行到第一个 yield 表达式
console.log(b.next());
// 输出: { value: 6, done: false }，其中 value 是第一个 yield 表达式的结果（5 + 1）

// 第二次调用 next(12)，将 12 传递给上一个 yield 表达式，继续执行函数体，执行到第二个 yield 表达式
console.log(b.next(12));
// 输出: { value: 8, done: false }，其中 value 是第二个 yield 表达式的结果（2 * 6 / 3）

// 第三次调用 next(13)，将 13 传递给上一个 yield 表达式，继续执行函数体，执行到函数结束
console.log(b.next(13));
// 输出: x 5 y 24 z 13，其中 x 是初始参数 5，y 是上一个 yield 表达式的结果（2 * 12），z 是上一个 yield 表达式的传入值（13）
// 最终返回 x + y + z，即 5 + 24 + 13 = 42
// 输出: { value: 42, done: true }，其中 value 是函数的返回值，done 表示 Generator 函数是否执行结束
```

分析函数执行过程：

- 第一次调用 b.next()：

Generator 函数开始执行，执行到 yield (x + 1) 时暂停，返回 { value: 6, done: false }。此时 yield 的表达式的值为 x + 1，即 5 + 1。

- 第二次调用 b.next(12)：

继续执行 Generator 函数，将传入的参数 12 赋给上一个 yield 表达式的结果。执行到 yield (y / 3) 时暂停，返回 { value: 8, done: false }。此时 y 的值为 2 \* 12，即 24。

- 第三次调用 b.next(13)：

继续执行 Generator 函数，将传入的参数 13 赋给上一个 yield 表达式的结果。执行到函数末尾，即 console.log 语句，打印 'x 5 y 24 z 13'。最终返回 { value: 18, done: true }，表示 Generator 函数执行完毕。
