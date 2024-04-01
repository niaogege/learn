/**
 * 坚持这么久，向自己鼓掌er
 * 1.字母异位分组
 * 2.找到字符串中所有字母异位词
 * 3.最小覆盖子串
 * 4.搜索二维矩阵
 * 5.搜索二维矩阵 II
 * 6.单词搜索
 * 7.寻找旋转排序数组中的最小值
 * 8.字符串解码
 * 9.前 K 个高频元素
 * 10.乘积最大子数组
 * 11.最大子序和
 * 12.岛屿数量
 */

/**
输入: nums = [1,1,1,2,2,3], k = 2
输出: [1,2]
 * @return {number[]}
 */
var topKFrequent = function (nums, k) {
  let m = new Map();
  for (let num of nums) {
    if (m.has(num)) {
      let count = m.get(num);
      m.set(num, count + 1);
    } else {
      m.set(num, 1);
    }
  }
  let ans = [];
  for (let [k, val] of m.entries()) {
    ans.push(val);
  }
  // 排序
  ans.sort((a, b) => b - a);
  // 前k个
  ans = ans.slice(0, k);
  let res = [];
  for (let [key, val] of m.entries()) {
    if (ans.length && ans.pop() == val) {
      res.push(key);
    }
  }

  return res;
};

var topKFrequent = function (nums, k) {
  let m = new Map();
  for (let num of nums) {
    if (m.has(num)) {
      let count = m.get(num);
      m.set(num, count + 1);
    } else {
      m.set(num, 1);
    }
  }
  return [...m.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map((i) => i[0]);
};

/**
 * @param {character[][]} board
 * @param {string} word
 * @return {boolean}
 */
var exist = function (board, word) {
  let [m, n] = [board.length, board[0].length];
  let used = new Array(m).fill().map(() => new Array(n).fill(false));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (board[i][j] == word[0] && dfs(i, j, 0, board, word, used)) {
        return true;
      }
    }
  }
  return false;
};
function dfs(row, col, i, board, word, used) {
  if (i == word.length) return true;
  if (!isValid(board, row, col) || used[row][col] || board[row][col] != word[i]) return false;
  used[row][col] = true;
  let res =
    dfs(row - 1, col, i + 1, board, word, used) ||
    dfs(row + 1, col, i + 1, board, word, used) ||
    dfs(row, col - 1, i + 1, board, word, used) ||
    dfs(row, col + 1, i + 1, board, word, used);
  if (res) {
    return true;
  }
  used[row][col] = false;
  return false;
}
function isValid(grid, i, j) {
  return i >= 0 && i < grid.length && j >= 0 && j < grid[0].length;
}

/**
 * @param {character[][]} grid
 * @return {number}
 */
var numIslands = function (grid) {
  let [m, n] = [grid.length, grid[0].length];
  let count = 0;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] == '1') {
        dfs(grid, i, j);
        count += 1;
      }
    }
  }
  return count;
};
function dfs(grid, row, col) {
  if (!isValid(grid, row, col) || grid[row][col] != '1') return false;
  grid[row][col] = '2';
  // 上下左右
  dfs(grid, row - 1, col);
  dfs(grid, row + 1, col);
  dfs(grid, row, col - 1);
  dfs(grid, row, col + 1);
}
function isValid(grid, i, j) {
  return i >= 0 && i < grid.length && j >= 0 && j < grid[0].length;
}
/**
输入：nums = [-2,1,-3,4,-1,2,1,-5,4]
输出：6
解释：连续子数组 [4,-1,2,1] 的和最大，为 6 。
 */
var maxSubArray = function (nums) {
  var max = nums[0];
  let sum = 0;
  for (let num of nums) {
    if (sum > 0) {
      sum += num;
    } else {
      sum = num;
    }
    max = Math.max(sum, max);
  }
  return max;
};
maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]);
var maxSubArray = function (nums) {
  let len = nums.length;
  let dp = new Array(len).fill(0);
  dp[0] = nums[0];
  let max = nums[0];
  for (let i = 0; i < len; i++) {
    dp[i] = Math.max(dp[i - 1] + nums[i], nums[i]);
    max = Math.max(dp[i], max);
  }
  return max;
};
/**
给你一个整数数组 nums ，请你找出数组中乘积最大的非空连续
子数组
（该子数组中至少包含一个数字），并返回该子数组所对应的乘积。
测试用例的答案是一个 32-位 整数。
 */
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxProduct = function (nums) {
  let max = Number.MIN_SAFE_INTEGER;
  let imax = 1,
    imin = 1;
  for (let num of nums) {
    if (num < 0) {
      let tmp = imax;
      imax = imin;
      imin = tmp;
    }
    imax = Math.max(imax * num, num);
    imin = Math.min(imin * num, num);
    max = Math.max(max, imax);
  }
  return max;
};

/**
 * @param {number[]} nums
 * @return {number}
 */
var maxProduct = function (nums) {
  let len = nums.length;
  let dpMax = new Array(len).fill(1);
  dpMax[0] = nums[0];
  let dpMin = new Array(len).fill(1);
  dpMin[0] = nums[0];
  let max = nums[0];
  for (let i = 1; i < len; i++) {
    let cur = nums[i];
    dpMax[i] = Math.max(dpMin[i - 1] * cur, Math.max(dpMax[i - 1] * cur, cur));
    dpMin[i] = Math.min(dpMin[i - 1] * cur, Math.min(dpMax[i - 1] * cur, cur));
    max = Math.max(max, dpMax[i]);
  }
  return max;
};
