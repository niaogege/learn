/**
 * 1.按照prize和size进行排序
 * 2.requestIdleCallback
 * 3.防抖和节流
 * 4.K 个一组翻转链表
 * 5.反转链表
 * 6.三数之和
 * 7.合并两个有序链表
 * 8.搜索旋转排序数组
 * 9.岛屿数量
 * 10.合并两个有序数组
 * 11.二叉树的最近公共祖先
 * 12.螺旋矩阵
 * 13.合并K个排序链表
 * 14.字符串相加
 * 15.最长上升子序列
 * 16.最长连续递增子序列
 */

/**
 * @param {character[][]} grid
 * @return {number}
 */
var numIslands = function (grid) {
  let r = grid.length;
  let c = grid[0].length;
  let i = 0;
  for (let i = 0; i < r; i++) {
    for (let j = 0; j < c; j++) {
      if (grid[i][j] == '1') {
        dfs(grid, i, j);
        i++;
      }
    }
  }
  return i;
};
function dfs(grid, r, c) {
  if (!isValid(grid, r, c) || dp[r][c] !== '1') return;
  grid[r][c] = '2';
  // 上下左右
  dfs(grid, r - 1, c);
  dfs(grid, r + 1, c);
  dfs(grid, r, c - 1);
  dfs(grid, r, c + 1);
}
function isValid(grid, i, j) {
  return i >= 0 && i < grid.length && j < grid[0].length && j >= 0;
}

function debounce(fn, delay) {
  let timer = null;
  return function (...agr) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, arg);
      timer = null;
    }, delay);
  };
}
// 时间戳般
function throttle(fn, delay) {
  let cur = 0;
  return function (...arg) {
    let now = new Date().getTime();
    if (now - cur >= delay) {
      fn.apply(this, arg);
      cur = now;
    }
  };
}
// 定时器版
function throttle2(fn, delay) {
  let timer = null;
  return function (...arg) {
    if (!timer) {
      setTimeout(() => {
        fn.apply(this, arg);
        timer = null;
      }, delay);
    }
  };
}

const requestIdleCallback = function (cb) {
  let start = new Date();
  return setTimeout(() => {
    cb({
      didTimeout: false,
      timeRemaining: function () {
        return Math.max(0, 50 - (Date.now() - start));
      },
    });
  }, 1);
};

// 最长上升子序列

var lengthOfLIS = function (nums) {
  let len = nums.length;
  let dp = new Array(len).fill(1);
  let max = 0;
  for (let i = 1; i < len; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[i] > nums[j]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
      max = Math.max(max, dp[i]);
    }
  }
};

// 最长连续递增子序列
var findLengthOfLCIS = function (nums) {
  let len = nums.length;
  let dp = new Array(len).fill(1);
  dp[0] = 1;
  let max = 0;
  for (let i = 1; i <= len; i++) {
    if (nums[i] > nums[i - 1]) {
      dp[i] = Math.max(dp[i - 1] + 1, dp[i]);
    }
    max = Math.max(max, dp[i]);
  }
  return max;
};
