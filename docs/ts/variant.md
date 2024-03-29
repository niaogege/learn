---
title: 逆变和协变以及类型收窄和宽泛
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

## 类型兼容性

集合论中，如果一个集合 A 的所有元素在集合 B 中都存在，则 A 是 B 的子集；

类型系统中，**如果一个类型的属性更具体，则该类型是子类型**。（因为属性更少则说明该类型约束的更宽泛，是父类型）

基于类型的可赋值性/逆变/协变/双向协变

### 可赋值性

```ts
interface Animals {
  name: string;
}

interface Dog extends Animals {
  break(): void;
}

let A: Animals;
let B: Dog;
// B阔以赋值给A, 子类型阔以赋值给父类型
A = B;
// 反过来不行
// B = A
```

### 可赋值性在联合类型中的特性

```ts
type AA = 1 | 2 | 3;
type BB = 1 | 2;
let A2: AA;
let B2: BB;
// 不可赋值
B2 = A2;
// 可赋值
A2 = B2;
```

是不是 A 的类型更多，A 就是子类型呢？恰恰相反，A 此处类型在联合类型中更多是表达的类型更宽泛，所以 A 是父类型，B 是子类型。

因此 b = a 不成立（父类型不能赋值给子类型），而 a = b 成立（子类型可以赋值给父类型）。

## 概念

这种类型安全的限制也不能太死板，有的时候需要一些变通，比如子类型是可以赋值给父类型的变量的，可以完全当成父类型来使用，也就是 **型变（variant)**（类型改变）。

这种“型变”分为两种，一种是子类型可以赋值给父类型，叫做**协变**（covariant），一种是父类型可以赋值给子类型，叫做**逆变**（contravariant）。

## 协变

术语解释：

简单说就是，具有父子关系的多个类型，在通过某种**构造关系**构造成的新的类型，如果还具有父子关系则是协变的，而关系逆转了（子变父，父变子）就是逆变的

**子类型赋值给父类型**,比如下面实例中的 **person = CppPerson**

```ts
type User1 = {
  id: number;
  name: string;
};

type InferUser1<T> = T extends { id: infer U; name: infer U } ? U : T;
type GetUser1 = InferUser1<User1>; // string | number
```

这是因为在协变位置上，若同一个类型变量存在多个候选者，则最终的类型将被推断为联合类型。

在看一个示例

```ts
interface User {
  id: number;
  name: string;
}
interface CPP {
  id: number;
  name: string;
  hobby: string;
}
```

这时候 CPP 是 User2 类型的子类型，**更具体**，那么 CPP 类型就能赋值给 User2 类型

**更具体的子类型能赋值给宽泛的父类型**

```ts
let personT1: User = {
  id: 31,
  name: 'person',
};
let CppPerson: CPP = {
  id: 31,
  name: 'person',
  hobby: 'shufa',
};
// ok 兼容，可以赋值
personT1 = CppPerson;

// 类型 "User2" 中缺少属性 "hobby"，但类型 "CPP" 中需要该属性。
// CppPerson = personT;

let PP1: Array<User>;
let CC1: Array<CPP>;
// ok
PP1 = CC1;
```

通过 PP1 和 CC1 来看，在 User 和 CPP 变成数组类型后，`Array<CPP>`依旧可以赋值给 `Array<User>`，因此对于 type MakeArray = **Array<any**>来说就是**协变**的。

> 函数返回值应该是协变

## 逆变

**父类型赋值给子类型**

逆变位置上，若同一个类型变量存在多个候选者，则最终的类型将被推断为交叉类型。同样，我们来实际验证一下

```ts
type Bar = {
  a: (x: string) => void;
  b: (x: number) => void;
};
type InferBar<T> = T extends {
  a: (x: infer U) => void;
  b: (x: infer U) => void;
}
  ? U
  : never;
type GetBar = InferBar<Bar>; // never
```

看一个示例

