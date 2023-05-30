---
title: 实现 px 转rem(笔记)
order: 7
group:
  order: 0
  title: css
  path: /interview/css
nav:
  order: 3
  title: 'interview'
  path: /interview
---

### postcss

“PostCSS，一个使用 JavaScript 来处理 CSS 的框架”

PostCSS 主要做了三件事：

- **parse**：把 CSS 文件的字符串解析成抽象语法树（Abstract Syntax Tree）的框架，解析过程中会检查 CSS 语法是否正确，不正确会给出错误提示。

- **transform**: 执行插件函数。PostCSS 本身不处理任何具体任务，它提供了**以特定属性或者规则命名**的事件。有特定功能的插件（如 autoprefixer、CSS Modules）会注册事件监听器。PostCSS 会在这个阶段，重新扫描 AST，**执行注册的监听器函数**。

- **generate**: 插件对 AST 处理后，PostCSS 把处理过的 AST 对象转成 CSS string。

### postcss 插件写法

postcss 插件是工作在 runPlugin / transform 阶段，处理 ast 节点，插件的形式是这样的：

```js
const plugin = (options = {}) => {
  return {
    postcssPlugin: '插件名字',
    Rule(node) {},
    Declaration(node) {},
    AtRule(node) {},
  };
};
```

### 实战

px 是一个固定的长度单位，而设备视口的尺寸是各种各样的，我们想通过一套样式来适配各种设备的显示，就需要相对的单位，常用的是 rem。

rem 的本质就是等比缩放，相对于 html 元素的 font-size。

比如 html 的 font-size 设置为 100px，那 1rem 就等于 100px，之后的样式如果是 200px 就写为 2rem。

这样我们只需要修改 **html 的 font-size** 就可以适配各种屏幕宽度的显示，具体的单位会做等比缩放。

我们要根据 html 的 font-size 值来把所有的 px 转换为 rem，一般都是手动来做这件事情的，但比较繁琐，知道了计算方式之后，完全可以用 postcss 插件来自动做。

```js
// index.js

const plugin = (option) => {
  const pxReg = /(\d+)px/gi;
  const { rootValue } = option;
  return {
    postcssPlugin: 'postcss-plugin-pxTorem',
    Declaration(dec) {
      if (dec.value.indexOf('px') > -1) {
        dec.value = dec.value.replace(pxReg, (matchStr, num) => {
          return num / rootValue + 'rem';
        });
      }
    },
  };
};

module.exports = plugin;
```

测试下

```js
const postcss = require('postcss');
const moduleScope = require('./index');
const fs = require('fs');
const path = require('path');
const input2 = `
test {
  width: 20px;
}
a {
  font-size: 28px;
}
.ignore {
  border: 1Px solid red;
  border-width: 2Px;
}
`;

const res = postcss([moduleScope({ rootValue: 16 })]).process(input2);
const from = path.join(__dirname, './test.css');
fs.writeFile(from, res.css, function (err) {
  if (err) {
    throw err;
  }
  console.log('File is Writen');
});
console.log(res.css, 'res');
```

node 执行下 test.js，得到如下编译结果,编译成功

```css
// test.css
test {
  width: 1.25rem;
}
a {
  font-size: 1.75rem;
}
.ignore {
  border: 1px solid red;
  border-width: 2px;
}
```

### 参考

- [零基础理解 PostCSS 的主流程](https://mp.weixin.qq.com/s/Bkss0lzPT-TI6GyGxMyn3Q)

- [快速入门 postcss 插件：自动转换 px 到 rem](https://mp.weixin.qq.com/s?__biz=Mzg3OTYzMDkzMg==&mid=2247486562&idx=1&sn=d996787c1940d6ff4bba3cb0a01918b3&chksm=cf00c359f8774a4fcb8ee8e98a93c9825c958c959e098baf571dff1cdf4290eb7b751241d1dc&token=2101214812&lang=zh_CN#rd)
