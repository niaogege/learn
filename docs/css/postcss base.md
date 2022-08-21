---
title: Postcss基础
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

[解剖 postCSS —— 向前端架构师迈出一小步](https://mp.weixin.qq.com/s/qyqsR8-QJ17L3J3PBIbJIg)

### postcss

postCSS 是一款 css 编译器。

类比 Babel 家族的@babel/parser 可以将 js 代码解析为 AST（抽象语法树），再利用众多插件（@babel/plugin-xx）的能力改写 AST，最终输出改写后的 js 代码。

postCSS 利用自身的**parser**可以将 css 代码解析为 AST，再利用众多插件（上文介绍的 autoprefixer 就是一种）改写 AST，最终输出改写后的 css 代码。

### postCSS 的 AST

你可以在 **[astexplorer](https://astexplorer.net/)** 中选择：

语言：css

parser：postCSS

来了解 postCSS 如何解析 css。节点有如下几种类型：

- Root：根节点，代表一个 css 文件

- AtRule：以@开头的申明，比如@charset "UTF-8"或@media (screen) {}

- Rule：内部包含定义的选择器，比如 input, button {}

- Decl(Declaration)：key-value 键值对，比如 color: black;

- Comment：单独的注释。selectors、at-rule 的参数以及 value 的注释在节点的 node 属性内

### 练习下 postcss-focus

[postcss-focus](https://www.npmjs.com/package/postcss-focus)会为所有 **:hover** 选择器增加 **:focus** 以提高键盘操作的可用性。

比如：

```css
.a:hover,
.b:hover {
  outline: 0;
}
.b:focus {
  background: red;
}
```

会被 postcss-foucus 编译成

```css
.a:hover,
.b:hover,
.a:focus {
  outline: 0;
}
.b:focus {
  background: red;
}
```

源码实现

```js
function hasAlready(parent, selector) {
  return parent.some((i) => {
    return i.type === 'rule' && i.selectors.includes(selector);
  });
}
const plugin = () => ({
  postcssPlugin: 'postcss-cpp-plugin',
  Once(root) {
    // Transform CSS AST here
    root.walkRules((rule) => {
      if (rule.selector.includes(':hover')) {
        let focuses = [];
        for (let selector of rule.selectors) {
          if (selector.includes(':hover')) {
            let replaced = selector.replace(/:hover/g, ':focus');
            if (!hasAlready(rule.parent, replaced)) {
              focuses.push(replaced);
            }
          }
        }
        if (focuses.length) {
          rule.selectors = rule.selectors.concat(focuses);
        }
      }
    });
  },
});
plugin.postcss = true;
module.exports = plugin;
```

本地测试文件

```js
const postcssFocus = require('./index');
const postcss = require('postcss');
const fs = require('fs');
const path = require('path');
// 输入的css文件地址
const from = path.join(__dirname, './test.css');
const to = path.join(__dirname, './a.css');

fs.readFile(from, (err, css) => {
  postcss([postcssFocus])
    .process(css, { from, to })
    .then((result) => {
      fs.writeFileSync(to, result.css);
    });
});
```

分析下步骤

- postCSS 将输入的 css 解析为 AST

- 遍历 AST 中所有 Rule 类型节点

- 维护一个数组 focuses，遍历这个节点的所有 selector，每遍历到一个包含:hover 的 selector 就往数组中 push 一个:focus 的 selector

- 将 2 中得到的数组 concat 到该节点已有的 selectors 后

- 根据改变后的 AST 输出新的 css

### 总结

当前 postCSS 插件按功能划分大体有如下几类：

- 解决全局 css 问题，比如提供 css module[10]支持

- 使用未全面兼容的 css 特性，比如 autoprefixer[11]

- 格式化，提高 css 可读性

- 图片和文字处理

- linters，比如 stylelint

不同语法的 css 支持，比如 [postcss-html](https://www.npmjs.com/package/postcss-html)可以解析类 html 文件中<style>标签内的 css 语法
