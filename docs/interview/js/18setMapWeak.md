---
title: weakMap/weakMap应用场景
order: 18
group:
  order: 1
  title: Basic
  path: /interview/js
nav:
  order: 3
  title: 'interview'
  path: /interview
---

> hash 碰撞是啥玩意

## Map/WeakMap

Object 结构提供了“字符串—值”的对应，Map 结构提供了“**值—值**”的对应，是一种更完善的 **Hash** 结构实现。如果你需要“键值对”的数据结构，Map 比 Object 更合适。

### 设计相关的面试题

## Set/WeakSet

ES6 提供了新的数据结构 Set。它类似于数组，但是成员的值都是唯一的，没有重复的值。

Set 本身是一个构造函数，用来生成 Set 数据结构。

Set 函数可以接受一个数组（或者具有 **iterable** 接口的其他数据结构）作为参数，用来初始化。

```js
// 例一
const set = new Set([1, 2, 3, 4, 4]);
[...set];
// [1, 2, 3, 4]

// 例二
const items = new Set([1, 2, 3, 4, 5, 5, 5, 5]);
items.size; // 5

// 例三
const set = new Set(document.querySelectorAll('div'));
set.size; // 56

// 类似于
const set = new Set();
document.querySelectorAll('div').forEach((div) => set.add(div));
set.size; // 56
```

- [通过垃圾回收机制来了解 Map 与 WeakMap](https://mp.weixin.qq.com/s/reCQIfaLM3rTsvKJwovIHQ)
