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

- LRU 缓存淘汰策略
- 3. 无重复字符的最长子串
- 反转链表
- 全排列
- 前中后序遍历
- 二叉树层序遍历

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
    if (arr.length >= max) {
      maxArr = arr
      return arr
    }
  }
};
lengthOfLongestSubstring('abcabcbb')
```
