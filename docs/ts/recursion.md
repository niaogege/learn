---
title: 递归模式类型体操
order: 6
group:
  order: 0
  title: TS
  path: /interview/ts
nav:
  order: 3
  title: 'interview'
  path: /interview
---

## 应用场景

提取或构造的数组元素个数不确定、字符串长度不确定、对象层数不确定。这时候怎么办呢？递归复用做循环

TypeScript 类型系统不支持**循环**，但支持递归。当处理数量（个数、长度、层数）不固定的类型的时候，可以只处理一个类型，然后递归的调用自身处理下一个类型，直到结束条件也就是所有的类型都处理完了，就完成了不确定数量的类型编程，达到循环的效果。

## 常见的手写题

### Promise

```ts
type TP01 = Promise<Promise<[1, 2, 3]>>;
type DeepPromiseValueType<T extends Promise<unknown>> = T extends Promise<infer P>
  ? P extends Promise<unknown>
    ? DeepPromiseValueType<P>
    : P
  : T;
// 两种写法都行
type DeepPromiseValueType2<T> = T extends Promise<infer P> ? DeepPromiseValueType2<P> : T;
type TP02 = DeepPromiseValueType<TP01>; // [1,2,3]
```

### 数组类型的递归-Reverse

```ts
type TA01 = [1, 2, 3, 4, 5];
type TA02 = [5, 4, 3, 2, 1];
type Reverse<T extends unknown[]> = T extends [infer One, ...infer R]
  ? [...(R extends unknown[] ? Reverse<R> : R[0]), One]
  : [];
type TA03 = Reverse<TA01>;
// 进一步简化
type Reverse2<T extends unknown[]> = T extends [infer One, ...infer R] ? [...Reverse2<R>, One] : [];
```

### 数组中是否存在-Includes

```ts
type TA04 = Includes<[1, 2, 3], 2>; // true
type isEqual<A, B> = (A extends B ? true : false) & (B extends A ? true : false);
type Includes<T extends unknown[], N> = T extends [infer F, ...infer R]
  ? isEqual<F, N> extends true
    ? true
    : Includes<R, N>
  : T;
```

### 数组中移除 item-RemoveItem

```ts

```

### BuildArr 构造数组

> 如果构造的数组类型元素个数不确定，也需要递归。比如传入 5 和元素类型，构造一个长度为 5 的该元素类型构成的数组

```ts

```

### 对象类型的递归

- DeepReadonly

```ts
type TD1 = {
  name: string;
  age: number;
};
type TD02 = Readonly<TD1>;
type TD03 = {
  name: string;
  age: number;
  hobby: {
    name: string;
    paid: boolean;
  };
};
type TD04 = Readonly<TD03>;
type TD05 = DeepReadonly<TD03>;
// 期望做到
// type TD04 = {
//     readonly name: string;
//     readonly age: number;
//     readonly hobby: {
//         readonly name: string;
//         readonly paid: boolean;
//     };
// }
type DeepReadonly<T extends Record<any, any>> = T extends any
  ? {
      readonly [K in keyof T]: T[K] extends Object
        ? T[K] extends Function
          ? T[K]
          : DeepReadonly<T[K]>
        : T[K];
    }
  : never;
```
