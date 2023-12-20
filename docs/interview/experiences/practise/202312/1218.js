/**
 * 编写你会的dp
 */
// 不同的二叉搜索树
function diffBFS(n) {
  // 确定dp数组
  // 递推公式
  // dp初始化
  // 遍历顺序
  var dp = new Array(n + 1).fill(0);
  dp[0] = 1;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= i; j++) {
      // n=3
      dp[i] += dp[i - j] * dp[j - 1];
      // dp[i] += [2][0]+dp[1][1]+dp[0][2]
    }
  }
  return dp[n];
}
diffBFS(3);

function diffPath(m, n) {
  var dp = new Array(m).fill(new Array(n).fill(0));
  // 第一行第一列初始化为1
  for (let i = 0; i < m; i++) {
    dp[i][0] = 1;
  }
  for (let j = 0; j < n; j++) {
    dp[0][j] = 1;
  }
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
    }
  }
  return dp[m - 1][n - 1];
}
diffPath(3, 7);
// 10 3* 3 * 4
// 正数拆分
function numSplit(n) {
  var dp = new Array(n + 1).fill(1);
  dp[2] = 1;
  for (let i = 3; i <= n; i++) {
    for (let j = 1; j < i - 1; j++) {
      dp[i] = Math.max(dp[i], (i - j) * j, dp[i - j] * j);
    }
  }
  console.log(dp);
  return dp[n];
}
numSplit(10);
// 爬楼花费最小费用
function climbStairs(nums) {
  var dp = new Array(nums.length + 1).fill(0);
  for (let i = 2; i < nums.length; i++) {
    dp[i] = Math.min(dp[i - 1] + nums[i - 1], dp[i - 2] + nums[i - 2]);
  }
  return dp[nums.length];
}
