/**
 * 1.回文子串
 * 2.最长回文子串
 * 3.零钱兑换II
 * 4.数字转36进制
 * 5.对象和数组扁平化
 * 6.字符串相加
 * 7.字符串转换
 * 8.合并区间
 * 9.无重叠区间
 * 10.杨辉三角形
 * 11.判断子序列
 */

// 11 判断子序列
/**
 * 示例 1：
输入：s = "abc", t = "ahbgdc"
输出：true
示例 2：
输入：s = "axc", t = "ahbgdc"
输出：false
 */

// dp
function isChild(s, t) {
  let [m, n] = [s.length, t.length];
  let dp = new Array(m).fill().map(() => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s[i - 1] == t[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = dp[i][j - 1] + 1;
      }
    }
  }
  return dp[m][n] == m ? true : false;
}

function isChild(s, t) {
  let j = 0;
  for (let i = 0; i < t.length; i++) {
    if (t[i] == s[j]) {
      j = j + 1;
      if (j == s.length) {
        return true;
      }
    }
  }
  return false;
}

// 输出打印数组
/**
输入: numRows = 5
输出: [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]
示例 2:
输入: numRows = 1
输出: [[1]]
numRows=4
[[1],[1,1],[1,2,1],[1,3,3,1]]
*/
function generate(n) {
  let dp = [];
  for (let i = 0; i < n; i++) {
    dp[i] = new Array(i + 1).fill(1);
    for (let j = 1; j < i; j++) {
      dp[i][j] = dp[i - 1][j - 1] + dp[i - 1][j];
    }
  }
  return dp;
}
generate(3);

/**
 * 
给定一个区间的集合 intervals ，其中 intervals[i] = [starti, endi] 。返回 需要移除区间的最小数量，使剩余区间互不重叠 。
示例 1
输入: intervals = [[1,2],[2,3],[3,4],[1,3]]
输出: 1
解释: 移除 [1,3] 后，剩下的区间没有重叠。
示例 2:
输入: intervals = [ [1,2], [1,2], [1,2] ]
输出: 2
解释: 你需要移除两个 [1,2] 来使剩下的区间没有重叠。
示例 3:
输入: intervals = [ [1,2], [2,3] ]
输出: 0
解释: 你不需要移除任何区间，因为它们已经是无重叠的了。
*/

function merge(nums) {
  nums.sort((a, b) => a[0] - b[0]);
  let pre = nums[0];
  let res = [];
  for (let i = 1; i < nums.length; i++) {
    let num = nums[i];
    if (num[0] > pre[1]) {
      res.push(pre);
      pre = num;
    } else {
      pre[1] = Math.max(pre[1], num[1]);
    }
  }
  res.push(pre);
  return res;
}
merge([
  [0, 10],
  [10, 60],
]);

// get-element-by-id' -> 'getElementById

function transformStr(str) {
  return str.replace(/[_|-]([\w])/g, (_, p) => p.toUpperCase());
}
transformStr('get-element-by-id');

function flattenArr(arr) {
  let stack = [...arr];
  let res = [];
  while (stack.length) {
    let last = stack.pop();
    if (Array.isArray(last)) {
      stack.push(...last);
    } else {
      res.push(last);
    }
  }
  return res.reverse();
}
flattenArr([1, 2, 3, [4, 5, 6]]);

// 第三次写了
function flattenObj(res, tmp = {}, paths = '', isArray = false) {
  for (let [key, val] of Object.entries(res)) {
    if (Array.isArray(val)) {
      let path = isArray ? `${paths}[${key}]` : `${paths}${key}`;
      flattenObj(val, tmp, path, true);
    } else if (typeof val == 'object') {
      let path = isArray ? `${paths}[${key}].` : `${paths}${key}.`;
      flattenObj(val, tmp, path, false);
    } else {
      let path = isArray ? `${paths}[${key}]` : `${paths}${key}`;
      tmp[path] = val;
    }
  }
  return tmp;
}
flattenObj({
  a: {
    b: 1,
    c: [2, 3],
  },
});

function add(a, b) {
  let len = Math.max(a.length, b.length);
  a = a.padStart(len, '0');
  b = b.padStart(len, '0');
  let i = len - 1;
  let flag = 0;
  let res = '';
  while (i >= 0) {
    flag = Number(a[i]) + Number(b[i]) + flag;
    res = (flag % 10) + res;
    flag = Math.floor(flag / 10);
    i--;
  }
  if (flag == 1) {
    res = '1' + res;
  }
  return res;
}
add('12', '13');
// 数字转36进制
function numTo36(nums) {
  if (nums == 0) return '0';
  let radix = '0123456789abcdefghijklmnopqrstuvxyz';
  let res = '';
  while (nums > 0) {
    let flag = nums % 36;
    res = radix[flag] + res;
    nums = Math.floor(nums / 36);
  }
  return res;
}
numTo36(360);
/**
 * 输入: amount = 5, coins = [1, 2, 5]
输出: 4
 */
function coinChange2(amount, coins) {
  let dp = new Array(amount + 1).fill(0);
  dp[0] = 1;
  for (let coin of coins) {
    for (let j = coin; j <= amount; j++) {
      dp[j] += dp[j - coin];
    }
  }
  return dp[amount];
}
coinChange2(5, [1, 2, 5]);
coinChange2(3, [2]);
