---
title: TS总览
order: 0
group:
  order: 0
  title: TS
  path: /interview/ts
nav:
  order: 3
  title: 'interview'
  path: /interview
---

ts 强类型语言已经大势所趋，工具还是得需要掌握，至于要掌握到多深的程度？I dont Konw

## 体操类型

```ts
type ExcludeCopy<T, U> = T extends U ? never : T;
type ExtraCopy<T, U> = T extends U ? T : never;
```

## `<T>`范型相关

## tsc 编译相关
