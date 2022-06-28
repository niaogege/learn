---
title: 箭头函数转普通函数
order: 4
group:
  title: babel
  order: 0
  path: /babel
nav:
  order: 1
  title: 'node'
  path: /node
---

> 真正的勇者敢于迎刃而上

需求下面的代码转换成目标代码

```js
// before
var a = () => console.log(11);

// after
var a = function func() {
  console.log(11);
};
```

思路：

- 手写要把要转换之后的代码和转换前的代码放到[astexplorer](https://astexplorer.net/)好好分析两者之间的区别
- 通过 path 要找到要遍历的函数表达式 ArrowFunctionExpression
- 找到之后，构造一个{}，然后把返回语句填充到{}
- 替换现有函数表达式

[看到别人文章](https://juejin.cn/post/7040328166832865293)

```js
// 构造函数 函数表达式

t.functionExpression(id, params, body, generator, async);

AST Node FunctionExpression shape:

- id: Identifier (default: null)
- params: Array<Identifier | Pattern | RestElement> (required)
- body: BlockStatement (required)
- generator: boolean (default: false)
- async: boolean (default: false)


// {} blockStatement语句
t.blockStatement(body, directives);
- body: Array<Statement> (required)
- directives: Array<Directive> (default: [])


// returnStatement 语句
t.returnStatement(argument);
- argument: Expression (default: null)
```

具体 API 请移步[@babel/types](https://babeljs.io/docs/en/babel-types)

### 手写简易 plugin

第一版： 0620

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

当源代码没有缩写的时候，比如是

```js
const a = () => {
  console.log(11);
};
```

这时候上面的代码就会报错 `Property argument of ReturnStatement expected node to be of a type ["Expression"] but instead got "BlockStatement"`,所以需要针对上面做个特殊处理

```js
module.exports = function ({ types: t, template }, options, dirname) {
  return {
    visitor: {
      ArrowFunctionExpression(path, state) {
        const node = path.node;
        // 拿到函数参数体
        const params = node.params;
        // 拿到函数体
        let body = node.body;
        // 函数返回语句
        // 没有{}时才会创建{}
        if (!t.isBlockStatement(body)) {
          const r = t.returnStatement(body);
          // 花括号 {}
          body = t.blockStatement([r]);
        }
        const f = t.functionExpression(null, params, body, false, false);
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

最后在`babel.config.js`中配置

```js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          chrome: 55,
        },
        useBuiltIns: 'usage',
        corejs: '3.6.4',
      },
    ],
  ],
  plugins: [
    // "@babel/plugin-transform-runtime",
    './plugin/insertCode/index.js',
    './plugin/arrowFunction/index.js',
  ],
};
```

然后命令行执行 `npx babel ./index.js --out-file build.ast.plugin.js`

就会改项目的`index.js`文件输出到`build.ast.plugin.js`

## 参考

- [AST 抽象语法树](https://blog.csdn.net/weixin_30875157/article/details/99978236)
- [从箭头函数转换看 AST 抽象语法树(小白级教程，简单易懂)](https://juejin.cn/post/7040328166832865293#heading-2)
- [一文助你搞懂 AST](https://blog.csdn.net/qiwoo_weekly/article/details/107011006)
