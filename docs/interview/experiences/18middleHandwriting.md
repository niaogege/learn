---
title: 202311手写汇总(6)-middleWriting
order: 18
group:
  order: 0
  title: interview
nav:
  order: 3
  title: 'interview'
  path: /interview
---

> 面试前的 middleWriting 中等难度

## 1.大数相乘

```js
function multiple(a, b) {
  let [m, n] = [a.length, b.length];
  let res = new Array(m + n).fill(0);
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      let p1 = i + j;
      let p2 = p1 + 1;
      let tmp = Number(a[i]) * Number(b[j]);
      let data = res[p2] + tmp;
      res[p2] = data % 10;
      res[p1] = Math.floor(data / 10) + res[p1];
    }
  }
  while (res[0] === 0) {
    res.shift();
  }
  return res.length ? res.join('') : '0';
}
multiple('22', '22');
```

## 2.数字转汉字

## 3.归并排序/堆排序

## 4.数组转树

```js

```

## 5.树转数组

## 6.判断对象是否存在循环引用

```js
function isCycleObj(obj) {
  let cache = new Set();
  let dfs = (obj) => {
    let vals = Object.values(val);
    for (val of vals) {
      if (cache.has(val)) {
        return true;
      }
      if (typeof val != 'object' || val == null) continue;
      cache.add(val);
      if (dfs(val)) {
        return true;
      }
    }
    return false;
  };
  return dfs(obj);
}
```

## 7.抢红包算法

```js
function redPacket(total, num, max = 2, min = '0.1') {
  function name(params) {
    let remain = total;
    let ans = [];
    for (let i = 0; i < num - 1; i++) {
      let Max = (remain / num) * max;
      let cur = Math.floor(Max * Math.random() * 100) / 100;
      cur = cur < min ? min : cur;
      ans.push(cur);
      remain = Math.round((remain - cur) * 100) / 100;
    }
    ans.push(remain);
    return ans;
  }
  redPacket(10, 4);
}
```

## 8.封装异步的 fetch，使用 async await 方式来使用

## 9.查找文章中出现频率最高的单词

## 10.实现双向数据绑定

## 11.判断两个数组内容是否相同

```js
function isSameArr(a, b) {
  if (a.length != b.length) return false;
  let m = new Map();
  // a塞到m
  for (let item of a) {
    if (m.has(item)) {
      m.set(item, m.get(item) + 1);
    } else {
      m.set(item, 1);
    }
  }
  for (let item of b) {
    let val = m.get(item);
    if (val == undefined || val < 1) return false;
    m.set(item, val - 1);
  }
  return true;
}
```

## 链接

- [手写 js](https://juejin.cn/post/6946136940164939813?searchId=2024031814180491A668E2D8A6BD15EEE9#heading-55)
