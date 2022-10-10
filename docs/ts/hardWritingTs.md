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

函数参数的**逆变性质**一般就联合类型转交叉类型会用

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
// type Up7 = {
//     name: 'cpp';
// } & {
//     age: 30;
// }
```

> 1008 晦涩难懂

```ts
type UnionToIntersection2<T> = (T extends any ? (arg: T) => unknown : never) extends (
  x: infer R,
) => unknown
  ? R
  : never;
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

重点是这句提取值可能为 **undefined** 的属性`{} extends Pick<T, P> ? P : never` 如果提取非可选索引呢

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

// type UserRequiredName = {
//     name: string;
//     age?: number | undefined;
//     address?: string | undefined;
// }

type RequiredByKeys<T extends Record<PropertyKey, any>, K extends keyof T> = Merge<
T & Required<Pick<T, K>
>
```

### RemoveIndexSignature

如果想删除索引类型中的**可索引签名**呢？

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

// type Up12 = {
//     sleep: () => void;
// }
```

### ClassPublicProps

keyof 提取出 public 属性的属性名

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

### Assign 合并选项

合并对象

```ts
type Up16 = Assign<{ a: 1; d: 4 }, { a: 2; b: 3 }>;
// expect { d: 4, a: 2, b: 3}
type Assign<T1 extends Record<PropertyKey, any>, T2 extends Record<PropertyKey, any>> = {
  [K in keyof T1 | keyof T2]: K extends keyof T2 ? T2[K] : K extends keyof T1 ? T1[K] : never;
};
const Test171 = assign({ a: 1, d: 4 }, { a: 2, b: 3 });

declare function assign<Obj1 extends Record<string, any>, Obj2 extends Record<string, any>>(
  obj1: Obj1,
  obj2: Obj2,
): Assign<Obj1, Obj2>;
```

### Diff

找出两个对象的不同

```ts
type Foo = {
  name: string;
  age: string;
};
type Bar = {
  name: string;
  age: string;
  gender: number;
  say: () => void;
};

type Up17 = Diff<Bar, Foo>;
type Up171 = Diff<Foo, Bar>; // same
// type Up17 = {
//     gender: number;
//     say: () => void;
// }
type Up18 = Exclude<keyof Foo, keyof Bar>; // type Up19 = "gender" | "say"
type Up19 = Exclude<keyof Bar, keyof Foo>; // type Up19 = "gender" | "say"

type Diff<A extends Record<PropertyKey, any>, B extends Record<PropertyKey, any>> = {
  [K in Exclude<keyof A, keyof B> | Exclude<keyof B, keyof A>]: K extends keyof B
    ? B[K]
    : K extends keyof A
    ? A[K]
    : never;
};
```

### ObjectEntries

实现 TS 版本的 **Object.entries**：

```ts
interface Model {
  name: string;
  age: number;
  locations: string[] | null;
}
type modelEntries = ObjectEntries<Partial<Model>>;
// ['name', string] | ['age', number] | ['locations', string[] | null];
type ObjectEntries<T extends Record<PropertyKey, any>> = {
  [K in keyof T]-?: [K, RemoveUndefined<T[K]>];
}[keyof T];

interface Model1 {
  hobby?: string;
}
type Up20 = ObjectEntries<Model1>;
type Up21 = number | undefined | string[];
type RemoveUndefined<T> = [T] extends [undefined] ? T : Exclude<T, undefined>;
type Up22 = RemoveUndefined<Up21>;
```

### Tuple to Nested Object

实现 TupleToNestedObject<T, P>，其中 T 仅接收字符串数组，P 是任意类型，生成一个递归对象结构，满足如下结果：

