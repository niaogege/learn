/**
 * 1.删除链表的倒数第 N 个结点
 * 2.最长重复子数组
 * 3.最长公共子序列
 * 4.最长递增子序列
 * 5.最长连续递增子序列
 * 6.三数之和
 * 7.旋转搜索数组
 * 8.最长有效的括号
 * 9.螺旋矩阵II
 */

// 最长有效括号(()
function longestValid(str) {
  let stack = [-1];
  let ans = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] == '(') {
      stack.push(i);
    } else {
      stack.pop();
      // 如果栈为空 继续进栈
      if (stack.length == 0) {
        stack.push(i);
      } else {
        ans = Math.max(ans, i - stack.slice(-1));
      }
    }
  }
  return ans;
}

// 最长连续递增
// 输入：nums = [10,9,2,5,3,7,101,18]
// 输出：5
function findLengthOFCIS(nums) {
  let len = nums.length;
  let max = 1;
  let dp = new Array(len).fill(1);
  for (let i = 1; i < len; i++) {
    if (nums[i] > nums[i - 1]) {
      dp[i] = Math.max(dp[i - 1] + 1, dp[i]);
      max = Math.max(max, dp[i]);
    }
  }
  return max;
}

/**
输入：nums = [10,9,2,5,3,7,101,18]
输出：4
解释：最长递增子序列是 [2,3,7,101]，因此长度为 4 。
 */
function longAdd(nums) {
  let max = 1;
  let len = nums.length;
  let dp = new Array(len).fill(1);
  for (let i = 1; i < len; i++) {
    for (let j = 0; j < i; j++) {
      let a = nums[i];
      let b = nums[j];
      if (a > b) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
      max = Math.max(max, dp[i][j]);
    }
  }
  return max;
}

// 输入：text1 = "abcde", text2 = "ace"
// 输出：3
// 解释：最长公共子序列是 "ace"，它的长度为 3。
function longPublicSubsequence(nums1, nums2) {
  let max = 0;
  let m = nums1.length;
  let n = nums2.length;
  let dp = new Array(m + 1).fill().map(() => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      let a = nums1[i - 1];
      let b = nums2[j - 1];
      if (a == b) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
      max = Math.max(max, dp[i][j]);
    }
  }
  return max;
}

// 最长重复子数组
// 输入：nums1 = [1,2,3,2,1], nums2 = [3,2,1,4,7]
// 输出：3
// 解释：长度最长的公共子数组是 [3,2,1]
function findLength(nums1, nums2) {
  let max = 0;
  let m = nums1.length;
  let n = nums2.length;
  let dp = new Array(m + 1).fill().map(() => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      let a = nums1[i - 1];
      let b = nums2[j - 1];
      if (a == b) {
        dp[i][j] = Math.max(dp[i][j], dp[i - 1][j - 1] + 1);
      }
      max = Math.max(max, dp[i][j]);
    }
  }
  return max;
}

// 两种方式 快慢指针
function deleteNode(root, n) {
  let dummy = { next: root, val: 0 };
  let p = dummy;
  let q = dummy;
  while (n > 0) {
    q = q.next;
    n--;
  }
  while (q && q.next) {
    q = q.next;
    p = p.next;
  }
  p.next = p.next.next;
  return dummy.next;
}

// function deleteNode(root, n) {
//   let dummy = {
//     next: null,
//     val: 0,
//   };
//   dummy.next = root;
//   let cur = root;
//   let arr = [];
//   while (cur) {
//     arr.push(cur);
//     cur = cur.next;
//   }
//   arr.splice(arr.length - n, 1);
//   for (let i = 0; i < arr.length; i++) {
//     cur = {
//       next: null,
//       val: arr[i],
//     };
//     cur = cur.next;
//   }
//   return dummy.next;
// }

// 输出符合的数组
// 输入：nums = [-1,0,1,2,-1,-4]
// 输出：[[-1,-1,2],[-1,0,1]]
function threeSum(nums) {
  if (nums.length < 3 || !nums.length) return [];
  nums.sort((a, b) => a - b);
  let ans = [];
  let len = nums.length;
  for (let i = 0; i < len; i++) {
    let cur = nums[i];
    if (cur > 0) break;
    if (i > 0 && nums[i] == nums[i - 1]) continue;
    let l = i + 1;
    let r = len - 1;
    while (l < r) {
      let sum = nums[l] + cur + nums[r];
      if (sum == 0) {
        ans.push([nums[l], cur, nums[r]]);
        // l 去重
        if (l < r && nums[l] == nums[l + 1]) {
          l = l + 1;
        }
        // r 去重
        if (l < r && nums[r] == nums[r - 1]) {
          r = r - 1;
        }
        l = l + 1;
        r = r - 1;
      } else if (sum > 0) {
        r = r - 1;
      } else {
        l = l + 1;
      }
    }
  }
  return ans;
}

// 搜索 旋转排序数组
// 输入：nums = [4,5,6,7,0,1,2], target = 0
// 输出：4
function rotateArr(arr, target) {
  if (!arr.length) return -1;
  let l = 0;
  let r = arr.length - 1;
  while (l <= r) {
    let mid = l + Math.floor((r - l) / 2);
    if (arr[mid] == target) return mid;
    // 通过mid切分俩段
    if (arr[mid] >= arr[l]) {
      if (target >= arr[l] && target < arr[mid]) {
        r = mid - 1;
      } else {
        l = mid + 1;
      }
    } else {
      if (target > arr[mid] && target <= arr[r]) {
        l = mid + 1;
      } else {
        r = mid - 1;
      }
    }
  }
  return -1;
}
