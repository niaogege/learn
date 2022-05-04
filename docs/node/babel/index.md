---
title: 初识babel
order: 1
group:
  title: babel
  order: 0
  path: /babel
nav:
  order: 1
  title: 'node'
  path: /node
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

## parse

分为词法分析和语法分析

当 parse 阶段开始时，首先会进行文档扫描，并在此期间进行词法分析。那怎么理解此法分析呢 如果把我们所写的一段 code 比喻成句子，词法分析所做的事情就是在拆分这个句子。如同 “我正在吃饭” 这句话，可以被拆解为“我”、“正在”、“吃饭”一样, code 也是如此。比如: `const a = '1'` 会被拆解为一个个最细粒度的单词(tokon): 'const', 'a', '=', '1' 这就是词法分析阶段所做的事情。

词法分析结束后，将分析所得到的 tokens 交给语法分析， 语法分析阶段的任务就是根据 **tokens** 生成 AST。它会对 tokens 进行遍历，最终按照特定的结构(esTree)生成一个 tree 这个 tree 就是 AST。

如下图, 可以看到上面语句的到的结构，我们找到了几个重要信息, 最外层是一个 VariableDeclaration 意思是变量声明，所使用的类型是 const, 字段 declarations 内还有一个 VariableDeclarator[变量声明符] 对象，找到了 a, 1 两个关键字

## transform

在 parse 阶段后，我们已经成功得到了 AST。babel 接收到 AST 后，会使用 @babel/traverse 对其进行深度优先遍历，插件会在这个阶段被触发，以 vistor 函数的形式访问每种不同类型的 AST 节点。以上面代码为例, 我们可以编写 VariableDeclaration 函数对 VariableDeclaration 节点进行访问，每当遇到该类型节点时都会触发该方法。如下：

```js
const parser = require('@babel/parser');
const { default: traverse } = require('@babel/traverse');
const { default: generate } = require('@babel/generator');

const ast = parser.parse('const a = 1');
traverse(ast, {
  VariableDeclaration(path, state) {
    console.log(path.node, 'path');
    console.log(state, 'state');
    path.node.kind = 'var';
  },
});

const transformCode = generate(ast).code;
console.log(transformCode, 'transformCode');
```

比如**VariableDeclaration**方法中的两个参数该方法接受两个参数，

path path 为当前访问的路径, 并且包含了节点的信息、父节点信息以及对节点操作许多方法。可以利用这些方法对 ATS 进行添加、更新、移动和删除等等。

state state 包含了当前 plugin 的信息和参数信息等等，并且也可以用来自定义在节点之间传递数据。

## 生成（generate）

generate：把转换后的 AST 打印成目标代码，并生成 sourcemap

这个阶段就比较简单了， 在 transform 阶段处理 AST 结束后，该阶段的任务就是将 AST 转换回 code, 在此期间会对 AST 进行深度优先遍历，根据节点所包含的信息生成对应的代码，并且会生成对应的 sourcemap。

## AST

标识符 Identifer、各种字面量 xxLiteral、各种语句 xxStatement，各种声明语句 xxDeclaration，各种表达式 xxExpression，以及 Class、Modules、File、Program、Directive、Comment 这些 AST 节点

## 参考文档

- [最详细、最全面的 Babel 小抄](https://mp.weixin.qq.com/s/miey_S-cBElyxOiAnMVOmw)
- [保姆级教学！这次一定学会 babel 插件开发！](https://mp.weixin.qq.com/s/ZVWffh-MWcRNl2rDp0cKiQ)