```ts
type Up41 = [1, 2, 3, 4];
type Up42 = Up41['length'];
type Up43 = ['hello', 1, 'cpp'];
type Up44 = Up43['length'];
type a = TupleToNestedObject1<['a'], string>; // {a: string}
type b = TupleToNestedObject1<['a', 'b'], number>; // {a: {b: number}}
type c = TupleToNestedObject1<[], boolean>; // boolean. if the tuple is empty, just return the U type

// type TupleToNestedObject<
//   T extends string[],
//   P extends any,
//   S = {}> = T extends [...infer A, infer R extends PropertyKey]
//   ? R extends string
//     ? { [K in R]: P }
//     : A extends [] ? {name: 'cpp'} : {name: 'wmh'}
//   : P;

type TupleToNestedObject1<
  T,
  U,
  S = U> =
  T extends []
    ? S
    : (T extends [...infer A, infer Last extends PropertyKey]
      ? TupleToNestedObject1<A, U, {
          [K in Last]: S
        }>
      : never
    );
```

### 接口类型的约束

```ts
type UnionToIntersection1<U> = (U extends any ? (arg: U) => any : never) extends (
  arg: infer I,
) => void
  ? I
  : never;
type Up23 = 'a' | 'b' | 'c';
type Up24 = 'd' | 'e' | 'f';
type Up27 = [string, number, symbol];
type Up25 =
  | {
      type: 'a';
      payload: 'd';
    }
  | {
      type: 'b';
      payload: 'e';
    }
  | {
      type: 'c';
      payload: 'f';
    };

type Up26 = ToAction<Up23>;
type Up28 = ToAction2<Up24>;
type ToAction<A extends PropertyKey> = {
  [P in A]: {
    type: P;
  };
}[A];
type ToAction2<A extends PropertyKey> = {
  [P in A]: {
    payload: P;
  };
}[A];
type Last1<A extends Record<PropertyKey, any>, B extends string> = A extends { type: infer F }
  ? {
      type: F;
      payload: B[number];
    }
  : never;
type Up30 = Last1<Up26, Up24>;
```

### BEM style string

```ts
type Up31 = BEM1<'btn', [], ['small', 'medium', 'large']>; // 'btn--small' | 'btn--medium' | 'btn--large'

type Up34 = BEM2<'btn', [], ['small', 'medium', 'large']>;
// type Up34 = "btn--small" | "btn--medium" | "btn--large"

type Up35 = BEM2<'btn', ['cpp'], ['small', 'medium', 'large']>;
// type Up35 = "btn__cpp--small" | "btn__cpp--medium" | "btn__cpp--large"
```

```ts
type BEM1<
  B extends string,
  E extends string[],
  M extends string[],
> = `${B}__${E[number]}--${M[number]}`;

type IsNever<T> = T[] extends never[] ? true : false;
type SafeUnion<T> = IsNever<T> extends true ? '' : T;

type BEM2<
  B extends string,
  E extends string[],
  M extends string[],
> = `${B}${SafeUnion<`__${E[number]}`>}${SafeUnion<`--${M[number]}`>}`;

type Equal2<A, B = A> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
  ? true
  : false;
type Up32 = Equal2<any, true>;
type Up33 = Equal2<unknown, never>; // type Up33 = false
```

### Unique

实现 Unique<T>，对 T 去重：

```ts
type Res = Unique<[1, 1, 2, 2, 3, 3]>; // expected to be [1, 2, 3]
type Res1 = Unique<[1, 2, 3, 4, 4, 5, 6, 7]>; // expected to be [1, 2, 3, 4, 5, 6, 7]
type Res2 = Unique<[1, 'a', 2, 'b', 2, 'a']>; // expected to be [1, "a", 2, "b"]
type Res3 = Unique<[string, number, 1, 'a', 1, string, 2, 'b', 2, number]>; // expected to be [string, number, 1, "a", 2, "b"]
type Res4 = Unique<[unknown, unknown, any, any, never, never]>; // expected to be [unknown, any, never]
type Unique<T extends unknown[], R extends unknown[] = []> = T extends [infer F, ...infer L]
  ? Includes3<R, F> extends true
    ? Unique<L, R>
    : Unique<L, [...R, F]>
  : R;
// 这种方式有问题
type Includes2<Arr extends unknown[], V> = V extends Arr[number] ? true : false;
type Includes3<Arr extends unknown[], V> = Arr extends [infer F, ...infer L]
  ? Equal3<V, F> extends true
    ? true
    : Includes3<L, V>
  : false;
type Up40 = Includes2<[1, 2, 3], 2>;

type Equal3<A, B = A> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
  ? true
  : false;
```

