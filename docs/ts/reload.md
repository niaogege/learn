---
title: 函数重载定义
order: 1
group:
  order: 0
  title: TS
  path: /interview/ts
nav:
  order: 3
  title: 'interview'
  path: /interview
---

膜拜：[TS 函数重载](https://juejin.cn/post/7186291184766517305)

- 面试官问：说一说函数重载？
- 我: 函数签名不同，函数会做出不同的处理，这是我对函数重载的理解。

# 函数重载定义

函数重载有 2 部分构成：**1.重载签名** **2.实现签名**

一般函数由四部分构成： 函数名/参数/返回值/函数体

```ts
// 函数名 参数
function getName(name) {
  // 函数体 {return name} 包括花括号
  return name; // 返回值
}
```

TS 阔以帮我们约束**参数类型和返回值类型**

```ts
function getName1(name: string): string {
  // 函数体 {return name} 包括花括号
  return name; // 返回值
}
```

### 重载签名

重载签名的意思是只需要提供参数类型和返回值类型，不需要提供函数体，比如这样

```ts
interface DataType {
  name: string;
  age: number;
}
function getData2(id: string): DataType; // 重载签名1
function getData2(id: string[]): DataType[]; // 重载签名2
```

### 实现签名

实现签名意思就是一个**带有函数体**的同名函数，并且这个函数的参数类型和返回值类型要包含所有**重载签名的所有类型**

举例：比如我们删掉中间一个函数类型 string[],中间函数签名会报红

```ts
function getData3(id: string): DataType;
function getData3(): DataType[]; // 此重载签名与其实现签名不兼容
function getData3(id: string | string[]): DataType | DataType[] {
  let data;
  if (Array.isArray(id)) {
    return data as unknown as DataType[];
  } else {
    return data as unknown as DataType;
  }
}
getData3('1111');
getData3(['1111']); // Argument of type 'string[]' is not assignable to parameter of type 'string'.
```

所以上面那个案例改下就不报错

```ts
function getData4(id: string): DataType;
function getData4(id: string[]): DataType[]; // 此重载签名与其实现签名不兼容
function getData4(id: string | string[]): DataType | DataType[] {
  let data;
  if (Array.isArray(id)) {
    return data as unknown as DataType[];
  } else {
    return data as unknown as DataType;
  }
}
getData4('1111');
getData4(['1111']);
```

核心一点：实现签名的时候，需要非常明确的确定 **不同类型的参数所对应的返回值**，这样 TS 才能帮我们实现精确推导！！！

> 有这么难记住吗

重载签名主要是精确显示函数的输入输出，实现签名主要是将所有的输入输出类型做一个全量定义，防止 TS 编译报错，函数体就是整个函数实现的全部逻辑。

```ts
function sayName2(value: string): string | undefined;
function sayName2(value: number, age: number): number;
function sayName2(value: string | number, age: number = 0): number | string | undefined {
  if (typeof value === 'number') {
    return age;
  } else {
    return value;
  }
}
sayName2('1111'); // ok
sayName2(10, 10); // ok
// sayName2('10', 10) // is not ok
```

### other

- 函数重载可以有多个重载签名，但是只允许有一个实现签名。说白了就是一个函数名只能有一个函数体。

```ts
function getData5(id: string): DataType;
function getData5(id: string[]): DataType[]; // 此重载签名与其实现签名不兼容
function getData5(id: string | string[]): DataType | DataType[] {
  let data;
  if (Array.isArray(id)) {
    return data as unknown as DataType[];
  } else {
    return data as unknown as DataType;
  }
}
function getData5() {} // 重复函数实现
```

- 方法重载

方法重载是放在类里面的 应用例子：简单封装一个数组，使数组更加好用,通过 index 删除返回 index,通过 object 删除返回 object

```ts
class ArrayEN {
  constructor(public arr: object[]) {}

  get(Index: number) {
    return this.arr[Index];
  }
  delete(value: number): number;
  delete(value: object): object;
  delete(value: number | object): number | object {
    this.arr = this.arr.filter((item, index) => {
      if (typeof value === 'number') {
        return value !== index;
      } else {
        return value !== item;
      }
    });
    return value;
  }
}
var test11 = new ArrayEN([
  {
    name: 'cpp',
    age: 30,
  },
  {
    name: 'wmh',
    age: 25,
  },
]);
test11.delete(1);
test11.delete({
  name: 'wmh',
  age: 25,
});
```

或者以下实例

```ts
type Combine = string | number;
class Course {
  begin(name: string, score: number): string;
  begin(name: string, score: string): string;
  begin(name: string, score: Combine) {
    if (typeof score === 'string') {
      return name;
    }
  }
}
const course = new Course();
course.begin('cpp', 99); // 没有输出
course.begin('cpp', '11');
course.begin('cpp', []);
// No overload matches this call.
//  Overload 1 of 2, '(name: string, score: number): string', gave the following error.
//  Overload 2 of 2, '(name: string, score: string): string', gave the following error.ts(2769)
```

- Class 类也可以实现 constructor 的重载

先来理解构造器 constructor 的原理，构造器是没有返回值的，他会隐式返回一个 this，这个 this 会分配给 new 对象的左边的变量，至此所有的 this 都是指向的当前正在使用的对象。构造器重载和函数重载使基本相同，

主要区别是：TS 类构造器重载签名和实现签名都不需要管理返回值，TS 构造器是在对象创建出来之后，但是还没有赋值给对象变量之前被执行，一般用来给对象属性赋值。

应用例子：现在要求算一个图片的面积，这个图形可能是传参可以是对象也可能是长宽

```ts
interface AreaI {
  width: number;
  height: number;
}
class AREA {
  constructor(width: number, height: number);
  constructor(width: string, height: string);
  constructor(width: string | number, h: string | number) {
    if (typeof width == 'object') {
      console.log(width);
    } else {
      console.log(h);
    }
  }
}
```

### 利用 JS 实现函数重载

- 利用 arguments

```js
var arr = [1, 2, 3, 4];
Array.prototype.mockReload = function () {};
var len = arguments.length;
switch (len) {
  case 0:
    return this;
  case 1:
    return `${arguments[0]}`;
  case 2:
    return `${arguments[1]}`;
}
arr.mockReload(); // [1,2,3,4]
arr.mockReload(1); // `
arr.mockReload(1, 2); // 2
```

- 利用闭包和 arguments

```js
function addMethod(obj, name, fn) {
  var old = obj[name];
  console.log(old, 'BEFORE)
  obj[name] = function () {
    let arg = Array.from(arguments); // 转换成array
    if (fn.length === arg.length) {
      fn.apply(this, arg);
    } else if (typeof fn === 'function') {
      old.apply(this, arg);
    }
  };
}
// test
var person = { userName: 'bear鲍的小小熊' };
addMethod(person, 'show', function () {
  console.log(this.userName + '---->' + 'show1');
});
addMethod(person, 'show', function (str) {
  console.log(this.userName + '---->' + str);
});
addMethod(person, 'show', function (a, b) {
  console.log(this.userName + '---->' + (a + b));
});
person.show(); // bear鲍的小小熊---->show1
person.show('bkl'); // bear鲍的小小熊---->bkl
person.show(10, 20); // bear鲍的小小熊---->30
```

### 利用函数重载，用一个平铺的方式和数组实现函数定义

```ts
type ParamsArr = ['CloseEvent', 'CustomEvent', 'InputEvent'];

type ReturnTypeMap = {
  CloseEvent: string;
  CustomEvent: void;
  InputEvent: any;
};

type TupleToIntersectionFunTry<Tuple extends unknown[]> = Tuple extends [infer First, ...infer Rest]
  ? First extends keyof ReturnTypeMap
    ? ((params: First) => ReturnTypeMap[First]) & TupleToIntersectionFunTry<Rest>
    : never
  : {};

type resTry = TupleToIntersectionFunTry<ParamsArr>;
declare const fun5: resTry;
fun5('CustomEvent');
```

### 参考

- [一文读懂 TS 的函数重载，方法重载，构造器重载](https://juejin.cn/post/7055668560965681182#heading-1)
