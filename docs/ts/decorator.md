---
title: 装饰器与反射元数据
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

## 装饰器 Decorator

首先我们需要明确的是，装饰器的**本质其实就是一个函数**，只不过它的**入参是提前确定好的**。同时，TypeScript 中的**装饰器目前只能在类以及类成员上**使用。

这样的装饰器只能起到固定的功能，我们实际上使用更多的是 Decorator Factory，即装饰器工厂的形式：

```ts
function Deco() {
  return () => {};
}
@Deco()
class Cpp {}
```

在这种情况下，程序执行时会先执行 Deco() ，再用内部返回的函数作为装饰器的实际逻辑。

TypeScript 中的装饰器可以分为类装饰器、方法装饰器、访问符装饰器、属性装饰器以及参数装饰器五种，最常见的主要还是类装饰器、方法装饰器以及属性装饰器。接下来，我们会依次介绍这几种装饰器的具体使用。

### 类装饰器

```ts
// lib.es5.d.ts(1493, 14)
declare type ClassDecorator = <TFunction extends Function>(target: TFunction) => TFunction | void;
```

类装饰器是直接作用在类上的装饰器，它在执行时的入参只有一个，那就是这个**类本身**（**而不是类的原型对象**）。因此，我们可以通过类装饰器来覆盖类的属性与方法，如果你在类装饰器中返回一个新的类，它甚至可以篡改掉整个类的实现。

```ts
const OverrideBar = (target: any) => {
  return class extends target {
    print() {}
    overridedPrint() {
      console.log('This is Overrided Bar!');
    }
  };
};
@OverrideBar
class Bar {
  print() {
    console.log('This is Bar!');
  }
}

// 被覆盖了，现在是一个空方法
new Bar().print();

// This is Overrided Bar!
(<any>new Bar()).overridedPrint();
```

> 类装饰器的唯一参数 target 是类本身，target.prototype 上的属性才是会随着继承与实例化过程被传递的实例成员

我们在这里调用的方法并没有直接在 Foo 中定义，而是通过装饰器来强行添加！我们也可以在装饰中返回一个子类

下面是一个给目标类增加**静态属性** test 的例子

```ts
const decoratorClass = (target) => {
  target.test = '123';
  target.prototype.test = '实例属性';
};
@decoratorClass
class Test {}
Test.test; // '123'
const tt = new Test();
tt.test; // 实例属性
```

除了可以修改类本身，还可以通过修改原型，给实例增加新属性。下面是给目标类增加 speak 方法的例子：

```ts
const withSpeak = (targetClass) => {
  const prototype = targetClass.prototype;
  prototype.speak = function () {
    console.log('I can speak ', this.language);
  };
};
@withSpeak
class Student {
  constructor(language) {
    this.language = language;
  }
}
const student1 = new Student('Chinese');
const student2 = new Student('English');
student1.speak(); // I can speak  Chinese
student2.speak(); // I can speak  English
```

利用高阶函数的属性，还可以给装饰器传参，通过参数来判断对类进行什么处理。

```ts
const withLanguage = (language) => (targetClass) => {
  targetClass.prototype.language = language;
};
@withLanguage('Chinese')
class Student {}
const student = new Student();
student.language; // 'Chinese'
```

### 方法装饰器

看下 ts 类型定义,阔以看到入參三个参数，返回值阔以是一个 Object.defindeProperty()

```ts
declare type MethodDecorator = <T>(
  target: Object,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>,
) => TypedPropertyDescriptor<T> | void;

interface TypedPropertyDescriptor<T> {
  enumerable?: boolean;
  configurable?: boolean;
  writable?: boolean;
  value?: T;
  get?: () => T;
  set?: (value: T) => void;
}
```

方法装饰器的入参包括**类的原型**、**方法名**以及**方法的属性描述符**（PropertyDescriptor），而通过属性描述符你可以控制这个方法的内部实现（即 value）、可变性（即 writable）等信息。在执行原本方法的同时，插入一段新的逻辑，比如计算这个方法的执行耗时

