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
 * 3. LRU缓存机制
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
 * 44.x 的平方根
 * 45.爬楼梯
 * 46.括号生成
 * 47.字符串转换整数 (atoi)
 * 48.两数相加
 * 49.滑动窗口最大值
 * 50.比较版本号
 */
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

## 6.三数之和(排序 双指针 去重)

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

## [合并两个有序链表](https://leetcode.cn/problems/merge-two-sorted-lists/)

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

## [12.搜索旋转排序数组](https://leetcode.cn/problems/search-in-rotated-sorted-array/description/)

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function (nums, target) {
  var len = nums.length;
  if (len == 0) return -1;
  if (len === 1) return nums[0] === target ? 0 : -1;
  var l = 0,
    r = len - 1;
  while (l < r) {
    var mid = Math.floor((r - l) / 2 + l);
    if (nums[mid] === target) return mid;
    if (nums[0] < nums[mid]) {
      if (nums[0] < target && target < nums[mid]) {
        r = mid - 1;
      } else {
        l = mid + 1;
      }
    } else {
      if (nums[mid] < target && target < nums[len - 1]) {
        l = mid + 1;
      } else {
        r = mid - 1;
      }
    }
  }
};
```

## [17.合并两个有序数组](https://leetcode.cn/problems/merge-sorted-array/)

```js
function merge(num1, m, num2, n) {
  for (let i = m; i < m + n; i++) {
    num1[i] = nums2[i - m];
  }
  num1.sort((a, b) => a - b);
}
```

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

## [32.二叉树中的最大路径和](https://leetcode.cn/problems/binary-tree-maximum-path-sum/)

```js

```
