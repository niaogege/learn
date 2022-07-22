---
title: 三种单独声明类型和三种模块语法
order: 10
group:
  order: 0
  title: TS
  path: /interview/ts
nav:
  order: 3
  title: 'interview'
  path: /interview
---

TypeScript 给 JavaScript 添加了类型信息，在编译时做类型检查。

除了在变量声明时定义类型外，TS 也支持通过 **declare 单独声明类型**。只存放类型声明的文件后缀是 **d.ts**。

> 我曾经一度以为 declare 没啥用处 只能看这个这篇文章才知道 declare 阔以定义变量类型 主要用于他人用你的代码时的类型检测如何给 api 加上类型限制呢

- lib： 内置的类型声明，包含 dom 和 es 的，因为这俩都是有标准的。
- @types/xx： 其他环境的 api 类型声明，比如 node，还有 npm 包的类型声明
- 开发者写的代码：tsConfig 配置的 通过 include + exclude 还有 files 指定

```ts
// lib.dom.d.ts
declare var onclick: ((this: Window, ev: MouseEvent) => any) | null;
declare var onclose: ((this: Window, ev: Event) => any) | null;
```

模块声明的三种方式

- namespace：最早的实现模块的方式，编译为声明对象和设置对象的属性的 JS 代码
- module：和 namespace 的 AST 没有任何区别，只不过一般用来声明 CommonJS 的模块，在 @types/node 下有很多
- es module：es 标准的模块语法，ts 额外扩展了 import type

dts 中的类型声明默认是全局的， 除非有 es module 的 export 和 import 声明，这时候需要手动 **declare global**,为了更方便，阔以采用三斜杠，即 reference

```ts
import * as fs from 'fs';

declare global {
  declare function funcNum1(a: number, b: number): number;
  declare const ttname: fs.Dir;
}

export declare namespace CPPModule {
  export function readName(name: string): string;
}

// declare module 'xx:node' {
//   global {
//     declare function moduleName(name: string): string;
//   }
// }
```
