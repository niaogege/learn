---
title: 面试经验之手写算法基础版
order: 3
group:
  order: 0
  title: interview
nav:
  order: 3
  title: 'interview'
  path: /interview
---

> 至少准备 50 个常规算法

- LRU 缓存淘汰策略
- 二分法
- 3. 无重复字符的最长子串
- 反转链表
- 删除链表一个节点
- 链表是否有环
- 链表如果有环的话返回入口节点
- 无重复字符的最长子串
- 盛最多水的容器
- 20. 有效的括号
- 全排列
- 前中后序遍历
- 二叉树层序遍历

### LRU 缓存淘汰策略

### 二分法

给定一个  n  个元素有序的（升序）整型数组  nums 和一个目标值  target  ，写一个函数搜索  nums  中的 target，如果目标值存在返回下标，否则返回 -1。

```js
输入: nums = [-1,0,3,5,9,12], target = 9
输出: 4
解释: 9 出现在 nums 中并且下标为 4
var search = function(nums, target) {
  let start = 0
  let end = nums.length -1
  while(start <= end) {
    let mid = start + Math.floor(end-start / 2)
    if (nums[mid] === target) {
      return mid
    } else if (target > nums[mid]) {
      start = mid + 1
    } else if (target < nums[mid]) {
      end = mid - 1
    }
  }
  return -1
}
search([-1,0,3,5,9,12], 9)
```

### 反转链表

- 数组随机访问时间复杂度 O(1),插入/删除时间复杂度 O(n)
- 链表随机访问时间复杂度 O(n),插入/删除时间复杂度 O(1)

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 * 输入: 1->2->3->4->5->NULL
 * 输出: 5->4->3->2->1->NULL
 */
var reverseList = function (head) {
  let cur = head;
  let pre = null;
  while (cur) {
    let next = cur.next;
    cur.next = pre;
    pre = cur;
    cur = next;
  }
  return pre;
};
```

### 链表是否有环

```js
function hasCycle(head) {
  var fast = head;
  var slow = head;
  while (fast && fast.next) {
    if (slow === fast) {
      return true;
    }
    slow = slow.next;
    fast = fast.next.next;
  }
  return false;
}
```

### 链表有环的话返回入口节点

```js
function entryPart(head) {
  var cur = head;
  var m = new Map();
  while (cur) {
    if (m.has(cur)) {
      return m.get(cur);
    }
    m.set(cur, cur);
    cur = cur.next;
  }
  return null;
}
```

### 无重复字符的最长子串

给定一个字符串 s ，请你找出其中不含有重复字符的 最长子串 的长度。

```js
输入: s = "abcabcbb"
输出: 3
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
  var max = 0
  let len = s.length
  let arr = []
  let maxArr = []
  for (let i = 0; i < len; i++) {
    var cur = s[i]
    let index = arr.indexOf(cur)
    if (index > -1) {
      arr.splice(0, index+1)
    }
    arr.push(cur)
    max = Math.max(max, arr.length)
  }
  return max
};
lengthOfLongestSubstring('abcabcbb')
```

### [盛最多水的容器](https://leetcode.cn/problems/container-with-most-water/)

### [20. 有效的括号](https://leetcode.cn/problems/valid-parentheses/)

```js
/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function (s) {};
```

### 删除链表的一个节点

```js
/**
 * @param {ListNode} head
 * @param {number} val
 * @return {ListNode}
 */
var deleteNode = function (head, val) {
  let dummy = {
    val: 0,
    next: head,
  };
  let cur = dummy;
  while (cur.next) {
    if (cur.next.val === val) {
      cur.next = cur.next.next;
      continue;
    }
    cur = cur.next;
  }
  return dummy.next;
};
```

### 前中后序遍历

1.递归解法

```js
function preorder(tree) {
  var res = []
  var dfs = (node) {

  }
  return res
}
```

2.迭代解法

```js

```
