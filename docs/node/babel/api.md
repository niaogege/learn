---
title: babel相关API
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

![Babel编译流程.png](https://s2.loli.net/2022/06/22/ucOJxmXstDdZglv.png)

## info 介绍

Babel 是一个通用的多功能的 JavaScript 编译器。此外它还拥有众多模块可用于不同形式的**静态分析**。

静态分析是在不需要执行代码的前提下对代码进行分析的处理过程 （执行代码的同时进行代码分析即是动态分析）。 静态分析的目的是多种多样的， 它可用于**语法检查，编译，代码高亮，代码转换，优化，压缩**等等场景。

你可以使用 Babel 创建多种类型的**工具**来帮助你更有效率并且写出更好的程序。

## Basic 基础

Babel 是 JavaScript 编译器，更确切地说是源码到源码的编译器，通常也叫做“**转换编译器**（transpiler）”。 意思是说你为 Babel 提供一些 JavaScript 代码，Babel 更改这些代码，然后返回给你新生成的代码。

## 抽象语法树（ASTs）

这个处理过程中的每一步都涉及到创建或是操作抽象语法树，亦称 AST。

## Babel 的处理步骤

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

- 语法分析语法分析阶段会把一个令牌流转换成 AST 的形式。 这个阶段会使用令牌 Token 中的信息把它们转换成一个 **AST** 的表述结构，这样更易于后续的操作。

### 转换 transform

转换步骤 接收 **AST** 并对其进行遍历，在此过程中对节点进行添加、更新及移除等操作。 这是 Babel 或是其他编译器中最复杂的过程 同时也是插件将要介入工作的部分，这将是本手册的主要内容， 因此让我们慢慢来。

对 Parse 阶段生成的 AST 进行遍历，遍历过程中会处理到不同的 AST 节点，并调用相应的 Visitor 函数,visitor 函数对 AST 节点进行增删改，返回新的 AST,这样遍历完就完成了对代码的修改

### 生成 generate

代码生成步骤把最终（经过一系列转换之后）的 AST 转换成字符串形式的代码，同时还会创建源码映射 SourceMap,代码生成其实很简单：**深度优先遍历**整个 AST，然后构建可以表示转换后代码的字符串。不同的 AST 对应不同结构的字符串，比如 IfStatement 就可以打印成 if(test) {} 格式的代码。这样从 AST 根节点进行递归打印，就可以生成目标代码的字符串。

sourcemap 记录了源码到目标代码的转换关系，通过它我们可以找到目标代码中每一个节点对应的源码位置。

### webpack 构建流程

```js
const fs = require('fs');
const path = require('path');
// es6 code transform ast
const parser = require('@babel/parser');
// traverse 依赖路径
const traverse = require('@babel/traverse');
// paser transformFromAst es5代码
const babel = require('@babel/core');
const getModuleInfo = (file) => {
  const body = fs.readFileSync(file, 'utf-8');
  const ast = parser.parse(body, {
    sourceType: 'module', // 解析的是es模块 default sourceType: 'script'
  });
  // 收集依赖路径 win10系统下
  const deps = {};
  // 访问者函数
  traverse.default(ast, {
    // 默认导入函数时调用
    ImportDeclaration({ node }) {
      const dirname = path.dirname(file);
      const depsPath = node.source.value;
      const abspath = './' + path.join(dirname, depsPath);
      deps[depsPath] = abspath;
    },
    // 跟上面的等价
    // ImportDeclaration: {
    //   enter({node}) {

    //   }
    // }
  });
  const { code } = babel.transformFromAst(ast, null, {
    presets: ['@babel/preset-env'],
  });
  return {
    file,
    deps,
    code,
  };
};
// 解析模块深层次遍历模块 输出字符串
const parseModules = (file) => {
  const entry = getModuleInfo(file);
  const temp = [entry];
  for (let i = 0; i < temp.length; i++) {
    const deps = temp[i].deps;
    if (deps) {
      for (const key in deps) {
        if (deps.hasOwnProperty(key)) {
          temp.push(getModuleInfo(deps[key]));
        }
      }
    }
  }
  // 存储格式 add.js: {deps: '', code: ''}
  const depsGraph = {};
  temp.forEach((moduleInfo) => {
    depsGraph[moduleInfo.file] = {
      deps: moduleInfo.deps,
      code: moduleInfo.code,
    };
  });
  return depsGraph;
};
// 输出bundle
const bundle = (file) => {
  const depsGraph = JSON.stringify(parseModules(file));
  return `(function (graph) {
    function require(file) {
      var exports = {};
      function absRequire(relPath) {
        return require(graph[file].deps[relPath])
      }
      (function(require, exports, code){
        console.log(code)
        eval(code)
      })(absRequire, exports, graph[file].code)
      return exports
    }
    require('${file}')
  })(${depsGraph})`;
};
// 按照路径生成文件
function emit(path) {
  const content = bundle(path);
  const distPath = './dist';
  const bundlePath = './dist/bundle.js';
  fs.unlinkSync(bundlePath);
  fs.rmdirSync(distPath);
  fs.mkdirSync(distPath);
  fs.writeFileSync(bundlePath, content);
}
emit('./src/index.js');
```

## Babel 三个阶段的核心 API

### @babel/parser

它提供了有两个 api：parse 和 parseExpression。两者都是把源码转成 AST，不过 parse 返回的 AST 根节点是 File（整个 AST），parseExpression 返回的 AST 根节点是是 Expression（表达式的 AST），粒度不同。

```ts
// function parse(input: string, options?: ParserOptions): File
// function parseExpression(input: string, options?: ParserOptions): Expression
```

详细的 options 可以[查看文档](https://babeljs.io/docs/en/babel-parser#options)。其实主要分为两类，一是 parse 的内容是什么，二是以什么方式去 parse

其实最常用的 option 就是 plugins、sourceType 这两个，比如要 parse tsx 模块，那么就可以这样来写

```ts
const parser = require('@babel/parser');
const body = fs.readFileSync('../../xx', 'utf-8');
parser.parse(body, {
  sourceType: 'module',
  plugins: ['jsx', 'typescript'],
});
```

### @babel/traverse

parse 出的 AST 由 @babel/traverse 来遍历和修改，babel traverse 包提供了 traverse 方法：

```ts
function tarverse(parent, opts);
```

parent: Ast 节点，即@babel/parser 生成的节点 opts：指定 visitor 函数。babel 会在遍历 parent 对应的 AST 时调用相应的 visitor 函数。

#### 遍历过程

visitor 对象的 value 是对象或者函数：

- 如果 value 为函数，那么就相当于是 enter 时调用的函数。
- 如果 value 为对象，则可以明确指定 enter 或者 exit 时的处理函数。

函数会接收两个参数 path 和 state。

```js
module.exports = declare((api, options, dirname) => {
  visitor: {
    Identifer: (path, state) {}, // 函数
    StringLiteral: {
      enter(path, state) {},
      exit(path, state) {}
    },
    Program: {
      enter(path) {}
    }
  }
})
```

如果只指定一个函数，默认就是 enter 阶段会调用

```js
traverse(ast, {
  FunctionDeclaration(path, state) {}, // 进入节点时调用
});
```

可以为单个节点的类型，也可以是多个节点类型通过 | 连接，还可以通过别名指定一系列节点类型。

```js
// 单个FunctionDeclartion节点类型的访问
tarverse(ast, {
  FunctionDeclartion: {
    enter(path, state) {},
  },
});
// 默认是进入节点时调用，和上面等价
traverse(ast, {
  FunctionDeclartion(path, state) {},
});
// 进入函数和声明时调用
traverse(ast, {
  'FunctionDeclaration|VariableDeclaration'(path, state) {},
});
// 通过别名指定离开声明时调用
traverse(ast, {
  FunctionDeclaration: {
    exit(path, state) {},
  },
});
```

#### path

path 是遍历过程中的路径，会保留上下文信息，有很多属性和方法，比如:

- path.node 指向当前 AST 节点
- path.get、path.set 获取和设置当前节点属性的 path
- path.parent 指向父级 AST 节点 父亲节点
- path.getSibling、path.getNextSibling、path.getPrevSibling 获取兄弟节点
- path.find 从当前节点向上查找节点
- path.scope 获取当前节点的作用域信息 // 这个属性可以获取作用域的信息
- path.isXxx 判断当前节点是不是 xx 类型
- path.assertXxx 判断当前节点是不是 xx 类型，不是则抛出异常

下面这些方法可以对 AST 进行增删改

- path.insertBefore、path.insertAfter 插入节点(增)
- path.replaceWith、path.replaceWithMultiple、replaceWithSourceString 替换节点(改)
- path.remove 删除节点(删)

> 跟 dom 节点里的增删改相比呢

- path.skip 跳过当前节点的子节点的遍历
- path.stop 结束后续遍历

#### state

第二个参数 state 则是遍历过程中在不同节点之间传递数据的机制，插件会通过 state 传递 options 和 file 信息，我们也可以通过 state 存储一些遍历过程中的共享数据。

### @babel/types

遍历 AST 的过程中需要**创建一些 AST 和判断 AST 的类型**，这时候就需要 @babel/types 包。

- 判断这个节点是不是这个节点（t.isBlockStatement）
- 生成对应的表达式(t.blockStatement([r]))

> 这个包比较重要 相关基础概念要了解掌握

举例来说，如果要创建 IfStatement 就可以调用

```js
import t from '@babel/types';
t.ifStatement(test, consequent, alternate);
```

而判断节点是否是 IfStatement 就可以调用 isIfStatement 或者 assertIfStatement

```js
t.isIfStatement(node, opts);
t.assertIfStatement(node, opts);
```

### @babel/template

通过 @babel/types 创建 AST 还是比较麻烦的，要一个个的创建然后组装，如果 AST 节点比较多的话需要写很多代码，这时候就可以使用 @babel/template 包来批量创建。

```js
const template = require('@babel/template');
const ast = template(code, [opts])(agrs);
const ast1 = template.ast(code, [opts]);
const ast2 = template.program(code, [opts]);
```

如果是根据模版创建整个 AST，那么用 **template.ast** 或者 **template.program** 方法，这俩都是直接返回 ast 的，template.program 返回的 AST 的根节点是 Program。

如果模版中有占位符，那么就用 template 的 api，在模版中写一些占位的参数，调用时传入这些占位符参数对应的 AST 节点。

```js
const fn = template(`console.log(%%NAME%%)`);
const ast = fn({
  NAME: t.stringLiteral('cpp'),
});
```

### @babel/generator

AST 转换完之后就要打印成目标代码字符串，通过 @babel/generator 包的 generate api

```ts
// function generate(ast: Object,opts: Object, code: string): {code, map}
```

options 中常用的是 sourceMaps，开启了这个选项才会生成 sourcemap

```js
const { code, map } = geneate(ast, { sourceMap: true });
```

### @babel/core

@babel/core 包则是基于它们完成整个编译流程，从源码到目标代码，生成 sourcemap

```js
const babel = require('@babel/core');
const { code } = babel.transformFromAstSync(ast, null, {
  presets: ['@babel/preset-env'],
}); // 从源代码ast开始处理
```

```js
const { code, map, ast } = babel.transformSync(ast, null, {});
const {} = babel.transformFileSync(ast, {});
const {} = babel.transformSync(ast, {});
```

前三个 transformXxx 的 api 分别是从源代码、源代码文件、源代码 AST 开始处理，最终生成目标代码和 sourcemap。

options 主要配置 **plugins** 和 **presets**，指定具体要做什么转换。

这些 api 也同样提供了异步的版本，异步地进行编译，返回一个 promise

```js
transformAsync('code()', options).then((res) => {});
transformFileAsync('cpp.js');
```

## 参考

- [parser options 可以查看文档](https://babeljs.io/docs/en/babel-parser#options)
