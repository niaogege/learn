/**
 * @param {number[]} nums
 * @return {number}
 * 输入：nums = [-2,1,-3,4,-1,2,1,-5,4]
输出：6
解释：连续子数组 [4,-1,2,1] 的和最大，为 6 
 */
var maxSubArray = function (nums) {
  if (!nums.length) return 0;
  let max = nums[0];
  let dp = [];
  dp[0] = max;
  for (let i = 1; i < nums.length; i++) {
    if (dp[i - 1] > 0) {
      dp[i] = dp[i - 1] + nums[i];
    } else {
      dp[i] = nums[i];
    }
    max = Math.max(dp[i], max);
  }
  return max;
};

/**
 * @param {string} s
 * @return {number}
 */

var countSubstrings = function (s) {
  let len = s.length;
  var dp = new Array(len).fill(0).map((_) => new Array(len).fill(false));
  let count = 0;
  for (let i = len - 1; i >= 0; i--) {
    for (let j = i; j < len; j++) {
      // 三种情况
      if (s[i] === s[j]) {
        if (j - i <= 1) {
          count = count + 1;
          dp[i][j] = true;
        } else if (dp[i + 1][j - 1]) {
          count = count + 1;
          dp[i][j] = true;
        }
      }
    }
  }
  return count;
};
countSubstrings('aba');
// 最长回文子串
/**
 * @param {string} s
 * @return {string}
 * 输入：s = "babad"
   输出："bab"
   解释："aba" 同样是符合题意的答案。
 */
var longestPalindrome = function (s) {
  if (!s.length || s.length < 2) return s;
  let len = s.length;
  var dp = new Array(len).fill(0).map((_) => new Array(len).fill(false));
  let max = 1;
  let begin = 0;
  for (let i = len - 1; i >= 0; i--) {
    for (let j = i; j < len; j++) {
      if (s[j] != s[i]) {
        dp[i][j] = false;
      } else {
        if (j - i <= 1) {
          dp[i][j] = true;
        } else {
          dp[i][j] = dp[i + 1][j - 1];
        }
      }
      let temp = j - i + 1;
      if (dp[i][j] && temp > max) {
        max = temp;
        begin = i;
      }
    }
  }
  return s.substring(begin, max + begin);
};

longestPalindrome('abac');

/**
 * @param {number} n
 * @return {number}
 */
var climbStairs = function (n) {
  if (n < 2) return 1;
  let dp = [];
  dp[1] = 1;
  dp[2] = 2;
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
};
