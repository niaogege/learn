---
title: Basic综述
order: 0
group:
  order: 1
  title: Basic
  path: /interview/js
nav:
  order: 3
  title: 'interview'
  path: /interview
---

## js 知识点 class

### class 类的实例属性

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

类的属性和方法，除非显式定义在其本身（即定义在 this 对象上），否则都是定义在原型上（即定义在 class 上）

```js
class Cpp {
  constructor() {
    this.name = 'cpp';
  }
  getName() {
    return this.name;
  }
}
var cppInstance = new Cpp();
cppInstance.hasOwnProperty('name'); // true
cppInstance.hasOwnProperty('getName'); // false
cppInstance.__proto__.hasOwnProperty('getName'); // true
```

### 取值函数（getter）和存值函数（setter）

与 ES5 一样，在“类”的内部可以使用 get 和 set 关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为。

```js
class Cpp2 {
  constructor() {}
  get prop() {
    return 'cpp getter prop';
  }
  set prop(val) {
    console.log('cpp::', val);
  }
}
var test = new Cpp2();
test.prop = 123;
console.log(test.prop);
```

### 静态方法

类相当于实例的原型，**所有在类中定义的方法，都会被实例继承**。如果在一个方法前，加上**static**关键字，就表示该方法**不会被实例继承**，而是直接通过类来调用，这就称为“静态方法”。

> 类的静态方法会被子类继承

```js
class Foo {
  static getName() {
    return 'cpp';
  }
  getName() {
    return 'wmh';
  }
}
Foo.getName(); // cpp
var test1 = new Foo();
test1.getName(); // wmh
```

注意，如果静态方法包含 this 关键字，这个 this 指的是类，而不是实例。

```js
class Foo {
  static getName() {
    this.bar();
  }
  static bar() {
    console.log('static');
  }
  bar() {
    console.log('instance');
  }
}
Foo.getName(); // static
```

### 静态属性

静态属性指的是 Class 本身的属性，即**Class.propName**，而不是定义在**实例对象（this）**上的属性。

```js
// 老写法
class Foo {}
Foo.prop = 1;
Foo.prop; // 1

// 新写法
class Foo1 {
  static prop = 1;
}
Foo.prop;
```

### 私有属性的正式写法

```js
class IncreasingCounter {
  #count = 0;
  get value() {
    console.log('Getting the current value!');
    return this.#count;
  }
  increment() {
    this.#count++;
  }
}
var tt = new IncreasingCounter();
tt.#count; // Uncaught SyntaxError: Private field '#count' must be declared in an enclosing class
```

上面代码中，#count 就是**私有属性**，只能在类的内部使用（this.#count）。如果在类的外部使用，就会报错。

## 在没有 class 之前，js 是怎么做面向对象的

原型链的应用场景之一，在没有 class 关键字之前，JavaScript 使用原型继承来实现面向对象编程。 javaScript 中的每个对象都有一个原型（prototype），原型是一个对象，它包含了共享的属性和方法。当我们访问一个对象的属性或方法时，如果对象本身没有该属性或方法，JavaScript 会沿着原型链向上查找，直到找到该属性或方法或者到达原型链的顶端。

## 为什么 ES6 子类的构造函数，一定要调用 super()

es6: 先将父类的属性和方法加到一个空对象上，然后再将该对象作为子类的实例，即继承在前，实例在后，这也是为啥 es6 继承需要先调用 super,因为这一步会生成一个继承父类的 this 对象，没有这一步就无法继承父类

es5: 先创造一个独立的子类的实例对象，然后再将父类的方法添加到这个对象上面，即实例在前，继承在后

## 继承

[js 继承](../js/5extend.md)

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

## [原型以及原型链](https://segmentfault.com/a/1190000008959943)

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

## 正则学习

**正则表达式是匹配模式，要么匹配字符，要么匹配位置**

正则中常用来表示位置的符号主要有：`^`、$、\b、\B、?=p、(?!p)、(?<=p)、(?<!p)`

`^ 脱字符 匹配行的开头`

```js
var string = 'hello';
console.log(string.replace(/^/, '😄')); // 😄hello
```

`$ 美元符号，匹配行的结尾`

```js
var string = 'hello';
console.log(string.replace(/$/, '😄')); // hello😄
```

`\b 单词的边界 `

```js
① \w和\W之间的位置

