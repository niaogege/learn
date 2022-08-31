---
title: pulgin和preset区别
order: 3
group:
  title: babel
  order: 1
  path: /babel
nav:
  order: 1
  title: 'node'
  path: /node
---

写插件或者预设之前，好好看看[官网](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md)

> 拷贝下官网里的描述 我感觉比网上的文章描述很准确

## Plugins 和 Preset 区别

Babel 的预设（preset）可以被看作是一组 **Babel 插件**和或 **options** 配置的可共享模块。

plugin 是单个转换功能的实现，当 plugin 比较多或者 plugin 的 options 比较多的时候就会导致使用成本升高。这时候可以封装成一个 preset，用户可以通过 preset 来批量引入 plugin 并进行一些配置。preset 就是对 babel 配置的一层封装

### 官方提供的预设

我们已经针对常用环境编写了一些预设（preset）：

- @babel/preset-env **for compiling ES2015+ syntax** 用于编译 ES2015 + 语法
- @babel/preset-typescript **for TypeScript**
- @babel/preset-react **for React**
- @babel/preset-flow **for Flow**

### Using a Preset

```js
//.babelrc
module.exports = {
  presets: [
    '@babel/preset-react', // bare string
    [
      '@babel/preset-env',
      {
        // 要指定参数，请传递一个以参数名作为键（key）的对象。
        targets: {
          chrome: 55,
        },
        useBuiltIns: 'usage',
        corejs: '3.6.4',
      },
    ],
  ],
  plugins: ['@babel/plugin-transform-runtime'],
};
```

### 预设的执行顺序

Preset 是逆序排列的（从后往前）

```json
{
  "presets": ["a", "b", "c"]
}
```

将按如下顺序执行： c、b 然后是 a。这主要是为了确保向后兼容，由于大多数用户将 "es2015" 放在 "stage-0" 之前。

### 创建一个预设

```js
export default function (api, options) {
  return {
    plugins: ['pluginA'],
    presets: [['presetsB', { options: 'bbb' }]],
  };
}
```

或者

```js
export default obj = {
  plugins: ['pluginA'],
  presets: [['presetsB', { options: 'bbb' }]],
};
```

### plugin

Babel's code transformations are enabled by applying plugins (or presets) to your configuration file. 通过将插件（或预设）应用到您的配置文件来启用 Babel 的代码转换。

### plugin 执行顺序

这意味着如果两个转换插件都将处理“程序（Program）”的某个代码片段，则将根据转换插件或 preset 的排列顺序依次执行。

- 插件在 Presets 前运行。先 plugin 再 preset，先插件再预设
- 插件顺序从前往后排列。
- Preset 顺序是颠倒的（从后往前）。

```js
{
  "plugins": ["transform-decorators-legacy", "transform-class-properties"]
}
```

先执行 transform-decorators-legacy ，在执行 transform-class-properties。

```js
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

首先是 执行 @babel/preset-react，然后是 @babel/preset-env。

## 函数插桩，plugin 实例

希望通过 babel 能够自动在 console.log 等 api 中插入文件名和行列号的参数，方便定位到代码。

### 首先把 parse、transform、generate 的框架搭好：

```js
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

const sourceCode = `console.log(1);`;
const ast = parser.parse(sourceCode, {
  sourceType: 'unambiguous',
});
// callExpression
traverse(ast, {
  CallExpression(path, state) {},
});

const { code, map } = generate(ast);
console.log(code);
```

### 设计要转换的源码

```js
console.log('cpp');
function func() {
  console.info(2);
}

export default class Clazz {
  say() {
    console.debug(3);
  }
  render() {
    return <div>{console.error(4)}</div>;
  }
}
```

### 代码实现

```js
const ast = parser.parse(sourceCode, {
  sourceType: 'unambiguous',
  plugins: ['jsx'],
});
traverse(ast, {
  CallExpression(path, state) {
    if (
      types.isMemberExpression(path.node.callee) &&
      path.node.callee.object.name === 'console' &&
      ['log', 'info', 'error', 'debug'].includes(path.node.callee.property.name)
    ) {
      const { line, column } = path.node.loc.start;
      path.node.arguments.unshift(types.stringLiteral(`filename: (${line}, ${column})`));
    }
  },
});
```

现在判断条件比较复杂，要先判断 **path.node.callee** 的类型，然后一层层取属性来判断，其实我们可以用 **path.get** 模块来简化

```js
const targetCalleeName = ['log', 'info', 'error', 'debug'].map((item) => `console.${item}`);
traverse(ast, {
  CallExpression(path, state) {
    const calleeName = path.get('callee').toString();
    console.log(calleeName, '————————calleeName');
    if (targetCalleeName.includes(calleeName)) {
      const { line, column } = path.node.loc.start; // 找到行数信息
      path.node.arguments.unshift(types.stringLiteral(`filename: (${line}, ${column})`)); // 根据ast语法插入到参数前面
    }
  },
});
// console.log ————————calleeName
// console.info ————————calleeName
// console.debug ————————calleeName
// console.error ————————calleeName
```

> 我想知道**path.get**这些 API 哪里有文档 [Manipulation 增删改 API](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md#toc-manipulation)

### 换成插件格式

上面完成的功能想要复用就得封装成插件的形式，babel 支持 transform 插件，形式是函数返回一个对象，对象有 visitor 属性。

```js
module.exports = function (api, options) {
  return {
    visitor: {
      Identifier(path, state) {},
    },
  };
};
```

第一个参数可以拿到 types、template 等常用包的 api，不需要单独引入这些包。

作为插件用的时候，并不需要自己调用 parse、traverse、generate，只需要提供一个 visitor 函数，在这个函数内完成转换功能。

state 中可以拿到用户配置信息 options 和 file 信息，filename 就可以通过 state.filename 来取。

最终代码实现

```js
const targetCalleeName = ['log', 'info', 'error', 'debug'].map((item) => `console.${item}`);

