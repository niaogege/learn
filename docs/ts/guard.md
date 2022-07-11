---
title: typeof以及类型守护
order: 9
group:
  order: 0
  title: TS
  path: /interview/ts
nav:
  order: 3
  title: 'interview'
  path: /interview
---

## typeof

### typeof 获取对象类型

```ts
const lolo = {
  name: 'lolo',
  age: 7,
  address: {
    province: '福建',
    city: '厦门',
  },
};
type TT01 = typeof lolo;
type TTA = TT01['address'];
// type TTA = {
//     province: string;
//     city: string;
// }
```

### 对枚举类型使用 typeof 操作符。但这往往没有多大的实际用途，处理枚举类型时，一般还会搭配 keyof 操作符：

```ts
enum HttpMethod {
  Get,
  Post,
  Delete,
}
type Method = keyof typeof HttpMethod;
// type Method = "Get" | "Post" | "Delete"
```

利用 keyof 和 typeof 操作符，你就可以获取枚举类型的所有属性名

### 利用 typeof 获取函数对象类型

typeof 操作符还有另一个比较常见的使用场景。即利用它来获取函数对象的类型，在获取对应的函数类型之后，你可以继续利用 TypeScript 内置的 ReturnType 和 Parameters 工具类型来分别获取函数的返回值类型和参数类型：

```ts
function add(a: number, b: number): number {
  return a + b;
}
type Tadd = typeof add;
type TaddParamter = Parameters<Tadd>;
// type TaddParamter = [a: number, b: number]
type TaddReturn = ReturnType<Tadd>;
// type TaddReturn = number
```

处理 class 对象

```ts
class TestT {
  a: number;
  b: number;
  constructor(x: number, y: number) {
    this.a = x;
    this.b = y;
  }
}
function Testdeom(Constructor: typeof TestT, x: number, y: number) {
  return new Constructor(x, y);
}
```

typeof 获取 TestT 类对应的构造签名,从而实现相应的类型校验。在定义 **Constructo**r 参数类型时，如果不使用 typeof 操作符的话，将会出现以下错误信息：

```ts
function Testdeom1(Constructor: TestT, x: number, y: number) {
  return new Constructor(x, y); //  Type 'TestT' has no construct signatures 类型没有构造函数签名
}
```

### as const 获得更精确的类型

在使用 typeof 操作符的过程中，如果你想要获取更精确的类型，那么你可以结合 TypeScript 3.4 版本中引入的 const 断言。具体的使用方式如下：

```ts
let dconst = 'cpp';
let deconst = 'wmh' as const;
type TT002 = typeof dconst; // type TT002 = string
type TT003 = typeof deconst; // type TT003 = "wmh"

let Cpp = {
  name: 'cpp',
  age: 30,
};
let Wmh = {
  name: 'wmh',
  age: 23,
} as const;

type CppType = typeof Cpp;
// type CppType = {
//     name: string;
//     age: number;
// }
type WmhType = typeof Wmh;
// type WmhType = {
//     readonly name: "wmh";
//     readonly age: 23;
// }
```

由以上结果可知，使用 const 断言之后，再利用 typeof 操作符，我们就可以获得更精确的类型。

> as const 只能用在实例之后声明，不能用在类型之后

```ts
const list = [
  { name: 'a', val: 1 },
  { name: 'b', val: 2 },
  { name: 'c', val: 3 },
] as const;
type PicKName<T extends readonly unknown[] = []> = T[number] extends { name: infer N } ? N : never;
type NameList = PicKName<typeof list>;
// type NameList = "a" | "b" | "c"
```

## 类型保护

类型保护是可执行运行时检查的一种表达式，用于确保该类型在一定的范围内。换句话说，类型保护可以保证一个字符串是一个字符串，尽管它的值也可以是一个数值。类型保护与特性检测并不是完全不同，其主要思想是尝试检测属性、方法或原型，以确定如何处理值。目前主要有四种的方式来实现类型保护：

### 关键词 in

