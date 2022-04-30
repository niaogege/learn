---
title: 初识
order: 1
group:
  title: babel
  order: 0
  path: /read-code/babel
nav:
  order: 1
  title: 'read-code'
  path: /read-code
---

> 前端工程化中 babel 绝对占了很大一部分比例，面试中听到这个词就是浑身发麻，作为一枚 copy 工程师，还得了解下 babel 的基本知识,学习这方面知识，初试 babel 真的是无从抓起

## js -> js

Babel 是一个工具链，主要用于将采用 ECMAScript 2015+ 语法编写的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中。（我摊牌了，直接从 `Babel` 中文官网[1]复制），我们一般用 Babel 做下面几件事：

- 语法转换（es-higher -> es-lower）；
- 通过 Polyfill 处理在目标环境无法转换的特性（通过 core-js 实现）；
- 源码转换（codemods、jscodeshift）；
- 静态分析（lint、根据注释生成 API 文档等）;

babel 是 source to source 的转换，整体编译流程分为三步：

- parse：通过 parser 把源码转成抽象语法树（AST）
- transform：遍历 AST，调用各种 transform 插件对 AST 进行增删改
- generate：把转换后的 AST 打印成目标代码，并生成 sourcemap

source code -> parse -> **AST** -> transform(增删改) -> **AST** -> generate

## AST

## 参考文档

- [最详细、最全面的 Babel 小抄](https://mp.weixin.qq.com/s/miey_S-cBElyxOiAnMVOmw)
