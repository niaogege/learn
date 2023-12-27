/**
 * 1.limitQuest
 * 2.背包问题 滚动数组
 * 3.比较版本号
 * 4.岛屿数量
 * 5.目标和
 * 6.1和0
 */

var changeOne = function (amount, coins) {
  let len = coins.length;
  let dp = new Array(amount + 1).fill(0);
  dp[0] = 1;
  for (let i = 0; i < len; i++) {
    for (let j = coins[i]; j <= amount; j++) {
      dp[j] += dp[j - coins[i]];
    }
  }
  return dp[amount];
};
var change = function (amount, coins) {
  let len = coins.length;
  let dp = new Array(len).fill().map(() => new Array(amount + 1).fill(0));
  for (let i = 0; i <= amount; i += coins[0]) {
    dp[0][i] = 1;
  }
  for (let i = 1; i < len; i++) {
    for (let j = 0; j <= amount; j++) {
      for (let k = 0; k * coins[i] <= j; k++) {
        dp[i][j] += dp[i - 1][j - k * coins[i]];
      }
    }
  }
  return dp[len - 1][amount];
};

/**
 * 
给你一个非负整数数组 nums 和一个整数 target 。
向数组中的每个整数前添加 '+' 或 '-' ，然后串联起所有整数，可以构造一个 表达式 ：
例如，nums = [2, 1] ，可以在 2 之前添加 '+' ，在 1 之前添加 '-' ，然后串联起来得到表达式 "+2-1" 。
返回可以通过上述方法构造的、运算结果等于 target 的不同 表达式 的数目。
*/
// 目标和
// 背包问题解决太牵强
var findTargetSumWays = function (nums, target) {
  // 如何转化为背包问题
  let sum = nums.reduce((a, b) => a + b);
  // 此时没有方案
  if (target > sum || (sum + target) % 2 == 1) return 0;
  let bagSize = (sum + target) / 2;
  let dp = new Array(bagSize + 1).fill(0);
  dp[0] = 1;
  for (let i = 0; i < nums.length; i++) {
    for (let j = bagSize; j >= nums[i]; j--) {
      dp[j] += dp[j - nums[i]];
    }
  }
  return dp[bagSize];
};

/**
 * 判断岛屿数量
 * @param grid char字符型二维数组
 * @return int整型
 */
function solve(grid) {
  // write code here
  let count = 0;
  let r = grid.length - 1;
  let c = grid[0].length - 1;
  for (let i = 0; i <= r; i++) {
    for (let j = 0; j <= c; j++) {
      if (grid[i][j] === '1') {
        dfs(grid, i, j);
        count = count + 1;
      }
    }
  }
  let isValid = (grid, r, c) => {
    return r >= 0 && r < grid.length && c < grid[0].length && c >= 0;
  };
  let dfs = (grid, r, c) => {
    if (!isValid(grid, r, c) || grid[r][c] != '1') {
      return;
    }
    grid[r][c] = '2';
    dfs(grid, r - 1, c);
    dfs(grid, r + 1, c);
    dfs(grid, r, c - 1);
    dfs(grid, r, c + 1);
  };
  return count;
}

/**
"1.1","2.1" -1
"2.0.1","2" 1
"1.1","1.01" 0 
"1.0.1","1"
 * 比较版本号
 * @param version1 string字符串 
 * @param version2 string字符串 
 * @return int整型
 */
function compare(v1, v2) {
  v1 = v1.split('.').map((e) => +e);
  v2 = v2.split('.').map((e) => +e);
  let len = Math.max(v1.length, v2.length);
  let i = 0;
  while (i < len) {
    let cu1 = v1[i] || 0;
    let cu2 = v2[i] || 0;
    if (cu1 > cu2) {
      return 1;
    } else if (cu1 < cu2) {
      return -1;
    } else {
      i++;
    }
  }
  return 0;
}

function weightBagOne(weight, value, size) {
  let len = weight;
  var dp = new Array(size + 1).fill(0);
  for (let i = 0; i < len; i++) {
    for (let j = size; j >= 0; j--) {
      dp[j] = Math.max(dp[j], dp[j - weight[i]] + value[i]);
    }
  }
  return dp[size];
}

async function limitQuest(arr, limit, fn) {
  let queue = [];
  let res = [];
  for (let i = 0; i < arr.length; i++) {
    let p1 = Promise.resolve(arr[i]).then(() => fn());
    res.push(p1);
    if (arr.length >= limit) {
      // 当任务完成后，从正在执行的任务数组中移除已完成的任务
      let p2 = p1.then(() => {
        return queue.splice(queue.indexOf(p2), 1);
      });
      queue.push(p2);
      if (queue.length >= limit) {
        await Promise.race(queue);
      }
    }
  }
  return Promise.all(res);
}
