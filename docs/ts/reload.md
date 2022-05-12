---
title: 函数重载
order: 1
group:
  order: 0
  title: TS
  path: /interview/ts
nav:
  order: 3
  title: 'interview'
  path: /interview
---

用于实现不同参数输入并且对应不同参数输出的函数，在前面定义多个重载签名，一个实现签名，一个函数体构造，重载签名主要是精确显示函数的输入输出，实现签名主要是将所有的输入输出类型做一个全量定义，防止 TS 编译报错，函数体就是整个整个函数实现的全部逻辑。

```ts
function sayName(value: string): string | undefined;
function sayName(value: number, age: number): number;
function sayName(value: string | number, age: number = 0): number | string | undefined {
  if (typeof value === 'number') {
    return age;
  } else {
    return value;
  }
}
sayName('1111'); // ok
sayName(10, 10); // ok
// sayName('10', 10) // is not ok
```

### 参考

- [一文读懂 TS 的函数重载，方法重载，构造器重载](https://juejin.cn/post/7055668560965681182#heading-1)
