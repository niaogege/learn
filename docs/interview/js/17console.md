---
title: 常考的打印题
order: 17
group:
  order: 1
  title: Basic
  path: /interview/js
nav:
  order: 3
  title: 'interview'
  path: /interview
---

## 数值转换

```js
var box = {
  valueOf() {
    console.log('调用了valueOf');
    return 'abc';
  },
  toString() {
    console.log('调用了toString');
    return '123';
  },
};
console.log(Number(box));
```

以及

```js
var box = {
  valueOf() {
    console.log('调用了valueOf');
    return {};
  },
  toString() {
    console.log('调用了toString');
    return '123';
  },
};
console.log(Number(box));
```

转换规则如下：

如果 valueOf 存在，且返回“基本类型”数据，返回 valueOf 的结果。如果 toString 存在，且返回“基本类型”数据，返回 toString 的结果。报错。
