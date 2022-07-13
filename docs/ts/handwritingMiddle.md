---
title: handwritingTsMiddle.md
order: 11
group:
  order: 0
  title: TS
  path: /interview/ts
nav:
  order: 3
  title: 'interview'
  path: /interview
---

### 字符串转联合类型

中等难度的类型体操

```ts
type R1 = GetChars<'abc', never>; // 'a' | 'b' | 'c'
type GetChars<T extends string, R> = T extends `${infer F}${infer L}` ? GetChars<L, F | R> : R;
```

### 构造数组 BuildArr

```ts
type R2 = BuildArr<2>; // type R2 = [unknown, unknown]
type BuildArr<
  Length extends number,
  E = unknown,
  Arr extends unknown[] = [],
> = Arr['length'] extends Length ? Arr : BuildArr<Length, E, [...Arr, E]>;
```

### Mutable(-readonly 语法)

实现 Mutable<T>，将对象 T 的所有 Key 变得可写：

```ts
interface Todo1 {
  readonly title: string;
  readonly description: string;
  readonly completed: boolean;
}

type MutableTodo = Mutable<Todo1>; // { title: string; description: string; completed: boolean; }

type Mutable<T extends Record<PropertyKey, any>> = {
  -readonly [P in keyof T]: T[P];
};

type Readonly1<T> = {
  readonly [P in keyof T]: T[P];
};

interface R3 extends Todo1 {
  name: string;
}
type R4 = Mutable<R3>;

// type R4 = {
//     name: string;
//     title: string;
//     description: string;
//     completed: boolean;
// }

type R5 = Readonly1<R3>;

// type R5 = {
//     readonly name: string;
//     readonly title: string;
//     readonly description: string;
//     readonly completed: boolean;
// }
```

## 参考文档

- [接近天花板的 TS 类型体操，看懂你就能玩转 TS 了](https://mp.weixin.qq.com/s/CweuipYoHwOL2tpQpKlYLg)
