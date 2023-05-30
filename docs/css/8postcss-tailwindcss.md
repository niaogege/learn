---
title: 如何实现自己的tailwindcss
order: 8
group:
  order: 0
  title: css
  path: /interview/css
nav:
  order: 3
  title: 'interview'
  path: /interview
---

postCSS 利用自身的 parser 可以将 css 代码解析为 AST，再利用众多插件（上文介绍的 autoprefixer 就是一种）改写 AST，最终输出改写后的 css 代码。
