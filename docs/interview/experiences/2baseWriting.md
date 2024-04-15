---
title: 面试经验之手写js基础版
order: 13
group:
  order: 11
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

```js
Array.prototype.mockMap = function (fn, context) {
  var arr = Array.prototype.slice.call(this) || []
  var res = []
  for (let i = 0; i < arr.length; i ++) {
    res.push(fn.call(context, arr[i], i, arr)))
  }
  return res
}
```

### myReduce 重写

```js
Array.prototype.myReduce = function (fn, init) {
  var arr = Array.prototype.slice.call(this) || [];
  var res = init ? init : arr[0];
  let startIndex = init ? 0 : 1;
  for (let startIndex; startIndex < arr.length; startIndex++) {
    res = fn.call(null, res, arr[startIndex], startIndex, arr);
  }
  return res;
};
var sum = [1, 2].reduce((a, b) => a + b, 10);
console.log(sum, 'sum');
var sum2 = [1, 2].myReduce((a, b) => a + b, 10);
console.log(sum2, 'sum');
```

### myFlat

```js
Array.prototype.myFlat = function (depth = 1) {
  var arr = Array.prototype.slice.call(this) || [];
  var i = 0;
  while (arr.some((e) => Array.isArray(e))) {
    arr = [].concat(...arr);
    i++;
    if (i >= depth) break;
  }
  console.log(arr, 'arr');
  return arr;
};
var test = [1, [2, 3, 4], [[5, 6, 7]]];
test.myFlat(2);

Array.prototype.myFlatten2 = function (depth = 1) {
  var arr = Array.prototype.slice.call(this) || [];
  var stack = [...arr];
  var res = [];
  let i = 0;
  while (stack.length) {
    var cur = stack.pop();
    if (Array.isArray(cur) && i <= depth) {
      i++;
      stack.push(...cur);
    } else {
      res.push(cur);
    }
  }
  return res;
};
var test = [1, [2, 3, 4], [[5, 6, 7]]];
test.myFlatten2(2);
```
