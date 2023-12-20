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

> 还行不忍心放下 DP 太不甘里，20221112，再次重拾

### 01 背包

```js
/**
 * 「背包问题：给你一个可装载重量为10的背包和N个物品，每个物品有重量和价值两个属性。其中第i个物品的重量为wt[i]，价值为val[i]，现在让你用这个背包装物品，最多能装的价值是多少？」
 */
// 先遍历物品 还是先遍历背包的容量
// dp[i][j] [0,i]的物品放进容量为j的背包
// dp[i][j] 又哪几个状态决定 取决于你放不放物品 你放物品是一种状态 不放另一种状态
// 不放物品i dp[i-1][j]
// 放物品i dp[i-1][j-weight[i-1]]+val[i]
// dp[i][j] = Math.max(dp[i - 1][j], dp[i - 1][j - weight[i - 1]] + val[i]);
// weight 2，3，4
// value 15 20 30
function weightBag(weight, value, size) {
  let len = weight.length;
  let dp = new Array(len).fill().map(() => new Array(size + 1).fill(0));
  // 第一行初始化 等于第一个物品的价值
  for (let i = weight[0]; i <= size; i++) {
    dp[0][i] = value[0];
  }
  // 先遍历物品 在遍历容量
  for (let i = 1; i < len; i++) {
    for (let j = 0; j <= size; j++) {
      // 物品大雨总容量的时候 就不需要放物品
      if (weight[i] > j) {
        dp[i][j] = dp[i - 1][j];
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i - 1][j - weight[i]] + value[i]);
      }
    }
  }
  console.table(dp);
  return dp[len - 1][size];
}
weightBag([1, 3, 4, 5], [15, 20, 30, 55], 6);
```

### [494. 目标和](https://leetcode.cn/problems/target-sum/)

