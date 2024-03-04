/**
 * 1.买卖股票的最佳时机
 * 2.岛屿数量
 * 3.反转链表 II
 * 4.螺旋矩阵
 * 5.最长上升子序列
 * 6.字符串相乘
 * 7.字符串相加
 * 8.打家劫舍
 * 9.接雨水
 * 10.二叉树的最近公共祖先
 * 11.排序链表
 * 12.合并区间
 * 13.三数之和
 */

/**
 * 输入：intervals = [[1,3],[2,6],[8,10],[15,18]]
输出：[[1,6],[8,10],[15,18]]
解释：区间 [1,3] 和 [2,6] 重叠, 将它们合并为 [1,6].
 */
function mergeArr(arrs) {
  if (!arrs.length) return [];
  arrs.sort((a, b) => a[0] - b[0]);
  let pre = arrs[0];
  let ans = [];
  for (let i = 1; i < arrs.length; i++) {
    let cur = arrs[i];
    if (cur[0] > pre[1]) {
      ans.push(cur);
      pre = cur;
    } else {
      pre[1] = Math.max(pre[1], cur[1]);
    }
  }
  ans.push(pre);
  return ans;
}

// 螺旋矩阵
/**
输入：matrix = [[1,2,3],[4,5,6],[7,8,9]]
输出：[1,2,3,6,9,8,7,4,5]
 */
var spiralOrder = function (matrix) {
  if (!matrix.length) return [];
  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix[0].length - 1;
  let ans = [];
  while (true) {
    // 上
    for (let i = left; i <= right; i++) {
      ans.push(matrix[top][i]);
    }
    if (++top > bottom) break;
    // 右
    for (let i = top; i <= bottom; i++) {
      ans.push(matrix[i][right]);
    }
    if (--right < left) break;
    // 下
    for (let i = right; i >= left; i--) {
      ans.push(matrix[bottom][i]);
    }
    if (top > --bottom) break;
    // 左
    for (let i = bottom; i >= top; i--) {
      ans.push(matrix[i][left]);
    }
    if (right < ++left) break;
  }
  return ans;
};

/**
输入：nums = [-1,0,1,2,-1,-4]
输出：[[-1,-1,2],[-1,0,1]]
 */
var threeSum = function (nums) {
  if (!nums || !nums.length) return [];
  if (nums.length < 3) return nums;
  nums.sort((a, b) => a - b);
  let ans = [];
  for (let i = 0; i < len; i++) {
    let cur = nums[i];
    if (cur > 0) continue;
    if (i > 0 && nums[i - 1] == nums[i]) continue;
    let start = i + 1;
    let end = nums.length - 1;
    while (start < end) {
      let sum = nums[start] + nums[end] + cur;
      if (sum == 0) {
        ans.push(cur, nums[start], nums[end]);
        // 如何去重
        while (start < end && nums[end] == nums[end - 1]) {
          end--;
        }
        while (start < end && nums[start] == nums[start + 1]) {
          start++;
        }
        end--;
        start++;
      } else if (sum > 0) {
        end--;
      } else {
        start++;
      }
    }
  }

  return ans;
};

function rob(arr) {
  let len = arr.length;
  let dp = new Array(len).fill(0);
  dp[0] = arr[0];
  dp[1] = Math.max(arr[0], arr[1]);
  for (let i = 2; i < len; i++) {
    dp[i] = Math.max(dp[i - 2] + arr[i], dp[i - 1]);
  }
  return dp[len - 1];
}

function islands(grid) {
  let c = grid.length;
  let r = grid[0].length;
  let count = 0;
  for (let i = 0; i < c; i++) {
    for (let j = 0; j < r; j++) {
      if (grid[i][j] === '1') {
        dfs(grid, i, j);
        count++;
      }
    }
  }
  return count;
}

function dfs(grid, c, r) {
  if (!isValid(grid, c, r) || grid[i][j] != '1') return;
  grid[i][j] = '2';
  // 左右上下
  dfs(grid, c - 1, r);
  dfs(grid, c + 1, r);
  dfs(grid, c, r + 1);
  dfs(grid, c, r - 1);
}

function isValid(grid, c, r) {
  return c < grid.length && c >= 0 && r >= 0 && r < grid[0].length;
}

// 买卖股票
function maxProfit(prizes) {
  let len = prizes.length;
  let dp = new Array(len).fill([]);
  dp[0] = [-prizes[0], 0];
  for (let i = 1; i < len; i++) {
    dp[i][0] = Math.max(dp[i - 1][0], -prizes);
    dp[i][1] = Math.max(dp[i - 1][1], dp[i - 1][0] + prizes[i]);
  }
  return dp[len - 1][1];
}

// 打家劫舍
/**
输入：nums = [1,2,3,1]
输出：4
解释：偷窃 1 号房屋 (金额 = 1) ，然后偷窃 3 号房屋 (金额 = 3)。
     偷窃到的最高金额 = 1 + 3 = 4 。
 */
var rob = function (nums) {
  let len = nums.length;
  let dp = new Array(len);
  dp[0] = nums[0];
  dp[1] = Math.max(nums[0], nums[1]);
  for (let i = 2; i < len; i++) {
    dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);
  }
  return dp[len - 1];
};

// 22;
// (33)[(0, 0, 0, 0)];
function mulStr(a, b) {
  let aLen = a.length;
  let bLen = b.length;
  let arr = new Array(aLen + bLen).fill(0);
  for (let i = aLen - 1; i >= 0; i--) {
    for (let j = bLen - 1; j >= 0; j--) {
      let p1 = i + j;
      let p2 = p1 + 1;
      let res = Number(a[i]) * Number(b[j]);
      let sum = arr[p2] + res;
      arr[p2] = sum % 10;
      arr[p1] = arr[p1] + Math.floor(res / 10);
    }
  }
  while (arr[0] == 0) {
    arr.shift();
  }
  return arr.length ? arr.join('') : '0';
}
mulStr('22', '33');

function bigNumAdd(a, b) {
  let len = Math.max(a.length, b.length);
  a = a.padStart(len, '0');
  b = b.padStart(len, '0');
  let flag = 0;
  let res = '';
  let i = len - 1;
  while (i >= 0) {
    flag = Number(a[i]) + Number(b[i]) + flag;
    res = (flag % 10) + res;
    flag = Math.floor(flag / 10);
    i--;
  }
  return flag == 1 ? '1' + res : res;
}
bigNumAdd('22', '88');

function requestIdleCallback(cb) {
  let cur = new Date().getTime();
  return setTimeout(() => {
    cb({
      didTimeout: false,
      timeRemaining: () => 1,
    });
  });
}

function merge(arr1, m, arr2, n) {
  for (let i = m; i < m + n; i++) {
    arr1[i] = arr2[i - m];
  }
  return arr1.sort((a, b) => a - b);
}

function defineProperties(target, obj) {
  for (let key in obj) {
    Object.defineProperty(target, key, {
      writable: true,
      value: obj[key],
      enumerable: false,
      configurable: true,
    });
  }
}

function mockClass(con, proto, staticProps) {
  proto && defineProperties(con.prototype, proto);
  staticProps && defineProperties(con, staticProps);
  return con;
}