函数的参数有逆变的性质，即父类型参数阔以赋值给子类型参数（而返回值是协变的，也就是子类型可以赋值给父类型）

```ts
let cppF: (cpp: CPP) => void;

cppF = (cpp) => {
  console.log(cpp.hobby);
};

let personF: (person: User) => void;

personF = (person) => {
  console.log(person.name);
};
// ok 父类型的参数赋值给子类型的参数
cppF = personF;
// 反过来不行
personF = cppF;
```

在看一个示例

```ts
interface Animal {
  name: string;
}

interface Dog extends Animal {
  break(): void;
}

type AnimalFn = (arg: Animal) => void;
type DogFn = (arg: Dog) => void;

let animal: AnimalFn = (arg: Animal) => {};
let dog: DogFn = (arg: Dog) => {};
// 假设类型安全设置
animal = dog;
// 那么animal在调用时约束的参数，缺少dog所需的参数，此时会导致错误
animal({ name: 'cpp' }); // 缺少break方法
```

从这个例子看到，如果 dog 函数赋值给 animal 函数，那么 animal 函数在调用时，约束的是参数必须要为 Animal 类型（而不是 Dog），但是 animal 实际为 dog 的调用，此时就会出现错误。因此，Animal 和 Dog 在进行**type Fn<T> = (arg: T) => void**构造器构造后，父子关系逆转了，此时成为**逆变**。

逆变有啥用途？？

```ts
// 联合转交叉
type TT03 = { name: 'cpp' } | { name: 'wmh' };
type TT04 = UnionToInter<TT03>;
type UnionToInter<T> = (T extends T ? (x: T) => unknown : never) extends (x: infer R) => unknown
  ? R
  : never;
```

### 双向协变

Ts 在函数参数的比较中实际上默认采取的策略是双向协变：只有当源函数参数能够赋值给目标函数或者反过来时才能赋值成功。这是不稳定的，因为调用者可能传入了一个具有更精确类型信息的函数，但是调用这个传入的函数的时候却使用了不是那么精确的类型信息（典型的就是上述的逆变）。 但是实际上，这极少会发生错误，并且能够实现很多 JavaScript 里的常见模式：

```ts
interface EventListener {
  (evt: Event): void;
}
interface Event {
  readonly target: EventTarget | null;
  preventDefault(): void;
}

interface MouseEvent extends Event {
  readonly x: number;
  readonly y: number;
}

interface Window {
  addEventListener(type: string, listener: EventListener);
}

window.addEventListener('click', (e: Event) => {});
window.addEventListener('mouseout', (e: MouseEvent) => {});
```

可以看到 Window 的 listener 函数要求参数是 Event，但是日常使用时更多时候传入的是 Event 子类型(更具体)。但是这里可以正常使用，正是其默认行为是**双向协变**的原因。可以通过 tsconfig.js 中修改**strictFunctionType**属性来严格控制协变和逆变。

## 巩固下

函数参数是具有逆变性质，返回值是具有协变

```ts
type Func = (a: string) => void;

const func: Func = (a: 'hello') => undefined; // 不能将类型“string”分配给类型“"hello"”
```

参数的位置是逆变的，即父类型赋值给子类型 ,也就是 实例函数参数 要是 函数参数的子类型，而 string 不是 'hello' 的子类型，所以报错了。(hello 不是 string 的父类型)

返回值的位置是协变的，即子类型赋值给父类型，void 阔以赋值给 undefined, (void： 父类型, undefined: 子类型)

改造下

```ts
type Func1 = (a: 'hello') => void;
const func1: Func1 = (a: string) => undefined;
```

## 不变（invariant）

非父子类型之间不会发生型变，只要类型不一样就会报错：

```ts
interface User2 {
  name: string;
  sex: string;
}

var user1: User2 = {
  name: 'cpp',
  sex: 'human',
};

interface User {
  id: number;
  name: string;
}
var user2: User = {
  id: 1,
  name: 'cpp',
};
// user2 = user1 // error
```

