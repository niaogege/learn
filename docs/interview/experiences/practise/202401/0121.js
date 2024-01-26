/**
 * 1.36进制转
 * 2.最长回文子串
 * 3.最长回文子序列 阔以要求不连续
 * 4.回文子串个数
 * 5.和为 K 的子数组
 * 6.滑动窗口最大值
 * 7.除自身以外数组的乘积
 * 8.旋转图像
 */

// 和为 K 的子数组 前缀和？

// 除自身以外数组的乘积
var productExceptSelf = (nums) => {
  let res = [1];
  let right = 1;
  for (let i = 1; i < nums.length; i++) {
    res[i] = res[i - 1] * nums[i - 1];
  }
  for (let i = nums.length - 1; i >= 0; i--) {
    res[i] = res[i] * right;
    right = nums[i] * right;
  }
};

// 最长回文子序列
// 输入：s = "cbbd"
/**
 输出：2
 解释：一个可能的最长回文子序列为 "bb" 。
 */
function longestPalindromicSub(s) {
  if (s.length == 0) return '';
  let dp = new Array(len).fill().map(() => new Array(len).fill(0));
  for (let i = 0; i < len; i++) {
    dp[i][i] = 1;
  }
  for (let i = len - 1; i >= 0; i--) {
    for (let j = i + 1; j < len; j++) {
      if (s[i] == s[j]) {
        dp[i][j] = dp[i + 1][j - 1] + 2; // +2
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]); // 从左边和下边推出来
      }
    }
  }
  return dp[0][len - 1];
}
// 回文子串个数
/** 
输入："aaa"
输出：6
解释：6个回文子串: "a", "a", "a", "aa", "aa", "aaa"
*/
function countPalidromicSub(s) {
  let len = s.length;
  let dp = new Array(len).fill().map(() => new Array(len).fill(false));
  let count = 0;
  for (let i = len - 1; i >= 0; i--) {
    for (let j = i; j < len; j++) {
      if (s[i] == s[j]) {
        if (j - i <= 1) {
          dp[i][j] = true;
          count = count + 1;
        } else if (dp[i + 1][j - 1]) {
          dp[i][j] = true;
          count = count + 1;
        }
      }
    }
  }
  return count;
}

// 最长回文子串 'caba'
function longestPandStr(s) {
  let len = s.length;
  let dp = new Array(len).fill().map(() => new Array(len).fill(false));
  let maxLen = 1;
  let begin = 0;
  // 从左下角开始往右上角遍历
  for (let i = len - 1; i >= 0; i--) {
    for (let j = i; j < len; j++) {
      if (s[i] == s[j]) {
        if (j - i <= 1) {
          dp[i][j] = true;
        } else if (dp[i + 1][j - 1]) {
          dp[i][j] = true;
        }
      }
      if (dp[i][j] && j - i + 1 > maxLen) {
        maxLen = j - i + 1;
        begin = i;
      }
    }
  }
  return s.substring(begin, begin + maxLen);
}
longestPandStr('caba');

function to36(num, radix = 36) {
  if (num == 0) return '0';
  let base = '0123456789abcdefghijklmnopqrstuvwxyz';
  let res = '';
  while (num > 0) {
    let flag = num % radix;
    res = base[flag] + res;
    num = Math.floor(num / radix);
  }
  return res;
}
to36(360);
