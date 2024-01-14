/**
 * 1.编辑距离
 * 2.最小路径和
 * 3.搜索二维矩阵
 * 4.螺旋矩阵II
 * 5.判断子序列
 * 6.不同的子序列
 * 7.两个字符串的删除操作
 */

// 最小路径和
var minPathSum = function (grid) {
  let [m, n] = [grid.length, grid[0].length];
  let dp = new Array(m).fill().map(() => new Array(n).fill(0));
  dp[0][0] = grid[0][0];
  // 首行
  for (let i = 1; i < n; i++) {
    dp[0][i] = dp[0][i - 1] + grid[0][i];
  }
  // 首列
  for (let j = 1; j < m; j++) {
    dp[j][0] = dp[j - 1][0] + grid[i][0];
  }
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j];
    }
  }
  return dp[m - 1][n - 1];
};

// 编辑距离
/**
输入：word1 = "horse", word2 = "ros"
输出：3
解释：
horse -> rorse (将 'h' 替换为 'r')
rorse -> rose (删除 'r')
rose -> ros (删除 'e')
* 
 */
var minDistance = function (word1, word2) {};

/**
输入：s = "babgbag", t = "bag"
不同的子序列
*/
var numDistinct = function (s, t) {
  let [m, n] = [s.length, t.length];
  let dp = new Array(m + 1).fill().map(() => new Array(n + 1).fill(0));
  for (let i = 0; i < m; i++) {
    dp[i][0] = 1;
  }
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s[i - 1] == t[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + dp[i - 1][j];
      } else {
        dp[i][j] = dp[i - 1][j];
      }
    }
  }
  return dp[m][n];
};

// 是否是子序列
function isChild(s, t) {
  if (s.length == 0) return true;
  let j = 0;
  for (let i = 0; i < t.length; i++) {
    if (t[j] == s[i]) {
      j++;
      if (j == s.length) {
        return true;
      }
    }
  }
  return false;
}
// dp[m][n] == m
function isChild2(s, t) {
  if (s.length == 0) return true;
  let [m, n] = [s.length, t.length];
  let dp = new Array(m + 1).fill().map(() => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s[i - 1] == t[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = dp[i][j - 1];
      }
    }
  }
  return dp[m][n] == m ? true : false;
}
