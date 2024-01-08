/**
 * 1.三数之和
 * 2.最长重复子数组
 * 3.最长公共子序列
 * 4.编辑距离
 * 5.螺旋矩阵I
 * 6.螺旋矩阵II
 */

/**
 * @param {number[][]} grid
 * @return {number}
 */
var minPathSum = function (grid) {
  let m = grid.length;
  let n = grid[0].length;
  let dp = new Array(m).fill().map(() => new Array(n).fill(0));
  dp[0][0] = grid[0][0];
  // 首列
  for (let i = 1; i < m; i++) {
    dp[i][0] = dp[i - 1][0] + grid[i][0];
  }
  // 首行
  for (let j = 1; j < n; j++) {
    dp[0][j] = dp[0][j - 1] + grid[0][j];
  }
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j];
    }
  }
  return dp[m - 1][n - 1];
};

/**
 * @param {number[]} nums
 * @return {number[][]}
 */
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function (nums) {
  let len = nums.length;
  if (nums.length < 3 || !len) return [];
  let ans = [];
  nums.sort((a, b) => a - b);
  for (let i = 0; i < len; i++) {
    if (nums[i] > 0) break;
    if (i > 0 && nums[i] == nums[i - 1]) continue;
    let l = i + 1;
    let r = len - 1;
    let cur = nums[i];
    while (l < r) {
      let sum = cur + nums[l] + nums[r];
      if (sum == 0) {
        ans.push([cur, nums[l], nums[r]]);
        while (l < r && nums[r] == nums[r - 1]) {
          r = r - 1;
        }
        while (l < r && nums[l] == nums[l + 1]) {
          l = l + 1;
        }
        l = l + 1;
        r = r - 1;
      } else if (sum > 0) {
        r = r - 1;
      } else {
        l = l + 1;
      }
    }
  }
  return ans;
};

// 输入: [-2,1,-3,4,-1,2,1,-5,4]
// 输出: 6
// 解释: 连续子数组 [4,-1,2,1] 的和最大，为 6。
function maxSum(nums) {
  let dp = new Array(nums.length).fill(0);
  let max = nums[0];
  dp[0] = nums[0];
  for (let i = 1; i < nums.length; i++) {
    dp[i] = Math.max(dp[i - 1] + nums[i], nums[i]);
    max = Math.max(max, dp[i]);
  }
  return max;
}
maxSum([111, 1, -3, 4, -1, 2, 1, -5, 4]);
function maxSum(nums) {
  let sum = nums[0];
  let max = 0;
  for (let num of nums) {
    if (sum > 0) {
      sum += num;
    } else {
      sum = num;
    }
    max = Math.max(sum, max);
  }
  return max;
}
maxSum([-2, 1, -3, 4, -1, 2, 1, -5, 4]);
