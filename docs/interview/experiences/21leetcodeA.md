---
title: 手撕热门算法题1
order: 19
group:
  order: 0
  title: interview
nav:
  order: 3
  title: 'interview'
  path: /interview
---

汇总题目来源于[codetop](https://codetop.cc/home)

> 如果能积累 hot100 道题，基本面试算法没啥大问题 1120

> [Hot 100](https://leetcode.cn/studyplan/top-100-liked/)

> [面试经典 150 题](https://leetcode.cn/studyplan/top-interview-150/)

```js
/**
 * 1.无重复字符的最长子串
 * 2.反转链表
 * 3.LRU缓存机制
 * 4.数组中的第K个最大元素
 * 5. K 个一组翻转链表
 * 6.三数之和
 * 7.最大子序和
 * 8.合并两个有序链表
 * 9.两数之和
 * 10.最长回文子串
 * 11.二叉树的层序遍历
 * 12.搜索旋转排序数组
 * 13.买卖股票的最佳时机
 * 14.岛屿数量
 * 15.环形链表
 * 16.有效的括号
 * 17.合并两个有序数组
 * 18.全排列
 * 19.二叉树的最近公共祖先
 * 20.手撕快速排序
 * 21.二叉树的锯齿形层序遍历
 * 22.反转链表 II
 * 23.螺旋矩阵
 * 24.相交链表
 * 25.合并K个排序链表
 * 26.字符串相加
 * 27.最长上升子序列
 * 28.环形链表 II
 * 29.重排链表
 * 30.接雨水
 * 31.删除链表的倒数第 N 个结点
 * 32.二叉树中的最大路径和
 * 33.合并区间
 * 34.编辑距离
 * 35.二叉树的中序遍历
 * 36.二分查找
 * 37.用栈实现队列
 * 38.最长公共子序列
 * 39.二叉树的右视图
 * 40.删除排序链表中的重复元素 II
 * 41.复原IP地址
 * 42.排序链表
 * 43.下一个排列
 * 44.x的平方根
 * 45.爬楼梯
 * 46.括号生成
 * 47.字符串转换整数 (atoi)
 * 48.两数相加
 * 49.滑动窗口最大值
 * 50.比较版本号
 */
```

## 1.无重复字符的最长子串

> 小红书第一道题的变种题 不会举一反三 直接跪了

```js
// 给定一个字符串 s ，请你找出其中不含有重复字符的 最长子串 的长度。
var lengthOfLongestSubstring = function (s) {
  if (s && s.length <= 1) return 1;
  s = s.split('');
  let res = {
    string: '',
    count: 0,
  };
  let arr = []; // 滑动的窗口
  for (let i = 0; i < s.length; i++) {
    let cur = s[i];
    if (!arr.includes(cur)) {
      arr.push(cur);
    } else {
      let index = arr.indexOf(cur);
      arr.splice(0, index + 1);
      arr.push(cur);
    }
    res.count = Math.max(res.count, arr.length);
    if (res.count === arr.length) {
      res.string = arr.join('');
    }
  }
  return res;
};
lengthOfLongestSubstring('abcabcbb');
```

### 扩展：连续重复的子字符串

```js
- 编写 maxContinuousString 函数，寻找字符串中连续重复次数最多的字符：
- 输入 aaabbbbccbbcccccc，返回 { string: 'c', count: 6} \*/
```

### 扩展 2:

```js
利用字符重复出现的次数，编写一种方法，实现基本的字符串压缩功能。比如，字符串aabcccccaaa会变为a5b1c5
如果需要是连续的呢？比如aabcccccaaa会变为a2b1c5a3
再优化一下，如果只有一个元素那就将1给去掉
function outPutStr(str) {
  let res = {
    string: '',
    count: 0
  }
  let arr = []
  for (let i=0;i<str.length;i++) {

  }
}
```

## 2.反转链表

```js
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function (head) {
  var pre = null;
  var cur = head;
  while (cur) {
    var next = cur.next;
    cur.next = pre;
    pre = cur;
    cur = next;
  }
  return pre;
};
```

## 4.数组中的第 K 个最大元素

## 5.K 个一组链表反转

```js
var reverseKGroup = function (head, k) {
  var dummy = {
    next: null,
    val: 0,
  };
  var prev = dummy;
  var cur = head;
  dummy.next = head;
  let length = 0;
  while (head !== null) {
    length++;
    head = head.next;
  }
  for (let i = 0; i < Math.floor(length / k); i++) {
    for (let j = 0; j < k - 1; j++) {
      let next = cur.next;
      cur.next = next.next;
      next.next = prev.next;
      prev.next = next;
    }
    prev = cur;
    cur = prev.next;
  }
  return dummy.next;
};
```

## [6.三数之和(排序 双指针 去重)](https://leetcode.cn/problems/3sum/description/)

> [参考题解](https://leetcode.cn/problems/3sum/solutions/39722/pai-xu-shuang-zhi-zhen-zhu-xing-jie-shi-python3-by/)

```js
// 给你一个整数数组 nums ，判断是否存在三元组 [nums[i], nums[j], nums[k]] 满足 i != j、i != k 且 j != k ，同时还满足 nums[i] + nums[j] + nums[k] == 0 。请
// 你返回所有和为 0 且不重复的三元组。
// 注意：答案中不可以包含重复的三元组。
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function (nums) {
  // [-1, -1, -4, 0, 1, 2]
  nums.sort((a, b) => a - b);
  var res = [],
    len = nums.length;
  for (let i = 0; i < len; i++) {
    var cur = nums[i];
    var r = len - 1;
    var l = i + 1;
    if (cur > 0) return res;
    // cur i-1正确去重
    if (i > 0 && cur === nums[i - 1]) continue;
    while (l < r) {
      var sum = cur + nums[l] + nums[r];
      if (sum === 0) {
        res.push([cur, nums[l], nums[r]]);
        // l去重
        while (r > l && nums[l] === nums[l + 1]) {
          l++;
        }
        // r去重
        while (r > l && nums[r] === nums[r - 1]) {
          r--;
        }
        r--;
        l++;
      } else if (sum > 0) {
        r--;
      } else if (sum < 0) {
        l++;
      }
    }
  }
};
threeSum([-1, 0, 1, 2, -1, -4]);
```

## [7.最大子序和](https://leetcode.cn/problems/maximum-subarray/description/)

```js
// 迭代方式
var maxSubArray = function (nums) {
  var max = 0;
  var total = nums[0];
  for (let i of nums) {
    if (total > 0) {
      total = total + i;
    } else {
      total = i;
    }
    max = Math.max(max, total);
  }
  return max;
};
maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]);

// dp 方式
var maxSubArray = function (nums) {
  var len = nums.length;
  var max = nums[0];
  var dp = new Array(len);
  dp[0] = nums[0];
  for (let i = 1; i < len; i++) {
    if (dp[i - 1] > 0) {
      dp[i] = dp[i - 1] + i;
    } else {
      dp[i] = i;
    }
    max = Math.max(dp[i], max);
  }
  return max;
};
```

## [8.合并两个有序链表](https://leetcode.cn/problems/merge-two-sorted-lists/)

```js
/**
 * 迭代
 */
var mergeTwoLists = function (l1, l2) {
  var dummy = {
    next: null,
    val: 0,
  };
  var cur = dummy;
  while (l1 && l2) {
    if (l1.val > l2.val) {
      cur.next = l2;
      l2 = l2.next;
    } else {
      cur.next = l1;
      l1 = l1.next;
    }
    cur = cur.next;
  }
  cur.next = l1 || l2;
  return dummy.next;
};

// dfs
var mergeTwoLists = function (l1, l2) {
  if (l1 == null) {
    return l2;
  } else if (l2 == null) {
    return l1;
  } else if (l1.val > l2.val) {
    l2.next = mergeTwoLists(l1, l2.next);
    return l2;
  } else {
    l1.next = mergeTwoLists(l1.next, l2);
    return l1;
  }
};
```

## [10.最长回文子串](https://leetcode.cn/problems/longest-palindromic-substring/)

```js
// 输入：s = "babad"
// 输出："bab"
// 解释："aba" 同样是符合题意的答案。
var longestPalindrome = function (s) {
  let len = s.length;
  let dp = new Array(len).fill(0).map((_) => new Array(len).fill(false));
  let max = 0;
  let begin = 0;
  for (let i = len - 1; i >= 0; i--) {
    for (let j = i; j < len; j++) {
      if (s[i] == s[j]) {
        if (j - i <= 1) {
          dp[i][j] = true;
        } else if (dp[i + 1][j - 1]) {
          dp[i][j] = true;
        }
      }
      let temp = j - i + 1;
      if (dp[i][j] && temp > max) {
        max = temp;
        begin = i;
      }
    }
  }
  return s.slice(begin, begin + max);
};
```

## [12.搜索旋转排序数组](https://leetcode.cn/problems/search-in-rotated-sorted-array/description/)

```js
// 在传递给函数之前，nums 在预先未知的某个下标 k（0 <= k < nums.length）上进行了 旋转，使数组变为 [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]（下标 从 0 开始 计数）。例如， [0,1,2,4,5,6,7] 在下标 3 处经旋转后可能变为 [4,5,6,7,0,1,2] 。
// 给你 旋转后 的数组 nums 和一个整数 target ，如果 nums 中存在这个目标值 target ，则返回它的下标，否则返回 -1 。
// 你必须设计一个时间复杂度为 O(log n) 的算法解决此问题。
// 输入：nums = [4,5,6,7,0,1,2], target = 0
// 输出：4
var search = function (nums, target) {
  let l = 0;
  let r = nums.length - 1;
  while (l <= r) {
    let mid = l + Math.floor((r - l) / 2);
    if (nums[mid] == target) return mid;
    // 左半段 还是右半段
    if (nums[mid] >= nums[l]) {
      if (target >= nums[l] && target < nums[mid]) {
        r = mid - 1;
      } else {
        l = mid + 1;
      }
    } else {
      if (target > nums[mid] && target <= nums[r]) {
        l = mid + 1;
      } else {
        r = mid - 1;
      }
    }
  }
  return -1;
};
```

## [岛屿数量](https://leetcode.cn/problems/number-of-islands/)

> 我以为不会考 DP 真实面试中还会考的

> 不是 DP 是 DFS

```js
给定一个二维数组，其中只包含0和1。我们定义1相邻的区域是指1与1是上下左右相邻的区域。请编写一个JavaScript函数，找出给定二维数组中所有1相邻的区域。
function numIslands(grid) {
  var isArea = (grid, r, c) => r < grid.length && c < grid[0].length && r >= 0 && c >= 0;
  var dfs = (grid, r, c ) => {
    if (!isArea(grid, r, c) || grid[r][c] != '1') return;
    grid[r][c] = '2'
    dfs(grid, r-1, c)
    dfs(grid, r+1, c)
    dfs(grid, r, c-1)
    dfs(grid, r, c+1)
  }
  let count = 0
  for (let r = 0; i < grid.length;r++) {
    for(let c = 0; c < grid[0].length;c++) {
      if (grid[r][c] == '1') {
        count = count+1
        dfs(grid, r, c)
      }
    }
  }
  return count
}
```

## [17.合并两个有序数组](https://leetcode.cn/problems/merge-sorted-array/)

```js
// 输入：nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
// 输出：[1,2,2,3,5,6]
// 解释：需要合并 [1,2,3] 和 [2,5,6] 。
// 合并结果是 [1,2,2,3,5,6] ，其中斜体加粗标注的为 nums1 中的元素。
function merge(num1, m, num2, n) {
  for (let i = m; i < m + n; i++) {
    num1[i] = nums2[i - m];
  }
  num1.sort((a, b) => a - b);
}
```

> feel difficult ???

## 21.二叉树的锯齿形层序遍历

```js
var zigzagLevelOrder = function (root) {
  if (!root) return [];
  let res = [];
  let stack = [root];
  let j = 0;
  while (stack.length) {
    let arr = [];
    let len = stack.length;
    for (let i = 0; i < len; i++) {
      const cur = stack.shift();
      arr.push(cur.val);
      if (cur.left) {
        stack.push(cur.left);
      }
      if (cur.right) {
        stack.push(cur.right);
      }
    }
    if (arr.length) {
      j++;
      console.log(j, j % 2);
      res.push(j % 2 == 0 ? arr.reverse() : arr);
    }
  }
  return res;
};
```

## 24.相交链表

```js
function insectionLink(headA, headB) {
  let cur = headA;
  var set = new Set();
  while (cur) {
    set.add(cur);
    cur = cur.mext;
  }
  cur = headB;
  while (cur) {
    if (set.has(cur)) {
      return cur;
    }
    cur = cur.next;
  }
  return null;
}
```

## [30.接雨水](https://leetcode.cn/problems/trapping-rain-water/)

```js
// 单调栈
function water(nums) {
  if (!nums.length) return 0;
  let len = nums.length;
  let stack = [0];
  let res = 0;
  for (let i = 1; i < len; i++) {
    let cur = nums[i];
    // 当前元素跟栈顶元素进行比较
    // 当前元素小于栈顶元素 下标入栈
    if (cur < nums[stack.slice(-1)]) {
      stack.push(i);
    } else {
      while (cur && cur >= nums[stack.slice(-1)]) {
        // 需要计算h*w
        let top = stack.pop(); // 已经出栈的栈顶元素
        if (stack.length != 0) {
          let curTop = stack.slice(-1); // 当前栈顶元素
          let h = Math.min(cur, nums[curTop]) - nums[top];
          let w = i - curTop - 1;
          res = res + h * w;
        }
      }
      stack.push(i);
    }
  }
  return res;
}
```

## 31.删除链表的倒数第 N 个结点

## [32.二叉树中的最大路径和](https://leetcode.cn/problems/binary-tree-maximum-path-sum/)

> hard

```js

```

## [33.合并区间](https://leetcode.cn/problems/merge-intervals/)

```js
// 输入：intervals = [[1,3],[2,6],[8,10],[15,18]]
// 输出：[[1,6],[8,10],[15,18]]
// 解释：区间 [1,3] 和 [2,6] 重叠, 将它们合并为 [1,6].
function mergeArr(nums) {
  nums.sort((a, b) => a[0] - b[0]);
  let ans = [];
  let pre = nums[0];
  for (let i = 1; i < nums.length; i++) {
    let cur = nums[i];
    if (cur[0] > pre[1]) {
      ans.push(pre);
      pre = cur;
    } else {
      pre[1] = Math.max(cur[1], pre[1]);
    }
  }
  ans.push(pre);
  return ans;
}
mergeArr([
  [1, 3],
  [2, 6],
  [8, 10],
  [15, 18],
]);
```

## [38.最长公共子序列](https://leetcode.cn/problems/longest-common-subsequence/)

```js
function findLongest(nums1, nums2) {
  let len1 = nums1.length;
  let len2 = nums2.length;
  let max = 0;
  let dp = new Array(len1 + 1).fill().map(() => new Array(len2 + 1).fill(0));
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      let a = dp[i - 1];
      let b = dp[j - 1];
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
```

## [46.括号生成](https://leetcode.cn/problems/generate-parentheses/)

```js
function generate(n) {
  if (n <= 0) return '';
  let res = [];
  var dfs = (paths, left, right) => {
    if (left < right || left > n) return;
    if (paths.length == 2 * n) {
      res.push(paths.slice());
      return;
    }
    dfs(paths + '(', left + 1, right);
    dfs(paths + ')', left, right);
  };
  dfs('', 0, 0);
  return res;
}
```

## [50.比较版本号](https://leetcode.cn/problems/compare-version-numbers/description/)

```js
var compareVersion = function (v1, v2) {
  v1 = v1.split('.');
  v2 = v2.split('.');
  let len = Math.max(v1.length, v2.length);
  let i = 0;
  while (i < len) {
    let cu1 = +v1[i] || 0;
    let cu2 = +v2[i] || 0;
    if (cu1 > cu2) {
      return 1;
    } else if (cu1 < cu2) {
      return -1;
    } else if (cu1 == cu2) {
      i++;
    }
  }
  return 0;
};
```

作为其扩展的题目，比较版本号之后，输出排序之后的版本号(正序或者倒序都行)

```js
// 输入：versions = ['0.1.1', '2.3.3', '0.302.1', '4.2', '4.3.5', '4.3.4.5']
// 输出：['0.1.1', '0.302.1', '2.3.3', '4.3.4.5', '4.3.5']

function compare(nums) {
  return nums.sort((a, b) => {
    let a1 = a.split('.');
    let b1 = b.split('.');
    let len = Math.max(a1.length, b1.length);
    for (let i = 0; i < len; i++) {
      let cu1 = +a1[i] || 0;
      let cu2 = +b1[i] || 0;
      if (cu1 > cu2) {
        return 1;
      } else if (cu1 < cu2) {
        return -1;
      } else continue;
    }
    return 0;
  });
}
```
