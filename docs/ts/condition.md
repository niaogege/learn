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

条件类型的语法实际上就是三元表达式，即 `T extends U ? X : Y`,大致翻译就是 当类型 T 满足 U 类型的时候返回 X 类型否则返回 Y 类型

```ts
type isSting<T> = T extends string ? true : false;
type GetSomeType<T extends string | number> = T extends string ? 'a' : 'b';

let someTypeOne: GetSomeType<string>; // someTypeone 类型为 'a'

let someTypeTwo: GetSomeType<number>; // someTypeone 类型为 'b'

let someTypeThree1: GetSomeType<string | number>; // what ?  'a' | 'b'
```

分发，结合上边的 Demo 来说所谓的分发简单来说就是分别使用 string 和 number 这两个类型进入 GetSomeType 中进行判断，最终返回两次类型结果组成的联合类型。

```ts
// 你可以这样理解分发
// 伪代码：GetSomeType<string | number> = GetSomeType<string> | GetSomeType<number>
let someTypeThree2: GetSomeType<string | number>;
```

那么，什么情况下会产生分发(跟下文的分布式条件类型一样)呢？满足分发需要一定的条件，我们来一起看看：

- 分发一定是需要产生在 extends 产生的类型条件判断中，并且是前置类型,这种就不行`T extends string | number ? 'a' : 'b'`
- 要满足所谓的裸类型中才会产生效果

条件类型` a extends b ? c : d`仅仅支持在 type 关键字中使用。

> 如果你觉得这里的 extends 不太好理解，可以暂时简单理解为 U 中的属性在 T 中都有。一定注意跟范型中左边的约束 extends 区分开

```ts
type FirstType<T extends unknown[]> = T extends [infer F, ...infer R] ? F : never;
type T12 = FirstType<[1, 2, 3, 4]>;
```

> 第一个 extends 不是条件，条件类型是 extends ? :，这里的 extends 是约束的意思，也就是约束类型参数只能是数组类型。

```ts
type Name = 'b' | 'a' | 'c';
type Age = 'b';
type Excludes<T, U> = T extends U ? never : T;
type T13 = Excludes<Name, Age>; // 从U中排除T有的属性
type Extracts<T, U> = T extends U ? T : never;
type T14 = Extracts<Name, Age>; // 交集
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

TypeName 属于分布式条件类型(分发)。在条件类型中，如果被检查的类型是一个 “裸” 类型参数，即没有被数组、元组或 Promise 等包装过，则该条件类型被称为**分布式条件**类型。对于分布式条件类型来说，当传入的被检查类型是联合类型的话，在运算过程中会被分解成多个分支。

分发的应用实例

```ts
type TypeA = string | number | boolean | symbol;

type MyExclude<T, K> = T extends K ? never : T;

// ExcludeSymbolType 类型为 string | number | boolean，排除了symbol类型
type ExcludeSymbolType = MyExclude<TypeA, symbol | boolean>;
// NonNullable
type NonNullable1<T> = T extends null | undefined ? never : T;
type T0201 = NonNullable1<null>; // type T0201 = never
type T0202 = NonNullable1<123>; // type T0202 = 123
```

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
// 另外一种实现方式
type FunName<T> = {
  [K in keyof T as T[K] extends Function ? K : never]: T[K];
};
type FunctionProperties<T> = Pick<T, FunctionPropertyName<T>>;
type T2 = FunctionProperties<User11>;
// type T2 = {
//     updateName: (name: string) => void;
//     getName: () => void;
// }
type T22 = FunName<User11>;
// type T22 = {
//     updateName: (name: string) => void;
//     getName: () => void;
// }
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

## 其他示例

- 以一个使用条件类型作为函数返回值类型的例子：

```ts
declare function strOrNum<T extends Boolean>(x: T): T extends true ? true : false;
const strReturnType = strOrNum(true);
const numReturnType = strOrNum(false);
```

- [用了 TS 条件类型，同事直呼 YYDS！](https://mp.weixin.qq.com/s/y-N265ULBluzwnmRGNs2Xg)