module.exports = function ({ types: t, template }) {
  return {
    visitor: {
      CallExpression(path, state) {
        if (path.node.isNew) {
          return;
        }
        const calleeName = path.get('callee').toString();
        if (targetCalleeName.includes(calleeName)) {
          const { line, column } = path.node.loc.start;
          const newNode = template.expression(
            `console.log("${'index.js'}: (${line}, ${column})")`,
          )();
          newNode.isNew = true;
          if (path.findParent((path) => path.isJSXElement())) {
            path.replaceWith(t.arrayExpression([newNode, path.node]));
            path.skip();
          } else {
            path.insertBefore(newNode);
            path.insertBefore(
              t.expressionStatement(t.stringLiteral("Because I'm easy come, easy go.")),
            );
          }
        }
      },
    },
  };
};
```

然后通过 @babel/core 的 transformSync 方法来调用

```js
const { transformFileSync } = require('@babel/core');
const insertPlugin = require('./index');
const path = require('path');
const fs = require('fs');
const FileName = './source.js';
const TargetName = './target.js';
const { code } = transformFileSync(path.join(__dirname, FileName), {
  plugins: [insertPlugin],
  parserOpts: {
    sourceType: 'unambiguous',
    plugins: ['jsx'],
  },
});

fs.writeFileSync(TargetName, code);
```

查看 target.js 文档就看到代码已经变化了

还有一个示例上，将箭头函数转普通函数的 plugin

```js
module.exports = function ({ types: t, template }, options, dirname) {
  return {
    visitor: {
      ArrowFunctionExpression(path, state) {
        const node = path.node;
        // 拿到函数参数体
        const params = node.params;
        // 拿到函数体
        const body = node.body;
        // 函数返回语句
        const r = t.returnStatement(body);
        // 花括号 {}
        const block = t.blockStatement([r]);
        const f = t.functionExpression(null, params, block, false, false);
        // 构造函数体
        // 如何构造FunctionExpression
        // 以及如何把函数名和函数体插入进去
        // path.repaceWith(t.FunctionDeclaration(path, state));
        path.replaceWith(f);
      },
    },
  };
};
```

## transform 阶段

transform 阶段有 **@babel/traverse**，可以遍历 AST，并调用 visitor 函数修改 AST，修改 AST 自然涉及到 AST 的判断、创建、修改等，这时候就需要 **@babel/types** 了，当需要批量创建 AST 的时候可以使用 **@babel/template** 来简化 AST 创建逻辑。

### path 相关的 API

```js
path {
    // 属性：
    node, // 当前AST节点
    parent, // 父AST节点
    parentPath, // 父AST节点path
    scope, // 作用域
    hub, // 通过 path.hub.file 拿到最外层 File 对象， path.hub.getScope 拿到最外层作用域，path.hub.getCode 拿到源码字符串
    container, // 当前 AST 节点所在的父节点属性的属性值
    key, // 当前 AST 节点所在父节点属性的属性名或所在数组的下标
    listKey, // 当前 AST 节点所在父节点属性的属性值为数组时 listkey 为该属性名，否则为 undefined

    // 方法
    get(key) //获取某个属性的 path
    set(key, node) // 设置某个属性的值
    inList() // 判断节点是否在数组中，如果 container 为数组，也就是有 listkey 的时候，返回 true
    getSibling(key) // 获取某个下标的兄弟节点
    getNextSibling() // 获取下一个兄弟节点
    getPrevSibling() // 获取上一个兄弟节点
    getAllPrevSiblings() // 获取之前的所有兄弟节点
    getAllNextSiblings() // 获取之后的所有兄弟节点
    isXxx(opts) // 判断当前节点是否是某个类型，可以传入属性和属性值进一步判断，比如path.isIdentifier({name: 'a'})
    assertXxx(opts)
    find(callback) // 当前节点到根节点来查找节点（包括当前节点），调用 callback（传入 path）来决定是否终止查找
    findParent(callback) //  从当前节点到根节点来查找节点（不包括当前节点），调用 callback（传入 path）来决定是否终止查找

    insertBefore(nodes) // 在之前插入节点，可以是单个节点或者节点数组
    insertAfter(nodes) // 在之后插入节点，可以是单个节点或者节点数组
    replaceWith(replacement) // 用某个节点替换当前节点
    replaceWithMultiple(nodes) //  用多个节点替换当前节点
    replaceWithSourceString(replacement) // 解析源码成 AST，然后替换当前节点
    remove() // 删除当前节点

    traverse(visitor, state) // 遍历当前节点的子节点，传入 visitor 和 state（state 是不同节点间传递数据的方式）
    skip() // 跳过当前节点的子节点的遍历
    stop() // 结束所有遍历
}
```

### path 中的 scope

scope 是作用域信息，javascript 中能生成作用域的就是模块、函数、块等，而且作用域之间会形成嵌套关系，也就是作用域链。babel 在遍历的过程中会生成作用域链保存在 path.scope 中。

属性和方法大概有这些

```js
path.scope {
    bindings, //当前作用域声明的所有变量
    block, // 生成作用域的block
    parent, //
    parentBlock,
    path, // 生成作用域的节点对应的 path
    references, // 所有 binding 的引用对应的 path

    dump() // 打印作用域链的所有 binding 到控制台
    parentBlock() // 父级作用域的 block
    getAllBindings() // 从当前作用域到根作用域的所有 binding 的合并
    getBinding(name) // 查找某个 binding，从当前作用域一直查找到根作用域
    hasBinding(name, noGlobals) // 从当前作用域查找 binding，可以指定是否算上全局变量，默认是 false
    getOwnBinding(name) // 从当前作用域查找 binding
    parentHasBinding(name) // 查找某个 binding，从父作用域查到根作用域，不包括当前作用域
    removeBinding(name) // 删除某个 binding
    moveBindingTo(name, scope) // 把当前作用域中的某个 binding 移动到其他作用域
    generateUid(name) // 生成作用域内唯一的名字，根据 name 添加下划线
}
```

### scope.block

能形成 scope 的有这些节点，这些节点也叫 block 节点。

```js
export type Scopable =
  | BlockStatement
  | CatchClause
  | DoWhileStatement
  | ForInStatement
  | ForStatement
  | FunctionDeclaration
  | FunctionExpression
  | Program
  | ObjectMethod
  | SwitchStatement
  | WhileStatement
  | ArrowFunctionExpression
  | ClassExpression
  | ClassDeclaration
  | ForOfStatement
  | ClassMethod
  | ClassPrivateMethod
  | StaticBlock
  | TSModuleBlock;
