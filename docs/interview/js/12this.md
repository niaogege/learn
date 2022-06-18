---
title: this/apply/call/bind
order: 12
group:
  order: 1
  title: js Basic
  path: /interview/js
nav:
  order: 3
  title: 'interview'
  path: /interview
---

## 面试题：

- 手写 apply/call/bind
- bind 有什么用？连续多个 bind，最后 this 指向是什么？

## this 指向

```js
var name = 'global';
var obj = {
  name: 'ngnce',
  log: () => {
    console.log(this.name);
  },
};
obj.log();
var test = obj.log;
test();

var obj = {
  name: 'ngnce',
  log: function () {
    console.log(this.name);
  },
};
obj.log();
```

## call/apply

## bind

```js
module.exports = function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
};
```

## 参考