```ts
class Foo {
  @ComputerTime()
  async fetch() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('RES');
      }, 3000)
    })
  }
}
function ComputerTime(): MethodDecorator {
  const start = new Date()
  return (_target, methodIdentifier, descriptor: TypedPropertyDescriptor<any>) => {
    const originM = descriptor.value!;
    descriptor.value = async (...args: unknown[]) => {
      const res = await originM.apply(this, args); // 执行原本的逻辑
      const end = new Date()
      console.log(
        `${String(methodIdentifier)} Time: `,
        end.getTime() - start.getTime()
      )
      return res
    }
  }
}
// 调用

(async () => {
  console.log(await new Foo().fetch());
})();

fetch Time:  3003
RES
```

> 需要注意的是，方法装饰器的 target 是类的原型而非类本身

实际案例防抖，debounce()

```ts
function debounceDecorator(time): MethodDecorator {
  let timer;
  return (target, name, descriptor: TypedPropertyDescriptor<any>) => {
    let originM = descriptor.value!;
    descriptor.value = function (...args: unknown[]) {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        originM.apply(this, args);
      }, time);
    };
  };
}
// 调用
class Cpp {
  componentDidMount() {
    window.addEveneListener('scroll', this.scroll);
  }
  componentWillUnmount() {
    window.removeEveneListener('scroll', this.scroll);
  }
  @debounceDecorator(200)
  scroll() {}
}
```

### 访问符装饰器

其实就是 get value(){} 与 set value(v)=>{} 这样的方法，其中 getter 在你访问这个属性 value 时触发，而 setter 在你对 value 进行赋值时触发。**访问符装饰器本质上仍然是方法装饰器**，它们使用的类型定义也相同。

需要注意的是，访问符装饰器只能同时应用在一对 getter / setter 的**其中一个**，即要么装饰 getter 要么装饰 setter 。这是因为，不论你是装饰哪一个，装饰器入参中的属性描述符都会包括 **getter 与 setter** 方法：

```ts
class Foo {
  _value!: string;

  get value() {
    return this._value;
  }

  @HijackSetter('LIN_BU_DU')
  set value(input: string) {
    this._value = input;
  }
}

function HijackSetter(val: string): MethodDecorator {
  return (target, methodIdentifier, descriptor: TypedPropertyDescriptor<any>) => {
    const originalSetter = descriptor.set;
    // 修改set
    descriptor.set = function (newValue: string) {
      const composed = `Raw: ${newValue}, Actual: ${val}-${newValue}`;
      originalSetter.call(this, composed);
      console.log(`HijackSetter: ${composed}`);
    };
    // or 篡改 getter，使得这个值无视 setter 的更新，返回一个固定的值
    // descriptor.get = function () {
    //   return val;
    // };
  };
}

const foo = new Foo();
foo.value = 'LINBUDU'; // HijackSetter: Raw: LINBUDU, Actual: LIN_BU_DU-LINBUDU
```

在这个例子中，我们通过装饰器劫持了 setter ，在执行原本的 setter 方法修改了其参数。同时，我们也可以在这里去劫持 getter（descriptor.get），这样一来在读取这个值时，会直接返回一个我们固定好的值，而非其实际的值（如被 setter 更新过的）。

### 属性装饰器

看下 ts 类型定义

```ts
declare type PropertyDecorator = (target: Object, propertyKey: string | symbol) => void;
```

属性装饰器在独立使用时能力非常有限，它的入参只有**类的原型与属性名称**，返回值会被忽略，但你仍然可以通过直接在类的**原型上赋值来修改属性**：

```ts
class Foo {
  @ModifyNickName()
  nickName!: string;
  constructor() {}
}
function ModifyNickName(): PropertyDecorator {
  return (target: any, propertyIdentifier) => {
    target[propertyIdentifier] = '林不渡!';
    target['otherName'] = '别名林不渡!';
  };
}
console.log(new Foo().nickName); // 林不渡
// @ts-expect-error
console.log(new Foo().otherName); // 别名林不渡!
```

### 参数装饰器

看下 ts 类型定义

```ts
declare type ParameterDecorator = (
  target: Object,
  propertyKey: string | symbol,
  parameterIndex: number,
) => void;
```

