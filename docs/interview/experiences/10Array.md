---
title: 0310积累面试经验之Array相关
order: 10
group:
  order: 11
  title: /interview/experience
nav:
  order: 3
  title: 'interview'
  path: /interview
---

## 数组相关 API

- 手写 instanceof
- Array.prototype.reduce
- Array.prototype.map
- Array.prototype.filter
- Array.prototype.some
- Array.prototype.every

## 数组相关应用

- 找到数组数字最小的 index
- 找到数组项中最大的一项

### [找到数组数字最小的 index](https://phuoc.ng/collection/1-loc/find-the-index-of-the-minimum-item-of-an-array/)

```js
function findMax(arr) {
  return arr.reduce((pre, cur, i, a) => (a[pre] > cur ? pre : i), 0);
}
findMax([101, 2, 3, 4, 5]);

function findMin(arr) {
  return arr.reduce((pre, cur, i, a) => (cur < a[pre] ? i : pre), 0);
}
findMin([101, 2, 3, 4, 5]);
```

### [找到数组项中最大的一项](https://phuoc.ng/collection/1-loc/find-the-maximum-item-of-an-array-by-given-key/)

```js
const people = [
  { name: 'Bar', age: 24 },
  { name: 'Baz', age: 32 },
  { name: 'Foo', age: 42 },
  { name: 'Fuzz', age: 36 },
];
maxBy(people, 'age'); // { name: 'Foo', age: 42 }
```
