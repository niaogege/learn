---
title: TS总览
order: 0
group:
  order: 0
  title: TS
  path: /interview/ts
nav:
  order: 3
  title: 'interview'
  path: /interview
---

ts 强类型语言已经大势所趋，工具还是得需要掌握，至于要掌握到多深的程度？I dont Konw

> 每次类型体操让我有一点清醒，知道自己在思考了，也算好事

## enum 和 const

[使用“const”优化 TypeScript 中的枚举](https://mp.weixin.qq.com/s/PPVPg0Spe09ZDqJ1aqBkxA)

在 TypeScript 中使用枚举是访问旨在: 多个文件共享的**特定参数**的好方法，例如特定用户的访问级别或特定常量。

Enums 会生成大量代码，通过 const 在 TypeScript 中与我们的 Enums 一起引入关键字，我们可以减轻大量生成的代码

通常，我们会如下声明一个 Enum：

```ts
export enum Sizes {
  Small,
  Middle,
  Large,
}
// 然后可以像这样访问枚举：
export const coffee = {
  name: 'pro',
  size: Sizes.Middle, // 1
};
```

以上代码会被编译成

```js
let exports = {};
exports.__esModule = true;
exports.Sizes = void 0;
var Sizes;
(function (Sizes) {
  Sizes[(Sizes['Small'] = 0)] = 'Small';
  Sizes[(Sizes['Middle'] = 1)] = 'Middle';
  Sizes[(Sizes['Large'] = 2)] = 'Large';
})((Sizes = exports.Sizes || (exports.Sizes = {})));
var coffee = {
  name: 'pro',
  size: Sizes.Middle,
};
console.log(coffee, 'coffee');
```

默认情况下，枚举还创建所谓的**反向映射**。这意味着我们可以获取 Enum 属性值并将其传递给 Enum 本身以获得其文字的值：

```ts
export enum Sizes {
  Small,
  Middle,
  Large,
}
const coffee1 = {
  name: 'cpp',
  size: Sizes[Sizes.Small], // 'Small'
};
```

大多数时候您可能不需要这种反向映射功能，如果是这种情况，那么您当然可以通过使用 **const** 规避这种反映射

```ts
const enum Sizes1 {
  Small,
  Middle,
  Large,
}

const coffee2 = {
  name: 'cpp',
  size: Sizes1.Middle,
};
```

编译 js 后代码很简单

```js
var coffee2 = {
  name: 'cpp',
  size: 1 /* Middle */,
};
```

## 体操类型

```ts
type ExcludeCopy<T, U> = T extends U ? never : T;
type ExtraCopy<T, U> = T extends U ? T : never;
```

## 关键字

### keyof

keyof 关键字代表它接受一个**对象类型**作为参数，并返回该对象所有 **key 值组成的联合类型**。

```ts
type T04 = {
  name: string;
  age: number;
};
type Exclude2<T, A> = T extends A ? never : T;
type MyOmit<T, K extends keyof T> = {
  [P in Exclude<keyof T, K>]: T[P];
};
type T05 = MyOmit<T04, 'age'>;
type T07 = keyof any; // type T07 = string | number | symbol

function getTValue<T extends object, K extends keyof T>(data: T, key: K): T[K] {
  return data[key];
}
```

### in

```ts
type T00 = 'data';
type T01 = {
  name: 'cpp';
  age: 30;
};
// => {
//   data: {
//     name: 'cpp',
//     age: 30
//   }
// }
type MyRecord12<K extends string | number | symbol, T> = {
  [P in K]: T;
};
type T02 = MyRecord12<T00, T01>;
// type T02 = {
//     data: T01;
// }
type T03 = Record<T00, T01>;
```

### is

is 关键字其实更多用在函数的返回值上，用来表示对于函数返回值的**类型保护**。

```ts
function isNumber(data: any): data is Number {
  return typeof data === 'number
}
function getValBy(val: any) {
  if (isNumber(val)) {
    val.toFixed(2)
  }
}
```

### 分发或者条件类型

## tsc 编译相关
