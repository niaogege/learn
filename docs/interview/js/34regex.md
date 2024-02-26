---
title: 正则表达式总结练习
order: 34
group:
  order: 1
  title: js Basic
  path: /interview/js
nav:
  order: 3
  title: 'interview'
  path: /interview
---

> 正则练习题汇总

正则表达式是**匹配模式**，要么**匹配字符**，要么**匹配位置**

[强烈推荐](https://juejin.cn/post/7021672733213720613#heading-24)

## 面试中可能遇到的正则类型的题目

- 手机号 3-4-4 分割
- 数字价格千分位分割
- [将字符串首字母转化为大写，剩下为小写](https://juejin.cn/post/7070284710131269669?searchId=202401041945548E669BD2908D492430A4)
- 将字符串驼峰化
- hex 转换 rgb 互相转换
- vue 中的 template 解析
- 验证密码的合法性

## 首字母大写，剩下小写

> 非捕获性括号（?:p）

```js
function capitalize(str) {
  return str.toLowerCase().replace(/(?:^|\s+)\w/g, (p) => p.toUpperCase());
}
capitalize('hello world'); // 'Hello World'
```

## 手机号 3-4-4 分割

```js
function mobile(str) {
  return str.replace(/(?=(\d{4})+$)/g, '-');
}
mobile('18799999999'); // '187-9999-9999'
```

## hex 和 rgb 互相转换

```js
// #ffffff => rgb(255, 255, 255)
function hexToRgb(str) {
  str = str.replace('#', '0x');
  var r = str >> 16;
  var g = (str >> 8) & 0xff;
  var b = str & 0xff;
  return `rgb(${r},${g},${b})`;
}
hexToRgb('#ffffff');
// rgb(255, 255, 255) => #ffffff
function rgbToHex(str) {
  let [, r, g, b] = str.split(/\D+/); // [_, 255,255,255 ]
  var toHex = (hex) => {
    let s = (+hex).toString(16);
    return s.length == 1 ? '0' + s : s;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
rgbToHex('rgb(255, 255, 255)');
```

## 数字价格千分位分割

```js
function toThousand(str) {
  return str.replace(/(?!^)(?=(\d{3})+$)/g, ',');
}
toThousand('12345');
```

## vue 中的 template 解析

```js
function render(str, data) {
  let reg = /\{\{(\w+)\}\}/;
  if (reg.test(str)) {
    var key = reg.exec(str)[1];
    str = str.replace(reg, data[key]);
    return render(str, data);
  }
  return str;
}
render('my{{name}}::{{age}}', {
  name: 'cpp',
  age: 32,
});
```

## 字符串驼峰化

```js
function transform(str) {
  return str.replace(/[_-\s](\w)/g, (_, p) => p.toUpperCase());
}
transform('cpp-wmh-and'); //cppWmhAnd
```
