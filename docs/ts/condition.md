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
- 要满足所谓的**裸类型**中才会产生效果(裸类型 没有被数组/元组/Promise 包装过)

```ts
type Te11<T> = T extends number ? 'a' : 'b';
type te11 = Te11<11 | '111'>;
```

条件类型` a extends b ? c : d`仅仅支持在 type 关键字中使用。

> 如果你觉得这里的 extends 不太好理解，可以暂时简单理解为 U 中的属性在 T 中都有。一定注意跟范型中左边的约束 extends 区分开

```ts
type FirstType<T extends unknown[]> = T extends [infer F, ...infer R] ? F : never;
type T12 = FirstType<[1, 2, 3, 4]>;
// type T12 = 1
```

> 第一个 extends 不是条件，条件类型是 extends ? :，这里的 extends 是约束的意思，也就是约束类型参数只能是数组类型。

```ts
type Name = 'b' | 'a' | 'c';
type Age = 'b';
type Excludes<T, U> = T extends U ? never : T;
type T13 = Excludes<Name, Age>; // 从U中排除T有的属性即从Name中排除Age有的类型
// type T13 = "a" | "c"
type Extracts<T, U> = T extends U ? T : never;
type T14 = Extracts<Name, Age>; // 交集
// type T14 = "b"
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
type T1112 = TypeName<undefined>;
type TestUnde<T> = T extends undefined ? 'undefined' : any;
type T1113 = TestUnde<undefined>; // type T1113 = "undefined"
type T1114 = TestUnde<111>; // type T1114 = any
```

TypeName 属于分布式条件类型(分发)。在条件类型中，如果被检查的类型是一个 “裸” 类型参数，即没有被数组、元组或 Promise 等包装过，则该条件类型被称为**分布式条件**类型。**对于分布式条件类型来说，当传入的被检查类型是联合类型的话，在运算过程中会被分解成多个分支**。

当类型参数为联合类型，并且在条件类型左边直接引用该类型参数的时候，TypeScript 会把每一个元素单独传入来做类型运算，最后再合并成联合类型，这种语法叫做分布式条件类型。

条件

- 类型是一个 “裸” 类型参数，即没有被数组、元组或 Promise 等包装过

```ts
type Union = 'a' | 'b' | 'c';
type FirstCap<T> = T extends 'a' ? Capitalize<T> : T;
type Uinon = FirstCap<Union>; // type Uinon = "b" | "c" | "A"
type Test123 = Record<any, {}>;
```

### 分发的应用实例

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

### CamelCaseUnion

> 字符串模式匹配 一般基本上会用到${} infer 提取特定字符出字符然后大写

```ts
type TC1 = 'cpp_wmh'; // type TC1 = "cpp_wmh"
type CamelCase<T extends string> = T extends `${infer F}_${infer M}${infer R}`
  ? `${F}${Capitalize<M>}${CamelCase<R>}`
  : T;
type TC2 = CamelCase<TC1>;
// type TC2 = "cppWmh"
```

如果对字符串数组做 CamelCase 呢

```ts
type TC3 = ['cpp_wmh', 'cpp_cpp'];
type TC4 = CamelCaseUnion<TC3>; // ['cppWmh', 'cppCpp']
type CamelCaseUnion<T extends unknown[] = []> = T extends [infer F, ...infer R]
  ? [CamelCase<F & string>, ...CamelCaseUnion<R>]
  : T;
```

联合类型呢(跟 CamelCase 写法一样)

```ts
type TC03 = 'cpp_wmh' | 'cpp_cpp';
type TC04 = CamelCaseUnion1<TC03>; // type TC04 = "cppWmh" | "cppCpp"
type TC05 = CamelCase<TC03>; // type TC05 = "cppWmh" | "cppCpp"
type CamelCaseUnion1<T extends string> = T extends `${infer F}_${infer M}${infer R}`
  ? `${F}${Uppercase<M>}${CamelCaseUnion1<R>}`
  : T;
```

对联合类型的处理和对单个类型的处理没什么区别，TypeScript 会把每个单独的类型拆开传入。不需要像数组类型那样需要递归提取每个元素做处理

### IsUnion 判断联合类型

```ts
type TestUnion<A, B = A> = A extends A ? { a: A; b: B } : never;
type TC7 = TestUnion<'a' | 'b' | 'c'>;
// type TC7 = {
//     a: "a";
//     b: "a" | "b" | "c";
// } | {
//     a: "b";
//     b: "a" | "b" | "c";
// } | {
//     a: "c";
//     b: "a" | "b" | "c";
// }
```

判断是否是联合类型

```ts
type IsUnion<A, B = A> = A extends A ? ([B] extends [A] ? false : true) : never;
type TC5 = IsUnion<'a' | 'b'>; // type TC5 = true
type TC6 = IsUnion<['a' | 'b']>; // type TC6 = false
type TC8 = IsUnion<{ name: 'cpp' }>; // type TC8 = false
```

- A extends A 触发分布式条件，让每个类型单独传入处理的，
- [B] extends [A] 避免触发分布式条件类型，两边都是联合类型，只有 extends 左边是裸类型参数才会触发 分布式条件类型

> 重点理解下

### 数组转联合类型

```ts
type TC9 = ['a', 'b'];
type TC10 = TC9[number]; // type TC10 = "a" | "b"
```

取索引值，数组类型取出所有的数字索引对应的值，然后组成联合类型

### BEM

bem 是 css 命名规范，用 block\_\_element--modifier 的形式来描述某个区块下面的某个元素的某个状态的样式。

```ts
type TC11 = BEM<'cpp', ['aa', 'bb'], ['warning', 'success']>;
type BEM<
  B extends string,
  E extends string[],
  M extends string[],
> = `${B}__${E[number]}--${M[number]}`;

// type TC11 = "cpp__aa--warning" | "cpp__aa--success" | "cpp__bb--warning" | "cpp__bb--success"
```

### AllCombinations

希望传入 'A' | 'B' 的时候，能够返回所有的组合： 'A' | 'B' | 'BA' | 'AB'。

```ts
type Combina<A extends string, B extends string> = A | B | `${A}${B}` | `${B}${A}`;

type TC12 = Combina<'a', 'b'>;
// type TC12 = "a" | "b" | "ab" | "ba"
```

这种全组合问题的实现思路就是两两组合，组合出的字符串再和其他字符串两两组和：

所以全组合的高级类型就是这样：

```ts
type AllCombinations<A extends string, B extends string = A> = A extends A
  ? Combina<A, AllCombinations<Exclude<B, A>>>
  : never;
type TC13 = AllCombinations<'a' | 'b' | 'c'>;
// type TC13 = "a" | "b" | "c" | "ab" | "ba" | "bc" | "cb" | "ac" | "abc" | "acb" | "ca" | "bca" | "cba" | "bac" | "cab"
```

- A extends A 的意义就是让联合类型每个类型单独传入做处理
- **Combina<A, AllCombinations<Exclude<B, A>>>** A 的处理就是 A 和 B 中去掉 A 以后的所有类型组合，也就是 Combination<A, **B 去掉 A 以后的所有组合**>。

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
