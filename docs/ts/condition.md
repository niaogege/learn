---
title: 条件类型condition
order: 2
group:
  order: 0
  title: TS
  path: /interview/ts
nav:
  order: 3
  title: 'interview'
  path: /interview
---

## 概念

```ts
type Name = 'b' | 'a' | 'c';
type Age = 'b';
type Excludes<T, U> = T extends U ? never : T;
type ExcludesDemo = Excludes<Name, Age>;
type Extracts<T, U> = T extends U ? T : never;
type ExtractDemo = Extracts<Name, Age>;
```

## 语法

`T extends U ? X : Y` T/U/X/Y 都是**类型占位符**

```ts
type IsString<T> = T extends string ? true : false;
type Demo1 = IsString<string>;

type TypeName<T> = T extends string
  ? 'string'
  : T extends number
  ? 'number'
  : T extends boolean
  ? 'boolean'
  : T extends undefined
  ? 'undefined'
  : T extends Function
  ? 'function'
  : 'object';
type T1 = TypeName<string | number>; // 分布式条件类型 string | number
```

TypeName 属于分布式条件类型。在条件类型中，如果被检查的类型是一个 “裸” 类型参数，即没有被数组、元组或 Promise 等包装过，则该条件类型被称为**分布式条件**类型。对于分布式条件类型来说，当传入的被检查类型是联合类型的话，在运算过程中会被分解成多个分支。

## 实现工具类型 FunctionProperties 和 NonFunctionProperties 等工具类型

实现 FunctionNames

```ts
interface User11 {
  id: number;
  name: string;
  updateName(name: string): void;
  getName(): void;
}
type nameType = Pick<User11, 'name'>;
// 得到接口中的函数名
type FunctionPropertyName<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];
type FunctionProperties<T> = Pick<T, FunctionPropertyName<T>>;
type T2 = FunctionProperties<User11>;

// 得到非函数类型的数据类型
type NonFunctionPropertyName<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
type T3 = NonFunctionPropertyName<User11>; // 'id' | 'name'
type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyName<T>>;
type T4 = NonFunctionProperties<User11>;
// {id: number,name: string}
```

## 再次推荐阿宝哥的 TS 视频学习

- [用了 TS 条件类型，同事直呼 YYDS！](https://mp.weixin.qq.com/s/y-N265ULBluzwnmRGNs2Xg)
