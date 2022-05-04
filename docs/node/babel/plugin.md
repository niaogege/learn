---
title: babel相关以及实现基本的plugin
order: 2
group:
  title: babel
  order: 0
  path: /babel
nav:
  order: 1
  title: 'node'
  path: /node
---

写插件之前，好好看看[官网](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md)

> 拷贝下官网里的描述 我感觉比网上的文章描述很准确

## info 介绍

Babel 是一个通用的多功能的 JavaScript 编译器。此外它还拥有众多模块可用于不同形式的**静态分析**。

静态分析是在不需要执行代码的前提下对代码进行分析的处理过程 （执行代码的同时进行代码分析即是动态分析）。 静态分析的目的是多种多样的， 它可用于**语法检查，编译，代码高亮，代码转换，优化，压缩**等等场景。

你可以使用 Babel 创建多种类型的**工具**来帮助你更有效率并且写出更好的程序。

## Basic 基础

Babel 是 JavaScript 编译器，更确切地说是源码到源码的编译器，通常也叫做“转换编译器（transpiler）”。 意思是说你为 Babel 提供一些 JavaScript 代码，Babel 更改这些代码，然后返回给你新生成的代码。

### 抽象语法树（ASTs）

这个处理过程中的每一步都涉及到创建或是操作抽象语法树，亦称 AST。

### Babel 的处理步骤

Babel 的三个主要处理步骤分别是： 解析（parse），转换（transform），生成（generate）。

### parser

接收代码并输出 AST。 这个步骤分为两个阶段：**词法分析（Lexical Analysis)** 和 **语法分析（Syntactic Analysis)**

- 词法分析词法分析阶段把字符串形式的代码转换为 令牌（tokens） 流。.

你可以把令牌看作是一个扁平的语法片段数组： `n * n;`

```js
[
  { type: { ... }, value: "n", start: 0, end: 1, loc: { ... } },
  { type: { ... }, value: "*", start: 2, end: 3, loc: { ... } },
  { type: { ... }, value: "n", start: 4, end: 5, loc: { ... } },
  ...
]
```

- 语法分析语法分析阶段会把一个令牌流转换成 AST 的形式。 这个阶段会使用令牌中的信息把它们转换成一个 **AST** 的表述结构，这样更易于后续的操作。

### 转换 transform

转换步骤 接收 **AST** 并对其进行遍历，在此过程中对节点进行添加、更新及移除等操作。 这是 Babel 或是其他编译器中最复杂的过程 同时也是插件将要介入工作的部分，这将是本手册的主要内容， 因此让我们慢慢来。

### 生成 generate

代码生成步骤把最终（经过一系列转换之后）的 AST 转换成字符串形式的代码，同时还会创建源码映射（source maps）。. 代码生成其实很简单：**深度优先遍历**整个 AST，然后构建可以表示转换后代码的字符串。

## 参考

- [no-func-assign 分别用 Eslint 插件和 Babel 插件来实现](https://mp.weixin.qq.com/s/OhjOlNZKTUvXUsFzl3bbvw)
- [保姆级教学！这次一定学会 babel 插件开发！](https://mp.weixin.qq.com/s/ZVWffh-MWcRNl2rDp0cKiQ)
