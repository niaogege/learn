---
title: plugin实战之函数参数处理
order: 6
group:
  title: babel
  order: 0
  path: /babel
nav:
  order: 1
  title: 'node'
  path: /node
---

首先膜拜大佬[最详细、最全面的 Babel 小抄](https://mp.weixin.qq.com/s/miey_S-cBElyxOiAnMVOmw)

面试官问：

输入：

```js
// 假设 spliceText 是全局函数，有大量的使用
function spliceText(...args) {
  return args[0].replace(/(\{(\d)\})/g, (...args2) => {
    return args[Number(args2[2]) + 1];
  });
}

spliceText('我有一只小{0}，我从来都不{1}', '毛驴', '骑'); // 有一只小毛驴，我从来都不骑
spliceText('我叫{0}，今年{1}岁，特长是{2}', '小余', 18, '睡觉'); // 叫小余，今年18岁，特长是睡觉
spliceText('有趣的灵魂');
```

要求输出：

```js
function cpp(str, obj) {
  return str.replace(/(\{(\d)\})/g, (...args2) => {
    return obj[args2[2]];
  });
}
cpp('我有一只小{0}，我从来都不{1}', { 0: '毛驴', 1: '骑' }); // 有一只小毛驴，我从来都不骑
cpp('我叫{0}，今年{1}岁，特长是{2}', { 0: '小余', 1: 18, 2: '睡觉' }); // 叫小余，今年18岁，特长是睡觉
cpp('有趣的灵魂'); // 有趣的灵魂
```

## 手写更改函数参数插件

> visitor 函数里谨慎用 es6+以上语法，babel 内部在转换的时候不一定能够支持

> 有些插件里喜欢用别名来创建节点

### 涉及到的@babel/types 相关 api

[@babel/types 相关 api](https://www.babeljs.cn/docs/babel-types)

- t.objectExpression([]) 创建对象数组表达式,比如创建一个数组[]

```js
t.objectExpression(properties);
```

```js
See also t.isObjectExpression(node, opts) and t.assertObjectExpression(node, opts).

AST Node ObjectExpression shape:

properties: Array<ObjectMethod | ObjectProperty | SpreadElement> (required)
```

> Aliases: Standardized, Expression

- t.objectProperty 创建对象属性,比如 {name, 'cpp'}

```js
t.objectProperty(key, value, computed, shorthand, decorators);
```

```js
See also t.isObjectProperty(node, opts) and t.assertObjectProperty(node, opts).

AST Node ObjectProperty shape:

key: if computed then Expression else Identifier | Literal (required)
value: Expression | PatternLike (required)
computed: boolean (default: false)
shorthand: boolean (default: false)
decorators: Array<Decorator> (default: null)
```

> Aliases: Standardized, UserWhitespacable, Property, ObjectMember

- t.numericLiteral

创建数字字面量，也就是 0/1/2...

```js
t.numericLiteral(value);
```

```
See also t.isNumericLiteral(node, opts) and t.assertNumericLiteral(node, opts).

AST Node NumericLiteral shape:

value: number (required)
```

> Aliases: Standardized, Expression, Pureish, Literal, Immutable

### 代码思路

这一步主要还是通过转换后的代码和转换前的代码对比，[分析 AST 结构](https://astexplorer.net/)

- 找到标识符 spliceText 的函数，然后直接改成自己想要的函数名
- 对当前函数的参数进行提取，以及创建
- 改变父亲节点的 arguments 即可

总体代码如下

```js
const { declare } = require('@babel/helper-plugin-utils');
module.exports = function ({ types: t, template, assertVersion }) {
  assertVersion(7);
  return {
    name: 'my-plugin',
    visitor: {
      Identifier(path, state) {
        if (path.node.name === 'spliceText') {
          path.node.name = 'cpp';
          const parent = path.parent;
          const args = parent.arguments;
          // 构建空对象
          let len = args.length;
          if (len <= 1) {
            return;
          }
          const params = t.objectExpression([]);
          for (let i = 1; i < len; i++) {
            params.properties.push(t.objectProperty(t.numericLiteral(i - 1), args[i]));
          }
          parent.arguments.splice(1);
          parent.arguments.push(params);
          path.skip(); // 跳过当前节点的子节点的遍历
        }
      },
    },
  };
};
```
