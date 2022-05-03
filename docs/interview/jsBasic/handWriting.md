---
title: 手写js
group:
  order: 1
  title: js Basic
  path: /interview/js
nav:
  order: 3
  title: 'interview'
  path: /interview
---

## new 手写

1.创建一个空对象-> Object.create() 2.将空对象的隐式原型指向构造函数的原型链 con.prototype 2.使用 apply 改变 this 指向 apply(obj, rest) 3.返回该对象(如果无返回值或者返回一个非对象，则返回 obj 否则返回一个新创建的对象)

```js
function Obj(name) {
  this.name = name;
  console.log('当前上下文是', this);
}
var instance = new Obj('cpp');
console.log(instance);
function newObj(fn, ...rest) {
  var obj = Object.create(fn.prototype);
  var res = fn.apply(obj, rest);
  return res instanceof Object ? res : obj;
}
var instance2 = newObj(Obj, 'cpp');
console.log(instance2, '222');
```
