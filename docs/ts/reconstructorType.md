---
title: 重新构造做转换
order: 5
group:
  order: 0
  title: TS
  path: /interview/ts
nav:
  order: 3
  title: 'interview'
  path: /interview
---

TypeScript 类型系统支持 3 种可以声明任意类型的变量： type、infer、类型参数。

```ts
type T103 = Promise<number>;
type GetVal<P> = P extends Promise<infer T> ? T : never;
type T104 = GetVal<T103>;
type isTwo<T> = T extends 2 ? true : false;
```

> 数组和元组的区别：数组类型是指任意多个同一类型的元素构成的，比如 number[]、Array<number>，而元组则是数量固定，类型可以不同的元素构成的，比如 [1, true, 'guang']。

## 字符串类型的重新构造

### CapitalizeStr

当泛型 T 满足于`${infer F}${infer R}`类型的时候，对 F 进行大小写

```ts
type T105 = 'cpp';
type T106 = CapitalizeStr<T105>; // 'Cpp'
type CapitalizeStr<T extends string> = T extends `${infer F}${infer R}` ? `${Uppercase<F>}${R}` : T;
type T107 = Capitalize<T105>; // Cpp 内置的首字母大小
```

### CamelCase

我们再来实现 dong_dong_dong 到 dongDongDong 的变换。

```ts
type CamelCase<Str extends string> = Str extends `${infer Left}_${infer Right}${infer Rest}`
  ? `${Left}${Uppercase<Right>}${CamelCase<Rest>}`
  : Str;
type T108 = CamelCase<'dong_dong_dong'>;
```

> 还是有点难度的哈 有递归和 extends 以及 infer

### 定义泛型的时候构造新的空数组盛放结果值

- BuildArray

```ts
type TR0 = BuildArray<2>; // [unknown, unknown]
type TR1 = BuildArray<2, { name: 'cpp' }>;
// type TR1 = [{
//     name: 'cpp';
// }, {
//     name: 'cpp';
// }]
type BuildArray<
  L extends number,
  E = unknown,
  Result extends unknown[] = [],
> = Result['length'] extends L ? Result : BuildArray<L, E, [...Result, E]>;
```

泛型中的**Result**就是构造出的一个空数组，定义的时候默认值为空数组，这个 Result 就负责收集所有的数据，然后返回即可

- RemoveItem<A, Item, Result>, 删除指定的某一项

```ts
type TR2 = RemoveItem<[1, 2, 3], 1>; // [2,3]
type RemoveItem<A extends unknown[], Item, Result extends unknown[] = []> = A extends [
  infer F,
  ...infer R,
]
  ? Equal<Item, F> extends true
    ? RemoveItem<R, Item, Result>
    : RemoveItem<R, Item, [...Result, F]>
  : Result;

type Equal<A, B> = (A extends B ? true : false) & (B extends A ? true : false);
type isEquals<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
  ? true
  : false;
```

### 定义泛型的时候构造新的字符串盛放结果值

```ts
// ReverseStr 'cpp' => 'ppc' empty 构造出来的
type ReverseStr<T extends string, E extends string = ''> = T extends `${infer F}${infer R}`
  ? `${ReverseStr<R, E>}${F}`
  : `${E}`;

type TP11 = ReverseStr<'hello'>;
// type TP11 = "olleh"
```

ReverseStr 泛型中的*E*也是构造出的一个默认空字符串的字符串类型值，结果也是保存所有的字符串，然后导出来