感谢[大佬分析](https://leetcode.cn/problems/target-sum/solutions/1303046/hen-xiang-xi-de-zhuan-hua-wei-0-1bei-bao-irvy/)

每个数字都有两种状态：被进行“+”， 或者被进行“-”，因此可以将数组分成 A 和 B 两个部分： A 部分的数字全部进行“+”操作，B 部分的数字全部进行“-”操作。

设数组的和为 sum，A 部分的和为 sumA，B 部分的和为 sumB 根据上面的分析，我们可以得出： sumA + sumB = sum (1) 同时有： sumA - sumB = target (2) 将(1)式与(2)式相加，可以得到： 2sumA = sum + target (3)

即：sumA = (sum + target) / 2 ，自此，原问题可以转化为 0-1 背包问题：

**有一些物品，第 i 个物品的重量为 nums[i]， 背包的容量为 sumA，问：有多少种方式将背包【恰好填满】**

即：bgSize = (sum + target) / 2;

> 转换为背包问题 有点复杂 但按照作者的思路还是能想通的 1112

- 确定 dp 数组和定义下标

- dp 递推公式不考虑

> 递推公式不理解

> 状态转移 二维数组和一维数组

nums[i]的情况下，填满容量为 j 的背包，有 dp[j]种方法。

那么考虑 nums[i]的话（只要搞到 nums[i]），凑成 dp[j]就有 dp[j - nums[i]] 种方法。

例如：**dp[j]，j 为 5**，

已经有一个 1（nums[i]） 的话，有 dp[4]种方法 凑成 dp[5]。

已经有一个 2（nums[i]） 的话，有 dp[3]种方法 凑成 dp[5]。

已经有一个 3（nums[i]） 的话，有 dp[2]中方法 凑成 dp[5]

已经有一个 4（nums[i]） 的话，有 dp[1]中方法 凑成 dp[5]

已经有一个 5 (nums[i]） 的话，有 dp[0]中方法 凑成 dp[5]

那么凑整 dp[5]有多少方法呢，也就是把 所有的 **dp[j - nums[i]]** 累加起来。

> 这句话放在这里，难以理解透彻、

所以求**组合类**问题的公式，都是类似这种：

```js
dp[j] = dp[j] + dp[j - nums[i]];
```

- dp 初始化

从递归公式可以看出，在初始化的时候 dp[0] 一定要初始化为 1，因为 dp[0]是在公式中一切递推结果的起源，如果 dp[0]是 0 的话，递归结果将都是 0。

dp[0] = 1，理论上也很好解释，装满容量为 0 的背包，**有 1 种方法，就是装 0 件物品**。

dp[j]其他下标对应的数值应该初始化为 0，从递归公式也可以看出，dp[j]要保证是 0 的初始值，才能正确的由 dp[j - nums[i]]推导出来。

```js
dp = new Array(size + 1).fill(1);
dp[0] = 1;
```

- dp 遍历顺序

nums 放在外循环，target 在内循环，且内循环倒序。

- dp 举例

输入： nums: [1,1,1,1,1] target: 3

bgsize = 5 + 3 / 2 = 4;

如果： nums1: [1,1,1,1,1] target: 2

1+1-1-1+1 +1+1-1-1+1

怎么加减都不能等于目标值，所以必须啥 nums+target % 2 === 0 ,如果 nums+target % 2 !== 0,则需要直接返回

```js
/**
 * @param {number[]} nums [1,1,1,1,1]
 * @param {number} target 3
 * @return {number}
 */
var findTargetSumWays = function (nums, target) {
  let sum = nums.reduce((a, b) => a + b);
  var bgSize = (sum + target) / 2; // 背包数量
  if (Math.abs(target) > sum) return 0; // 如果总数小于目标值 则直接返回
  if ((sum + target) % 2) return 0; // 总数+目标数 如果不能整除2 则直接返回
  var dp = new Array(bgSize + 1).fill(0);
  dp[0] = 1;
  for (let i = 0; i < nums.length; i++) {
    for (let j = bgSize; j >= nums[i]; j--) {
      dp[j] = dp[j] + dp[j - nums[i]];
    }
    console.table(dp);
  }
  return dp[bgSize];
};
findTargetSumWays([1, 1, 1, 1, 1], 3);
```

#### 二维数组方式

```js
var findTargetSumWays = function (nums, target) {
  const len = nums.length;
  let sum = nums.reduce((a, b) => a + b);
  var bgSize = (sum + target) / 2; // 背包数量
  if (Math.abs(target) > sum) return 0; // 如果总数小于目标值 则直接返回
  if ((sum + target) % 2) return 0; // 总数+目标数 如果不能整除2 则直接返回
  var dp = new Array(len + 1).fill().map(() => new Array(bgSize + 1).fill(0));
  // dp[0][0] = 1 第一列 算有一种方法
  // 装满容量为0的背包，有1种方法，就是装0件物品
  for (let i = 0; i <= len; i++) {
    dp[i][0] = 1;
  }
  for (let i = 1; i <= nums.length; i++) {
    let num = nums[i - 1];
    for (let j = 0; j <= bgSize; j++) {
      if (num > j) {
        dp[i][j] = dp[i - 1][j];
      } else {
        dp[i][j] = dp[i - 1][j] + dp[i - 1][j - num];
      }
    }
  }
  console.table(dp);
  return dp[nums.length][bgSize];
};
```

### [474. 一和零](https://leetcode.cn/problems/ones-and-zeroes/)

给你一个二进制字符串数组 strs 和两个整数 m 和 n 。

请你找出并返回 **strs** 的最大子集的长度，该子集中 最多 有 **m 个 0 和 n 个 1** 。

如果 x 的所有元素也是 y 的元素，集合 x 是集合 y 的 子集 。

示例 1: 输入：strs = ["10", "0001", "111001", "1", "0"], m = 5, n = 3

输出：4 解释：最多有 5 个 0 和 3 个 1 的最大子集是 {"10","0001","1","0"} ，因此答案是 4 。其他满足题意但较小的子集包括 {"0001","1"} 和 {"10","1","0"} 。

{"111001"} 不满足题意，因为它含 4 个 1 ，大于 n 的值 3 。

示例 2: 输入：strs = ["10", "0", "1"], m = 1, n = 1

输出：2

解释：最大的子集是 {"0", "1"} ，所以答案是 2 。

```js
/**
 * @param {string[]} strs
 * @param {number} m
 * @param {number} n
 * @return {number}
 * 如何转换成背包问题
 * **有一些物品，第 i 个物品的重量为 nums[i]， 背包的容量为 sumA，问：有多少种方式将背包【恰好填满】**
 * m+n 和等于背包
 * 物品是啥呢 把物品放到背包里
 * 物品小于背包的都阔以放进来
 * 背包里最多能放多少个物品
 */
var findMaxForm = function (strs, m, n) {
  var dp = new Array(m + 1).fill().map(() => new Array(n + 1).fill(0));
  let oneNum, zeroNum;
  for (let str of strs) {
    oneNum = 0;
    zeroNum = 0;
    for (let strOne of str) {
      if (strOne === '0') {
        zeroNum++;
      } else {
        oneNum++;
      }
    }
    for (let i = m; m >= zeroNum; i--) {
      for (let j = n; n >= oneNum; j--) {
        dp[i][j] = Math.max(dp[i][j], dp[i - zeroNum][j - oneNum] + 1);
      }
    }
  }
  return dp[m][n];
};
```
