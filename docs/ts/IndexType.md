---
title: 索引类型和映射类型
order: 3
group:
  order: 0
  title: TS
  path: /interview/ts
nav:
  order: 3
  title: 'interview'
  path: /interview
---

## 索引类型

JavaScript 中的数组、对象等聚合多个元素的类型在 TypeScript 中对应的是**索引类型**。比如

```ts
type TI1 = {
  name: string;
  age: number;
  gender: boolean;
};
```

对象、类、元组等都是索引类型。索引类型可以添加修饰符 readonly（只读）、?（可选）

```ts
interface TI2 {
  readonly name: string;
  age?: number;
  gender: boolean;
}
type ToReadOnly<T> = {
  readonly [K in keyof T]: T[K];
};
type TI121 = ToReadOnly<TI2>;
// type TI121 = {
//     readonly name: string;
//     readonly age?: number | undefined;
//     readonly gender: boolean;
// }
```

对于索引类型，如何做运算并产生新的类型呢？答案是**映射类型**。

## 映射类型

构造新的索引类型,即映射类型 Mapped Types

```ts
type Obj1 = {
  name: string;
  age: number;
};
type SplitObj<T> = {
  [K in keyof T]: {
    [K2 in K]: T[K2];
  };
};
type Res12 = SplitObj<Obj1>;
// type Res12 = {
//     name: {
//         name: string;
//     };
//     age: {
//         age: number;
//     };
// }
type Res121 = SplitObj<Obj1>['age'];
type Res122 = SplitObj<Obj1>['name'];
type RES123 = SplitObj<Obj1>['name' | 'age'];
// type RES123 = {
//     age: number;
// } | {
//     name: string;
// }
```

### 手写 Record 类型

```ts
interface Test {
  name: string;
  age: number;
  getName?: () => void;
}
type MyRecord<K extends string | number | symbol, T extends {}> = {
  [P in K]: T;
};
type T6 = MyRecord<'hobby', Test>;
type T06 = Record<'hobby', Test>;
const t6: T6 = {
  hobby: {
    name: '111',
    age: 31,
  },
};
```

### 在构造新的索引类型的过程中，还可以做加上一些修饰符。

比如 ReadOnly 类型

```ts
type ReadOnly<T> = {
  readonly [P in keyof T]: T[P];
};
type T7 = ReadOnly<Test>;
```

映射类型可以生成新的索引类型，在生成过程中可以加上或去掉 _readonly_、*?*以及 _-_ 的修饰符。内置的 Record、ReadOnly、Required、Partial 等类型都是映射类型。

## 重映射 (as)

重映射就是在索引后加一个 **as** 语句，表明索引转换成什么，它可以用来对索引类型做**过滤**和**转换**。

### 根据键的属性来过滤索引类型

```ts
type FilterByString<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};
type T8 = FilterByString<Test>;
// {name: string}
type FilterByParams<T, P> = {
  [K in keyof T as T[K] extends P ? K : never]: T[K];
};
type T9 = FilterByParams<Test, number | string>;
// type T9 = {
//     name: string;
//     age: number;
// }
```

### 转换，修改索引名,改变属性名

```ts
type ChangeName<T> = {
  [K in keyof T as `cpp${Capitalize<K & string>}`]: T[K];
};
type T10 = ChangeName<Test>;
// type T10 = {
//     cppName: string;
//     cppAge: number;
//     cppGetName?: (() => void) | undefined;
// }
```

> Capitalize 首字母大写 TS 内置的类型

重映射 as 可以用来做索引类型的过滤和转换，可以对索引类型做更灵活的编程。

### 实现索引类型 key 和 value 互换

```ts
type Transform<T extends Record<any, any>> = {
  [K in keyof T as `${T[K]}`]: K;
};
type T101 = {
  name: 'Cpp';
  age: 20;
};
type T11 = Transform<T101>;
// type T11 = {
//     Cpp: "name";
//     20: "age";
// }
```

## 参考

- [TS 类型体操：索引类型的映射再映射](https://mp.weixin.qq.com/s/Im52Qt1gt5eX7DIPZxfLpQ)
