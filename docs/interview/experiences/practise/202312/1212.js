/**
 * 1.接雨水 单调栈
 * 2.比较版本号
 * 3.螺旋矩阵
 * 4.括号生成
 * 5.合并区间
 * 6.每日温度
 */

var dailyTemperatures = function (nums) {
  if (!nums.length) return [];
  let len = nums.length;
  let res = new Array(len).fill(0);
  let stack = [0];
  for (let i = 1; i < len; i++) {
    if (nums[stack.slice(0, 1)] >= nums[i]) {
      stack.push(i);
    } else {
      while (nums[i] && nums[stack.slice(0, 1)] < nums[i]) {
        res[stack.slice(0, 1)] = i - stack.slice(0, 1);
        stack.pop();
      }
    }
  }
  return res;
};

function quto(n) {
  if (n <= 0) return '';
  let res = [];
  var dfs = (paths, left, right) => {
    if (left < right || left > n) return;
    if (2 * n === paths.length) {
      res.push(paths);
      return;
    }
    dfs(paths + '(', left + 1, right);
    dfs(paths + ')', left, right + 1);
  };
  dfs('', 0, 0);
  return res;
}
quto(3);

function merge(nums) {
  nums.sort((a, b) => a[0] - b[0]);
  if (!nums.length) return [];
  let res = [];
  let pre = nums[0];
  for (let i = 1; i < nums.length; i++) {
    let cur = nums[i];
    if (cur[0] > pre[1]) {
      res.push(pre);
      pre = cur;
    } else {
      pre[1] = Math.max(pre[1], cur[1]);
    }
  }
  res.push(pre);
  return res;
}
merge([
  [1, 2],
  [3, 4],
  [2, 5],
  [7, 8],
]);

function matrix(nums) {
  if (!nums.length) return [];
  let up = 0;
  let down = nums.length - 1;
  let left = 0;
  let right = nums[0].length - 1;
  let res = [];
  while (true) {
    // 从左往右
    for (let i = left; i <= right; i++) {
      res.push(nums[up][i]);
    }
    if (++up > down) break;

    // 从上往下
    for (let i = up; i <= down; i++) {
      res.push(nums[i][right]);
    }
    if (--right < left) break;

    // 从右往左
    for (let i = right; i >= left; i--) {
      res.push(nums[down][i]);
    }
    if (up > down--) break;

    // 从下往上
    for (let i = down; i >= up; i--) {
      res.push(nums[i][left]);
    }
    if (right < ++left) break;
  }
  return res;
}
matrix([
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
]);
