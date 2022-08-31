---
title: 函数插桩自动埋点插件实战
order: 6
group:
  title: babel
  order: 1
  path: /babel
nav:
  order: 1
  title: 'node'
  path: /node
---

> 还是得需要沉下心来，打磨，熟悉 babel 写法套路

## 需求

输入：

```js
import aa from 'aa';
import * as bb from 'bb';
import { cc } from 'cc';
import 'dd';
import tarck from 'track';

function a() {
  console.log('aaa');
}
```

输出

```js
import aa from 'aa';
import * as bb from 'bb';
import { cc } from 'cc';
import 'dd';
import tarck from 'track';

function a() {
  tarck();
  console.log('aaa');
}
```

## 分析思路

1.导入引用的函数，这地方如何导入,如何新建一个具名导入或者默认导入的声明 2.在函数插入导入的函数,这一步需要先创建 BlockStatement,然后在插入函数

标准点：

- 引入 tracker 模块。如果已经引入过就不引入，没有的话就引入，并且生成个唯一 id 作为标识符
- 对所有函数在函数体开始插入 tracker 的代码

## 可能需要用到的 API

### t.importSpecifier(identifier, imported)

> unknown: Property local of ImportSpecifier expected node to be of a type ["Identifier"] but instead got undefined

See also t.isImportSpecifier(node, opts) and t.assertImportSpecifier(node, opts).

AST Node ImportSpecifier shape:

- local: Identifier (required) // 是什么东东，如何创建
- imported: Identifier | StringLiteral (required)
- importKind: "type" | "typeof" | "value" (default: null, excluded from builder function)

> Aliases: Standardized, ModuleSpecifier

### t.ImportDefaultSpecifier(local)

See also t.isImportDefaultSpecifier(node, opts) and t.assertImportDefaultSpecifier(node, opts).

AST Node ImportDefaultSpecifier shape:

local: Identifier (required) // 如何创建 Identifier

> Aliases: Standardized, ModuleSpecifier

### t.callExpression(callee, arguments)

See also t.isCallExpression(node, opts) and t.assertCallExpression(node, opts).

AST Node CallExpression shape:

> Expression 什么是 Expression

- callee: Expression | V8IntrinsicIdentifier (required)
- arguments: Array<Expression | SpreadElement | JSXNamespacedName | ArgumentPlaceholder> (required)
- optional: true | false (default: null, excluded from builder function)
- typeArguments: TypeParameterInstantiation (default: null, excluded from builder function)
- typeParameters: TSTypeParameterInstantiation (default: null, excluded from builder function)

> Aliases: Standardized, Expression

## 代码实现

- 需要遍历整个文件来找到是否有依赖，如果已经引入就不需要再次引入

在 Program 根结点里通过 path.traverse 来遍历 ImportDeclaration，如果引入了 tracker 模块，就记录 id 到 state，并用 path.stop 来终止后续遍历；没有就引入 tracker 模块，用 generateUid 生成唯一 id，然后放到 state。

当然 default import 和 namespace import 取 id 的方式不一样，需要分别处理下。

我们把 tracker 模块名作为参数传入，通过 options.trackerPath 来取。

- 创建的 ast 节点要插入到满足条件的函数 body 里

- importModule 相关 api

```js
const { declare } = require('@babel/helper-plugin-utils');
const importModule = require('@babel/helper-module-imports');

const autoUbtPlugin = declare(({ types: t, template, assertVersion }, options) => {
  assertVersion(7); // 判断 babel 版本是否是指定的版本
  return {
    visitor: {
      Program: {
        enter(path, state) {
          path.traverse({
            ImportDeclaration(curPath) {
              const requirePath = curPath.get('source').node.value;
              if (requirePath === options.trackerPath) {
                const specifierPath = curPath.get('specifiers.0');
                if (specifierPath.isImportSpecifier()) {
                  state.trackerImportId = specifierPath.toString();
                } else if (specifierPath.isImportNamespaceSpecifier()) {
                  state.trackerImportId = specifierPath.get('local').toString(); // tracker 模块的 id
                }
              }
            },
          });
          if (!state.trackerImportId) {
            state.trackerImportId = importModule.addDefault(path, 'tracker', {
              nameHint: path.scope.generateUid('cpp'),
            }).name;
            state.trackerAST = template.statement(`${state.trackerImportId}()`)();
          }
        },
      },
      'FunctionDeclaration|ArrowFunctionExpression|FunctionExpression|ClassMethod': function (
        path,
        state,
      ) {
        const bodyPath = path.get('body');
        if (bodyPath.isBlockStatement()) {
          bodyPath.node.body.unshift(state.trackerAST);
        } else {
          const ast = template.statement(`{${state.trackerImportId}();return CPP;}`)({
            CPP: bodyPath.node,
          });
          bodyPath.replaceWith(ast);
        }
      },
    },
  };
});
module.exports = autoUbtPlugin;
```

## 参考

- [一文助你搞懂 AST](https://blog.csdn.net/qiwoo_weekly/article/details/107011006)
