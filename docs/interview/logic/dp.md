---
title: 动态规划
order: 9
group:
  order: 3
  title: 算法
  path: /interview/logic
nav:
  order: 3
  title: 'interview'
  path: /interview
---

dp 五大步骤

- 确定 dp 数组以及下标的含义 dp[i]还是 dp[i][j]
- 确定递推公式,比如 dp[i] = dp[i - 2] + dp[i - 1]
- dp 数组初始化,比如 dp[0] = 0, dp[1] = 1;
- 确定遍历顺序,从前到后或者从后往前
- 举例推导 dp 数组

### [53. 最大子数组和](https://leetcode.cn/problems/maximum-subarray/)

DP 解法，若前一个元素的和大于 0，则将其加到当前元素上

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function (nums) {
  if (!nums.length) return 0;
  let max = nums[0];
  let dp = [];
  dp[0] = nums[0];
  for (let i = 1; i < nums.length; i++) {
    if (dp[i - 1] > 0) {
      dp[i] = dp[i - 1] + nums[i];
    } else {
      dp[i] = nums[i];
    }
    max = Math.max(dp[i], max);
  }
  return max;
};
```

### [647. 回文子串](https://leetcode.cn/problems/palindromic-substrings/)

```js
/**
 * @param {string} s
 * @return {number}
 */
var countSubstrings = function (s) {
  // 构造回文数组
  var len = s.length;
  // [[false, false],[false, false]]
  var dp = new Array(len).fill(0).map((_) => new Array(len).fill(false));
  let count = 0;
  for (let i = len - 1; i >= 0; i--) {
    for (let j = i; j < len; j++) {
      if (s[j] === s[i]) {
        if (j - i <= 1) {
          count = count + 1;
          dp[i][j] = true;
        } else if (dp[i + 1][j - 1]) {
          count = count + 1;
          dp[i][j] = true;
        }
      }
    }
  }
  return count;
};
```

### [最长回文子串](https://leetcode.cn/problems/longest-palindromic-substring/)

```js
/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function (s) {};
```

### [正则表达式匹配](https://leetcode.cn/problems/regular-expression-matching/)
