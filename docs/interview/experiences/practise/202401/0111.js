/**
 * 1.字符串相乘
 * 2.三数之和
 * 3.旋转的排序数组
 * 4.最长公共子序列
 * 5.最长重复子串
 * 6.最长递增子序列
 * 7.最长连续递增子序列
 */
/**
输入：nums = [1,3,5,4,7]
输出：3
解释：最长连续递增序列是 [1,3,5], 长度为3。尽管 [1,3,5,7] 也是升序的子序列, 但它不是连续的，因为 5 和 7 在原数组里被 4 隔开。
*/
function longestUpChild(nums) {
  let max = 0;
  let len = nums.length;
  // 以下标i为结尾的连续递增的子序列长度最少也应该是1，即就是nums[i]这一个元素
  let dp = new Array(len).fill(1);
  for (let i = 1; i < len; i++) {
    if (nums[i] > nums[i - 1]) {
      dp[i] = dp[i - 1] + 1;
    }
    max = Math.max(dp[i], max);
  }
  return max;
}

function longestUpChild2(nums) {
  let max = 0;
  let arr = [nums[0]];
  for (let i = 1; i < len; i++) {
    if (nums[i] > nums[i - 1]) {
      arr.push(nums[i]);
    } else {
      arr = [];
    }
    max = Math.max(max, arr.length);
  }
  return max;
}

/** 
输入：nums = [10,9,2,5,3,7,101,18]
输出：4
解释：最长递增子序列是 [2,3,7,101]，因此长度为 4 。
*/
function longestUpChildSequence(nums) {
  let len = nums.length;
  let max = 0;
  let dp = new Array(len).fill(1);
  for (let i = 1; i < len; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[i] > nums[j]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
      max = Math.max(max, dp[i]);
    }
  }
  return max;
}
/**
输入：text1 = "abcde", text2 = "ace"
输出：3
解释：最长公共子序列是 "ace"，它的长度为 3。
*/
// 最长公共子序列
function longestChildSequence(a, b) {
  let max = 0;
  let dp = new Array(a.length + 1).fill().map(() => new Array(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] == b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j] + 1, dp[i][j - 1] + 1);
      }
      max = Math.max(max, dp[i][j]);
    }
  }
  return max;
}

// 最长重复子串
// [1,2,3]
// [4,2,1,2,3]
function longestChildD(a, b) {
  let max = 0;
  let dp = new Array(a.length + 1).fill().map(() => new Array(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] == b[j - 1]) {
        dp[i][j] = Math.max(dp[i - 1][j - 1] + 1, dp[i][j]);
      }
      max = Math.max(max, dp[i][j]);
    }
  }
  return max;
}
longestChildD([1, 2, 3, 2, 1], [3, 2, 1, 4, 7]);
// 双指针 去重
function threeNums(nums) {
  let len = nums.length;
  if (len < 3) return [];
  nums.sort((a, b) => a - b);
  let ans = [];
  for (let i = 0; i < len; i++) {
    if (nums[i] > 0) continue;
    if (i > 0 && nums[i] == nums[i - 1]) continue;
    let left = i + 1;
    let right = len - 1;
    let cur = nums[i];
    while (left < right) {
      let sum = cur + nums[left] + nums[right];
      if (sum == 0) {
        ans.push([cur, nums[left], nums[right]]);
        while (left < right && nums[right] == nums[right - 1]) {
          right--;
        }
        while (left < right && nums[left] == nums[left + 1]) {
          left++;
        }
        right--;
        left++;
      }
      if (sum > 0) {
        right--;
      }
      if (sum < 0) {
        left++;
      }
    }
  }
  return ans;
}

// 字符串相乘
function multiply(a, b) {
  let len = a.length + b.length;
  let res = new Array(len).fill(0);
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      let p1 = i + j;
      let p2 = p1 + 1;
      let sum = +a[i] * +b[j] + res[p2];
      res[p2] = sum % 10;
      res[p1] = Math.floor(sum / 10) + res[p1];
    }
  }
  while (res[0] == 0) {
    res.shift();
  }
  return res.join('');
}
multiply('11', '11');
