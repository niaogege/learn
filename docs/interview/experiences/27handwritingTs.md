---
title: 手写基础且重要的TS高级类型
order: 27
group:
  order: 0
  title: interview
nav:
  order: 3
  title: 'interview'
  path: /interview
---

```ts
/**
 * 1.TS练习体操之Equal<A, B>
 * 2.TS练习之Pick<T, K>
 * 3.TS实现内置函数Parameters和ReturnTypes
 * 4.手写ts版Awaited<T>
 * 5.Partial
 * 6.Record
 * 7.Exclude/Extract/Omit
 * 8.Required
 * 9.TS手写索引转联合类型
 * 10.TS手写联合转交叉
 * 11.TS手写Unique 去重
 * 12.OptionalKeys提取 T 中所有可选类型的 key 组成的联合类型。
 * 13.NonOptionalKeys提取 T 中非所有可选类型的 key 组成的联合类型。
 * 14.如何限制数组索引为非负数
 * 15.
 */
```

## 1.TS 练习体操之 Equal<A, B>

```ts
type Equal<A, B = A> = (<T>(arg: A) => T extends A ? 1 : 2) extends <T>(
  arg: B,
) => T extends B ? 1 : 2
  ? true
  : false;

type Q1 = Equal<string, false>;
```

## 2.Pick

```ts
type MockPick<T, B extends keyof T> = {
  [K in B]: T[K];
};
```

## 3.TS 实现内置函数 Parameters 和 ReturnTypes

```ts
type MockReturnTypes<T extends (...arg: any) => any> = T extends (...arg: any) => infer R ? R : any;

type MockParameters<T extends (...arg: any) => any> = T extends (...arg: infer P) => any
  ? P
  : never;
```

## 4.手写 ts 版 Awaited

```ts
type MockAwaited<T extends Promise<unknown>> = T extends Promise<infer P>
  ? P extends Promise<unknown>
    ? MockAwaited<P>
    : P
  : T;
```

## 5.Parital

```ts
/**
 * Make all properties in T optional
 */
type MockPartial<T> = {
  [P in keyof T]?: T[P];
};
```

## 6.Record

```ts
type MockRecord<T extends string | number | symbol, O> = {
  [K in T]: O;
};
```

## 7.Exclude/Extract/Omit

- Exclude 返回 T 中不存在 U 的部分

```ts
type MockExclude<A, B> = A extends B ? never : A;
```

- Extract 取两者交集

```ts
type MockExtract<A, B> = A extends B ? A : never;
```

- Omit

```ts
type MockOmit<T, P> = {
  [K in MockExclude<keyof T, P>]: T[K];
};
```

## 8.Required

```ts
type MockRequired<T> = {
  [K in keyof T]-?: T[K];
};
```

## 9.TS 手写索引转联合类型

```ts
type Q3 = {
  name: 'cpp';
  age: 32;
};
type IndexToUnion2<T extends Record<string, any>> = {
  [P in keyof T]: {
    [K in P]: T[K];
  };
}[keyof T];
type Q11 = IndexToUnion2<Q3>;
// type Q11 = {
//     name: 'cpp';
// } | {
//     age: 32;
// }
```

## 10.联合转交叉

```ts
type UnionToInsection2<T> = (T extends T ? (x: T) => unknown : never) extends (
  x: infer P,
) => unknown
  ? P
  : never;
type Q12 = UnionToInsection2<
  | {
      age: 32;
    }
  | {
      name: 'cpp';
    }
>;
// type Q12 = {
//   age: 32;
// } & {
//   name: 'cpp';
// }
```

## 11.TS 手写 Unique 去重

```ts
type Include<A extends unknown[], B> = A extends [infer F, ...infer R]
  ? Equal<B, F> extends true
    ? true
    : Include<R, B>
  : false;
type Q01 = Include<[1, 2, 3], 11>;

type Unique<A extends unknown[], C extends unknown[] = []> = A extends [infer F, ...infer R]
  ? Include<C, F> extends true
    ? Unique<R, C>
    : Unique<R, [F, ...C]>
  : C;
type Q02 = Unique<[1, 2, 3, 4, 4]>;
```

## 12.OptionalKeys 提取 T 中所有可选类型的 key 组成的联合类型。

```ts
type OptionalKeys<T> = {
  [P in keyof T as T[P] extends Required<T>[P] ? never : P]: T[P];
};
type Q031 = {
  name?: string;
  age: number;
};
type Q041 = OptionalKeys<Q03>;

type GetFunction<T> = {
  [P in keyof T as T[P] extends Function ? P : never]: T[P];
};
type Q0311 = {
  name?: string;
  age: number;
  getName: () => void;
};
type Q0312 = GetFunction<Q0311>;
```

## 13.NonOptionalKeys 提取 T 中非所有可选类型的 key 组成的联合类型。

```ts
type NonOptionalKeys<T> = {
  [P in keyof T as T[P] extends {} ? P : never]: T[P];
};
type Q03 = {
  name?: string;
  age: number;
};
type Q04 = NonOptionalKeys<Q03>;
```

## 14.如何限制数组索引为非负数

```ts
type NotNegative<N extends number> = `${N}` extends `-${number}` ? never : N;
function safeGet<T extends number>(arr: any[], index: NotNegative<T>) {
  console.log(arr[index]);
}
// Argument of type 'number' is not assignable to parameter of type 'never'.ts(2345)
safeGet([1, 2, 3, 4], -1);
```
