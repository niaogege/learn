---
title: 基础且相当重要的ts手写
order: 12
group:
  order: 0
  title: TS
  path: /interview/ts
nav:
  order: 3
  title: 'interview'
  path: /interview
---

### 比较两个类型是否相等

```ts
type Equals<A, B = A> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
  ? true
  : false;
type E11 = Equals<1, 2>; // false
type E12 = Equals<'string', string>; // false
type E13 = Equals<string, string>; // true
```

### 联合转交叉类型

```ts
type UnionToIntersection3<T> = (T extends T ? (x: T) => unknown : never) extends (
  x: infer R,
) => unknown
  ? R
  : never;
type E15 = { name: 'cpp' } | { age: 30 };
type E14 = UnionToIntersection3<E15>;
/**
 * type E14 = {
    name: 'cpp';
} & {
    age: 30;
}
 * /
```

### 实现嵌套类型 Awaited

```ts
type A1 = Promise<[1, 2, 3, 4]>;
type A2 = Awaited<A1>; // type A2 = [1, 2, 3, 4]
type A3 = Promise<Promise<{ name: string }>>;
type A4 = Awaited<A3>;
// type A4 = {
//     name: string;
// }
type MyAwaited1<T extends Promise<unknown>> = T extends Promise<infer A> ? A : T;
type A21 = MyAwaited1<A1>; // type A2 = [1, 2, 3, 4]
type MyAwaited2<T extends Promise<unknown>> = T extends Promise<infer A>
  ? A extends Promise<unknown>
    ? MyAwaited2<A>
    : A
  : T;
type A41 = MyAwaited2<A3>;
// type A41 = {
//     name: string;
// }
type AllAwaited<T> = T extends null | undefined
  ? T
  : T extends object & { then(onFullfill: infer F): any }
  ? F extends (value: infer V, ...arg: any) => any
    ? AllAwaited<V>
    : never
  : T;
type A31 = AllAwaited<A1>; // type A31 = [1, 2, 3, 4]
type A32 = AllAwaited<A3>;
// type A32 = {
//     name: string;
// }
```

### SymmetricDifference

SymmetricDifference<T, U>获取没有同时存在于 T 和 U 内的类型。

```ts
type E16 = SymmetricDifference<1 | 2 | 3, 2 | 3 | 4>; // type E16 = 1 | 4
type SymmetricDifference<A, B> = Exclude<A | B, A & B>;
type Excludepp<T, U> = T extends U ? never : T;
```

总结一下就是，提取存在于 T 但不存在于 T & U 的类型，然后再提取存在于 U 但不存在于 T & U 的，最后进行联合。

### FunctionKeys

获取 T 中所有类型为函数的 key 组成的联合类型。

```ts
type AType = {
  key1: string;
  key2: () => void;
  key3: Function;
};
type Eg = FunctionKeys<AType>;
type FunctionKeys<T> = {
  [K in keyof T as T[K] extends Function ? K : never]: T[K];
};
```

**as 重映射！！！**

### MutableKeys

MutableKeys<T>查找 T 所有**非只读类型**的 key 组成的联合类型。

[MutableKeys](https://github.com/type-challenges/type-challenges/issues?q=is%3Aissue+is%3Aopen+MutableKeys)

```ts
type E17 = {
  readonly name: string;
  age: number;
  hobby: string;
};
type E18 = MutableKeys<E17>;
type MutableKeys<T> = {
  [K in keyof T as Equals<Pick<T, K>, Readonly<Pick<T, K>>> extends true ? never : K]: T[K];
};
```

### OptionalKeys

OptionalKeys<T>提取 T 中所有可选类型的 key 组成的联合类型。

```ts
type E19 = {
  readonly name?: string;
  age?: number;
  hobby: string;
};
type E20 = NotOptionalKeys<E19>;
/**
 type E20 = {
    hobby: string;
}
*/
type E21 = OptionalKeys2<E19>;
// type E21 = {
//     readonly name?: string | undefined;
//     age?: number | undefined;
// }
type NotOptionalKeys<T> = {
  [K in keyof T as T[K] extends {} ? K : never]: T[K];
};
type OptionalKeys2<T> = {
  [K in keyof T as T[K] extends Required<T>[K] ? never : K]: T[K];
};
type Required1<T> = {
  [K in keyof T]-?: T[K];
};
type E22 = Required1<E19>;
// type E22 = {
//     readonly name: string;
//     age: number;
//     hobby: string;
// }
```

### Diff1

定义 Diff<T, U>，从 T 中排除存在于 U 中的 key 和类型。

```ts
type E23 = Diff1<E24, E25>;
// type E23 = {
//     name: string;
//     age: number;
// }
type E24 = {
  name: string;
  age: number;
  hobby: string;
};
type E25 = {
  hobby: string;
};
type Diff1<T extends object, U extends object> = Pick<T, Exclude<keyof T, keyof U>>;
type Foo1 = {
  name: string;
  age: string;
};
type Bar1 = {
  name: string;
  age: string;
  gender: number;
  say: () => void;
};
type E231 = Diff1<Bar1, Foo1>;
```

本题是从 T 中排除存在于 U 类型中的 key，但如果是找出两个对象的不同的呢？难度提升

```ts
type DiffHard<T extends Record<PropertyKey, any>, U extends Record<PropertyKey, any>> = {
  [K in Exclude<keyof T, keyof U> | Exclude<keyof U, keyof T>]: K extends keyof T
    ? T[K]
    : K extends keyof U
    ? U[K]
    : never;
};

type E232 = DiffHard<Bar1, Foo1>;
```

### Intersection

Intersection<T, U>从 T 中提取存在于 U 中的 key 和对应的类型。（注意，最终是从 T 中提取 key 和类型）

```ts
type E27 = Intersection<E24, E25>;
// type E27 = {
//     hobby: string;
// }
type Intersection<T extends object, U extends object> = Pick<
  T,
  Extract<keyof T, keyof U> & Extract<keyof U, keyof T>
>;

const e27: E27 = {
  hobby: 'cpp',
};
```

### Chunk

希望实现这样一个类型：

对数组做分组，比如 1、2、3、4、5 的数组，每两个为 1 组，那就可以分为 1、2 和 3、4 以及 5 这三个 Chunk。

```ts
type E28 = Chunk<[1, 2, 3, 4, 5], 2>; // [[1,2],[3,4], [5]]
type Chunk<
  Arr extends unknown[],
  ItemLen extends number,
  CurItem extends unknown[] = [],
  Res extends unknown[] = [],
> = Arr extends [infer First, ...infer Rest]
  ? CurItem['length'] extends ItemLen
    ? Chunk<Rest, ItemLen, [First], [...Res, CurItem]>
    : Chunk<Rest, ItemLen, [...CurItem, First], Res>
  : [...Res, CurItem];
```

### 参考

- [TS 重要](https://juejin.cn/post/6994102811218673700#heading-21)