## 类型父子系统

只要结构上是一致的，那么就可以确定父子关系，这种叫做结构类型系统（structual type）。

双方都有共同熟悉，且类型更具体的则阔以成为子类型,举例

```ts
type TT1 = 'a' | 'b';
type TT2 = 'a' | 'b' | 'c';
type res = TT1 extends TT2 ? true : false; // type res = true
```

## 类型收窄

TypeScript 类型收窄就是从宽类型转换成窄类型的过程。类型收窄常用于处理联合类型变量的场景，一个常见的例子是非空检查：

宽类型和窄类型？比如父类型 宽泛，子类型，更具体则就是窄类型

有许多方法可以收窄变量的类型。比如使用 **instanceof** 运算符：

```ts
function container(text: string, search: string | RegExp) {
  if (search instanceof RegExp) {
    return !!search.exec(text);
  }
  return text.includes(search);
}
```

属性检查也是阔以的

```ts
interface Admin {
  name: string;
  privileges: string[];
}

interface Employee {
  name: string;
  startDate: Date;
}

type UnknownEmployee = Employee | Admin;

function print(emp: UnknownEmployee) {
  if ('privileges' in emp) {
    console.log(emp.privileges);
  }
}
```

使用一些内置的函数，比如 **Array.isArray** 也能够收窄类型

帮助类型检查器缩小类型的另一种常见方法是在它们上放置一个明确的 “标签”：

```ts
interface UploadEvent {
  type: 'upload';
  filename: string;
  contents: string;
}

interface DownloadEvent {
  type: 'download';
  filename: string;
}
type Appevent = UploadEvent | DownloadEvent;
function findItem(item: Appevent) {
  switch (item.type) {
    case 'download':
      console.log(item.filename);
      break;
    case 'upload':
      console.log('222');
  }
}
```

如果 TypeScript 不能识别出类型，你甚至可以引入一个**自定义函数**来帮助它：

```ts
function isInput(el: HTMLElement): el is HTMLInputElement {
  return 'value' in el;
}

function getVal(el: HTMLElement) {
  if (isInput(el)) {
    return el.value;
  }
}
```

用户定义的类型保护，`el is HTMLInputElement`，作为返回类型告诉类型检查器，如果函数返回 true，则 el 变量的类型就是 HTMLInputElement。

> 类型保护是可执行运行时检查的一种表达式，用于确保该类型在一定的范围内。 换句话说，类型保护可以保证一个字符串是一个字符串，尽管它的值也可以是一个数值。类型保护与特性检测并不是完全不同，其主要思想是尝试检测属性、方法或原型，以确定如何处理值。

### 全面性检查

在 TypeScript 中我们可以利用**类型收窄和 never 类型**的特性来全面性检查，比如：

```ts
type TF1 = string | number;
function controlAnalysis(foo: TF2) {
  if (typeof foo === 'string') {
    return foo;
  } else if (typeof foo === 'number') {
    return 1 + foo;
  } else {
    const check: never = foo; // 'check' is declared but its value is never read.
  }
}
type TF2 = string | number | boolean;
```

## 类型宽泛

```ts
let a = null; // let a: any
let b = undefined; // let b: any
let c = { x: 0, y: null };
// let c: {
//     x: number;
//     y: any;
// }
let d = [null, undefined]; // let d: any[]
```

在运行时，每个变量都有一个值。但是在静态分析时，当 TypeScript 检查你的代码时，变量含有一组可能的值和类型。当你使用常量初始化变量但不提供类型时，**类型检查器**需要确定一个。换句话说，它需要根据你指定的单个值来确定一组可能的值。在 TypeScript 中，此过程称为拓宽。理解它可以帮助你理解错误并更有效地使用类型注释。

```ts
interface Vector3 {
  x: number;
  y: number;
  z: number;
}

function getComponent(vector: Vector3, axis: 'x' | 'y' | 'z') {
  return vector[axis];
}

let x = 'x'; // let x: string
let vec = { x: 10, y: 20, z: 30 };

// Argument of type 'string' is not assignable to parameter of type
// '"x" | "y" | "z"'.(2345)
getComponent(vec, x); // Error
```

