---
title: string相关的积累
order: 7
group:
  order: 3
  title: 算法
  path: /interview/logic
nav:
  order: 3
  title: 'interview'
  path: /interview
---

- [大数相加](https://leetcode.cn/problems/add-strings/submissions/)
- [大数相乘](https://leetcode.cn/problems/multiply-strings/)

## [大数相加](https://leetcode.cn/problems/add-strings/submissions/)

```js
/**
 * @param {string} num1
 * @param {string} num2
 * @return {string}
 */
var addStrings = function (num1, num2) {
  var len = Math.max(num1.length, num2.length);
  num1 = num1.padStart(len, '0');
  num2 = num2.padStart(len, '0');
  var res = '';
  var flag = 0;
  for (let i = len - 1; i >= 0; i--) {
    flag = Number(num1[i]) + Number(num2[i]) + flag;
    res = (flag % 10) + res;
    flag = Math.floor(flag / 10);
  }
  res = flag === 1 ? '1' + res : res;
  return res;
};
```
