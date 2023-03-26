---
title: css loader的各种区别
order: 3
group:
  order: 0
  title: css
  path: /interview/css
nav:
  order: 3
  title: 'interview'
  path: /interview
---

webpack 中的 style-loader 跟 css-loader 区别

## style-loader

style-loader 则是将 CSS 模块的样式插入到 HTML 页面的 style 标签中，使其生效。它可以将 **多个 CSS 模块的样式合并到一个 style** 标签中，减少 HTTP 请求，提高页面性能

## css-loader

css-loader 用于处理 CSS 文件，将 **CSS 文件转换为 JavaScript 模块**，以便在 JavaScript 中使用。它支持 **CSS 模块化、压缩、代码分割**等功能。

因此，一般情况下，我们需要同时使用 css-loader 和 style-loader，将 CSS 文件转换为 JavaScript 模块，并将样式插入到 HTML 页面中。例如：

```js
module: {
  rules: [
    {
      test: /.css$/,
      use: ['style-loader', 'css-loader'],
    },
  ];
}
```

## 手写 style-loader [...待续]

## 手写 css-loader [...待续]
