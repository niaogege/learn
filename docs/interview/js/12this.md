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

- 手写 apply/call/bind？
- bind 有什么用？连续多个 bind，最后 this 指向是什么？
- 箭头函数和普通函数区别

## 箭头函数和普通函数区别

### 语法形式：

箭头函数： 使用箭头（=>）来定义函数，通常有简洁的语法形式。箭头函数没有自己的 this，arguments，super 或 new.target，它们继承这些值来自执行上下文。

普通函数： 使用关键字 function 来定义函数，可以是函数声明或函数表达式。

### this 的值：

- 箭头函数： 箭头函数没有自己的 this，它继承自包含它的最近的非箭头函数父作用域的 this 值。
- 普通函数： 函数的 this 值在运行时动态确定，取决于函数如何被调用。在全局作用域中，this 指向全局对象（在浏览器中通常是 window）。在对象方法中，this 指向调用方法的对象。

### arguments 对象：

- 箭头函数： 没有自己的 arguments 对象，但可以使用剩余参数（rest parameters）来达到相似的效果。
- 普通函数： 有自己的 arguments 对象，它是一个类数组对象，包含传递给函数的所有参数。

### 构造函数：

- 箭头函数： 不能用作构造函数，不能通过 new 关键字调用，否则会抛出错误。
- 普通函数： 可以用作构造函数，通过 new 关键字调用时会创建一个新对象，并将其绑定到函数的 this 上。

### 绑定（Binding）：

- 箭头函数： 不会创建自己的执行上下文，不能通过 call()、apply() 或 bind() 改变其 this。
- 普通函数： this 可以通过 call()、apply() 或 bind() 方法进行显式绑定

## this 指向

- 三者都可以改变函数的 this 对象指向。
- 三者第一个参数都是 this 要指向的对象，如果如果没有这个参数或参数为 undefined 或 null，则默认指向全局 window。
- 三者都可以传参，但是 **apply 是数组**，而 **call 是参数列表**，且 apply 和 call 是一次性传入参数，而 bind 可以分为多次传入。
- bind 是返回绑定 this 之后的函数，便于**稍后调用**；apply 、call 则是**立即执行** 。
- bind()会返回一个新的函数，如果这个返回的新的函数作为构造函数创建一个新的对象，那么此时 this 不再指向传入给 bind 的第一个参数，而是**指向用 new 创建的实例**

```js
Function.prototype.mockBind = function (context) {
  const self = this;
  const arg1 = Array.protptype.slice.call(arguments, 1);
  let bindFn = function () {
    let arg2 = Array.prototype.slice.call(arguments);
    // this instanceof self 此时this指向指向bindFn的实例  这时候不需要改变this指向
    // 否则 如果只是作为普通函数调用  那就很简单了 直接改变this指向为传入的context
    self.apply(this instanceof self ? this : context, [...arg1, ...arg2]);
  };
  let BridgeFn = function () {};
  BridgeFn.prototype = this.prototype;
  bindFn.prototype = new BridgeFn();
  return bindFn;
};
```

### 指向啥

- 调用函数，严格模式下 this 指向 undefined，非严格指向全局 window
- new 一个对象，this 指向该对象
- call、apply、bind 都可以修改 this 指向，只有 apply 使用数组传参，同时 call 和 apply 改变了函数的 this 上下文后便执行该函数,而 bind 则是返回改变了上下文后的一个函数。
- 箭头函数中，this 指向由外层作用域决定，一般是全局

### 练习题

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
test();
// 由于 JavaScript 中函数的执行上下文与调用方式相关，此时 test 被作为全局函数调用，因此 this 将指向全局对象（在浏览器环境中通常是 window）
var name = 'cpp';
var obj = {
  name: 'local',
  log: function () {
    console.log(this.name);
  },
};
var test = obj.log;
test();
// obj.log(); // 通过对象调用 this 指向调用对象obj
var fn = obj.log.bind(obj); //local
fn(); // local
```

## call/apply

### 区别

- 立即执行与返回新函数：

  **call** 和 **apply**: 即执行原函数。

  bind： 返回一个新的函数，你可以稍后调用。

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
