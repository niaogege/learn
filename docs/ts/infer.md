---
title: infer推断
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

## 面试题：函数返回值类型以及函数入參类型

```ts
function SayName(name: string): string | number {
  return 'cpp' + name;
}
// ReturnType
type MockReturnType<T extends (...arg: any) => any> = T extends (...arg: any) => infer R ? R : any;

type MockParamtersType<T extends (...arg: any) => any> = T extends (...arg: infer P) => any
  ? P
  : never;

type SayNameReturn = MockReturnType<typeof SayName>;
type SayNameParam1 = MockParamtersType<typeof SayName>;
```

面试官：得到如下数据类型 T0 中的数据类型

```ts
type T0 = string[];
type GetType<T extends any[]> = T extends (infer P)[] ? P : T;
type T0Type = GetType<T0>;
//  简化看看呢
type GetType2<T extends any[]> = string[] extends (infer P)[] ? P : T;
```

面试官： 实现类型 First<T>，取到数组第一项的类型：

```ts
type arr1 = ['a', 'b', 'c'];
type arr2 = [3, 2, 1];

type head1 = First<arr1>; // expected to be 'a'
type head2 = First<arr2>; // expected to be 3

// 实现First
type First<T extends any[]> = T extends [infer F, ...infer R] ? F : never;
```

## 使用限制

1.infer 只能在条件类型的 extends 子句中使用，

2. **infer** 声明的类型变量只在条件类型的 **true** 分支中可用

> 条件类型是 extends ? : type GetType<T extends any[]> = T extends (infer P)[] ? P : T; 左边的 extends 是约束类型 右边的 T extends (infer P)[]? P : T 才是条件类型

**'infer'** declarations are only permitted in the 'extends' clause of a conditional type 仅在条件类型的**extends**的**子句**中允许使用**infer**声明

```ts
type WrongInfer<T extends (infer U)[]> = T[0];
type WrongInfer2<T> = (infer U)[] extends T ? T : U;
type WrongInfer3<T> = T extends (infer U)[] ? T : U;
```

返回值类型推断, 当遇到函数重载的场景，TypeScript 将使用最后一个调用签名进行类型推断：

```ts
declare function foo(x: string): number;
declare function foo(x: number): string;
declare function foo(x: string | number): string | number;

type InferFoo<T> = T extends (...args: any) => infer R ? R : any;
type U2 = InferFoo<typeof foo>;
```

利用条件类型+infer 推断出对象类型中键的类型

```ts
type User {
  id: number;
  name: string
}
type InferUser<T> = T extends {id: infer U, name: infer N} ? [U, N] : T;
type GetUser = InferUser<User> // [number string]

type InferUser2<T> = T extends {id: infer U, name: infer U} ? U : T;
type GetUser2 = InferUser2<User>
```

联合转交叉类型 UnionToIntersection

```ts
type Union = { a: string } | { b: number };

type UnionToIntersection<T> = (T extends any ? (arg: T) => void : never) extends (
  arg: infer R,
) => void
  ? R
  : never;

type Intersection = UnionToIntersection<Union>; // {a: string } & {b: number};
const Test: Intersection = {
  a: 'cpp',
  b: 10,
};

type Equal22<A, B = A> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
  ? true
  : false;
type TT11 = Equal22<true, true>;
```

### Exclude<A, B>

联合类型当作为类型参数出现在条件类型左边时，会被分散成单个类型传入，这叫做**分布式条件类型**。

所以写法上可以简化， A extends B 就是对每个类型的判断。

过滤掉 B 类型，剩下的类型组成联合类型。也就是取差集。

```ts
type TT122 = Exclude2<'a' | 'c' | 'b', 'a' | 'b'>; // type TT122 = "c"
type TT1222 = Exclude2<'a' | 'b', 'a' | 'b' | 'c'>; // type TT1222 = never
type Exclude2<A, B> = A extends B ? never : A;
```

### Extract<A, B>

取交集

```ts
type TT123 = Extra2<'a' | 'c' | 'b', 'a' | 'b'>; // type TT123 = "a" | "b"

type Extra2<A, B> = A extends B ? A : never;
```

### Include<A, B>

判断 B 是否在 A 里面

```ts
type TT14 = Include<['a', 'b'], 'a'>; // type TT14 = true
type Include<A extends unknown[], V> = A extends [infer F, ...infer R]
  ? Equal22<F, V> extends true
    ? true
    : Include<R, V>
  : false;
```

### Omit<T, K>

索引类型中去掉 K 的属性

```ts
type TT15 = {
  name: string;
  age: number;
};
type TT17 = Omit<TT15, 'age'>;
// type TT17 = {
//     name: string;
// }
type TT16 = Omit1<TT15, 'age'>;
type Omit1<T extends Record<PropertyKey, any>, K extends keyof any> = Pick<T, Exclude<K, keyof T>>;
```

### Awaited

获取 Promise 返回的类型

```ts
type TT18 = Awaited<Promise<Promise<number>>>; // type TT18 = number
type TT19 = Awaited1<Promise<Promise<number>>>; // type TT18 = number
type Awaited1<T extends any> = T extends null | undefined
  ? T
  : T extends object & { then(onfulfilled: infer F): any }
  ? F extends (value: infer V, ...args: any) => any
    ? Awaited1<V>
    : never
  : T;
```

## 参考

- [学会 TS infer，写起泛型真香！](https://mp.weixin.qq.com/s/3QlkoSWyPrsNj1Sc8DvzJQ)
