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

- [746. 使用最小花费爬楼梯](https://leetcode.cn/problems/min-cost-climbing-stairs/)
- [53. 最大子数组和](https://leetcode.cn/problems/maximum-subarray/)
- [647. 回文子串](https://leetcode.cn/problems/palindromic-substrings/)
- [5. 最长回文子串](https://leetcode.cn/problems/longest-palindromic-substring/)
- [62. 不同路径](https://leetcode.cn/problems/unique-paths/)
- [343.整数拆分](https://leetcode.cn/problems/integer-break/submissions/)
- [96. 不同的二叉搜索树](https://leetcode.cn/problems/unique-binary-search-trees/)

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

### [746. 使用最小花费爬楼梯](https://leetcode.cn/problems/min-cost-climbing-stairs/)

给你一个整数数组 cost ，其中 cost[i] 是从楼梯第 i 个台阶向上爬需要支付的费用。一旦你支付此费用，即可选择向上爬一个或者两个台阶。

你可以选择从下标为 0 或下标为 1 的台阶开始爬楼梯。

请你计算并返回达到楼梯顶部的最低花费。

示例

```js
输入：cost = [1,100,1,1,1,100,1,1,100,1]
输出：6
解释：你将从下标为 0 的台阶开始。
- 支付 1 ，向上爬两个台阶，到达下标为 2 的台阶。
- 支付 1 ，向上爬两个台阶，到达下标为 4 的台阶。
- 支付 1 ，向上爬两个台阶，到达下标为 6 的台阶。
- 支付 1 ，向上爬一个台阶，到达下标为 7 的台阶。
- 支付 1 ，向上爬两个台阶，到达下标为 9 的台阶。
- 支付 1 ，向上爬一个台阶，到达楼梯顶部。
总花费为 6 。
```

参考答案：

```js
/**
 * @param {number[]} cost
 * @return {number}
 */
var minCostClimbingStairs = function (cost) {
  var dp = [cost[0], cost[1]];
  for (let i = 2; i < cost.length; i++) {
    dp[i] = Math.min(dp[i - 1], dp[i - 2]) + cost[i];
  }
  return Math.min(dp[cost.length - 1], dp[cost.length - 2]);
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

[答案](https://programmercarl.com/0647.%E5%9B%9E%E6%96%87%E5%AD%90%E4%B8%B2.html#%E6%9A%B4%E5%8A%9B%E8%A7%A3%E6%B3%95) 给你一个字符串 s ，请你统计并返回这个字符串中 回文子串 的数目。

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
        // a aa
        if (j - i <= 1) {
          count = count + 1;
          dp[i][j] = true;
        } else if (dp[i + 1][j - 1]) {
          // cabac => aba
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

动态规划五步骤

- 确定 dp 数据格式 new Array(n).fill().map((\_) => new Array(n).fill(false))
- dp 初始化
- 递推公式
- 遍历顺序
- 模拟

```js
/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function (s) {
  if (!s.length || s.length === 1) return s;
  let len = s.length;
  var dp = new Array(len).fill().map(() => new Array(len).fill(false));
  console.log(dp, 'dp');
  let begin = 0;
  let max = 1;
  for (let i = len - 1; i >= 0; i--) {
    for (let j = i; j < len; j++) {
      if (s[j] != s[i]) {
        dp[i][j] = false;
      } else {
        if (j - i <= 1) {
          dp[i][j] = true;
        } else {
          dp[i][j] = dp[i + 1][j - 1];
        }
      }
      let temp = j - i + 1;
      if (dp[i][j] && temp > max) {
        begin = i;
        max = temp;
      }
    }
  }
  return s.substring(begin, begin + max);
};
```

### [正则表达式匹配](https://leetcode.cn/problems/regular-expression-matching/)

### [62. 不同路径](https://leetcode.cn/problems/unique-paths/)

一个机器人位于一个 m x n  网格的左上角 （起始点在下图中标记为 “Start” ）。

机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角（在下图中标记为 “Finish” ）。

问总共有多少条不同的路径？

```js
/**
 * @param {number} m
 * @param {number} n
 * @return {number}
 */
var uniquePaths = function (m, n) {
  // 确定dp数组以及下标
  var dep = new Array(m).fill().map((_) => new Array(n).fill(1));
  // 递归初始化
  // 递归遍历
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
    }
  }
  return dp[m - 1][n - 1];
};
```

### [63. 不同路径 II](https://leetcode.cn/problems/unique-paths-ii/)

```js
/**
 * @param {number[][]} obstacleGrid
 * @return {number}
 */
var uniquePathsWithObstacles = function (obstacleGrid) {
  let m = obstacleGrid.length;
  let n = obstacleGrid[0].length;
  var dp = new Array(m).fill().map((_) => new Array(n).fill(0));
  // 第一行初始化 遇到障碍物后变0
  for (let i = 0; i < n && obstacleGrid[0][i] === 0; i++) {
    dp[0][i] = 1;
  }
  // 第一列
  for (let i = 0; i < m && obstacleGrid[i][0] === 0; i++) {
    dp[i][0] = 1;
  }
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      if (obstacleGrid[i][j] === 0) {
        dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
      }
    }
  }

  return dp[m - 1][n - 1];
};
```

### [整数拆分](https://leetcode.cn/problems/integer-break/submissions/)

给定一个正整数 n ，将其拆分为 k 个 正整数 的和（ k >= 2 ），并使这些整数的乘积最大化。

返回 你可以获得的最大乘积 。

输入: n = 10 输出: 36 解释: 10 = 3 + 3 + 4, 3 × 3 × 4 = 36。

递推公式 **dp[i] = Math.max(dp[i], [i-j]*j, dp[i-j]*j)**

```js
/**
 * @param {number} n
 * @return {number}
 */
var integerBreak = function (n) {
  let dp = new Array(n + 1).fill(0);
  dp[2] = 1;
  for (let i = 3; i <= n; i++) {
    for (let j = 1; j < i; j++) {
      dp[i] = Math.max(dp[i], j * (i - j), dp[i - j] * j);
    }
  }
  return dp[n];
};
```

### [96. 不同的二叉搜索树](https://leetcode.cn/problems/unique-binary-search-trees/)

[卡特兰数](https://baike.baidu.com/item/%E5%8D%A1%E7%89%B9%E5%85%B0%E6%95%B0)

给你一个整数 n ，求恰由 n 个节点组成且节点值从 1 到 n 互不相同的 二叉搜索树 有多少种？返回满足题意的二叉搜索树的种数。

```js
输入：n = 3
输出：5
示例 2：

输入：n = 1
输出：1
```

参考答案：

```js
/**
 * @param {number} n
 * @return {number}
 */
var numTrees = function (n) {
  var dp = new Array(n + 1).fill(0);
  dp[0] = 1;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= i; j++) {
      dp[i] = dp[i] + dp[i - j] * dp[j - 1];
      // dp[3] = dp[0]*dp[2] + dp[1]*dp[1] + dp[2]*dp[0]
      // 头节点为1的时候=左子树有0个节点*右子树有2个节点
      // 头节点为2的时候=左子树有1个节点*右子树有1个节点
      // 头节点为3的时候=左子树有2个节点*右子树有0个节点

      // dp[4] = dp[0]*dp[3]+d[1]*dp[2]+dp[2]*dp[1]+dp[3]*dp[0]
      // 简化出 dp[i] = dp[i] + dp[i - j] * dp[j - 1];
    }
  }
  return dp[n];
};
```

### 背包问题

第一步确定 dp 下标

```js
dp = new Array(n).fill().map((e) => new Array(n).fill(0));
```

第二步 找到递推公式

```js
dp[i][j] = Math.max(dp[i - 1][j], dp[i - 1][j - weight[i]] + value[i]);
```

第三步 dp 初始化

```js
for (let j = weight[0]; j <= size; j++) {
  dp[0][j] = value[0];
}
```

第四步确定遍历顺序

先遍历物品，在遍历背包重量

```js
for (let i = 1; i < weight.length; i++) {
  for (let j = 0; j <= size; j++) {
    if (weight[i] > j) {
      dp[i][j] = dp[i - 1][j];
    } else [(dp[j][j] = Math.max(dp[i - 1][j], dp[i - 1][j - weight[i]] + value[i]))];
  }
}
```

代码如下

```js
function beibao(weight, value, size) {
  let len = weight.length
  let dp = new Array(len).fill().map((_) => new Array(size+1).fill(0))
  // 当背包容量大于物品0的重量时，将物品0放入到背包中
  for(let j = weight[0]; j <= size; j++) {
    dp[0][j] = value[0]
  }
  // 先遍历物品，再遍历重量
  for (let i=1;i<weight.length;i++) {
    for (let j = 0;j<= size;j++) {
      // 如果当前背包容量小于物品重量
      if (weight[i] > j) {
        dp[i][j] = dp[i-1][j] // 背包物品的价值等于背包不放置当前物品时的价值
      } else [
        // 若背包当前重量可以放置物品
        dp[j][j] = Math.max(
          dp[i-1][j],
          dp[i-1][j-weight[i]] + value[i]
        )
        // 背包的价值等于放置该物品或不放置该物品的最大值
      ]
    }
  }
  console.table(dp)
  return dp[len-1][size]
}
beibao([1, 2, 3, 5], [15, 20, 30, 55], 4)) // 45
beibao([1, 2, 3, 5], [15, 20, 30, 55], 6)) // 70
```
