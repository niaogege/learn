---
title: 函数式编程FP
order: 1
group:
  order: 1
  title: Basic
  path: /interview/js
nav:
  order: 3
  title: 'interview'
  path: /interview
---

## 定义

**面向对象编程**：它的思维方式是把现实世界中的事物抽象成程序世界中的类和对象，然后通过**封装，继承和多态**来演示事物之间的联系。

**面向函数式编程**：它的思维方式是把现实世界中的事物和事物之间的联系，抽象到程序世界中。

## 函数式应用

### 高阶函数 (high-order-function)

“一个以函数作为参数或返回的函数。高阶函数，它虽然听起来很复杂，但其实并不难。并且非常的实用。要完全理解这个概念，首先必须了解 头等函数(https://developer.mozilla.org/zh-CN/docs/Glossary/First-class_Function)（First-Class Functions）的概念。头等函数简单的讲就是函数也是一个对象，它能赋值给变量，能作为参数返回。

而高阶函数就是以函数为参数或返回的函数。

### 函数柯里化

当函数有多个参数的时候，我们可以对函数进行改造，只接收部分参数，然后返回一个函数继续等待接收剩余参数，并且返回相应的结果。

```js
function curry(fn) {
  var arr = [];
  return function judge(...rest) {
    console.log(fn.lengt, 'fn.lengt');
    console.log(rest.length, 'rest.length');
    if (fn.length === rest.length) {
      var val = fn.apply(this, arr);
      arr = [];
      return val;
    } else {
      arr.push(...rest);
      return judge;
    }
  };
}
var add = (...rest) => rest.reduce((a, b) => a + b, 0);
var sum = curry(add);
sum(1)(2)(3)();
```

## 参考

- [今天，我们来深入来聊聊函数式编程（FP）](https://mp.weixin.qq.com/s/vyKDJiIKtCcO5Wkh9ptDGw)