```ts
interface Admin {
  name: string;
  privileges: string[];
}

interface Employee {
  name: string;
  startDate: Date;
}

type UnknownEmployee1 = Employee | Admin;

function printEmployeeInformation(emp: UnknownEmployee1) {
  console.log('Name: ' + emp.name);
  // in 关键词
  // if ("privileges" in emp) {
  //   console.log("Privileges: " + emp.privileges);
  // }
  if (isCheckE(emp)) {
    console.log('Privileges: ' + emp.privileges);
  }
  if ('startDate' in emp) {
    console.log('Start Date: ' + emp.startDate);
  }
}

function isCheckE(emp: UnknownEmployee1): emp is Admin {
  return 'privileges' in emp;
}

function isCheckS(emp: UnknownEmployee1): emp is Employee {
  return 'startDate' in emp;
}
```

### typeof 关键字

```ts
function padLeft(value: string, padding: string | number) {
  if (typeof padding === 'number') {
    return Array(padding + 1).join(' ') + value;
  }
  if (typeof padding === 'string') {
    return padding + value;
  }
  throw new Error(`Expected string or number, got '${padding}'.`);
}
```

typeof 类型保护只支持两种形式：**typeof v === "typename"** 和 **typeof v !== typename**，"typename" 必须是 "number"， "string"， "boolean" 或 "symbol"。

### instanceof 关键字

```ts
interface CppUser {
  getName(): string;
}
class InstanceCpp implements CppUser {
  constructor(private num: number) {}
  getName() {
    return Array(this.num).join('');
  }
}
class InstanceCpp2 implements CppUser {
  constructor(private value: string) {}
  getName() {
    return this.value;
  }
}

let user11: CppUser = new InstanceCpp(111);
let user22: CppUser = new InstanceCpp2('cpp');
if (user1 instanceof InstanceCpp) {
  console.log(user11.getName);
}
```

### 自定义类型保护的类型谓词（type predicate）

```ts
function isNumber1(x: any): x is number {
  return typeof x === 'number';
}
```

### 类型谓词

```ts
interface Vehicle {
  move: (distance: number) => void;
}

class Car implements Vehicle {
  move = (distance: number) => {
    // Move car…
  };

  turnSteeringWheel = (direction: string) => {
    // Turn wheel…
  };
}

class VehicleController {
  vehicle: Vehicle;
  constructor(vehicle: Vehicle) {
    this.vehicle = vehicle;
  }
}

const car = new Car();
const vehicleController = new VehicleController(car);

const { vehicle } = vehicleController;
vehicle.turnSteeringWheel('left');

if (vehicle instanceof Car) {
  vehicle.turnSteeringWheel('left');
}

function isCheckCar(ve: any): ve is Car {
  return (ve as Car).turnSteeringWheel !== undefined;
}

if (isCheckCar(vehicle)) {
  vehicle.turnSteeringWheel('left');
}
```

### 通用自定义类型保护

自定义类型保护的主要特点是：

- 返回类型谓词，如 **vehicle is Car**；// vehicle is Car，这就是我们前面所说的 "类型谓词"。
- 包含可以准确确定给定变量类型的逻辑语句，如 **(vehicle as Car).turnSteeringWheel !== undefined**

对于基本数据类型来说，我们也可以自定义类型保护来保证类型安全，比如

```ts
type TIs = 'Cpp';
const isNumber2 = (val: any): val is Number => {
  return typeof val === 'number';
};
function TIs(val) {
  if (isNumber2(val)) {
    console.log(111);
  }
}
TIs(111);
// 统一处理
function isOfType<T>(obj: any, props: keyof T): obj is T {
  return (obj as T)[props] !== undefined;
}

if (isOfType<Car>(vehicle, 'turnSteeringWheel')) {
  vehicle.turnSteeringWheel('left');
}

type TIs1 = 'cpp' | 'wmh';
function isOne(a: any): a is TIs1 {
  return a !== undefined;
}
```

有了 isOfType 通用的类型保护函数之后，你不必再为每个要检查的类型编写唯一的类型保护函数。

## 参考大佬整理笔记

- [在 TS 中如何实现类型保护？类型谓词了解一下](https://mp.weixin.qq.com/s/nq3bxIbyFJPqs-hXRmfqnQ)
