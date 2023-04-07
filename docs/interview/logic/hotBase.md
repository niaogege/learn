---
title: hot100
order: 10
group:
  order: 3
  title: 算法
  path: /interview/logic
nav:
  order: 3
  title: 'interview'
  path: /interview
---

### 输出 100 内的所有质数

> 质数又称素数。一个大于 1 的自然数，除了 1 和它自身外，不能整除其他自然数的数叫做质数 2 是 1/0 都不是质数 也不是合数大于 1 且除 1 和这个数本身，还能被其他正整数整除的整数

```js
function isPrime(n) {
  const max = Math.ceil(Math.sqrt(n));
  if (n === 2) return true;
  for (let counter = 2; counter <= max; counter++) {
    if (n % counter === 0) {
      return false;
    }
  }
  return true;
}
function primeList(n) {
  let arr = [];
  for (let num = 2; num < n; num++) {
    if (isPrime(num)) {
      arr.push(num);
    }
  }
  return arr;
}
primeList(100);
```
