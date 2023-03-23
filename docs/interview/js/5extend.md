---
title: js基础之继承
order: 5
group:
  order: 1
  title: js Basic
  path: /interview/js
nav:
  order: 3
  title: 'interview'
  path: /interview
---

面试官问： 手写 ES5 的各种继承

- ES5/ES6 继承区别
- 实现继承的主要方法是什么(原型链)
- super 关键词的使用

> 老是会忘记？咋整主要还得死记硬背，不然过一段时间就会忘记，最好能结合实际场景

## 概念

面试官问：原型跟原型链以及构造函数之前的关系，一句话概括下

每一个构造函数都有一个原型对象(Prototype), 该原型对象有一个指向构造函数的指针(constructor)，经过构造函数 new 出来的对象也会包含一个**指向原型对象内部**的指针(**proto**),即隐式原型

原型链是由各个原型对象组成，每个实例对象(除了 null)都有 `__proto__` 属性，指向创建该实例对象的构造函数的原型，即通过隐式原型 `__proto__` 属性将对象链起来，组成原型链，用来实现**属性方法继承和共享**

<!-- 形成原型链的是每个对象的proto属性，而不是函数的prototype属性 -->

### prototype

每个函数都有一个 prototype 属性，就是我们经常在各种例子中看到的那个 prototype ，比如：

```js
function Person() {}
// 虽然写在注释里，但是你要注意：
// prototype是函数才会有的属性
Person.prototype.name = 'Kevin';
var person1 = new Person();
var person2 = new Person();
console.log(person1.name); // Kevin
console.log(person2.name); // Kevin
```

那这个函数的 prototype 属性到底指向的是什么呢？是这个函数的原型吗？

其实，函数的 prototype 属性指向了一个对象，这个对象正是调用该构造函数而创建的实例的原型，也就是这个例子中的 person1 和 person2 的原型。

那什么是原型呢？你可以这样理解：每一个 JavaScript 对象(null 除外)在创建的时候就**会与之关联另一个对象**，这个对象就是我们所说的原型，**每一个对象都会从原型"继承"属性**。

那么我们该怎么表示**实例与实例原型**，也就是 person 和 Person.prototype 之间的关系呢，这时候我们就要讲到第二个属性：

### `__proto__`(实例与实例原型关系)

这是每一个 JavaScript 对象(除了 null )都具有的一个属性，叫`__proto__`，这个属性会指向该对象的原型。

```js
function Person() {}
var person = new Person();
console.log(person.__proto__ === Person.prototype); // true
console.log(Object.getPrototypeOf(person) === Person.prototype); // true
```

> 当使用 `obj.__proto__` 时，可以理解成返回了 Object.getPrototypeOf(obj)

既然实例对象和构造函数都可以指向原型，那么**原型是否有属性指向构造函数或者实例**呢？

### constructor(实例原型和构造函数关系)

指向实例倒是没有，因为一个构造函数可以生成多个实例，但是**原型指向构造函数**倒是有的，这就要讲到第三个属性：constructor，**每个原型都有一个 constructor 属性指向关联的构造函数**。

```js
function Person() {}
console.log(Person.prototype.contructor === Person); // true
```

综上我们已经得出

```js
function Person() {}
var person = new Person();
console.log(person.__proto__ === Person.prototype); // true
console.log(Person.prototype.contructor === Person); // true
// es5方法 Object.getPrototypeof(person) 相当于person.__proto__
console.log(Object.getPrototypeof(person) === Person.prototype);
```

注意一个细节

```js
function Person() {}
var person = new Person();
console.log(person.constructor === Person); // true
```

当获取 person.constructor 时，其实 person 中并没有 constructor 属性,当不能读取到 constructor 属性时，会从 person 的原型也就是 Person.prototype 中读取，正好原型中有该属性，所以：

`person.constructor === Person.prototype.constructor`

了解了构造函数、实例原型、和实例之间的关系，接下来我们讲讲**实例和原型**的关系：

### 实例与原型

当读取实例的属性时，如果找不到，就会查找与对象关联的原型中的属性，如果还查不到，就去找原型的原型，一直找到最顶层为止。