TypeScript 提供了一些控制拓宽过程的方法。其中一种方法是使用 const。如果用 const 而不是 let 声明一个变量，那么它的类型会更窄。事实上，使用 const 可以帮助我们修复前面例子中的错误：

```ts
const x1 = 'x'; // const x1: "x"
getComponent(vec, x1); // Error
```

TypeScript 试图在具体性和灵活性之间取得平衡。它需要推断一个足够具体的类型来捕获错误，但又不能推断出错误的类型。它通过属性的初始化值来推断属性的类型，当然有几种方法可以覆盖 TypeScript 的默认行为。一种是提供显式类型注释：

```ts
const obj: { x: 1 | 3 } = {
  x: 1,
};
obj.x = 11; // Type '11' is not assignable to type '1 | 3'
```

另一种方法是使用 const 断言。不要将其与 let 和 const 混淆，后者在值空间中引入符号。这是一个纯粹的类型级构造。让我们来看看以下变量的不同推断类型：

```ts
// Type is { x: number; y: number; }
const obj1 = {
  x: 1,
  y: 2,
};

// Type is { x: 1; y: number; }
const obj2 = {
  x: 1 as const,
  y: 2,
};

// Type is { readonly x: 1; readonly y: 2; }
const obj3 = {
  x: 1,
  y: 2,
} as const;

const arr1 = [1, 2, 3]; // const arr1: number[]
const arr2 = [1, 2, 3] as const; // const arr2: readonly [1, 2, 3]
```

当你在一个值之后使用 const 断言时，TypeScript 将为它推断出最窄的类型，没有拓宽。对于真正的常量，这通常是你想要的。当然你也可以对数组使用 const 断言：

### 非拓宽字面量类型的用处

可以通过显式地将变量标注为字面量类型来创建非拓宽字面量类型的变量：

```ts
const https: 'https' = 'https'; // const https: "https"
const http: 'http' = 'http'; // const http: "http"
```

将含有非拓宽字面量类型的变量赋给另一个变量时，比如以下示例中的 widenedStringLiteral 变量，该变量的类型不会被拓宽：

```ts
let https1 = https; // let https1: "https"

const test1 = 'test1';
const test2 = 'test2';
const arr = [test1, test2];
```

TypeScript 推断出 arr 的类型是 string[]。因此数组元素 first 和 second 的类型被认为是 string 类型。字面量类型 "test1" 和 "test2" 的概念在拓宽过程中丢失了

但是如果你显式指定常量的类型则 arr 的类型推断就是

```ts
const test11: 'test1' = 'test1';
const test22: 'test2' = 'test2';
const arr11 = [test11, test22]; // const arr11: ("test1" | "test2")[]
```

假设出于某种原因，我们希望保留数组中字符串字面量类型的位置信息，这时我们可以显式地将 protocols 的类型设置为元组类型：

```ts
// Type "http" (widening)
const http1 = 'http';
// Type "https" (widening)
const https2 = 'https';

// Type ["http", "https"]
const protocols: ['http', 'https'] = [http1, https2];

// Type "http" (non-widening)
const first = protocols[0];
// Type "https" (non-widening)
const second = protocols[1];
```

现在，first 和 second 变量的类型被推断为各自的非拓宽字符串字面量类型。

## 膜拜大佬

- [深入 TypeScript 中的子类型、逆变、协变，进阶 Vue3 源码前必须搞懂的。](https://juejin.cn/post/6855517117778198542)
- [类型拓宽](https://mp.weixin.qq.com/s/hax038JDtgGX7orpRCNIfg)
- [Ts 高手篇：22 个示例深入讲解 Ts 最晦涩难懂的高级类型工具](https://juejin.cn/post/6994102811218673700#heading-1)
