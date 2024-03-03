/**
 * 1.requestIdleCallback
 * 2.mockClass
 * 3.合并俩个有序数组
 * 4.最长重复子数组
 * 5.最长公共子序列
 * 6.最长公共前缀
 */

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
