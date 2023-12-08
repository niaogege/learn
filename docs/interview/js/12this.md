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
  name: 'local',
  log: () => {
    console.log(this.name);
  },
};
obj.log(); // 箭头函数 this 指向全局window
var test = obj.log;
test(); // 由于 JavaScript 中函数的执行上下文与调用方式相关，此时 test 被作为全局函数调用，因此 this 将指向全局对象（在浏览器环境中通常是 window）

var obj = {
  name: 'local',
  log: function () {
    console.log(this.name);
  },
};
obj.log(); // 通过对象调用 this 指向调用对象obj
var fn = obj.log.bind(obj);
fn();
```

## call/apply

### 区别

- 立即执行与返回新函数：

  **call** 和 **apply**: 即执行原函数。bind： 返回一个新的函数，不会立即执行原函数，而是返回一个新函数，你可以稍后调用。

## bind

```js
module.exports = function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
};
```

## 参考

- [7 年前端面试](https://juejin.cn/post/7307507612722102307)
