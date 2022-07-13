---
title: SFC
order: 0
group:
  title: vue生态
  order: 1
nav:
  order: 8
  title: 'vue'
  path: /vue
---

SFC: 单文件组件 single File Component

- h() 函数是一个用于创建 VNode 的实用程序,准确的命名成 createVNode(),如何简称为 h()
- 如果让你设计类似的.cpp 文件，如何设计？一个 sfc 主要包含三个模块
  - template
  - script
  - style

要分别将这三部分，转换成 js 并组合成一个 Vue 对象，编译成 js 对象形式的 Vue 组件对象

> 像是快应用里的 ux 文件以及微信小程序里的 wxml 都是一样的套路说到底还是运用 nodejs 操作文件的能力，对文件进行增删改，然后拼接成 js 对象的方式组成 vue 组件

这里主要运用到@vue/compiler-sfc 这个库，专门用于 Vue 文件的预编译, 右大佬就是太厉害了，vue 生态的每一个细节都能单独成 package

## vue 文件编译整体流程

- 利用@vue/compiler-sfc 的预编译能力，对 vue 文件解析，读取文件内容
- 编译 script, 处理 script setup 代码以及合并 script，处理 css 变量注入
- 编译 template,编译 template，目的是将 template 转成 render 函数
- 组合 script 和 render 函数
- 利用 esbuild 打包代码
- 编译 style 产物

## 参考大佬

- [没想到这么简单！手把手教你处理 Vue 文件并渲染到页面~](https://mp.weixin.qq.com/s/buEAaIpiP57MP6dEjODDzQ)
- [node 端调试 js](https://www.php.cn/js-tutorial-482802.html)
