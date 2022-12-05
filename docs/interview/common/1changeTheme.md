---
title: 主题换肤前端实现
order: 1
group:
  order: 2
  title: 通用业务
  path: /interview/common
nav:
  order: 3
  title: 'interview'
  path: /interview
---

# 主题换肤前端实现

感触最大的就是我遇到 cra 搭建的项目不支持 scss 时，最先想到的方法竟然是百度或者谷歌？其实第一步要先去官网，一般官网都是有比较详细的步骤，如果官网没有介绍，再去谷歌，其次再去 stack 提问，最后还阔以去官网上 github 提 issue,说明进步空间很大！！

## 唤肤前置

### 仓库前的准备

- 需要有一个 react 项目<code>npx create-react-app my-app</code>
- 需要配置下 sass, <code>npm install node-sass --save</code>
  > cra 搭建的项目[添加 Sass 样式表](https://www.html.cn/create-react-app/docs/adding-a-sass-stylesheet/)

### css 特性属性相关

"value 是完整单词"  类型的比较符号: ~=, |= "拼接字符串" 类型的比较符号: `*=, ^=, $=`

- attribute 属性中包含 value:　 `[attribute ~= value]` 属性中包含独立的单词为 value，例如： [title ~= flower] --> <code><div title="tulip flower" /></code>

`[attribute *= value]` 属性中做字符串拆分，只要能拆出来 value 这个词就行，例如： [title *= flower] --> <code><div title="ffffflowerrrrrr" /></code>

- attribute 属性以 value 开头: `[attribute |= value]` 属性中必须是完整且唯一的单词，或者以  -  分隔开：，例如： [lang|=en] --> <p lang="en"> <p lang="en-us"> `[attribute ^= value]` 属性的前几个字母是 value 就可以，例如： [lang^=en] --> <p lang="ennn"> [data-theme^='dark'], [data-theme^='dark'] { --bg: #1e1e1e; --scrollbar: #6a6a6a; }

- attribute 属性以 value 结尾: `[attribute $= value ]` 属性的后几个字母是 value 就可以，例如：<code>a[src$=".pdf"]</code>

### css 自定义属性

CSS 自定义属性(Custom Properties)，在一个 css 选择器内部进行定义，使用两个短横连接线 `--` 作为开头命名的名称即被称为自定义属性。

可以给该自定义属性设置任意 css 属性值。该自定义属性赋值后，将可以作为变量赋值给 css 样式属性，会立马生效。

定义：`--custom-property-name: custom-property-value`

```scss
body {
  --color: red;
  --font-size: 20px;
  --font-color: #000;
}
```

css 自定义属性存在作用域，即它声明时候所处的 css 选择器。

当自定义属性属性声明在某个 css 选择器内的时候，则该选择器的元素和它的所有子元素，都可以使用该自定义属性。

当声明在 `:root` 下的时候，则全文档范围内皆可使用。`:root` 是一个伪类选择器，用来匹配文档的根元素。而在 html 中，根元素即为` <html>` 元素，但:root 优先级更高，其他则相同。

```scss
:root {
  --color: red;
  --font-size: 20px;
  --font-color: #000;
}
```

### 根据参数自定义变量颜色混入(!敲黑板)

当前主题是*dark* or *light*时 需要重新定义变量的值，通过借助第三方 css 预编译工具: **less/scss**中的 `@minix`混入功能

> 本文皆已.scss 文件格式为准,前文已提过项目如何配置 scss

```scss
// 定义
@mixin theme-color($name, $light, $dark) {
  :root {
    #{$name}: $light;
  }
  html[data-theme='dark'] {
    #{$name}: $dark;
  }
}
// 使用
@import '../../style/mixin/color.scss'; // 这一步很关键
@include theme-color(--study-primary-color, '#fff', '#000') .main {
  color: var(--study-primary-color);
}
```

> scss 还是蛮强大的，里面还有 if each 等简单的语法[@mixin](https://www.sasscss.com/documentation/at-rules/mixin)

## 主题换肤步骤

### First 创建 scss 文件

创建样式文件主入口， **index.scss** 其中包含 _light.scss_ 和 _dark.scss_,

```scss
@import './dark.scss';
@import './light.scss';
```

默认是 light, 阔以更改成 dark

- dark.scss

```scss
:root[data-theme^='dark'] {
  --color: rgb(58, 56, 56);
  --font-size: 14px;
  --font-color: #fff;
}
```

- light.scss

```scss
:root[data-theme^='light'] {
  --color: red;
  --font-size: 20px;
  --font-color: #000;
}
```

创建完之后，在项目启动入口那里引入即可

### Second 主入口文件通过 js 改变主题

> 在 index.js 更改，一般阔以把当前的主题存放在本地存储 localStorage 中

```js
const changeTheme = (e = 'light') => {
  const docEle = document.documentElement;
  docEle.setAttribute('data-theme', e);
};
```

### Third 根据自定义传入的参数决定主题的色值

这一步主要是用于当前作用域的文件，当然绝大部分的主题色是阔以定义在前面说的*dark.scss/light.scss*

```scss
@mixin theme-color($var, $light, $dark) {
  :root {
    #{$val}: $light;
  }
  html[data-theme='dark'] {
    #{$val}: $dark;
  }
}
```

然后组件里使用

```css
@import '../../style/mixin/color.scss';
@include theme-color(--border-set, 10px solid #c9c9c9, 20px dashed #666666);

.child {
  width: 500px;
  height: 300px;
  color: var(--font-color);
  font-size: var(--font-size);
  background: var(--color);
  border: var(--border-set);
}
```

### 参考文档

- [CSS 自定义属性与前端页面的主题切换](https://mp.weixin.qq.com/s/XXQ5tzY3c9GIxreJqu30Uw)
- [CRA 添加 sass](https://www.html.cn/create-react-app/docs/adding-a-sass-stylesheet/)
- [create-react-app 中支持 sass，怎么搞？](https://blog.csdn.net/yunchong_zhao/article/details/120812718)
