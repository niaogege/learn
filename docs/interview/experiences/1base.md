---
title: 0310积累面试经验之base相关
order: 1
group:
  order: 0
  title: interview
nav:
  order: 3
  title: 'interview'
  path: /interview
---

## 工程师最最基础的概念

- 基础概念
- new 手写
- bind 手写
- apply 和 call 手写
- es6 继承手写
- 深浅拷贝

## 基础概念

### 执行上下文 | 作用域 | 闭包

- JS 中存在的执行上下文类型： 1.全局上下文：windows 对象 2.函数上下文：每次调用函数时，创建一个新的上下文 3.eval。每次执行上下文，都存在三个属性：作用域、变量、this

- 作用域链：JavaScript 引擎在寻找一个变量名的时候，会在当前作用域进行查找，如果没有，就会继续往外层作用域进行查找，直到全局作用域为止，这就形成了一个作用域链。
- 闭包：引用外部函数变量的内部函数

主要使用场景： 1.setTimeout、setInterval、setImmediate 之类的定时器、事件回调、ajax 请求的回调 2.被外部函数作为函数返回，或者返回对象中引用内部函数的情况

可以使用立即执行函数（IIFE）来实现闭包，代码如下：

```js
(function Name(i) {
  console.log(i);
})(10);
```

> 闭包只是存储外部变量的引用，不会拷贝外部变量的值；闭包引用的变量会被存放到堆内存中。

### new 手写

> 不知道写过多少遍了，现在写又忘记了！又这么难记忆吗！！

- 创建一个新对象
- 新对象的原型属性**proto**指向构造函数的 prototype 属性
- 构造函数内部 this 执行新对象
- 执行构造函数
- 如果没有返回或者返回的不是对象 则需要返回对象

```js
function Test(name) {
  this.name = name;
}
var test = new Test('cpp');
console.log(test);
function mockNew(fn, ...rest) {
  var target = Object.create(fn.prototype);
  var val = fn.apply(target, rest);
  return val instanceof Object ? val : target;
}
var test2 = mockNew(Test, 'wmh');
console.log(test2);
```

### apply 和 call

- call

call() **方法使用一个指定的 this 值和单独给出的一个或多个参数来调用一个函数**。

call() 提供新的 this 值给当前调用的函数/方法。你可以使用 call 来实现继承：写一个方法，然后让另外一个新的对象来继承它（而不是在新对象中再写一次这个方法）。

> 使用 call 方法调用函数并且不指定第一个参数（argument）

```js
function getName({ name }) {
  return name;
}
var obj = { name: 'cpp' };
var name1 = getName.call(obj);
console.log(name1);

Function.prototype.myCall = function mockCall(obj, ...rest) {
  obj = window || Object(obj);
  var sy = Symbol();
  obj[sy] = this;
  var val = obj[sy](...rest);
  delete obj[sy];
  return val;
};
var name2 = mockCall(null, obj);
```

- apply

```js
Function.prototype.myApply = function (context, args) {
  context = context || window;
  var sym = Symbol();
  context[sym] = this;
  var res = context[sym](...args);
  delete context[sym];
  return res;
};
```

### bind

bind() 方法会创建一个新函数。当这个新函数被调用时，bind() 的第一个参数将作为它运行时的 this，之后的一序列参数将会在传递的实参前传入作为它的参数。(来自于 MDN ) 由此我们可以首先得出 bind 函数的两个特点：

- 返回一个函数

- 可以传入参数

```js
Function.

```

[Bind 模拟](https://segmentfault.com/a/1190000009271416)

### es6 继承

### 如何使用 es5 实现继承
