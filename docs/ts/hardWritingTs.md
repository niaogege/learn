---
title: hardwritingTs.md
order: 10
group:
  order: 0
  title: TS
  path: /interview/ts
nav:
  order: 3
  title: 'interview'
  path: /interview
---

实现稍微复杂点的类型体操

### Chainable Options

```ts
declare const config: Chainable;
const result = config
  .option('foo', 123)
  .option('name', 'type-challenges')
  .option('bar', { value: 'Hello World' })
  .get();
// expect the type of result to be:
interface Result12 {
  foo: number;
  name: string;
  bar: {
    value: string;
  };
}
```

如果用 js 实现

```js
class Chain {
  constructor(previous = {}) {
    this.obj = { ...previous };
  }
  option(k, v) {
    return new Chain({
      ...this.obj,
      [k]: v,
    });
  }
  get() {
    return this.obj;
  }
}
var conf = new Chain();
```

answer

```ts
type Chainable<T extends Record<string, any> = {}> = {
  option: <K extends string, V extends unknown>(
    key: K,
    value: V,
  ) => Chainable<
    T & {
      [P in K]: V;
    }
  >;
  get: () => T;
};
```

### PromiseAll

```ts
const promiseAllTest1 = PromiseAll([1, 2, 3] as const); // Promise<readonly [1, 2, 3]>
const promiseAllTest2 = PromiseAll([1, 2, Promise.resolve(3)] as const); // Promise<readonly [1, 2, number]>
const promiseAllTest3 = PromiseAll([1, 2, Promise.resolve(3)]); // Promise<(number | Promise<number>)[]>

declare function PromiseAll<T>(values: T): Promise<{
  [P in keyof T]: T[P] extends Promise<infer U> ? U : T[P];
}>;
```

### isTuple

元组类型跟数组类型的区别

```ts
type Up = [1, 2, 3];
type Up1 = Up['length'];
// type Up1 = 3
type Up2 = number[]['length'];
// type Up2 = number
```

元组类型也是数组类型，但每个元素都是只读的，并且 length 是数字字面量，而数组的 length 是 number。

```ts
type NotEqual<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
  ? false
  : true;
type IsTuple<T> = T extends readonly [...params: infer L] ? NotEqual<L['length'], number> : false;
type Up3 = IsTuple<Up>;
// type Up3 = true
type Up4 = IsTuple<number[]>;
// type Up4 = false
```

### UnionToIntersection(Hard)

联合类型转交叉类型

> 比如 A 和 B 的交叉类型 A & B 就是联合类型 A | B 的子类型，因为更具体

函数参数的逆变性质一般就联合类型转交叉类型会用

```ts
type Up5 = { name: 'cpp' } | { age: 30 };
// expected
type Up6 = { name: 'cpp' } & { age: 30 };
// const up6: Up6 = {
//   name: 'cpp',
//   age: 30,
// }
type UnionToIntersection<T> = (T extends T ? (x: T) => unknown : never) extends (
  x: infer R,
) => unknown
  ? R
  : never;
type Up7 = UnionToIntersection<Up5>;
```

### GetOptional

如何提取索引类型中的可选索引呢？

```ts
type Up8 = {
  name: string;
  age?: number;
};
type GetOptional<T extends Record<string, any>> = {
  [P in keyof T as {} extends Pick<T, P> ? P : never]: T[P];
};
type Up9 = GetOptional<Up8>;
// type Up9 = {
//     age?: number | undefined;
// }
```

重点是这句提取值可能为 undefined 的属性`{} extends Pick<T, P> ? P : never` 如果提取非可选索引呢

```ts
type GetNotOptional<T extends Record<string, any>> = {
  [P in keyof T as {} extends Pick<T, P> ? never : P]: T[P];
};
type Up10 = GetNotOptional<Up8>;
// type Up10 = {
//     name: string;
// }
```

### PartialByKeys

实现 PartialByKeys<T, K>，使 K 匹配的 Key 变成可选的定义，如果不传 K 效果与 Partial<T> 一样：

```ts
interface User {
  name: string;
  age: number;
  address: string;
}

type UserPartialName = PartialByKeys<User, 'name'>; // { name?:string; age:number; address:string }

type Merge<T> = {
  [P in keyof T]: T[P];
};
type PartialByKeys<T extends Record<PropertyKey, any>, K extends PropertyKey = keyof T> = Merge<
  Partial<T> & Omit<T, K>
>;
```

### RequiredByKeys

实现 RequiredByKeys<T, K>，使 K 匹配的 Key 变成必选的定义，如果不传 K 效果与 Required<T> 一样：

```ts
interface User12 {
  name?: string
  age?: number
  address?: string
}

type UserRequiredName = RequiredByKeys<User12, 'name'> // { name: string; age?: number; address?: string }
type RequiredByKeys<T extends Record<PropertyKey, any>, K extends keyof T> = Merge<
T & Required<Pick<T, K>
>
```

### RemoveIndexSignature

如果想删除索引类型中的可索引签名呢？

索引签名不能构造成字符串字面量类型，因为它没有名字，而其他索引可以。

```ts
type Up11 = {
  [key: string]: any; // 索引签名
  sleep(): void; // 具体索引
};
type RemoveIndexSignature<T extends Record<string, any>> = {
  [K in keyof T as K extends `${infer R}` ? R : never]: T[K];
};
type Up12 = RemoveIndexSignature<Up11>;
```

### ClassPublicProps

```ts
class Dong {
  public name: string;
  protected age: number;
  private hobbies: string[];

  constructor() {
    this.name = 'dong';
    this.age = 20;
    this.hobbies = ['sleep', 'eat'];
  }
}
type PublicKeys = keyof Dong;
type ClassPublicProps<T extends Record<string, any>> = {
  [P in keyof T]: T[P];
};
type Up13 = ClassPublicProps<Dong>;
// type Up13 = {
//     name: string;
// }
```

### ParseQueryString

```ts

```

### Append Argument

```ts
type Fn = (a: number, b: string) => number;

type Up14 = AppendArgument<Fn, boolean>; // type Up14 = (arg_0: number, arg_1: string, arg_2: boolean) => number
type Up15 = AppendArgument2<Fn, boolean>; // type Up15 = (args_0: number, args_1: string, args_2: boolean) => number
// expected be (a: number, b: string, x: boolean) => number
type AppendArgument2<F, E> = F extends (...args: infer T) => infer R
  ? (...args: [...T, E]) => R
  : F;
type AppendArgument<T, E> = T extends (...arg: infer P) => any
  ? (...arg: [...P, E]) => ReturnType<T>
  : T;
```

## 参考文档

- [精读《MinusOne, PickByType, StartsWith...》](https://mp.weixin.qq.com/s/eV6V92Q2olfFXiPXZY4vbw)
