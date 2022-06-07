---
title: 模式匹配
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

Typescript 类型的模式匹配是通过**extends** 对类型参数做匹配，结果保存到通过 **infer** 声明的局部类型变量里，如果匹配就能从该局部变量里拿到提取出的类型

## 数组类型

## 字符串类型

## 函数类型

## 构造器

构造器和函数的区别是，构造器是用于创建对象的，所以可以被 new。

### GetInstanceType

同样，我们也可以通过模式匹配提取构造器的参数和返回值的类型：

```ts
interface PPerson {
  name: string;
}
interface PPersonConstructor {
  new (name: string): PPerson;
}
```

这里的 PersonConstructor 返回的是 Person 类型的实例对象，这个也可以通过模式匹配取出来。

```ts
type GetInstanceType<T extends new (...args: any) => any> = T extends new (...args: any) => infer N
  ? N
  : any;
type T88 = GetInstanceType<PPersonConstructor>; // type T88 = PPerson
```

## GetPramaterConstructor

提取构造器的参数类型

```ts
type GetPramaterConstructor<T extends new (...args: any) => any> = T extends new (
  ...arg: infer A
) => any
  ? A
  : never;
type T89 = GetPramaterConstructor<PPersonConstructor>; // type T89 = [name: string]
```
