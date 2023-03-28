---
title: 0310积累面试经验之Array相关
order: 3
group:
  order: 0
  title: interview
nav:
  order: 3
  title: 'interview'
  path: /interview
---

## 数组相关 API

- 手写 instanceof

### 手写 instanceof

用于检测构造函数的原型是否在某一个实例的原型链上

```js
function mockInstanceof(left, right) {
  let link = left.__proto__; // Object.getPrototypeOf(left)
  while (link !== null) {
    if (link === right.prototype) {
      return true;
    }
    link = link.__proto__;
  }
  return false;
}
function mockInstanceof2(left, right) {
  return right.prototype.isPrototypeof(left);
}
```