② ^与\w之间的位置

③ \w与$之间的位置

'xxx_love_study_1.mp4'.replace(/\b/g, '❤️') // ❤️xxx_love_study_1❤️.❤️mp4❤️
```

`\B 非单词的边界，也就是\b反着来的意思`

```js
① \w与\w之间的位置

② \W与\W之间的位置

③^与\W之间的位置

④\W与$之间的位置
'[[xxx_love_study_1.mp4]]'.replace(/\B/g, '❤️')
```

`?=p` : 符合 p 子模式前面的那个位置。换句话说是，有一个位置，紧跟其后需要满足 p 子模式。也有一个学名叫正向先行断言。

```js

```

其他项目测试：

```js
str = `rgb(255, 5, 11)`;
var hex = str.split(/[^\d]+/);
console.log(hex);

str = 'cpp-wmh';
var p = str.replace(/[-|_|@]([\w])/g, (match, p) => p.toUpperCase());
console.log(p);

var reg = /\{\{(\w+)\}\}/;
var p = `{{msg}}-{{name}}`;
var p2 = p.replace(reg, 'cpp'); // cpp-{{name}} msg
console.log(p2, RegExp.$1.trim());
```

## 谈谈浏览器进程和线程的理解

- 浏览器是多进程架构它主要包括以下进程：

- Browser 进程：浏览器的主进程，唯一，负责创建和销毁其它进程、网络资源的下载与管理、浏览器界面的展示、前进后退等。
- GPU 进程：用于 3D 绘制等，最多一个。
- 第三方插件进程：每种类型的插件对应一个进程，仅当使用该插件时才创建。
- 浏览器渲染进程（浏览器内核）：内部是多线程的，每打开一个新网页就会创建一个进程，主要用于页面渲染，脚本执行，事件处理等。

### 渲染进程（浏览器内核）

浏览器的渲染进程是多线程的，页面的渲染，JavaScript 的执行，事件的循环，都在这个进程内进行：

- GUI 渲染线程：负责渲染浏览器界面，当界面需要重绘（Repaint）或由于某种操作引发回流(Reflow)时，该线程就会执行。
- JavaScript 引擎线程：也称为 **JS 内核**，负责处理 Javascript 脚本程序、解析 Javascript 脚本、运行代码等。（例如 V8 引擎）
- 事件触发线程：用来控制浏览器事件循环，注意这不归 JavaScript 引擎线程管，当事件被触发时，该线程会把事件添加到待处理队列的队尾，等待 JavaScript 引擎的处理。
- 定时触发器线程：传说中的 setInterval 与 setTimeout 所在线程，注意，W3C 在 HTML 标准中规定，规定要求 setTimeout 中低于 4ms 的时间间隔算为 4ms 。
- 异步 http 请求线程：在 XMLHttpRequest 连接后通过浏览器新开一个线程请求，将检测到状态变更时，如果设置有回调函数，异步线程就产生状态变更事件，将这个回调再放入事件队列中。再由 JavaScript 引擎执行。

注意，GUI 渲染线程与 JavaScript 引擎线程是互斥的，当 JavaScript 引擎执行时 GUI 线程会被挂起（相当于被冻结了），GUI 更新会被保存在一个队列中等到 JavaScript 引擎空闲时立即被执行。所以如果 JavaScript 执行的时间过长，这样就会造成页面的渲染不连贯，导致页面渲染加载阻塞。

### 单线程的 JavaScript

所谓单线程，是指在 JavaScript 引擎中负责解释和执行 JavaScript 代码的线程唯一，同一时间上只能执行一件任务

## 参考

- [理解 JavaScript 作用域](https://mp.weixin.qq.com/s/CJrrwqwJDyYxUS8tlDC-HQ)
- [就因为这三个知识点，我彻底学废了”正则表达式“](https://juejin.cn/post/7021672733213720613)