```

我们可以通过 path.scope.block 来拿到所在的块对应的节点，通过 path.scope.parentBlock 拿到父作用域对应的块节点。

一般情况下我们不需要拿到生成作用域的块节点，只需要通过 path.scope 拿到作用域的信息，通过 path.scope.parent 拿到父作用域的信息。

path 的 api 还是比较多的，这也是 babel 最强大的地方。主要是操作当前节点、当前节点的父节点、兄弟节点，作用域，以及增删改的方法。

### state

state 是遍历过程中 AST 节点之间传递数据的方式，插件的 visitor 中，第一个参数是 path，第二个参数就是 state。插件可以从 state 中拿到 opts，也就是插件的配置项，也可以拿到 file 对象，file 中有一些文件级别的信息，这个也可以从 path.hub.file 中拿。

```js
state = {
  file,
  opts,
};
```

### AST 的别名

遍历的时候要指定 visitor 处理的 AST，有的时候需要对多个节点做同样的处理，babel 支持指定多个 AST 类型，也可以通过别名指定一系列类型。

```js
  // 单个 AST 类型
  FunctionDeclaration(path, state) {},
  // 多个 AST 类型
  'FunctionDeclaration|VariableDeclaration'(path, state) {}
  // AST 类型别名
  Declaration(){}
```

可以在文档中查到某个 AST 类型的别名是啥[babel-types](https://www.babeljs.cn/docs/babel-types)

## 参考

- [no-func-assign 分别用 Eslint 插件和 Babel 插件来实现](https://mp.weixin.qq.com/s/OhjOlNZKTUvXUsFzl3bbvw)
- [保姆级教学！这次一定学会 babel 插件开发！](https://mp.weixin.qq.com/s/ZVWffh-MWcRNl2rDp0cKiQ)
- [一文助你搞懂 AST](http://caibaojian.com/ast.html)
