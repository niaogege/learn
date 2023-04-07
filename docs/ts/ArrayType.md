---
title: 数组相关以及其他类型体操
order: 8
group:
  order: 0
  title: TS
  path: /interview/ts
nav:
  order: 3
  title: 'interview'
  path: /interview
---

## 数组类型和元组 Tuple 类型区别

### Array 数组

TypeScript 像 JavaScript 一样可以操作数组元素。 有两种方式可以定义数组。 第一种，可以在元素类型后面接上 []，表示由此类型元素组成的一个数组：

```ts
let list: number[] = [1, 2, 3, 4];
```

第二种方式是使用数组泛型，Array<元素类型>：

```ts
let list1: Array<number> = [33, 44, 5];
type ListNum1 = number[];
type ListNum2 = Array<number>;
type ISArray = ListNum1['length'];
```

### 元组 Tuple

元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同。 比如，你可以定义一对值分别为 string 和 number 类型的元组。

```ts
let x: [string, number];
// Initialize it
x = ['hello', 10]; // OK

type Tu = [string, number];
type IsTuple1 = Tu['length'];
```

### 如何判断是元组还是数组

```ts
type IsNotEqual<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
  ? false
  : true;
type IsTuple2<T extends unknown[]> = T extends readonly [...p: infer Res]
  ? IsNotEqual<Res['length'], number>
  : false;
type IST = IsTuple2<Tu>; // true
type IST2 = IsTuple2<ListNum2>; // false
```

## 特殊类型的特性

### isEqual<A, B>

before :

<!-- type TE1 = true -->

```ts
type TE1 = isEqual0<'a', any>;
// type TE1 = true
type isEqual0<A, B> = (A extends B ? true : false) & (B extends A ? true : false);
```

实际上肯定是有问题的， 重写

```ts
type isEqual1<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
  ? true
  : false;
type TE2 = isEqual1<'a', any>; // type TE2 = false
type TE3 = isEqual1<'a', 'a'>; // type TE3 = true
```

### isNever

```ts
type TE4 = isNever<never>; // type TE4 = true
type TE5 = isNever<''>; // type TE5 = false
type isNever<T> = [T] extends [never] ? true : false;
```
