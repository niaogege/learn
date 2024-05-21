/**
 * 1.数组中的第 K 个最大元素
 * 2.K 个一组链表反转
 * 3.最大子序和
 * 4.最长回文子串
 * 5.搜索旋转排序数组
 * 6.买卖股票的最佳时机
 * 7.岛屿数量
 * 8.合并两个有序数组
 * 9.全排列 I/II
 * 10.二叉树的最近公共祖先
 */
function maxChildSum(arr) {}

// 最长回文子串 aabbcccbe dp
function maxPalidStr(str) {
  if (str.length == 0) return '';
  let len = str.length;
  let dp = new Array(len).fill().map(() => new Array(len).fill(false));
  // 对角线设置true
  for (let i = 0; i < len; i++) {
    dp[i][i] = true;
  }
  let left = 0;
  let maxL = 0;
  for (let i = 1; i < len; i++) {
    for (let j = 0; j < i; j++) {
      if (str[i] == str[j]) {
        if (i - i <= 2) {
          dp[i][j] = true;
        } else {
          dp[i][j] = dp[i - 1][j - 1];
        }
      }
      if (dp[i][j] && i - j + 1 > maxL) {
        maxL = i - j + 1;
        left = j;
      }
    }
  }
  return str.substring(left, left + maxL);
}

// 搜索旋转排序数组
function rotateSortArr(arr) {}

// 买卖股票的最佳时机
function bestTime(arr) {}

function islands(grid) {
  let num = 0;
  let [r, c] = [grid.length, grid[0].length];
  for (let i = 0; i < r; i++) {
    for (let j = 0; j < c; j++) {
      if (grid[i][j] == '1') {
        num += 1;
        dfs(i, j, grid);
      }
    }
  }
  return num;
}
function dfs(row, column, grid) {
  if (!isValid(row, column, grid) || grid[row][column] != '1') return;
  grid[row][column] = '2';
  // 上下左右
  dfs(row - 1, column, grid);
  dfs(row + 1, column, grid);
  dfs(row, column - 1, grid);
  dfs(row, column + 1, grid);
}
function isValid(row, column, grid) {
  return row >= 0 && row < grid.length && column >= 0 && column < grid[0].length;
}
