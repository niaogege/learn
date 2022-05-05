---
title: 手写js
order: 1
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

## instanceof 手写

instanceof 用于检测构造函数的 prototype 是否出现在某个实例对象的原型链上，运算符左侧是实例对象 右侧是构造函数

```js
// first
function myIntanceof(l, r) {
  l = Object.getPrototypeOf(l);
  while (true) {
    if (l === null) return false;
    if (l === r.prototype) return true;
    l = Object.getPrototypeOf(l);
  }
  return false;
}

// second
function myInstanceof(l, r) {
  return r.prototype.isPrototypeof(l);
}
```

## curry 函数柯里化

将一个多参数的函数转化为多个嵌套的单参数函数

### 第一种 参数固定(有局限，形参个数固定)

```js
// first
function curry(fn) {
  const judge = (...arg) => {
    console.log(fn.length, 'fn.length');
    console.log(arg, 'arg');
    if (fn.length === arg.length) {
      return fn(...arg);
    } else {
      return (...args) => judge(...args, ...arg);
    }
  };
  return judge;
}
var add = (a, b, c) => a + b + c;
var sum = curry(add);
sum(1)(2)(3);

function curry2(fn) {
  const judge = (...arg) => {
    console.log(fn.length, 'fn.length');
    console.log(arg, 'arg');
    debugger;
    if (fn.length === arg.length) {
      return fn(...arg);
    } else {
      return judge.bind(null, ...arg);
    }
  };
  return judge;
}
var add = (a, b, c) => a + b + c;
var sum = curry2(add);
sum(1)(2)(3);
```

### 第二种 参数不固定

```js
var curry = (fn) => {
  var arr = [];
  return function judge(...arg) {
    console.log(fn, fn.length);
    console.log(arg, arg.length);
    if (fn.length === arg.length) {
      var value = fn.apply(this, arr);
      arr = [];
      return value;
    } else {
      arr.push(...arg);
      return judge;
    }
  };
};
var add = (...rest) => rest.reduce((a, b) => a + b, 0);
var sum = curry(add);
sum(1)(12)(3)();
```

## compose 函数组合

```js
function compose(...rest) {
  if (!rest) return (arg) => arg;
  if (rest.length === 1) return (arg) => rest[0](arg);
  return rest.reduce((a, b) => {
    return (args) => a(b(args));
  });
}
var double = (x) => x * 2;
var three = (x) => x * 3;
var sum = compose(double, three);
sum(10); // 60
```

## 发布订阅模式

未完待续

```js
class EventBus {}
```

## 深浅拷贝

```js
// 深拷贝
function deepClone(data) {
  if (typeof data !== 'object' || data === null) return obj;
  var target = Array.isArray(data) ? [] : {};
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      target[key] = typeof data[key] === 'object' ? deepClone(data[key]) : data[key];
    }
  }
  return target;
}
var obj = {
  age: 31,
  hobby: ['shufa', 'fit'],
};
var copy = deepClone(obj);
obj.age = 32;
console.log(copy.age); // 31

// shallowCopy 浅拷贝
function shallowCopy(data) {
  if (typeof data !== 'object' || data === null) return obj;
  var target = Array.isArray(data) ? [] : {};
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      target[key] = data[key];
    }
  }
  return target;
}
```

## 参考

- [常见的手写题](https://mp.weixin.qq.com/s/Vbe33lJoj7CxZD-hDadKyg)
