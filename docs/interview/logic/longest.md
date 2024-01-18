---
title: 最长xx相关
order: 8
group:
  order: 3
  title: 算法
  path: /interview/logic
nav:
  order: 3
  title: 'interview'
  path: /interview
---

## 各种最长？老是混淆？

- 最长重复子数组
- 最长公共子序列
- 最长递增子序列
- 最长连续递增子序列
- 最长递增子序列的个数
- 最长回文子串
- 最长回文子序列
- 最长有效括号
- 最长公共前缀
- 无重复字符的最长子串

> 眼花缭乱,凌乱的很

## 最长公共系列

```js
// 最长重复子数组
输入：nums1 = [1,2,3,2,1], nums2 = [3,2,1,4,7]
输出：3
解释：长度最长的公共子数组是 [3,2,1] 。

function findPublicChild(a, b) {
  let [m, n] = [a.length, b.length];
  let dp = new Array(m + 1).fill().map(() => new Array(n + 1).fill(0));
  let max = 0;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] == b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      }
      max = Math.max(max, dp[i][j]);
    }
  }
  return max;
}
```

### 拓展，求输出公共子数组？

### 最长公共子序列

```js
输入：text1 = "abcde", text2 = "ace"
输出：3
解释：最长公共子序列是 "ace" ，它的长度为 3 。
function findLongestPublicChild(a, b) {
  let [m, n] = [a.length, b.length];
  let dp = new Array(m + 1).fill().map(() => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; i <= n; j++) {
      if (a[i - 1] == b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
      max = Math.max(max, dp[i][j]);
    }
  }
  return max;
}
```

两个区别是 重复子数组的个数=前一个状态+1，而最长公共子序列分为两种情况，a[i - 1] VS b[j - 1] 相等和不相等。相等的时候，dp[i][j]等于 dp[i-1][j-1]+1.如果不相等，则需要看前面的某一字符串是否相等，即 a[0, i-2]和 b[0, j-1]的最长公共子序列和 a[i-2]和 b[j-1]的最长公共子序列，两者取最大值

```js
if (a[i - 1] == b[j - 1]) {
  dp[i][j] = dp[i - 1][j - 1] + 1;
} else {
  dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
}
```

### 拓展，求输出公共子序列？

## 最长递增子序列相关

### 最长递增子序列

```js
/**
输入：nums = [10,9,2,5,3,7,101,18]
输出：4
解释：最长递增子序列是 [2,3,7,101]，因此长度为 4
 */
function longestUpChild(nums) {
  let len = nums.length;
  let dp = new Array(len + 1).fill(1);
  let max = 1;
  for (let i = 1; i <= len; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[i] > nums[j]) {
        dp[i] = Math.max(dp[j] + 1, dp[i]);
      }
      max = Math.max(max, dp[i]);
    }
  }
  return max;
}
```

### 最长连续递增子序列

```js
/**
输入：nums = [1,3,5,4,7]
输出：3
解释：最长连续递增序列是 [1,3,5], 长度为3。尽管 [1,3,5,7] 也是升序的子序列, 但它不是连续的，因为 5 和 7 在原数组里被 4 隔开。
 */
function longestUpChildSeq(nums) {
  let dp = new Array(nums.length + 1).fill(1);
  let max = 1;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > nums[i - 1]) {
      dp[i] = dp[i - 1] + 1;
    }
    max = Math.max(max, dp[i]);
  }
  return max;
}
function longestUpChildSeq(nums) {
  if (nums.length == 0) return 0;
  let max = 1;
  let temp = [];
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > nums[i - 1]) {
      temp.push(nums[i]);
    } else {
      temp = [];
    }
    max = Math.max(max, temp.length);
  }
  return max;
}
```

## 最长回文相关

### [最长回文子串](https://leetcode.cn/problems/longest-palindromic-substring/description/)

```js
/**
 * 输入：s = "babad"
 * 输出："bab"
 * 解释："aba" 同样是符合题意的答案。
 */
function longestPalindrome(s) {
  if (s == '') return s;
  let maxLen = 1;
  let begin = 0;
  let len = s.length;
  let dp = new Array(len).fill().map(() => new Array(len).fill(false));
  for (let i = 0; i < len; i++) {
    dp[i][i] = true;
  }
  for (let i = 1; i < len; i++) {
    for (let j = 0; j < i; j++) {
      if (s[i] == s[j]) {
        if (i - j <= 2) {
          dp[i][j] = true;
        } else {
          dp[i][j] = dp[i - 1][j + 1];
        }
      }
      if (dp[i][j] && i - j + 1 > maxLen) {
        maxLen = i - j + 1;
        begin = j;
      }
    }
  }
  return s.substring(begin, begin + maxLen);
}
```

### 最长回文子序列

```js

```

## [最长有效括号](https://leetcode.cn/problems/longest-valid-parentheses/description/)

```js
/**
输入：s = ")()())"
输出：4
解释：最长有效括号子串是 "()()"
 */
function longestValidPar(str) {
  if (str.length < 2) return 0;
  let stack = [-1];
  let max;
  for (let i = 0; i < str.length; i++) {
    let cur = str[i];
    if (cur == '(') {
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
```

## [最长公共前缀](https://leetcode.cn/problems/longest-common-prefix/description/)

```js
/**
 * 输入：strs = ["flower","flow","flight"]
输出："fl"
 */
// 横向扫描
function findLongestPefix(nums) {
  let prefix = nums[0];
  for (let i = 1; i < nums.length; i++) {
    let cur = nums[i];
    prefix = findTwo(cur, prefix);
    if (prefix.length == 0) {
      continue;
    }
  }
  return prefix;
}
function findTwo(a, b) {
  let len = Math.min(a.length, b.length);
  let i = 0;
  let j = len;
  while (i <= len && a[i] == b[i]) {
    i++;
  }
  return a.slice(0, i);
}
findLongestPefix(['flower', 'flow', 'flight']);
```

## [无重复字符的最长子串](https://leetcode.cn/problems/longest-substring-without-repeating-characters/description/)

```js
/**
 * 输入: s = "abcabcbb"
输出: 3 
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
 */
function longestSub(str) {
  let max = 0;
  let ans = [];
  for (let i = 0; i < str.length; i++) {
    let cur = str[i];
    const index = ans.indexOf(cur);
    if (index > -1) {
      ans.splice(0, index + 1);
    }
    ans.push(cur);
    max = Math.max(max, ans.length);
  }
  return max;
}
```