```js
function Person() {}

Person.prototype.name = 'Kevin';

var person = new Person();

person.name = 'Daisy';
console.log(person.name); // Daisy

delete person.name;
console.log(person.name); // Kevin
```

在这个例子中，我们给实例对象 person 添加了 name 属性，当我们打印 person.name 的时候，结果自然为 Daisy。

但是当我们删除了 person 的 name 属性时，读取 person.name，从 person 对象中找不到 name 属性就会从 person 的原型也就是 `person.__proto__` ，也就是 Person.prototype 中查找，幸运的是我们找到了 name 属性，结果为 Kevin。

但是万一还没有找到呢？原型的原型又是什么呢？

### 原型的原型

在前面，我们已经讲了原型也是一个对象，既然是对象，我们就可以用最原始的方式创建它，那就是：

```js
var obj = new Object();
obj.name = 'Kevin';
console.log(obj.name);
```

原型对象是通过 Object 构造函数生成的

### 原型链

那 Object.prototype 的原型呢？

null，不信我们可以打印：

```js
console.log(Object.prototype.__proto__ === null);
```

所以查到属性的时候查到 Object.prototype 就可以停止查找了

## ES5 继承

### 原型链继承

![构造函数实例原型关系.png](https://s2.loli.net/2022/06/18/cCIwaz69sPKdGth.png)

继承本质上复制，重写原型对象

```js
function Parent() {
  this.name = ['cpp', 'wmh']; // 引用类型
}
Parent.prototype.sayName = function () {
  alert(this.name);
};
function Child() {}
Child.prototype = new Parent(); // 子构造函数原型指向父类实例
var child1 = new Child();
child1.name.push('chendap');
var child2 = new Child();
console.log(child2, child2.name); //  ['cpp', 'wmh', 'chendap']
```

child -> `__proto__` -> Child.prototype -> `__proto__` -> Parent.prototype 概念：子构造函数的原型指向父函数构造的实例**Child.prototype = new Parent()**

缺点：

1.当原型中包含**引用类型属性**的时候，引用类型的属性会被**所有实例共享**

2.创建 Child 实例的时候，不能向父类构造函数 Parent 传参

> 引用类型属性会被所有实例共享，而不是所有数据类型哦

### 构造函数继承(经典继承)

```js
function Parent() {
  this.name = ['cpp', 'wmh'];
}
function Child() {
  Parent.call(this); // keyword
}
var child1 = new Child();
child1.name.push('chendap');
console.log(child1.name, 'child1'); // ['cpp', 'wmh', 'chendap']
var child2 = new Child();
console.log(child2.name, 'child2'); // ['cpp', 'wmh']
```

概念：**Parent.call(this)** 创建子类的时候调用 Parent 构造函数,于是每个 Child 实例都会将 Parent 中的实例属性复制一份优缺点：

- 优点：(很好解决原型链继承的 2 个问题) 1.避免了引用类型的属性被所有实例共享， 2.可以在 Child 中向 Parent 传参

```js
function Parent(name) {
  this.name = name;
  this.SayName = function () {
    console.log(this, 'Parent');
  };
}
Parent.prototype.getName = function () {
  console.log('parent getName', this);
};
function Child(name) {
  Parent.call(this, name);
}

var child1 = new Child('cpp');
console.log(child1, 'child1');
// child1.getName() // VM100:13 Uncaught TypeError: child1.getName is not a function
var child2 = new Child('wmh');
console.log(child2, 'child2');
```

缺点： 1.无法实现复用，每次创建子类实例都有父类实例函数的副本,影响性能 2.只能继承实例属性和方法，不会继承原型属性/方法,比如**Parent.prototype.getName**子类调用会报错

```js
function Parent(name) {
  this.name = name;
  this.getName = function () {
    console.log(this.name);
  };
  this.getName();
}
// Parent.prototype.getName = function() {
//   console.log(this.name)
// }
function Child(name) {
  Parent.call(this, name);
}

var child1 = new Child('cpp');
var child2 = new Child('wmh');
console.log(child1, 'child1'); // getName 1次调用
console.log(child2, 'child2'); // getName 2次调用
```

### 组合继承

原型链继承和借用构造函数继承合璧，常用继承模式

- 原型链继承 实现对原型属性和方法的继承(引用属性会被所有实例共享)
- 借用构造函数继承 实现对实例属性和方法的继承

```js
function Parent() {
  this.name = ['cpp', 'wmh'];
}
Parent.prototype.getName = function getName() {
  console.log(this.name);
};
function Child(name) {
  // 第二次调用Parent
  Parent.call(this);
}
// 第一次调用Parent
Child.prototype = new Parent();
Child.prototype.constructor = Child;
var child1 = new Child('compose2');
child1.name.push('child1');
console.log(child1, child1.name, 'child1'); // ['cpp', 'wmh', 'child1'] 'child1'
var child2 = new Child('compose2');
child2.name.push('child2');
console.log(child2, child2.name, 'child2'); //  ['cpp', 'wmh', 'child2'] 'child2'
```

缺点：创建实例依然会调用 2 次父类构造函数，这个并没有解决

### 原型式继承(Object.create)

ES5 Object.create 的模拟实现，将传入的**对象作为创建的对象的原型**,阔以理解成对传入对象的浅复制缺点：引用类型的原型属性会被实例共享

```js
function CreateObj(obj) {
  function F() {}
  F.prototype = obj;
  return new F();
}
```

示例

```js
function CreateObj(obj) {
  function F() {}
  F.prototype = obj;
  return new F();
}
var person = {
  name: 'cpp',
  hobby: ['1', '2'],
};
var person1 = CreateObj(person);
var person2 = CreateObj(person);
console.log(person1, '111');
// person1.name = 'wmh'
// console.log(person2.name) // cpp
person1.__proto__.name = 'changeName'; // 修改原型链上的属性
console.log(person2);
```

> 修改 person1.name 的值，person2.name 的值并未发生改变 , 而是给 person1 添加了 name 值，并非修改了原型上的 name 值

### 寄生式继承

基于原型式继承，增强对象，扩展属性,最后返回对象

```js
function createObj(obj) {
  const instance = Object.create(obj);
  instance.sayName = function () {
    console.log(this);
  };
  return instance;
}
var person = {
  name: 'cpp',
  hobby: ['1', '2'],
};
var person1 = createObj(person);
var person2 = createObj(person);
console.log(person1, '11');
```

缺点：跟借用构造函数模式一样，每次创建对象都会创建一遍方法。

### 寄生组合继承

```js
function Parent(name) {
  this.name = name;
  this.colors = ['1', '2'];
}
function Child() {
  Parent.call(this);
}
Child.prototype = new Parent();
var child1 = new Child();
```

组合继承最大的缺点是会调用两次父构造函数。一次是: 设置子类型实例的原型

```js
Child.prototype = new Parent();
```

一次是： 创建子类型的时候会调用父类型构造函数

```js
Parent.call(this);
```

那么我们该如何精益求精，避免这一次重复调用呢？

```js
function Parent(name) {
  this.name = name;
  this.colors = ['1', '2'];
}
function Child() {
  Parent.call(this);
}
// Child.prototype = new Parent()
function F() {}
F.prototype = Parent.prototype;
Child.prototype = new F();
var child1 = new Child();
console.log(child1);
```

封装下就是

```js
function inheritPrototype(Child, Parent) {
  var prototype = Object.create(Parent.prototype); // 1
  prototype.constructor = Child; // 2
  Child.prototype = prototype; // 3
}
```

第一步： 创建对象，基于**父类原型**创建一个副本 prototype

第二步： 增强对象，弥补因重写原型而失去的默认的 constructor 属性

第三步： 指定对象，将副本 prototype 赋值给子类型的**原型属性**

```js
// 父类初始化实例属性和原型属性
function Parent(name) {
  this.name = name;
}
Parent.prototype.sayName = function () {};
// 借用构造函数传递增强子类实例属性（支持传参和避免篡改）
function Child(name) {
  Parent.call(this, name);
}
// 将父类原型指向子类
inheritPrototype(Child, Parent);
var child1 = new Child('cpp');
var child2 = new Child('wmh');
console.log(child1, child2);
```

目前最成熟的方法，开发人员普遍认为**寄生组合式继承**是引用类型最理想的继承范式。

## ES6 继承

ES6 提供了 Class 关键字来实现类的定义，Class 可以通过 **extends** 关键字实现继承，让子类继承父类的属性和方法。

- super
- extends

对于该继承的效果和寄生组合继承方式一样

```js
class Parent {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  sayName() {
    console.log(this.name);
  }
}
class Child extends Parent {
  constructor(name, age, sex) {
    super(name, age);
    this.sex = sex;
  }
  getSex() {
    console.log(this.name);
  }
}
var child1 = new Child('cpp', 31, 'human');
child1.sayName();
console.log(child1, 'CHILD1');
```

- 子类必须在 constructor 方法中调用 super 方法,否则新建实例时会报错。这是因为子类自己的 this 对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，加上子类自己的实例属性和方法。如果不调用 super 方法，子类就得不到 this 对象

### 用 ES5 实现 es6 class 中的 extends(高频面试题)

```js
function extend(Child, Parent, proto) {
  var prototype = Object.create(Parent.prototype); // 1
  prototype.constructor = Child; // 2
  Child.prototype = prototype; // 3
  for (var k in proto) {
    Child.prototype[k] = proto[k];
  }
}
function Par(name) {
  this.name = name;
}
Par.prototype.logName = function () {
  console.log(`My name is ${this.name}`);
};

function Child(name, age) {
  Par.call(this, name);
  this.age = age;
}

extend(Child, Par, {
  logAge() {
    console.log(`my age is ${this.age}`);
  },
});

class A {
  constructor(name) {
    this.name = name;
  }
  logName() {
    console.log('My name is ' + this.name + '.');
  }
}

class AA extends A {
  constructor(name, age) {
    super(name);
    this.age = age;
  }

  logAge() {
    console.log("I'm " + this.age + ' years old.');
  }
}
var a = new AA('xiaolan', 10);
a.logName(); //My name is xiaolan
a.logAge(); //I'm 10 years old.

var b = new Child('cpp', 31);
b.logName();
b.logAge();
```

### super

super 这个关键字，既可以当作函数使用，也可以当作对象使用。在这两种情况下，它的用法完全不同。

- 函数使用 super 作为函数调用时，代表父类的构造函数。ES6 要求，子类的构造函数必须执行一次 super 函数。

如果子类中没有定义 constructor 方法，这个方法会被默认添加，相当于已经执行了一次 super 函数。

super 虽然代表了父类 A 的构造函数，但是返回的是子类 Child 的实例，即 super 内部的 this 指的是 B 的实例，因此 super()在这里相当于**Parent.prototype.constructor.call(this)**

作为函数时，super()只能用在子类的构造函数之中，用在其他地方就会报错

- 对象使用 super 作为对象时，在普通方法中，指向**父类的原型对象**；在静态方法中，指向**父类**。

```js
class Parent {
  constructor() {
    this.name = 'parent';
  }
  getName() {
    return this.name;
  }
  sayHello() {
    return this;
  }
}
class Child extends Parent {
  constructor() {
    super();
    this.printName = super.getName(); // Child
    this.printHello = super.sayHello;
  }
}
var child1 = new Child();
console.log(child1);
```

上面代码中，子类 Child 当中的 super.getName()，就是将 super 当作一个对象使用。这时，super 在普通方法之中，指向 Parent.prototype，所以 super.printName()就相当于 Parent.prototype.printName()。

- 由于 super 指向父类的原型对象，所以定义在**父类实例上的方法或属性**，是无法通过 super 调用的。

- 如果属性定义在父类的原型对象上，super 就可以取到。

```js
class Parent {
  constructor() {
    this.name = 'parent';
    this.sayHello = function sayHello() {
      return this;
    };
  }
  sayName() {
    return this.name;
  }
}
class Child extends Parent {
  constructor() {
    super();
    this.printHello = super.sayHello; // undefined 父类实例上的方法或属性，是无法通过super调用的
    this.sayName = super.sayName; // ok
  }
}
var child1 = new Child();
console.log(child1);
child1.printHello; // undefined
```

如果 super 作为对象，用在静态方法之中，这时 super 将指向父类，而不是父类的原型对象。

```js
class Parent {
  static getName(name) {
    // 静态方法
    console.log(name, 'static');
  }
  getName(name) {
    // 原型对象方法
    console.log(name, 'prototype');
  }
}
class Child extends Parent {
  static getName(name) {
    // 静态方法
    super.getName(name);
  }
  getName(name) {
    // 原型对象方法
    super.getName(name);
  }
}

Child.getName('cpp'); // cpp static
var child1 = new Child();
child1.getName('wmh'); // wmh prototype
```

ES6 中的继承：

- 主要是依赖 extends 关键字来实现继承，且继承的效果类似于**寄生组合继承**
- 使用了 extends 实现继承不一定要 constructor 和 super，因为没有的话会默认产生并调用它们
- extends 后面接着的目标不一定是 class，只要是个有 prototype 属性的函数就可以了

super 相关：

- 在实现继承时，如果子类中有 constructor 函数，必须得在 constructor 中调用一下 super 函数，因为它就是用来产生实例 this 的。
- super 有两种调用方式：当成函数调用和当成对象来调用。 1.super 当成函数调用时，代表父类的构造函数，且返回的是子类的实例，也就是此时 super 内部的 this 指向子类。在子类的 constructor 中 super()就相当于是 Parent.constructor.call(this)。 2.super 当成对象调用时，普通函数中 super 对象指向父类的原型对象，静态函数中指向父类。且通过 super 调用父类的方法时，super 会绑定子类的 this，就相当于是 Parent.prototype.fn.call(this)

### 两者区别

ES5 的继承和 ES6 的继承有什么区别？

ES5 的继承时通过 **prototype(构造函数机制)** 来实现。ES5 的继承实质上是先创建**子类**的实例对象，然后再将父类的方法添加到 **this** 上（**Parent.call(this)**)

