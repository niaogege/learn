---
title: 面试经验之手写算法基础版
order: 14
group:
  order: 11
  title: /interview/experience
nav:
  order: 3
  title: 'interview'
  path: /interview
---

> 至少准备 50 个常规算法

- LRU 缓存淘汰策略
- 二分法
- 无重复字符的最长子串
- 反转链表
- 删除链表一个节点
- 链表是否有环
- 链表如果有环的话返回入口节点
- 无重复字符的最长子串
- 盛最多水的容器
- 有效的括号
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

### [11.盛最多水的容器](https://leetcode.cn/problems/container-with-most-water/)

给定一个长度为 n 的整数数组 height 。有 n 条垂线，第 i 条线的两个端点是 (i, 0) 和 (i, height[i]) 。

找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水。

返回容器可以储存的最大水量。

```js
/**
 * 两条垂直线的距离越远越好，两条垂直线的最短长度也要越长越好。
 * 若要下一个矩阵面积比当前面积来得大，必须要把 height[left] 和 height[right] 中较短的垂直线往中间移动，看看是否可以找到更长的垂直线
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function (height) {
  var maxArea = null;
  var start = 0;
  var end = height.length - 1;
  while (start <= end) {
    var w = end - start;
    var h = Math.min(arr[start], arr[end]);
    maxArea = Math.max(maxArea, w * h);
    if (height[start] < height[end]) {
      start++;
    } else {
      end--;
    }
  }
  return maxArea;
};
```

### [20. 有效的括号](https://leetcode.cn/problems/valid-parentheses/)

给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。

有效字符串需满足：

- 左括号必须用相同类型的右括号闭合。
- 左括号必须以正确的顺序闭合。
- 每个右括号都有一个对应的相同类型的左括号。

  1.输入：s = "()[]{}" 输出：true 2.输入：s = "[()]" 输出：true

```js
/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function (s) {
  var m = new Map([
    [')', '('],
    ['}', '{'],
    [']', '['],
  ]);
  var data = [];
  for (let i = 0; i < s.length; i++) {
    var item = s[i];
    if (m.has(item) && m.get(item) === data[data.length - 1]) {
      data.pop();
    } else {
      data.push(item);
    }
  }
  return data.length === 0;
};
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
// 前序 根左右
function preorder(tree) {
  var res = []
  var dfs = (node) {

  }
  return res
}
// 中序 左根右

// 后序 左右根
```

2.迭代解法

```js
// 前序 根左右
// 进栈 右 左
// 出栈 左 右
function preOrder(root, res = []) {
  if (!root) return res;
  var stack = [root];
  while (stack.length) {
    var cur = stack.pop();
    res.push(cur.val);
    if (cur.right) {
      stack.push(cur.right);
    }
    if (cur.left) {
      stack.push(cur.left);
    }
  }
  return res;
}

// 中序 左根右
function preOrder(root, res = []) {
  if (!root) return res;
  var stack = [];
  let cur = root;
  while (cur || stack.length) {
    if (cur) {
      cur = cur.left;
      stack.push(cur);
    } else {
      cur = stack.pop();
      res.push(cur.val);
      cur = cur.right;
    }
  }
}

// 后序 左右根
function preOrder(root, res = []) {
  if (!root) return res;
  var stack = [root];
  while (stack.length) {
    var cur = stack.pop();
    res.push(cur.val);
    if (cur.left) {
      stack.push(cur.left);
    }
    if (cur.right) {
      stack.push(cur.right);
    }
  }
  return res.reverse();
}
```

### 二叉树层序遍历

```js
/**
 *
 */
function levelOrder(root) {}
```
