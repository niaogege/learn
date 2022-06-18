---
title: unknown和any类型区别
order: 7
group:
  order: 0
  title: TS
  path: /interview/ts
nav:
  order: 3
  title: 'interview'
  path: /interview
---

要用实例来解释和消化知识点

> any 和 unknown 的区别： any 和 unknown 都代表任意类型，但是 unknown 只能接收任意类型的值，而 any 除了可以接收任意类型的值，也可以赋值给任意类型（除了 never）。类型体操中经常用 unknown 接受和匹配任何类型，而很少把任何类型赋值给某个 unknown 类型变量。(怎么理解呢)

## unknown VS any Vs never

### 简单实例

```ts
let a: any = '11';
let b: unknown = '22';
let c: string = a;
let d: string = b; // Type 'unknown' is not assignable to type 'string'.
```

不能将类型“unknown”分配给类型“string”,就是具体类型(子类型)不能赋值给 unknown 类型

### 强化实例

```ts
function invokeAny(cb: any) {
  cb();
}
invokeAny(1); // 运行时会报错 TypeError: cb is not a function

function invokeAnything(cb: unknown) {
  cb(); // 类型错误: 对象的类型为 "unknown"
  if (typeof cb === 'function') {
    cb();
  }
}
invokeAnything(2);
```

any: 主动放弃类型检查，丢掉类型限制，跟 ts 类型限制背道而驰,any 类型阔以接受任何类型，也阔以赋值给任何类型 unknown: 阔以接受任何类型，但在类型检查或者断言之前，不能对 unknown 进行操作

```ts
function invokeAnything1(cb: unknown) {
  // 可以将任何东西赋给 `unknown` 类型，
  // 但在进行类型检查或类型断言之前，不能对 `unknown` 进行操作
  if (typeof cb === 'function') {
    cb();
  }
}
invokeAnything1(2);
```

## 总结

unknown 和 any 是 2 个特殊的类型，可以容纳任何值。

推荐使用 unknown 而不是 any，因为它提供了更安全的类型--如果想对 unknown 进行操作，必须使用类型断言或缩小到一个特定的类型。(unknown 会收窄类型)

## 参考

- [TypeScript 中 unknown 与 any 有啥区别](https://juejin.cn/post/7021676475434663966)
