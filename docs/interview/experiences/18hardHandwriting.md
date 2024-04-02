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

> 没有强求要掌握，当然掌握最好，多多益善

> 顶多 20 个

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

```js
// 后续补上
function trans(str) {
  let isLof = +str < 0;
  let res = [];
  let units = ['', '万', '亿'];
  let len = str.length;
  for (let i = len; i > 0; i -= 4) {
    let cur = parseHan(str.slice(Math.max(0, i - 4), i));
    res.push(cur);
  }
  for (let i = 0; i < res.length; i++) {
    res[i] += units[i];
  }

  if (isLof) {
    res.push('负');
  }
  return res.reverse().join('');
}

function parseHan(str) {
  str = '' + str;
  let units = ['', '十', '百', '千'];
  let nums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  let res = '';
  let len = str.length;
  for (let i = 0; i < len; i++) {
    let cur = str[i];
    if (cur != '0') {
      // 102
      if (i >= 1 && str[i - 1] == '0') {
        res += nums[0];
      }
      // key
      res += nums[cur] + units[len - i - 1];
    }
  }
  if (str.length == 2 && str[0] == 1) {
    res = res.slice(1);
  }
  return res;
}
// parseHan('103');
trans('123456');
```

## 3.归并排序/堆排序

```js
function mergeSort(arr) {
  let merge = (l, r) => {
    let i = 0,
      j = 0;
    let res = [];
    while (i < l.length && j < r.length) {
      if (r[j] > l[i]) {
        res.push(l[i++]);
      } else {
        res.push(r[j++]);
      }
    }
    while (i < l.length) {
      res.push(l[i++]);
    }
    while (j < r.length) {
      res.push(r[j++]);
    }
    return res;
  };
  let sort = (arr) => {
    if (arr.length == 1) return arr;
    let mid = Math.floor(arr.length / 2);
    let l = arr.slice(0, mid);
    let r = arr.slice(mid);
    return merge(mergeSort(l), mergeSort(r));
  };
  return sort(arr);
}
mergeSort([1, 222, 1, 24, 23, 44, 9]);
```

## 4.十进制转 36 进制

```js
function to36(num, radix = 36) {
  num = +num;
  let units = '0123456789abcdefghijklmnopqrstuvwxzy';
  let res = '';
  while (num > 0) {
    let flag = Math.floor(num % radix);
    res = units[flag] + res;
    num = Math.floor(num / radix);
  }
  return res;
}
to36('360');
```

## 5.

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

> [出自](https://juejin.cn/post/6946136940164939813?searchId=2024031814180491A668E2D8A6BD15EEE9#heading-60)

```js
class HttpRequestUtils {
  async get(url) {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  }
  async post(url, data) {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const data = await res.json();
    return data;
  }
}
const httpUtil = new HttpRequestUtils();
const res = await httpUtil.get('http://golderbrother.cn/');
console.log(res);
```

## 9.查找文章中出现频率最高的单词(几率太低了)

```js
function findMoreWords(str) {
  if (str.length == 0) return 0;
  str = str.trim().toLowerCase();
  let wordList = str.match(/[a-z]+/g),
    visited = [],
    maxNum = 0,
    maxWord = '';
  str = ' ' + wordList.join(' ') + ' ';
  wordList.forEach((item) => {
    if (visited.indexOf(item) < 0) {
      visited.push(item);
      let word = new RegExp(' ' + item + ' ', 'g');
      let count = str.match(word).length;
      if (count > maxNum) {
        maxNum = count;
        maxWord = item;
      }
    }
  });
  return maxWord + '' + maxNum;
}
```

## 10.实现双向数据绑定

```js
function mockData() {
  let obj = {}
  let input = document.getElementById('input')
  let span = document.getElementById('span')
  // 数据劫持
  Object.defineProperty(obj, 'text', {
    configurable: true,
    enumerable: true,
    get() {},
    set(val) [
      input.value = val
      span?.innerHTML = val
    ]
  })
  input?.addEventListener('click', function(e) {
    obj.text = e.target.value
  })
}
```

## 11.

## 链接

- [手写 js](https://juejin.cn/post/6946136940164939813?searchId=2024031814180491A668E2D8A6BD15EEE9#heading-55)
