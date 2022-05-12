---
title: 代码片段
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
})()(function () {
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
console.log(typeof a);
console.log(typeof b);
```
