---
title: 动态规划Hard
order: 10
group:
  order: 3
  title: 算法
  path: /interview/logic
nav:
  order: 3
  title: 'interview'
  path: /interview
---

> DP 动态规划是真的难，这辈子遇到过最难的算法，没有之一 0919

> 感觉坚持不下去了，咋办

### [494. 目标和](https://leetcode.cn/problems/target-sum/)

- dp 定义下标

- dp 递推公式不考虑 nums[i]的情况下，填满容量为 j 的背包，有 dp[j]种方法。

那么考虑 nums[i]的话（只要搞到 nums[i]），凑成 dp[j]就有 dp[j - nums[i]] 种方法。

例如：dp[j]，j 为 5，

已经有一个 1（nums[i]） 的话，有 dp[4]种方法 凑成 dp[5]。已经有一个 2（nums[i]） 的话，有 dp[3]种方法 凑成 dp[5]。已经有一个 3（nums[i]） 的话，有 dp[2]中方法 凑成 dp[5] 已经有一个 4（nums[i]） 的话，有 dp[1]中方法 凑成 dp[5] 已经有一个 5 (nums[i]） 的话，有 dp[0]中方法 凑成 dp[5]

```js
dp[j] = dp[j] + dp[j - nums[i]];
```

- dp 初始化

```js
dp = new Array(size + 1).fill(1);
```

- dp 遍历顺序

nums 放在外循环，target 在内循环，且内循环倒序。

- dp 举例

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var findTargetSumWays = function (nums, target) {
  let sum = nums.reduce((a, b) => a + b);
  var bgSize = sum + target / 2;
  if (Math.abs(target) > sum) return 0;
  if ((sum + target) % 2) return 0;
  var dp = new Array(bgSize + 1).fill(0);
  dp[0] = 1;
  for (let i = 0; i < nums.length; i++) {
    for (let j = bgSize; j >= nums[i]; j--) {
      dp[j] = dp[j] + dp[j - nums[i]];
    }
  }
  return dp[bgSize];
};
```
