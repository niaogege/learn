---
title: 手撕热门算法题2
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
 1.二叉树路径和
 2.二叉树路径和II
 3.重排链表
 4.最长公共前缀
 5.最长公共子序列
 6.阶乘(迭代/递归/缓存)
 7.打家劫舍
 8.零钱兑换
 9.删除链表的节点
 10.括号生成
 */
```

## 1/2 路径和 II

```js
var pathSum = function (root, targetSum) {
  if (!root) return [];
  var res = [];
  var backTrack = (root, path) => {
    if (root == null) return;
    path.push(root.val);
    if (root.right == null && root.left == null) {
      if (path.reduce((a, b) => a + b) === targetSum) {
        res.push(path.slice());
      }
    }
    backTrack(root.left, path);
    backTrack(root.right, path);
    path.pop();
  };
  backTrack(root, []);
  return res;
};
// dfs
var pathSum = function (root, targetSum) {
  if (!root) return [];
  var res = [];
  var dfs = (root, path, sum) => {
    if (!root) return;
    sum = sum + root.val;
    var tempPath = [...path, root.val];
    if (sum === targetSum && root.left == null && root.right == null) {
      res.push(tempPath);
    }
    dfs(root.left, tempPath, sum);
    dfs(root.right, tempPath, sum);
  };
  dfs(root, [], 0);
};
```

## 6.阶乘(迭代/递归/缓存)

```js
// bfs
function count(n) {
  if (n < 0) return undefined;
  let total = 1;
  for (let i = n; i > 1; i--) {
    total = total * i;
  }
  return total;
}
count(3);
// dfs
function coun2(n) {
  if (n <= 1) {
    return 1;
  } else {
    return n * coun2(n - 1);
  }
}
coun2(3);
// cache
function count3(n) {
  var m = new Map();
  var fn = (n) => {
    if (n <= 1) return 1;
    if (m.has(n)) return m.get(n);
    let res = n * fn(n - 1);
    m.set(n, res);
    return res;
  };
  return fn(n);
}
count3(3);
```

## 9.[剑指 Offer 18. 删除链表的节点](https://leetcode.cn/problems/shan-chu-lian-biao-de-jie-dian-lcof/)

```js
/**
 * 给定单向链表的头指针和一个要删除的节点的值，定义一个函数删除该节点。返回删除后的链表的头节点。
 * 示例： 输入: head = [4,5,1,9], val = 5
输出: [4,1,9]
解释: 给定你链表中值为 5 的第二个节点，那么在调用了你的函数之后，该链表应变为 4 -> 1 -> 9.
 * @param {ListNode} head
 * @param {number} val
 * @return {ListNode}
 * 节点next指针直接指向下下一个节点
 */
var deleteNode = function (head, val) {
  var dummy = {
    next: head,
    val: null,
  };
  let cur = dummy;
  while (cur) {
    if (cur.next && cur.next.val === val) {
      let next = cur.next.next;
      cur.next = next;
      continue;
    }
    cur = cur.next;
  }
  return dummy.next;
};
```