### MapTypes

实现 **MapTypes<T, R>**，根据对象 R 的描述来替换类型：

```ts
type StringToNumber = {
  mapFrom: string; // value of key which value is string
  mapTo: number; // will be transformed for number
};
type StringToDate = {
  mapFrom: string; // value of key which value is string
  mapTo: Date;
};
type Up100 = MapTypes<{ iWillBeANumberOneDay: string }, StringToNumber>; // gives { iWillBeANumberOneDay: number; }
type Up101 = MapTypes<{ iWillBeNumberOrDate: string }, StringToDate | StringToNumber>; // gives { iWillBeNumberOrDate: number | Date; }
type Up102 = MapTypes2<{ iWillBeNumberOrDate: string }, StringToDate | StringToNumber>; // gives { iWillBeNumberOrDate: number | Date; }
type MapTypes<
  T extends Record<PropertyKey, any>,
  A extends {
    mapFrom: any;
    mapTo: any;
  },
> = {
  [P in keyof T]: [T[P]] extends [A['mapFrom']] ? A['mapTo'] : T[P];
};

type MapTypes2<
  T extends Record<PropertyKey, any>,
  A extends {
    mapFrom: any;
    mapTo: any;
  },
> = {
  [P in keyof T]: [T[P]] extends [A['mapFrom']] ? Transform<A, T[P]> : T[P];
};
type Transform<
  R extends {
    mapFrom: any;
    mapTo: any;
  },
  T,
> = R extends any ? (T extends R['mapFrom'] ? R['mapTo'] : never) : never;
```

### Construct Tuple

生成指定长度的 Tuple：

```ts
type Up103 = ConstructTuple<999>; // expect to be [unknown, unkonwn]
type ConstructTuple<
  T extends number,
  E extends unknown = unknown,
  Arr extends unknown[] = [],
> = Arr['length'] extends T ? Arr : ConstructTuple<T, E, [E, ...Arr]>;
```

### Number Range

实现 NumberRange<T, P>，生成数字为从 T 到 P 的联合类型：

```ts
type Up104 = NumberRange<2, 9>; //  | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
type NumberRange<
  T extends number,
  P extends number,
  U extends any[] = Len<T>,
  R extends number = never,
> = U['length'] extends P ? R | U['length'] : NumberRange<T, P, [0, ...U], R | U['length']>;

type Len<N extends number, R extends unknown[] = []> = R['length'] extends N
  ? R
  : Len<N, [0, ...R]>;
type Up105 = Len<10>;
```

> 没看懂？？

### 实现 Combination<T>:

```ts
// expected to be `"foo" | "bar" | "baz" | "foo bar" | "foo bar baz" | "foo baz" | "foo baz bar" | "bar foo" | "bar foo baz" | "bar baz" | "bar baz foo" | "baz foo" | "baz foo bar" | "baz bar" | "baz bar foo"`
type Keys = Combination<['foo', 'bar', 'baz']>;
```

### Subsequence 全排列

实现 Subsequence<T> 输出所有可能的子序列：

```ts
type A = Subsequence3<[1, 2, 3]> // [] | [1, 2, 3] | [1] | [1, 2] | [2] | [3] | [2, 3] | [1, 3]
type Subsequence3<T extends number[]> = T extends [infer F, ...infer R extends number[]]
? Subsequence3<R> | [F, ...Subsequence3<R>]
: T
```

## 参考文档

- [精读《Unique, MapTypes, Construct Tuple...》](https://mp.weixin.qq.com/s/bVKm5BuMg2hKE8FG5ZHX4w)
- [精读《MinusOne, PickByType, StartsWith...》](https://mp.weixin.qq.com/s/eV6V92Q2olfFXiPXZY4vbw)
- [精读《Diff, AnyOf, IsUnion...》](https://mp.weixin.qq.com/s/11B6kLuz9TxykGU6_Hh8ug)
