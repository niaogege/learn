---
title: 手写js2
order: 2
group:
  order: 1
  title: Basic
  path: /interview/js
nav:
  order: 3
  title: 'interview'
  path: /interview
---

## 手写可以缓存的接口封装

## 手动实现一个 vue 模版字符串 render

```js
输入： render(`{{msg}}-{{name}}`, {msg: 'chendap', name: 'wmh'})
输出： chandap-wmh
function render(str, data) {
  var reg = /\{\{(\w+)\}\}/
  if (reg.test(str)) {
    const name = reg.exec(str)[1]
    str = str.replace(reg, data[name])
    return render(str, data)
  }
  return str
}
render(`{{msg}}-{{name}}`, {msg: 'chendap', name: 'wmh'})
```

## 手动实现一个模版字符串

## 手写字母转换

```js
输入: 'on-click-handle'
输出： 'onClickHandle'
function transform(str) {
  return str.replace(/[-|@|_]+(.)?/g, (match, path) => {
    return path ? path.toUpperCase() : ''
  })
}
transform('on-click-handle')
```

## 二分查找

```js

```

## 参考

- [社招面经】22 年裁员潮下的前端面经分享](https://mp.weixin.qq.com/s/_c34EF6xNLs8JFmnU1M0Zg)
