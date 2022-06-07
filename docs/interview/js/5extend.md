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

面试官问：

- ES5/ES6 继承区别

## 应用场景

## ES5 继承

## ES6 继承

## 两者区别

ES5 的继承和 ES6 的继承有什么区别？ ES5 的继承时通过 prototype 或构造函数机制来实现。ES5 的继承实质上是先创建子类的实例对象，然后再将父类的方法添加到 this 上（Parent.apply(this))

ES6 的继承机制完全不同，实质上是先创建父类的实例对象 this（所以必须先调用父类的 super()方法），然后再用子类的构造函数修改 this。

具体的：ES6 通过 class 关键字定义类，里面有构造方法，类之间通过 extends 关键字实现继承。子类必须在 constructor 方法中调用 super 方法，否则新建实例报错。因为子类没有自己的 this 对象，而是继承了父类的 this 对象，然后对其进行加工。如果不调用 super 方法，子类得不到 this 对象。 ps：super 关键字指代父类的实例，即父类的 this 对象。在子类构造函数中，调用 super 后，才可使用 this 关键字，否则报错。

## 参考

- [前端笔试题面试题记录（上）](https://juejin.cn/post/6844903577421365255?utm_medium=fe#heading-7)