参数装饰器包括了构造函数的参数装饰器与方法的参数装饰器，它的入参包括**类的原型、参数名与参数在函数参数中的索引值**（即第几个参数），如果只是单独使用，它的作用同样非常有限。忽略返回值

```ts
class Foo {
  handler(@CheckParam() input: string) {
    console.log(input);
  }
}
function CheckParam(): ParameterDecorator {
  return (target, paramIdentifier, index) => {
    console.log(target, paramIdentifier, index);
  };
}
// {} handler 0
new Foo().handler('linbudu');
```

## 装饰器的执行机制

[装饰器的执行机制 Playground](https://www.typescriptlang.org/play?#code/GYVwdgxgLglg9mABAYQDYGcAUBKAXC1AQ3XQBEBTCOAJ0KhsQG8AoRRa8qEapTKQ6gHNO2RAF4AfE0QBfZnOahIsBIgCynABZwAJjnwao2nRSq161Jq3aduvfkJHipjWfOaLw0eEgAK1OAAHfUR-IPJqKABPUxo6BhY2Di4eRD4BYShRSSs2OQUlb1VfAUIAWxCS2jLOCNjzBOtkuzSHTOyXNwUAATQsbGYIIhJEADE4OFzEKjB0KGoQaBpMbqrynEQYMBgoAH58OeotwVFXBTZVgOCBtkCrg-nj8UQAclQtgCMQHRAXjwuwtdrHM6DAIIgQbAIICHkcwIJni9IWDEO8wF8fn9rN1DMYcNZNIQwDpUBEVmsKqItoEQFBYcdTv83Njcbp8WxkeDOQAJIkksmrUqUzZgGl0iGPeGM6z5DyDBBzRDACbPMDkADuYwmOAA3PLZnBSQA6VBwQSYZVwAYzdCG8gms0WiZGu5Ba0Ku0O83jOBGzmA7BAA)

```ts
function Deco(identifier: string): any {
  console.log(`${identifier} 执行`);
  return function () {
    console.log(`${identifier} 应用`);
  };
}

@Deco('类装饰器')
class Foo {
  constructor(@Deco('构造函数参数装饰器') name: string) {}

  @Deco('实例属性装饰器')
  prop?: number;

  @Deco('实例方法装饰器')
  handler(@Deco('实例方法参数装饰器') args: any) {}
}

// output
// 实例属性装饰器 执行
// 实例属性装饰器 应用
// 实例方法装饰器 执行
// 实例方法参数装饰器 执行
// 实例方法参数装饰器 应用
// 实例方法装饰器 应用
// 类装饰器 执行
// 构造函数参数装饰器 执行
// 构造函数参数装饰器 应用
// 类装饰器 应用
```

#### 多个同类装饰器的执行顺序

另外，我们也可以使用多个同种装饰器，比如一个类上可以有好多个类装饰器：

```ts
@Deprecated()
@User()
@Internal
@Provide()
class Foo {}
```

总结来说，很像洋葱模型，其顺序分为两步。首先，**由上至下**依次对装饰器的表达式求值，得到装饰器的实现。然后，这些装饰器的具体实现才会**从下往上**调用，如这里是 Provide、Internal、User、Deprecated 的顺序

## 反射 Reflect 和反射元数据 Reflect Metadata

### ES6 反射 Reflect

反射的核心要素：**在程序运行时去检查以及修改程序行为**，比如在代码运行时通过 Reflect.construct 实例化一个类，通过 Reflect.setPrototypeOf 修改对象原型指向，这些其实都属于反射 API

```js
class Foo {
  hello() {
    return 'hello cpp';
  }
}
const test = new Foo();
test.hello();
// 基于反射
const test1 = Reflect.construct(Foo, []);
const hello = Reflect.get(test1, 'hello');
Reflect.apply(hello, test1, []);
```

### Reflect Metadata 反射元数据

[Reflect Metadata playground](https://stackblitz.com/edit/ptdisn?file=src%2Freflect.ts,src%2Freflect1.ts,index.ts,src%2Freflect2.ts&view=editor)

反射元数据提案（即 "**reflect-metadata**" 包）为顶级对象 Reflect 新增了一批专用于元数据读写的 API，如 Reflect.defineMetadata、Reflect.getMetadata 等。那么元数据又是什么？你可以将元数据理解为用于**描述数据的数据**，如某个方法的**参数信息、返回值信息**就可称为该方法的元数据。

那么元数据又存储在哪里？静态成员的元数据信息存储于构造函数(类本身)，而实例成员的元数据信息存储于构造函数的原型上。

#### 元数据的注册与提取

```ts
import 'reflect-metadata';

class Foo {
  handler() {}
}

Reflect.defineMetadata('class:key1', 'class metadata', Foo);
Reflect.defineMetadata('method:key1', 'handler metadata', Foo, 'handler');
Reflect.defineMetadata('proto:method:key1', 'proto handler metadata', Foo.prototype, 'handler');

// [ 'class:key' ]
console.log(Reflect.getMetadataKeys(Foo));
// ['method:key']
console.log(Reflect.getMetadataKeys(Foo, 'handler'));
// ['proto:method:key'];
console.log(Reflect.getMetadataKeys(Foo.prototype, 'handler'));

// class metadata
console.log(Reflect.getMetadata('class:key1', Foo));
// handler metadata
console.log(Reflect.getMetadata('method:key1', Foo, 'handler'));
// proto handler metadata
console.log(Reflect.getMetadata('proto:method:key1', Foo.prototype, 'handler'));
```

defineMetadata 的入参包括元数据 **Key**、**元数据 Value**、**目标类 Target** 以及一个可选的属性，在这里我们的三个调用分别是在 Foo、Foo.handler 以及 Foo.prototype 上注册元数据。而提取则可以通过 getMetadata 方法：

#### 基于类型的元数据

反射元数据提案中内置了基于**类型**的元数据，你可以通过 **design:type**、design:paramtypes 以及 design:returntype 这三个内置的元数据 Key，获取到**类与类成员的类型**、**参数类型**、**返回值类型**

```ts
import 'reflect-metadata';
function DefineType(type: Object) {
  return Reflect.metadata('design:type', type);
}
function DefineParamTypes(...types: Object[]) {
  return Reflect.metadata('design:paramtypes', types);
}
function DefineReturnType(type: Object) {
  return Reflect.metadata('design:returntype', type);
}

@DefineParamTypes(String, Number)
class Foo {
  @DefineType(String)
  get name() {
    return 'linbudu';
  }
  @DefineType(Function)
  @DefineParamTypes(Number, Number)
  @DefineReturnType(Number)
  add(source: number, input: number): number {
    return source + input;
  }
}

const foo = new Foo();
const paramTypes = Reflect.getMetadata('design:paramtypes', foo, 'add');
// [ [Function: Number], [Function: Number] ]
console.log(paramTypes);

const returnTypes = Reflect.getMetadata('design:returntype', foo, 'add');
console.log(returnTypes); // [Function: Number]

const type = Reflect.getMetadata('design:type', foo, 'name');
console.log(type); // [Function: String]
```

#### 真实案例走一个

校验是否缺少必填字段以及入參数据类型是否准确

[playground User](https://stackblitz.com/edit/ptdisn?file=src%2Freflect.ts,index.ts,src%2Ftest.ts,src%2Freflect2.ts&view=editor)

有了装饰器、反射元数据以及内置的基于类型的元数据信息，我们就可以实现“委托”的能力了。以看似平平无奇的属性装饰器为例，我们使用元数据来实现基于装饰器的属性校验。

在这个例子里，我们会实现两种校验逻辑，对必填属性（Required）与属性类型的校验（String / Number / Boolean），其基本使用方式如下：

```ts
class User {
  @Required()
  name!: string;

  @ValueType(TypeValidation.Number)
  age!: number;
}

const user = new User();
user.age = '18';

// expected
```

我们会将 user 实例传递给校验方法，在这里应当给出两处错误：没有提供必填属性 name，以及 age 属性的类型不符。
