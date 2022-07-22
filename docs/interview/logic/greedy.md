---
title: 贪心算法相关
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

### [53. 最大子数组和](https://leetcode.cn/problems/maximum-subarray/)

贪心解法，若当前指针所指元素的和 sum 小于 0，则丢弃当前元素的和

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function (nums) {
  let res = nums[0];
  let sum;
  for (let num of nums) {
    if (sum > 0) {
      sum = sum + num;
    } else {
      sum = num;
    }
    res = Math.max(res, sum);
  }
  return res;
};
```