ES6 的继承机制完全不同，实质上是**先创建父类的实例对象 this**（所以必须先调用父类的 super()方法），然后再用子类的构造函数**修改 this**。

> 面试重点

具体的：ES6 通过 class 关键字定义类，里面有构造方法，类之间通过 extends 关键字实现继承。子类必须在 constructor 方法中调用 super 方法，否则新建实例报错。因为子类没有自己的 this 对象，而是继承了父类的 this 对象，然后对其进行加工。如果不调用 super 方法，子类得不到 this 对象。

ps：super 关键字指代父类的实例，即父类的 this 对象。在子类构造函数中，调用 super 后，才可使用 this 关键字，否则报错。

## ES6 中的 class

ES6 的 class 可以看作只是一个语法糖，它的绝大部分功能，ES5 都可以做到，新的 class 写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已。但是它们还是有区别的。区别：

- 类必须使用 new 调用，否则会报错。ES 的构造函数是可以当成普通函数使用的
- 类的内部所有定义的方法，都是不可枚举的。（包括内部定义的静态方法）
- 类的静态方法也可以被子类继承
- 可以继承原生构造函数
  - ES5 是先新建子类的实例对象 this，再将父类的属性添加到子类上，由于父类的内部属性无法获取，导致无法继承原生的构造函数。
  - ES6 允许继承原生构造函数定义子类，因为 ES6 是先新建父类的实例对象 this，然后再用子类的构造函数修饰 this，使得父类的所有行为都可以继承

## 参考

- [前端笔试题面试题记录（上）](https://juejin.cn/post/6844903577421365255?utm_medium=fe#heading-7)
- [ES6 Class 继承](https://juejin.cn/post/7039228671911002149)
- [Javascript 如何实现继承？](https://fe.ecool.fun/topic/21144fa1-41b7-4077-97cd-b0c6030b10e0?orderBy=updateTime&order=desc&titleKey=%E7%BB%A7%E6%89%BF)
