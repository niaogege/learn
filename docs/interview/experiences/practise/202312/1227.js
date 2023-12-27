/**
 * 1.零钱兑换II
 * 2.不定长的二维数组全排列
 * 3.
 * 4.
 */

// 假设你正在爬楼梯。需要 n 阶你才能到达楼顶。
// 每次你可以爬至多m (1 <= m < n)个台阶。你有多少种不同的方法可以爬到楼顶呢？
// 注意：给定 n 是一个正整数。

// dp[j]：凑足总额为j所需钱币的最少个数为dp[j]
function coinChange(coins, amount) {
  let dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let coin of coins) {
    for (let j = coin; j <= amount; j++) {
      dp[j] = Math.min(dp[j], dp[j - coin] + 1);
    }
  }
  return dp[amount] == Infinity ? '-1' : dp[amount];
}

function per(nums) {
  let ans = [];
  let backTrack = (nums, path) => {
    if (nums.length == path.length) {
      ans.push(path.slice());
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      let cur = nums[i];
      if (!path.includes(cur)) {
        path.push(cur);
        backTrack(nums, path);
        path.pop();
      }
    }
  };
  backTrack(nums, []);
  return ans;
}
per(['1', '2', '3']);
//
function allPer(nums) {
  let ans = [];
  let backTrack = (arr, path, row) => {
    if (path.length === arr.length) {
      ans.push(path.slice().join(''));
      return;
    }
    for (let i = 0; i < arr[row].length; i++) {
      path.push(arr[row][i]);
      backTrack(arr, path, row + 1);
      path.pop();
    }
  };
  backTrack(nums, [], 0);
  return ans;
}
allPer([
  ['A', 'B'],
  [1, 2],
  ['a', 'b'],
]);
