---
title: type 和 interface区别
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

> 老生常谈的问题 简历中如果填写 ts，命中的概率 99%+

## 介绍下两者

### type 类型别名

类型别名 type 可以用来给一个类型起个新名字，当命名基本类型或联合类型等**非对象类型**时非常有用：

```ts
type MyNumber = number;
type StringOrNumber = string | number;
type Text = string | string[];
type Point = [number, number];
type Callback = (data: string) => void;
```

在 TypeScript 1.6 版本，**类型别名开始支持泛型**。我们工作中常用的 Partial、Required、Pick、Record 和 Exclude 等工具类型都是以 type 方式来定义的。

```ts
type Partial<T> = {
  [P in keyof T]?: T[P];
};
type Required<T> = {
  [P in keyof T]-?: T[P];
};

type Record<K extends PropertyKey, T> = {
  [P in K]: T;
};

type Exclude<A, B> = A extends B ? never : A;
```

### interface

接口 interface 只能用于定义**对象类型**，Vue 3 中的 App 对象就是使用 interface 来定义的：

```ts
// packages/runtime-core/src/apiCreateApp.ts
export interface App<HostElement = any> {
  version: string;
  config: AppConfig;
  use(plugin: Plugin, ...options: any[]): this;
  mixin(mixin: ComponentOptions): this;
  component(name: string): Component | undefined; // Getter
  component(name: string, component: Component): this; // Setter
  directive(name: string): Directive | undefined;
  directive(name: string, directive: Directive): this;
}
```

## 相同点

- 类型别名和接口都能用来**描述对象或者函数**

```ts
type Point = {
  x: number;
  y: number;
};

type SetPoint = (x: number, y: number) => void;
```

在以上代码中，我们通过 type 关键字为**对象字面量**类型和**函数**类型分别取了一个别名，从而方便在其他地方使用这些类型。

用 **interface** 实现上面同样的结果

```ts
interface Point {
  x: number;
  y: number;
}

interface SetPoint {
  (x: number, y: number): void;
}
```

- type 和 interface 都支持扩展

type 类型通过 **&交叉运算符** 来扩展，而 interface 接口 通过 extends 实现扩展

```ts
type Person = {
  name: string;
};
type Older = Person & {
  hobby: string;
};

interface Child {
  name: string;
}
interface Student extends Child {
  hobby: string;
}
```

还有：接口也可以通过 extends 来扩展类型别名定义的类型：

```ts
type Person1 = {
  name: string;
};
interface Student extends Person1 {
  hobby: string;
}
```

同样，类型别名也阔以通过交叉运算符 **(&)** 扩张接口定义的类型

```ts
interface Child {
  name: string;
}
type Older1 = Person & {
  hobby: string;
};
```

## 不同点

- type 类型别名阔以为基本数据类型/联合类型/元祖类型定义别名，interface 接口不行

```ts
type NumberT = number;
type MyUnion = number | string;
type MyTuple = [number, number];
```

- interface 能自动合并**同名接口**， type 不行,同名类型别名会冲突

```ts
interface User {
  name: string;
}
interface User {
  id: number;
}
let user: User = { id: 666, name: '阿宝哥' };
user.id; // 666
user.name; // "阿宝哥"
```

- **条件类型 a extends b ? c : d 仅仅支持在 type 关键字中使用 extends，interface 中不行**

```ts
type Equal<A, B> = (<T>(arg: A) => T extends A ? 1 : 2) extends <T>(arg: B) => T extends B ? 1 : 2
  ? true
  : false;
type HasInclude<A extends unknown[], B> = A extends [infer F, ...infer R]
  ? Equal<B, F> extends true
    ? true
    : HasInclude<R, B>
  : false;
```

## 实际应用场景

## 膜拜大佬

- [type 和 interface 傻傻分不清楚？](https://mp.weixin.qq.com/s/C-n1vkfv2pATT2fjdNLjmQ)
