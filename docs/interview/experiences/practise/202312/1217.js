/**
 * 1.最长回文子串
 * 2.买卖股票的最佳时机
 * 3.编辑距离
 * 4.爬楼梯
 * 5.打家劫舍
 * 6.零钱兑换
 * 7.最长公共子序列
 * 8.多叉树, 获取每一层的节点之和
 * 9.最大子数组和
 * 10.不同路径
 */

// 不同的二叉搜索树
var numTrees = function (n) {
  var dp = new Array(n + 1).fill(0);
  dp[0] = 1;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= i; j++) {
      dp[i] += dp[i - j] * dp[j - 1];
    }
  }
  return dp[n];
};

10;
3 * 3 * 4;
// 整数拆分
function integerBreak(n) {
  let dp = new Array(n + 1);
  dp[2] = 1;
  for (let i = 3; i <= n; i++) {
    for (let j = 1; j < i - 1; j++) {
      // j * (i - j) 是单纯的把整数拆分为两个数相乘，而j * dp[i - j]是拆分成两个以及两个以上的个数相乘。
      dp[i] = Math.max(dp[i], (i - j) * j, dp[i - j] * j);
    }
  }
  return dp[n];
}
integerBreak(9);
/**
 * 1.确定dp数组以及下标含义
 * 2.递推公式
 * 3.dp初始化
 * 4.遍历顺序
 * 5.验证dp数组
 */

var minCostClimbingStairs = function (cost) {
  var dp = new Array(cost.length).fill(0);
  for (let i = 2; i <= cost.length; i++) {
    dp[i] = Math.min(dp[i - 1] + cost[i - 1], dp[i - 2] + cost[i - 2]);
  }
  return dp[cost.length];
};

function fib(n) {
  let dp = [0, 1];
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  console.log(dp, 'dp');
  return dp[n];
}
var climbStairs = function (n) {
  var dp = [];
  dp[1] = 1;
  dp[2] = 2;
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
};
fib(4);
var largestRectangleArea = function (heights) {
  if (!heights.length) return 0;
  let max = 0;
  let stack = [0];
  heights.push(0);
  heights.unshift(0);
  let len = heights.length;
  if (len == 1) return heights[0];
  for (let i = 1; i < len; i++) {
    // 栈顶和当前元素进行比较
    let cur = heights[i];
    if (cur >= heights[stack.slice(-1)]) {
      stack.push(i);
    } else {
      while (stack.length && cur < heights[stack.slice(-1)]) {
        let top = stack.pop();
        let left = stack.slice(-1);
        max = Math.max(max, (i - left - 1) * heights[top]);
      }
      stack.push(i);
    }
  }
  return max;
};

class Promise {
  static resolve(val) {
    return new Promise((resolve, reject) => {
      if (val instanceof Promise) {
        val.then(resolve);
      } else {
        resolve(val);
      }
    });
  }
  static reject(resaon) {
    return new Promise((_, reject) => {
      reject(resaon);
    });
  }
  finally(cb) {
    return this.then(
      (val) => {
        return Promise.resolve(cb()).then(() => val);
      },
      (err) => {
        return Promise.reject(cb()).then(() => err);
      },
    );
  }
}
