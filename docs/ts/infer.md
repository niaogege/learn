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

面试官： 得到如下数据类型 T0 中的数据类型

```ts
type T0 = string[];
type GetType<T extends any[]> = T extends (infer P)[] ? P : T;
type T0Type = GetType<T0>;
type GetType2<T extends any[]> = string[] extends (infer P)[] ? P : T;
```

## 使用限制

1.infer 只能在条件类型的 extends 子句中使用， 2. **infer** 声明的类型变量只在条件类型的 **true** 分支中可用

'infer' declarations are only permitted in the 'extends' clause of a conditional type 仅在条件类型的**extends**的**子句**中允许使用**infer**声明

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
```

## 参考

- [学会 TS infer，写起泛型真香！](https://mp.weixin.qq.com/s/3QlkoSWyPrsNj1Sc8DvzJQ)
