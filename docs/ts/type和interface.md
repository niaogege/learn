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

> 老生常谈的问题 简历中如果填写 ts，命中的概率 90%+

## 不同点

- type 类型别名阔以为基本数据类型/联合类型/元祖类型定义别名，interface 接口不行

- interface 能自动合并同名接口， type 不行

## 相同点

- 类型别名和接口都能用来描述对象或者函数

- type 和 interface 都支持扩展

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

类型别名通过交叉运算符 **(&)** 扩张接口定义的类型

```ts
interface Child {
  name: string;
}
type Older1 = Person & {
  hobby: string;
};
```

## 实际应用场景

## 膜拜大佬

- [type 和 interface 傻傻分不清楚？](https://mp.weixin.qq.com/s/C-n1vkfv2pATT2fjdNLjmQ)
