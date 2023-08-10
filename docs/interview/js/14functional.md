---
title: 函数式编程FP
order: 14
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

柯里化的定义: **接收一部分参数，返回一个函数接收剩余参数，接收足够参数后，执行原函数**。

当柯里化函数接收到足够参数后，就会执行原函数，如何去确定何时达到足够的参数呢？

有两种思路：

1.通过函数的 length 属性，获取函数的形参个数，形参的个数就是所需的参数个数 2.在调用柯里化工具函数时，手动指定所需的参数个数,所以需要判断形参和 fn.length

```js
function curry2(fn) {
  var arr = [];
  return function temp(...rest) {
    if (rest.length) {
      arr.push(...rest);
      return temp;
    } else {
      var res = fn.apply(this, arr);
      arr = [];
      return res;
    }
  };
}
var sum = (...rest) => rest.reduce((a, b) => a + b, 0);
var fn = curry2(sum);
fn(1)(2)(3)(4)();
```

## 参考

- [今天，我们来深入来聊聊函数式编程（FP）](https://mp.weixin.qq.com/s/vyKDJiIKtCcO5Wkh9ptDGw)
