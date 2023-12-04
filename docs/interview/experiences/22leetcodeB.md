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
 1. 二叉树路径和
 2. 二叉树路径和II
 */
```

## 路径和 II

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
