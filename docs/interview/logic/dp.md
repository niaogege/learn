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

感谢卡子哥提供的技术支持[代码随想录](https://programmercarl.com/%E5%8A%A8%E6%80%81%E8%A7%84%E5%88%92%E7%90%86%E8%AE%BA%E5%9F%BA%E7%A1%80.html#%E4%BB%80%E4%B9%88%E6%98%AF%E5%8A%A8%E6%80%81%E8%A7%84%E5%88%92)

> 接下来的重点刷题对象

### dp 五大步骤

- 确定 **dp** 数组以及下标的含义 dp[i]还是 dp[i][j]
- 确定**递推公式**,比如 dp[i] = dp[i - 2] + dp[i - 1]
- dp 数组**初始化**,比如 dp[0] = 0, dp[1] = 1;
- 确定**遍历顺序**,从前到后或者从后往前,
- 举例推导 dp 数组

### [509. 斐波那契数](https://leetcode.cn/problems/fibonacci-number/)

五个步骤

- 确定 dp 数组以及下标含义：dp[i]的定义为：第 i 个数的斐波那契数值是 dp[i]
- 确定递归公式：状态转移方程 dp[i] = dp[i - 1] + dp[i - 2];
- dp 数组初始化：dp[0] = 0,dp[1]=1
- 确定遍历顺序：从前到后或者从后往遍历
- 举例推导 dp 数组：当 N 为 10 的时候，dp 数组应该是如下的数列：0 1 1 2 3 5 8 13 21 34 55

```js
/**
 * @param {number} n
 * @return {number}
 */
var fib = function (n) {
  var dp = [0, 1];
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
};
```

### [70. 爬楼梯](https://leetcode.cn/problems/climbing-stairs/)

假设你正在爬楼梯。需要 n 阶你才能到达楼顶。

每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？

示例 1

```js
输入：n = 2
输出：2
解释：有两种方法可以爬到楼顶。
1. 1 阶 + 1 阶
2. 2 阶

输入：n = 3
输出：3
解释：有三种方法可以爬到楼顶。
1. 1 阶 + 1 阶 + 1 阶
2. 1 阶 + 2 阶
3. 2 阶 + 1 阶
```

动规五步骤

- 确定 dp 数组以及下标含义 dp[3] = 3
- 确定递归公式: dp[n] = dp[n-1] + dp[n-2]
- dp 初始化，dp[1]=1,dp[2]=2
- 遍历顺序，从前到后遍历

```js
/**
 * @param {number} n
 * @return {number}
 */
var climbStairs = function (n) {
  var dp = [0];
  dp[1] = 1;
  dp[2] = 2;
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  console.log(dp, 'dp'); // 打印数组看看
  return dp[n];
};
```

优化下

```js
var climbStairs = function (n) {
  var dp = [1, 2];
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
};
```

### [53. 最大子数组和](https://leetcode.cn/problems/maximum-subarray/)

给你一个整数数组 nums ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。

```js
输入：nums = [-2,1,-3,4,-1,2,1,-5,4]
输出：6
解释：连续子数组 [4,-1,2,1] 的和最大，为 6 。
```

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

给你一个字符串 s ，请你统计并返回这个字符串中 回文子串 的数目。

回文字符串 是正着读和倒过来读一样的字符串。

子字符串 是字符串中的由连续字符组成的一个序列。

具有不同开始位置或结束位置的子串，即使是由相同的字符组成，也会被视作不同的子串。

示例 1

```js
输入：s = "abc"
输出：3
解释：三个回文子串: "a", "b", "c"
```

示例 2

```js
输入：s = "aaa"
输出：6
解释：6个回文子串: "a", "a", "a", "aa", "aa", "aaa"
```

代码如下：

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

### [5. 最长回文子串](https://leetcode.cn/problems/longest-palindromic-substring/)

```js
/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function (s) {};
```

### [正则表达式匹配](https://leetcode.cn/problems/regular-expression-matching/)
