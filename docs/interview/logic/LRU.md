---
title: LRU(least Recently used)最近最少使用
order: 8
group:
  order: 3
  title: 算法
  path: /interview/logic
nav:
  order: 3
  title: 'interview'
  path: /interview
---

```js
class LRU {
  constructor(limit) {
    this.cache = new Map();
    this.limit = limit;
  }
  get(key) {
    var val = this.cache.get(key);
    if (this.cache.has(key)) {
      this.cache.delete(key);
      this.cache.set(key, val);
    } else {
      return -1;
    }
  }
  set(key, val) {
    var value = this.cache.get(key);
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.limit) {
      var oldKey = this.cache.keys().next().value;
      this.cache.delete(oldKey);
    }
    this.cache.set(key, val);
  }
}
```
