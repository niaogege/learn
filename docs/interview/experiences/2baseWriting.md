---
title: 面试经验之手写js基础版
order: 2
group:
  order: 0
  title: interview
nav:
  order: 3
  title: 'interview'
  path: /interview
---

> 准备至少 30 个常规手写题，基础扎实一点

- myCall/myApply
- mockNew
- LRU 最近最少更新 缓存淘汰策略
- compose 组合，洋葱模型
- myBind
- curry(参数固定和不固定)
- bigIntSum 大数相加
- deepClone 深浅拷贝
- 16 进制转 rgb or rgb 转 16 进制
- mockMap/mockFilter 数组方法重写
- myReduce 重写
- flatter 扁平化手写
- 手写发布订阅模式
- instanceof 手写

### new 手写

### apply 和 call 手写

### bind 手写

### mockMap/mockFilter 数组方法重写

### myReduce 重写

```js
Array.prototype.myReduce = function (fn, init) {
  var arr = Array.prototype.slice.call(this) || [];
  var res = init ? init : arr[0];
  for (let i = init ? 0 : 1; i < arr.length; i++) {
    res = fn.call(null, res, arr[i], i, arr);
  }
  return res;
};
var sum = [1, 2].reduce((a, b) => a + b, 10);
console.log(sum, 'sum');
var sum2 = [1, 2].myReduce((a, b) => a + b, 10);
console.log(sum2, 'sum');
```
