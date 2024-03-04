/**
 * 1.requestIdleCallback
 * 2.mockClass
 * 3.合并俩个有序数组
 * 4.最长重复子数组
 * 5.最长公共子序列
 * 6.最长公共前缀
 */

/**
输入：text1 = "abcde", text2 = "ace" 
输出：3  
解释：最长公共子序列是 "ace" ，它的长度为 3 。
 */
var longestCommonSubsequence = function (text1, text2) {
  let [len1, len2] = [text1.length, text2.length];
  let dp = new Array(len1 + 1).fill().map(() => new Array(len2 + 1).fill(0));
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (text1[i - 1] == text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[len1][len2];
};

/**
输入：nums1 = [1,2,3,2,1], 
     nums2 = [3,2,1,4,7]
输出：3
解释：长度最长的公共子数组是 [3,2,1] 。
 */
var findLength = function (nums1, nums2) {
  const [len1, len2] = [nums1.length, nums2.length];
  let dp = new Array(len1 + 1).fill().map(() => new Array(len2 + 1).fill(0));
  let max = 0;
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (nums1[i - 1] == nums2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      }
      max = Math.max(dp[i][j], max);
    }
  }
  return max;
};
findLength([1, 2, 3, 2, 1], [3, 2, 1, 4, 7]);

function multiply(a, b) {
  let len1 = a.length;
  let len2 = b.length;
  let arr = new Array(len1 + len2).fill(0);
  for (let i = len1 - 1; i >= 0; i--) {
    for (let j = len2 - 1; j >= 0; j--) {
      let mul = +a[i] * +b[j];
      let p1 = i + j;
      let p2 = i + j + 1;
      let tmp = mul + arr[p2];
      arr[p2] = tmp % 10;
      arr[p1] = Math.floor(tmp / 10) + arr[p1];
    }
  }
  while (arr[0] == 0) {
    arr.shift();
  }
  return arr.length ? arr.join('') : '0';
}
multiply('22', '33');

function longUpperSub(arr) {
  let max = 0;
  let len = arr.length;
  let dp = new Array(len).fill(1);
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

function mergeTwoArr(arr1, m, arr2, n) {
  for (let i = m; i < m + n; i++) {
    arr1[i] = arr2[i - m];
  }
  return arr1.sort((a, b) => a - b);
}

function requestIdleCallback(cb) {
  return setTimeout(() => {
    cb({
      didTimeout: false,
      timeRemaining: () => 1,
    });
  });
}

/**
输入：nums1 = [1,2,3,2,1], nums2 = [3,2,1,4,7]
输出：3
解释：长度最长的公共子数组是 [3,2,1] 。
 */
var findLength = function (nums1, nums2) {};

/**
输入：text1 = "abcde", text2 = "ace" 
输出：3  
解释：最长公共子序列是 "ace" ，它的长度为 3 。
 */
var longestCommonSubsequence = function (text1, text2) {};

// 输入：strs = ["flower","flow","flight"]
// 输出："fl"
// 横向扫描
var longestCommonPrefix = function (strs) {
  let prefix = strs[0];
  for (let i = 1; i < strs.length; i++) {
    prefix = findTwo(prefix, strs[i]);
  }
  return prefix;
};
function findTwo(a, b) {
  let len = Math.min(a.length, b.length);
  let i = 0;
  while (i < len && a[i] == b[i]) {
    i++;
  }
  return a.slice(0, i);
}
longestCommonPrefix(['flower', 'flow', 'flight']);
// 合并俩个有序数组
var merge = function (nums1, m, nums2, n) {
  for (let i = m; i < m + n; i++) {
    nums[i] = nums2[i - m];
  }
  return nums1.sort((a, b) => a - b);
};
// 同名函数定义多次
function heavyLoad(target, name, fn) {
  let old = target[name];
  target[name] = function (...rest) {
    if (fn.length === rest.length) {
      fn.apply(this, rest);
    } else {
      old.apply(this, rest);
    }
  };
}

var test = { name: 'cpp' };
heavyLoad(test, 'show', () => {
  console.log('show one');
});
heavyLoad(test, 'show', (a, b) => {
  console.log('show two', a, b);
});
test.show();
test.show('wmh', 'cpp');
