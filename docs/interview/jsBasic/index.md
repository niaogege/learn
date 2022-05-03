---
title: Basic
group:
  order: 1
  title: js Basic
  path: /interview/js
nav:
  order: 3
  title: 'interview'
  path: /interview
---

### js 知识点

- class 类的实例属性

```js
class Cpp {
  constructor() {
    this.name = 'cpp';
  }
  // or 定义在类的最顶层
  name = 'cpp';
}
```

[实例属性的新写法](https://es6.ruanyifeng.com/#docs/class#%E5%AE%9E%E4%BE%8B%E5%B1%9E%E6%80%A7%E7%9A%84%E6%96%B0%E5%86%99%E6%B3%95)

## 继承

## 作用域以及作用域链以及上下文

### 作用域

作用域是指你的代码在运行时，各个变量/函数/对象的可访问性。作用域决定了你的代码里的变量和其他资源在各个区域的可见性。作用域是指程序源代码中定义变量的区域，作用域规定了如何查找变量也就是确定当前执行代码对变量的访问权限，js 采用词法作用域 lexical scoping，也称静态作用域; 因为 JavaScript 采用的是词法作用域，函数的作用域在函数定义的时候就决定了。

JavaScript 中的作用域

在 JavaScript 中有两种作用域

全局作用域局部作用域

当变量定义在一个函数中时，变量就在局部作用域中，而定义在函数之外的变量则从属于全局作用域。每个函数在调用的时候会创建一个新的作用域。

### 块语句

块级声明包括 if 和 switch，以及 for 和 while 循环，和函数不同，它们**不会创建新的作用域**。在块级声明中定义的变量**从属于**该块所在的作用域。

ECMAScript 6 引入了 let 和 const 关键字。这些关键字可以代替 var。和 var 关键字不同，let 和 const 关键字支持在**块级声明**中创建使用**局部作用域**。

```js
if (true) {
  // this 'if' conditional block doesn't create a scope
  // name is in the global scope because of the 'var' keyword
  var name = 'Hammad';
  // likes is in the local scope because of the 'let' keyword
  let likes = 'Coding';
  // skills is in the local scope because of the 'const' keyword
  const skills = 'JavaScript and PHP';
}

console.log(name); // logs 'Hammad'
console.log(likes); // Uncaught ReferenceError: likes is not defined
console.log(skills); // Uncaught ReferenceError: skills is not defined
```

### 上下文

作用域指的是变量的可见性,上下文指的是在相同的作用域中 this 的值，在全局作用域中，上下文总是 windows 对象，我们当然也可以使用函数方法改变上下文(apply/call/bind)

```js
class User {
  logName() {
    console.log(this);
  }
}
new User().logName();
```

### 使用 call/apply/bind 改变上下文

只需使用 call/bind 函数把上下文当作第一个参数传入，函数自己的参数在上下文参数之后传入

```js
function info(name, inter) {
  console.log(`my name is ${name}, l like ${inter}`);
  console.log('当前上下文是', this);
}
info('cpp', 'shufa');
info.call(window, 'wmh', 'play games');
info.apply('h1', ['chendapeng', 'sleep']);
```

与 Call 和 Apply 不同，Bind 并不是自己调用函数，它只是在函数调用之前绑定**上下文**和其他参数。在上面提到的例子中使用 Bind：

```js
function info(name, inter) {
  console.log(`my name is ${name}, l like ${inter}`);
  console.log('当前上下文是', this);
}
var bindF = info.bind(window, 'cppwmh', 'sleep & xuexi');
bindF();
```

### 执行环境：

JavaScript 是一种单线程语言，所以它同一时间只能执行单个任务。其他任务排列在执行环境中。当 JavaScript 解析器开始执行你的代码，环境（作用域）默认设为全局。全局环境添加到你的执行环境中，事实上这是执行环境里的第一个环境。每个函数都会创建它自己的执行环境。

当浏览器执行完环境中的代码，这个环境会从执行环境中弹出，执行环境中当前环境的状态会转移到父级环境。浏览器总是先执行在执行栈顶的执行环境（事实上就是你代码最里层的作用域）。

全局环境只能有一个，函数环境可以有任意多个。执行环境有两个阶段：**创建和执行**。

#### 创建

第一阶段是创建阶段，是函数刚被调用但代码并未执行的时候。创建阶段主要发生了 3 件事

- 创建变量对象
- 创建作用域链
- 设置上下文（this）的值

- 变量对象 Variable Object

变量对象（Variable Object）也称为活动对象（activation object），包含所有变量、函数和其他在执行环境中定义的声明。当函数调用时，解析器扫描所有资源，包括函数参数、变量和其他声明。这些东西会被塞到一个对象，这个对象就是变量对象。

- 作用域链 scopeChain 在执行环境创建阶段，作用域链在变量对象之后创建。作用域链包含变量对象。作用域链用于解析变量。当解析一个变量时，JavaScript 开始从最内层沿着父级寻找所需的变量或其他资源。作用域链包含自己执行环境以及所有父级环境中包含的变量对象。

在《JavaScript 深入之变量对象》中讲到，当查找变量的时候，会先从当前上下文的变量对象中查找，如果没有找到，就会从父级(词法层面上的父级)执行上下文的变量对象中查找，一直找到全局上下文的变量对象，也就是全局对象。这样由多个执行上下文的变量对象构成的链表就叫做作用域链。

- 设置上下文（this）的值

#### 代码执行阶段

执行环境的第二个阶段就是代码执行阶段，进行其他赋值操作并且代码最终被执行。

## 原型以及原型链

每一个 JavaScript 对象(null 除外)在创建的时候就会与之关联另一个对象，这个对象就是我们所说的原型，每一个对象都会从原型"继承"属性

访问查找一个对象的属性或者方法的时候 如果对象里没有就回去他原型上查找，如果他原型上也没有就去原型的原型上查找，如果没有就返回 null,这个查找的过程就构成了一个链条，被称为原型链，原型链的顶端 null;

```js
function Person() {}

var person = new Person();

console.log(person.__proto__ == Person.prototype); // true 实例的_proto__指向实例原型
console.log(Person.prototype.constructor == Person); // true 原型的constrcuore属性指向构造函数
// 顺便学习一个ES5的方法,可以获得对象的原型
console.log(Object.getPrototypeOf(person) === Person.prototype); //
```

## 词法作用域

词法作用域的意思是在函数嵌套中，内层函数可以访问父级作用域的变量等资源。这意味着子函数词法绑定到了父级执行环境。因为 JavaScript 采用的是词法作用域，函数的作用域在函数定义的时候就决定了。

## 闭包

当内部函数试着访问外部函数的作用域链（词法作用域之外的变量）时产生闭包。闭包包括它们自己的作用域链、父级作用域链和全局作用域。

闭包不仅能访问外部函数的变量，也能访问外部函数的参数;即使函数已经 return，闭包仍然能访问外部函数的变量。这意味着 return 的函数允许持续访问外部函数的所有资源。当你的外部函数 return 一个内部函数，调用外部函数时 return 的函数并不会被调用。你必须先用一个单独的变量保存外部函数的引用，然后将这个变量当做函数来调用。看下面这个例子：

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

## 参考

- [理解 JavaScript 作用域](https://mp.weixin.qq.com/s/CJrrwqwJDyYxUS8tlDC-HQ)
