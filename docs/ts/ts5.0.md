---
title: TypeScript 5.0 beta 发布：新版 ES 装饰器、泛型参数的常量修饰、枚举增强等
order: 20
group:
  order: 0
  title: TS
  path: /interview/ts
nav:
  order: 3
  title: 'interview'
  path: /interview
---

来源于林不渡[TypeScript 5.0 beta 发布：新版 ES 装饰器、泛型参数的常量修饰、枚举增强等](https://juejin.cn/post/7194435148329254972?share_token=ff8630cd-b008-438d-8d24-f817a31fcdd9)

### Decorators

装饰器的本质就是一个函数，它能够动态地修改被装饰的类或类成员，在这些部分的值未定义时进行初始化，或在这里已有值时，在值实例化后执行一些额外的代码。

装饰器在被调用时会接受两个参数，并基于其返回值进行实际应用。一个最基本的装饰器类型定义大致是这样的：

```ts
type Input = PropertyKey;
type Output = PropertyKey;
type Decorator = (
  value: Input,
  context: {
    kind: string;
    name: string | symbol;
    access: {
      get?(): unknown;
      set?(value: unknown): void;
    };
    isPrivate?: boolean;
    isStatic?: boolean;
    addInitializer?(initializer: () => void): void;
  },
) => Output | void;
```

除了语义与参数地变化，在调用方面新版的装饰器也进行了一些调整

- 类表达式现在也可以应用装饰器了，如：

```ts
const Foo = @deco class {
  constryctor() {}
}
```

- 装饰器与 export 关键字一同应用的方式调整为：

```ts
export default @deco class Foo {}
```

### 类装饰器

类装饰器的类型定义如下：

```ts
type ClassDecorator = (
  value: Function,
  context: {
    kind: 'class';
    name: string | undefined;
    ddInitializer(initializer: () => void): void;
  },
) => Function | void;
```

value 为被装饰的 Class，你可以通过返回一个新的 Class 来完全替换掉原来的 Class。或者由于你能拿到原先的 Class，你也可以直接返回一个它的子类：

```ts
function logged(value, { kind, name }) {
  if (kind === 'class') {
    return class extends value {
      constructor(...args) {
        super(...args);
      }
    };
  }
}
@logged
class Test {}
```
