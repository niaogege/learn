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
