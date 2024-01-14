/**
 * 1.合并两个有序数组（https://leetcode.cn/problems/merge-sorted-array/description/
 * 2.不同路径和最小路径
 * 3.最长的有效括号
 * 4.判断子序列
 * 5.移动0
 */

/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var moveZeroes = function (nums) {
  for (let i = 0; i < nums.length; i++) {
    let index = nums.indexOf(0);
    if (index > -1) {
      nums.splice(index, 1);
      nums.push(0);
    }
  }
};
var moveZeroes = function (nums) {
  let j = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] != 0) {
      let tem = nums[i];
      nums[i] = nums[j];
      nums[j++] = tem;
    }
  }
};

/**
示例 1：
输入：s = "abc", t = "ahbgdc"
输出：true
示例 2：
输入：s = "axc", t = "ahbgdc"
输出：false

s = ""
t =
"ahbgdc"
*/

var isSubsequence = function (s, t) {
  if (s.length == 0) return true;
  for (let i = 0, j = 0; j < t.length; j++) {
    if (s[i] == t[j]) {
      if (++i == s.length) {
        return true;
      }
    }
  }
  return false;
};
var isSubsequence = function (s, t) {
  for (let j = 1; j < s.length; j++) {
    let a = s[j];
    let a2 = s[j - 1];
    let index1 = t.indexOf(a);
    let index2 = t.indexOf(a2);
    if (index2 > -1 && index1 > -1 && index2 < index1) {
      return true;
    }
  }
  return false;
};

var isSubsequence = function (s, t) {
  let [m, n] = [s.length, t.length];
  let dp = new Array(m + 1).fill().map(() => new Array(n + 1).fill(false));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s[i] == t[j]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = dp[i][j - 1];
      }
    }
  }
  return dp[m][n] == m ? true : false;
};

function longestValid(str) {
  if (str.length < 2) return 0;
  let stack = [-1];
  let max = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] == '(') {
      stack.push(i);
    } else {
      stack.pop();
      if (stack.length == 0) {
        stack.push(i);
      } else {
        max = Math.max(max, i - stack.slice(-1));
      }
    }
  }
  return max;
}

/**
 * 
 * 给你两个按 非递减顺序 排列的整数数组 nums1 和 nums2，另有两个整数 m 和 n ，分别表示 nums1 和 nums2 中的元素数目。
请你 合并 nums2 到 nums1 中，使合并后的数组同样按 非递减顺序 排列。
注意：最终，合并后数组不应由函数返回，而是存储在数组 nums1 中。为了应对这种情况，nums1 的初始长度为 m + n，其中前 m 个元素表示应合并的元素，后 n 个元素为 0 ，应忽略。nums2 的长度为 n 。

输入：nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
输出：[1,2,2,3,5,6]
解释：需要合并 [1,2,3] 和 [2,5,6] 。
合并结果是 [1,2,2,3,5,6] ，其中斜体加粗标注的为 nums1 中的元素。

输入：nums1 = [1], m = 1, nums2 = [], n = 0
输出：[1]
解释：需要合并 [1] 和 [] 。
合并结果是 [1] 。

输入：nums1 = [0], m = 0, nums2 = [1], n = 1
输出：[1]
解释：需要合并的数组是 [] 和 [1] 。
合并结果是 [1] 。
注意，因为 m = 0 ，所以 nums1 中没有元素。nums1 中仅存的 0 仅仅是为了确保合并结果可以顺利存放到 nums1 中。
*/

function longestIncreSub(arr) {
  let len = arr.length;
  let dp = new Array(len).fill(0);
  dp[0] = 1;
  let max = 0;
  for (let i = 1; i < len; i++) {
    for (let j = 0; j < i; j++) {
      if (arr[i] > arr[j]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
      max = Math.max(max, dp[i]);
    }
  }
  return max;
}
longestIncreSub([2, 3, 7, 101]);

// splice(start, deletecount, pushItem)
function mergeArr(nums1, nums2, m, n) {
  nums1.splice(m, nums1.length - m, ...nums2);
  nums1.sort((a, b) => a - b);
  return nums1;
}
// nums1 = [0], m = 0, nums2 = [1], n = 1
function mergeArr(nums1, nums2, m, n) {
  for (let i = m; i < m + n; i++) {
    nums1[i] = nums2[i - m];
  }
  nums1.sort((a, b) => a - b);
  return nums1;
}
mergeArr([1, 2, 3, 0, 0, 0], [2, 5, 6], 3, 3);

/**
 * 输入: s = "abcabcbb"
输出: 3 
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
 */
var lengthOfLongestSubstring = function (s) {
  let max = 0;
  let arr = [];
  let res = [];
  for (let i = 0; i < s.length; i++) {
    let cur = s[i];
    const index = arr.indexOf(cur);
    if (index > -1) {
      arr.splice(0, index + 1);
    }
    arr.push(cur);
    max = Math.max(max, arr.length);
    if (arr.length == max) {
      res = arr.slice();
    }
  }
  return res;
};
lengthOfLongestSubstring('abcabcbb');
