---
title: handwritingTs.md
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

感谢[黄子毅大佬提供的技术文章](https://mp.weixin.qq.com/s/QtlViS4uV0iUfO7f6F9Myw)以及[神光的 TypeScript 类型体操通关秘籍](https://juejin.cn/book/7047524421182947366/section/7061895757581778984)

### 实现索引类型 key 和 value 互换

```ts
type Transform1<T extends Record<any, any>> = {
  [K in keyof T as `${T[K]}`]: K;
};
type T1011 = {
  name: 'Cpp';
  age: 20;
};
type T111 = Transform<T101>;
// type T11 = {
//     Cpp: "name";
//     20: "age";
// }
```

### 转换，修改索引名,改变属性名

```ts
interface Test {
  name: string;
  age: number;
  getName?: () => void;
}
type ChangeName1<T> = {
  [K in keyof T as `cpp${Capitalize<K & string>}`]: T[K];
};
type T1012 = ChangeName1<Test>;
// type T10 = {
//     cppName: string;
//     cppAge: number;
//     cppGetName?: (() => void) | undefined;
// }
```

### 根据键的属性来过滤索引类型

```ts
interface Test1 {
  name: string;
  age: number;
  getName: () => void;
}
type FilterByString1<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};
type T81 = FilterByString1<Test1>;
// {name: string}
type FilterByParams1<T, P> = {
  [K in keyof T as T[K] extends P ? K : never]: T[K];
};
type T91 = FilterByParams1<Test1, Function>;
// type T91 = {
//     getName: () => void;
// }
// 另外一种实现方式 不过稍微复杂点
type FunctionPropertyName1<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];
type T92 = FunctionPropertyName1<Test1>;
type T93 = Pick<Test1, T92>;
// type T93 = {
//     getName: () => void;
// }
```

### 获取元素首个数据类型

```ts
type arr11 = ['a', 'b', 'c'];
type arr22 = [3, 2, 1];

type First1<T extends unknown[]> = T extends [infer F, ...infer P] ? F : never;
type head11 = First1<arr1>; // expected to be 'a'
type head22 = First1<arr2>; // expected to be 3
```

### 手写 Record 类型

```ts
interface Test {
  name: string;
  age: number;
  getName?: () => void;
}
type MyRecord1<K extends string | number | symbol, T extends {}> = {
  [P in K]: T;
};
type T61 = MyRecord<'hobby', Test>;
const t61: T6 = {
  hobby: {
    name: '111',
    age: 31,
  },
};
```

### 手动实现 Pick

```ts
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = MyPick<Todo, 'title' | 'completed'>;

const todo: TodoPreview = {
  title: 'Clean room',
  completed: false,
};

type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```

### 实现类型 Length<T> 获取元组长度:

```ts
type tesla = ['tesla', 'model 3', 'model X', 'model Y'];
type spaceX = ['FALCON 9', 'FALCON HEAVY', 'DRAGON', 'STARSHIP', 'HUMAN SPACEFLIGHT'];

type teslaLength = Length<tesla>; // expected 4
type spaceXLength = Length<spaceX>; // expected 5
type Length<T extends unknown[]> = T['length'];
type Length2<T extends unknown[]> = T extends [...infer R] ? R['length'] : never;
type T21 = Length2<tesla>;
// type T21 = 4
```

### 实现类型 Exclude<T, U>，返回 T 中不存在于 U 的部分

```ts
type T24 = 'a' | 'b' | 'c';
type T23 = 'a' | 'b';
type Exclude1<T, U> = T extends U ? never : T;
type T25 = Exclude1<T24, T23>;
// type T25 = "c"
```

### 实现类型 Awaited，比如从 Promise<ExampleType> 拿到 ExampleType

```ts
type T26 = Promise<[Promise<{ name: 'cpp' }>, 2, 3]>;
type MyPromise<T> = T extends Promise<infer A> ? A : never;
type T27 = MyPromise<T26>;
```

还需要考虑嵌套 Promise 类型

```ts
type T28 = Promise<[1, 2, 3]>;
type MyAwaited<T extends Promise<unknown>> = T extends Promise<infer A>
  ? A extends Promise<unknown>
    ? MyAwaited<A>
    : A
  : never;

type T29 = MyAwaited<T28>;
type P1 = Promise<[3, 4]>;
type T30 = MyAwaited<Promise<P1>>;
// type T29 = [1, 2, 3]
// type T30 = [3, 4]
```

### 实现类型 If<Condition, True, False>，当 C 为 true 时返回 T，否则返回 F：

```ts
type A = If<true, 'a', 'b'>; // expected to be 'a'
type B = If<false, 'a', 'b'>; // expected to be 'b'
type If<B extends Boolean, A, C> = B extends true ? A : C;
```

### 用类型系统实现 Concat<P, Q>，将两个数组类型连起来

```ts
type Result = Concat<[1], [2]>; // expected to be [1, 2]
type Concat<A extends unknown[], B extends unknown[]> = [...A, ...B];
type T31 = Concat<[1, [2, 3]], [4]>;
type Concat2<A, B> = [...(A extends any[] ? A : [A]), ...(B extends any[] ? B : [B])];
// 如何实现数组的多重解构之后的组合？？
```

### 用类型系统实现 Includes<T, K> 函数：

```ts
type isPillarMen = Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Kars'>; // expected to be `false`
type Includes1<T extends any, B extends string> = B extends T ? true : false;

type isT32 = Includes1<'Kars' | 'Esidisi' | 'Wamuu' | 'Santana', 'Kars'>; // expected to be `false`
type Includes<T extends any[], A> = A extends T[number] ? true : false;
type T33 = Includes<['a', 'b'], 'c'>;
type T34 = Includes<[boolean], false>;
type T35 = Includes<[boolean], true>;
```

原因很简单，true、false 都继承自 boolean，所以 extends 判断的界限太宽了，题目要求的是精确值匹配，故上面的答案理论上是错的。

```ts
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
  ? true
  : false;
type T36 = Equal<boolean, false>;
```

采用递归 + infer + 解构的方式遍历每一个是否相等然后得出结论

```ts
type Includess<T extends any[], A> = T extends [infer F, ...infer R]
  ? Equal<F, A> extends true
    ? true
    : Includess<R, A>
  : false;

type T37 = Includess<[boolean], true>; // type T37 = false
```

### 实现 Push<T, K> 函数：

```ts
type Result1 = Push<[1, 2], '3'>; // [1, 2, '3']
type Push<T extends any[], A> = [...T, A];
```

### 实现 Unshift<T, K> 函数：

```ts
type Result2 = Unshift<[1, 2], 0>; // [0, 1, 2,]
type Unshift<T extends any[], A> = [A, ...T];
```

### 实现内置函数 Parameters：

```ts
type Parameters1<T extends (...args: any) => void> = T extends (...arg: infer P) => void
  ? P
  : never;
function SayName(name: string): string | number {
  return 'cpp' + name;
}
type T38 = Parameters1<typeof SayName>;
// type T38 = [name: string]
```

### 实现内置函数 ReturnTypes

```ts
function SayName1(name: string): string | number {
  return 'cpp' + name;
}
type ReturnType2<T extends (...args: any) => void> = T extends (...arg: any) => infer R ? R : never;
type T39 = ReturnType2<typeof SayName1>;
// type T39 = string | number
```

### 实现 PopArr 数组去掉最后一个元素

```ts
type T40 = [1,2,3]
type T41 = PopArr<T40>
type PopArr<T extends unknown[]> = T extends [...infer F, infer L]
  ? F extends any[] ? F
  : L
```

### 实现 ShiftArr 数组去掉首个元素

```ts
type T42 = ShiftArr<T40>;
type ShiftArr<T extends unknown[]> = T extends [] ? [] : T extends [unknown, ...infer L] ? L : T;
```

### 通过模式匹配判断字符串是否以某个前缀开头 StartsWith

```ts
type T43 = 'cpp_wmh';
type StartsWith<T extends string, Prefix extends string> = T extends `${Prefix}${string}`
  ? true
  : false;
type T44 = StartsWith<T43, 'cpp'>; // true
type T45 = StartsWith<T43, 'wmh'>; // false
```

### Replace

```ts
type Replace<T, A extends string, B extends string> = T extends `${infer Prefix}${A}${infer Suffix}`
  ? `${Prefix}${B}${Suffix}`
  : T;
type T46 = Replace<'Cpp is ?!', '?!', 'WMH'>; // type T46 = "Cpp is WMH"
type T47 = Replace<'Cpp is', 'a', 'WMH'>; // type T47 = "Cpp is"
```

### Trim

```ts
type TrimStrRight<Str extends string> = Str extends `${infer Rest}${' ' | '\n' | '\t'}`
  ? TrimStrRight<Rest>
  : Str;
type T48 = TrimStrRight<'cpp 11 '>; // type T48 = "cpp"
```
