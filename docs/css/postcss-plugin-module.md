---
title: 实现 css-module(笔记)
order: 1
group:
  order: 0
  title: css
  path: /interview/css
nav:
  order: 3
  title: 'interview'
  path: /interview
---

[手写 css-modules 来深入理解它的原理](https://mp.weixin.qq.com/s/CX-LC014iZ4vpTko59Sf7A)

## css modules

如何给 css 加上模块的功能呢？

有的同学会说 CSS 不是有 @import 吗？

那个只是把不同的 CSS 文件合并到一起，并不会做不同 CSS 的隔离。

CSS 的隔离主要有两类方案，一类是**运行时的通过命名区分**，一类是**编译时的自动转换 CSS**，添加上模块唯一标识,还有第三种方式：通过 JS 来组织 css，利用 JS 的作用域来实现 css 隔离，这种是 **css-in-js** 的方案。

### BEM 运行时的通过命名区分

运行时的方案最典型的就是 **BEM**，它是通过 **.block\_\_element--modifier** 这种命名规范来实现的样式隔离，不同的组件有不同的 blockName，只要按照这个规范来写 CSS，是能保证样式不冲突的。

但是这种方案毕竟不是强制的，还是有样式冲突的隐患。

### 编译时自动转换 CSS

编译时的方案有两种，一种是 **scoped**，一种是 **css modules**

scoped 是 **vue-loader** 支持的方案，它是通过编译的方式在元素上添加了 **data-xxx** 的属性，然后给 css 选择器加上 **[data-xxx]** 的 **属性选择器**的方式实现 css 的样式隔离。

比如

```js
<style scpede>
  .red {
    color: red
  }
</style>
<template>
  <div class = 'red'> hi </div>
</template>
```

会被编译成

```js

<style>
.red[data-v-f3f3eg9]
{
    color: red;
}
</style>
<template>
    <div class="red" data-v-f3f3eg9>hi</div>
</template>
```

通过给 css 添加一个全局唯一的**属性选择器**来限制 css 只能在这个范围生效，也就是 scoped 的意思。

css-modules 是 **css-loader** 支持的方案，在 vue、react 中都可以用，它是通过编译的方式**修改选择器名字**为全局唯一的方式来实现 css 的样式隔离。

比如

```js
<style module>
.guang {
    color: red;
}
</style>
<template>
  <p :class="$style.guang">hi</p>
</template>
```

最后会被编译成

```js
<style module>
._1yZGjg0pYkMbaHPr4wT6P__1 {
    color: red;
}
</style>
<template>
    <p class="_1yZGjg0pYkMbaHPr4wT6P__1">hi</p>
</template>
```

和 scoped 方案的区别是 css-modules 修改的是选择器名字，而且因为名字是编译生成的，所以组件里是通过 **style.xx** 的方式来写选择器名。

### css in js

除了 css 本身的运行时、编译时方案，还可以通过 JS 来组织 css，利用 **JS 的作用域**来实现 css 隔离，这种是 **css-in-js** 的方案。

比如

```js

import styled from 'styled-components';

const Wrapper = styled.div`
    font-size: 50px;
    color: red;
`;

function Guang {
    return (
        <div>
            <Wrapper>内部文件写法</Wrapper>
        </div>
    );
}
```

但这个是运行时的，有点耗性能

## Ast 中的 css

看图加深基本认知[Postcss](https://astexplorer.net/)

![astpostcss.png](https://s2.loli.net/2022/08/18/cz4qPFfxQsLC7Bh.png)

postcss 插件的形式是一个函数返回一个对象，函数接收插件的 options，返回的的对象里包含了 AST 的处理逻辑，可以指定对什么 AST 做什么处理。

这里的 Once 代表对 AST 根节点做处理，第一个参数是 AST，第二个参数是一些辅助方法，比如可以创建 AST。

postcss 的 AST 主要有三种：

- atrule：以 @ 开头的规则，比如：

```css
@media screen and (min-width: 480px) {
  body {
    background-color: lightgreen;
  }
}
```

- rule：选择器开头的规则，比如：

```css
#main {
  border: 1px solid black;
}
```

- decl：具体的样式，比如：

```css
border: 1px solid black;
```

## 手写 css modules

> postCSS

postCSS 是一款 css 编译器。

类比 Babel 家族的 **@babel/parser** 可以将 js 代码解析为 AST（抽象语法树），再利用众多插件（@babel/plugin-xx）的能力改写 AST，最终输出改写后的 js 代码。

postCSS 利用自身的 parser 可以将 css 代码解析为 AST，再利用众多插件（上文介绍的 autoprefixer 就是一种）改写 AST，最终输出改写后的 css 代码。

首先看 npm [postcss-modules-scope](https://www.npmjs.com/package/postcss-modules-scope)官网中的例子

> postcss 生态是如何解析 postcss-modules-scope 的

```js
// before
:local(.continueButton) {
  color: red
}

// after

:export {
  continueButton: __buttons_continueButton_djd347adcxz9;
}

.__buttons_continueButton_djd347adcxz9 {
  color: red
}
```

用 **:local** 这样的伪元素选择器包裹的 css 会做选择器名字的编译，并且把编译前后的名字的映射关系放到 **:export** 这个选择器下。

其他复杂的例子

```js
.cpp {
  color: red
}
:local(.peng) {
  color: blue
}
:local(.pengpeng) {
  color: yellow
}
:local(.chenpp) {
  composes-with: peng;
  composes: pengpeng;
  color: red;
}
@keyframes :local(chenpengpeng) {
   from {
        width: 0;
    }
    to {
        width: 100px;
    }
}
```

会被编译成

```js

.cpp {
  color: red
}
._input_css_M56K5y__peng {
  color: blue
}
._input_css_M56K5y__pengpeng {
  color: yellow
}
._input_css_M56K5y__chenpp {
  color: red;
}
@keyframes _input_css_M56K5y__chenpengpeng {
   from {
        width: 0;
    }
    to {
        width: 100px;
    }
}
:export {
  cpp: cpp;
  peng: _input_css_M56K5y__peng;
  pengpeng: _input_css_M56K5y__pengpeng;
  chenpp: _input_css_M56K5y__chenpp _input_css_M56K5y__peng _input_css_M56K5y__pengpeng;
  chenpengpeng: _input_css_M56K5y__chenpengpeng
}
```

可以看到以 **:local** 包裹的才会被编译，不是 :local 包裹的会作为全局样式。

**composes-with 和 composes** 的作用相同，都是做样式的组合，可以看到编译之后会把 compose 的多个选择器合并到一起。也就是一对多的映射关系

源码

> 具体内容请看神光的文章分析

```js
const selectorParser = require('postcss-selector-parser');
const hasOwnProperty = Object.prototype.hasOwnProperty;

const plugin = (options = {}) => {
  const generateScopedName = (options && options.generateScopedName) || plugin.generateScopedName;
  return {
    postcssPlugin: 'postcss-modules-scope',
    Once(root, helpers) {
      const exports = {};
      function exportScopedName(name, rawName) {
        const scopedName = generateScopedName(
          rawName ? rawName : name,
          root.source.input.from,
          root.source.input.css,
        );
        exports[name] = exports[name] || [];
        if (exports[name].indexOf(scopedName) < 0) {
          exports[name].push(scopedName);
        }
        return scopedName;
      }

      // 遍历node
      function traverseNode(node) {
        switch (node.type) {
          case 'root':
          case 'selector': {
            node.each(traverseNode);
            break;
          }
          case 'id':
          case 'class':
            exports[node.value] = [node.value];
            break;
          case 'pseudo':
            if (node.value === ':local') {
              const selector = localizeNode(node.first, node.spaces);
              node.replaceWith(selector);
              return;
            }
        }
        return node;
      }

      // Find any :import and remember imported names
      const importedNames = {};
      root.walkRules(/^:import\(.+\)$/, (rule) => {
        rule.walkDecls((decl) => {
          importedNames[decl.prop] = true;
        });
      });

      function localizeNode(node) {
        switch (node.type) {
          case 'class':
            return selectorParser.className({
              value: exportScopedName(
                node.value,
                node.raws && node.raws.value ? node.raws.value : null,
              ),
            });
          case 'id': {
            return selectorParser.id({
              value: exportScopedName(
                node.value,
                node.raws && node.raws.value ? node.raws.value : null,
              ),
            });
          }
          case 'selector':
            node.nodes = node.map(localizeNode);
            return node;
        }
      }
      root.walkRules((rule) => {
        // parse 选择器为 AST
        const parsedSelector = selectorParser().astSync(rule);
        console.log(parsedSelector, 'parsedSelector');
        // 遍历选择器 AST 并实现转换
        rule.selector = traverseNode(parsedSelector.clone()).toString();

        rule.walkDecls(/composes|compose-with/i, (decl) => {
          // 处理 compose
          // 因为选择器的 AST 是 Root-Selector-Xx 的结构，所以要做下转换
          const localNames = parsedSelector.nodes.map((node) => {
            return node.nodes[0].first.first.value;
          });
          const classes = decl.value.split(/\s+/);
          classes.forEach((className) => {
            const global = /^global\(([^)]+)\)$/.exec(className);

            if (global) {
              localNames.forEach((exportedName) => {
                exports[exportedName].push(global[1]);
              });
            } else if (hasOwnProperty.call(importedNames, className)) {
              localNames.forEach((exportedName) => {
                exports[exportedName].push(className);
              });
            } else if (hasOwnProperty.call(exports, className)) {
              localNames.forEach((exportedName) => {
                exports[className].forEach((item) => {
                  exports[exportedName].push(item);
                });
              });
            } else {
              throw decl.error(`referenced class name "${className}" in ${decl.prop} not found`);
            }
          });
          decl.remove();
        });
      });

      root.walkAtRules(/keyframes$/i, (atRule) => {
        const localMatch = /^:local\((.*)\)$/.exec(atRule.params);

        if (localMatch) {
          atRule.params = exportScopedName(localMatch[1]);
        }
      });

      // If we found any :locals, insert an :export rule
      console.log(exports, 'exports');
      const exportedNames = Object.keys(exports);

      if (exportedNames.length > 0) {
        const exportRule = helpers.rule({ selector: ':export' });

        exportedNames.forEach((exportedName) =>
          exportRule.append({
            prop: exportedName,
            value: exports[exportedName].join(' '),
            raws: { before: '\n  ' },
          }),
        );
        root.append(exportRule);
      }
    },
  };
};
plugin.postcss = true;

plugin.generateScopedName = function (name, path = '') {
  const sanitisedPath = path
    .replace(/\.[^./\\]+$/, '')
    .replace(/[\W_]+/g, '_')
    .replace(/^_|_$/g, '');

  return `_${sanitisedPath}__${name}`.trim();
};
module.exports = plugin;
```

测试下

```js
const postcss = require('postcss');
const moduleScope = require('./index');

const input2 = `
.cpp {
  color: red
}
:local(.peng) {
  color: blue
}
:local(.pengpeng) {
  color: yellow
}
:local(.chenpp) {
  composes-with: peng;
  composes: pengpeng;
  color: red;
}
@keyframes :local(chenpengpeng) {
   from {
        width: 0;
    }
    to {
        width: 100px;
    }
}
`;
const pipeline = postcss([moduleScope]);

const res = pipeline.process(input2);

console.log(res.css, 'res');
```

需要 debugger 下，看看终端输出,本地调试 **.vscode/launch.json**

```json
{
  "configurations": [
    {
      "name": "debugger postcss-plugin-module-scope",
      "program": "${workspaceFolder}/plugin/test.js",
      "request": "launch",
      "skipFiles": ["<node_internals>/**"],
      "type": "node"
    }
  ]
}
```

![WechatIMG417.png](https://s2.loli.net/2022/08/17/zoFles9Y1kjvKJi.png)

## 参考

- [手写 css-modules 来深入理解它的原理](https://mp.weixin.qq.com/s/CX-LC014iZ4vpTko59Sf7A)

- [解剖 postCSS —— 向前端架构师迈出一小步](https://mp.weixin.qq.com/s/qyqsR8-QJ17L3J3PBIbJIg)
