---
title: 作用域链以及闭包
order: 13
group:
  order: 1
  title: js Basic
  path: /interview/js
nav:
  order: 3
  title: 'interview'
  path: /interview
---

## 作用域

作用：管理 js 引擎如何在当前作用域以及子域根据标识符名称进行变量查找

## 作用域链

在《JavaScript 深入之变量对象》中讲到，当查找变量的时候，会先从当前上下文的变量对象中查找，如果没有找到，就会从父级(词法层面上的父级)执行上下文的变量对象中查找，一直找到全局上下文的变量对象，也就是全局对象。这样由多个执行上下文的变量对象构成的链表就叫做作用域链。

## 词法作用域

词法作用域的意思是在函数嵌套中，内层函数可以访问父级作用域的变量等资源。这意味着子函数词法绑定到了父级执行环境。因为 JavaScript 采用的是词法作用域，函数的作用域在函数定义的时候就决定了。

## [闭包](https://segmentfault.com/a/1190000009215716)

### 从技术的角度讲，所有的 JavaScript 函数都是闭包。

所有的函数。因为它们都在创建的时候就将上层上下文的数据保存起来了。哪怕是简单的全局变量也是如此，因为函数中访问全局变量就相当于是在访问自由变量，这个时候使用最外层的作用域。

### 从实践角度：以下函数才算是闭包：

1.即使创建它的上下文已经销毁，它仍然存在（比如，内部函数从父函数中返回）

2.在代码中引用了自由变量

当内部函数试着访问外部函数的作用域链（词法作用域之外的变量）时产生闭包。闭包包括它们自己的作用域链、父级作用域链和全局作用域。

闭包不仅能访问外部函数的变量，也能访问外部函数的参数;

即使函数已经 return，闭包仍然能访问外部函数的变量。这意味着 return 的函数允许持续访问外部函数的所有资源。当你的外部函数 return 一个内部函数，调用外部函数时 return 的函数并不会被调用。你必须先用一个单独的变量保存外部函数的引用，然后将这个变量当做函数来调用。看下面这个例子：

```js
function greet() {
  name = 'Hammad';
  return function () {
    console.log('Hi ' + name);
  };
}
greet(); // nothing happens, no errors
// the returned function from greet() gets saved in greetLetter
greetLetter = greet();
// calling greetLetter calls the returned function from the greet() function
greetLetter(); // logs 'Hi Hammad'
```

看另一个案例：

```js
const a = 'aaaaaa';
function testFn() {
  const a = 'bbbbbb';
  return function () {
    console.log(a);
  };
}
const testFnA = testFn();
testFnA();
```

在 testFn 函数内部，返回了一个内部函数，并且内部函数引用了外部函数 testFn 中的变量 a。当执行 testFn() 后，返回的内部函数被赋值给了 testFnA，然后再调用 testFnA()。在调用 testFnA() 时，内部函数访问的变量 a 是通过闭包的方式捕获的，它引用的是外部函数 testFn 中的局部变量 a，而不是全局作用域下的变量 a。因此，console.log(a) 打印的结果是 'bbbbbb'，而不是全局作用域下的 'aaaaaa'。这是因为 JavaScript 中函数在执行时会按照词法作用域的规则查找变量，找到最近的定义。

### 必刷的面试题

```js
var data = [];

for (var i = 0; i < 3; i++) {
  data[i] = function () {
    console.log(i);
  };
}

data[0]();
data[1]();
data[2]();
```

答案是都是 3，让我们分析一下原因：

当执行到 data[0] 函数之前，此时全局上下文的 VO 为：

```js
globalContext = {
    VO: {
        data: [...],
        i: 3
    }
}
```

当执行 data[0] 函数的时候，data[0] 函数的作用域链为：

```js
data[0]Context = {
    Scope: [AO, globalContext.VO]
}
```

data[0]Context 的 AO 并没有 i 值，所以会从 globalContext.VO 中查找，i 为 3，所以打印的结果就是 3。

data[1] 和 data[2] 是一样的道理。改成闭包呢？

```js
var data = [];

for (var i = 0; i < 3; i++) {
  data[i] = (function (i) {
    return function () {
      console.log(i);
    };
  })(i);
}

data[0](); // 0
data[1](); // 1
data[2](); // 2
```
