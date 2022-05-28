---
title: 二叉树困难题
order: 5
group:
  order: 3
  title: 算法
  path: /interview/logic
nav:
  order: 3
  title: 'interview'
  path: /interview
---

- [114.二叉树展开为链表](https://leetcode.cn/problems/flatten-binary-tree-to-linked-list/)
- [236. 二叉树的最近公共祖先](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/)

### [114.二叉树展开为链表](https://leetcode.cn/problems/flatten-binary-tree-to-linked-list/)

好难理解！！！ 又得动手画

```js
var flatten(root) {
  while(root) {
    let temp = root.left
    if (temp) {
      while (temp.right) {
        temp = temp.right
      }
      temp.right = root.right
      root.right = root.left
      root.left = null
    }
    root = root.right
  }
```

### [236. 二叉树的最近公共祖先](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/)

```js
/**
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
var lowestCommonAncestor = function (root, p, q) {
  /**
   * Definition for a binary tree node.
   * function TreeNode(val) {
   *     this.val = val;
   *     this.left = this.right = null;
   * }
   */
  /**
   * @param {TreeNode} root
   * @param {TreeNode} p
   * @param {TreeNode} q
   * @return {TreeNode}
   */
  var lowestCommonAncestor = function (root, p, q) {
    if (p == root || q == root || !root) return root;
    let left = lowestCommonAncestor(root.left, p, q);
    let right = lowestCommonAncestor(root.right, p, q);
    if (left && right) {
      return root;
    }
    if (left == null && right !== null) {
      return right;
    } else if (left !== null && right == null) {
      return left;
    } else {
      return null;
    }
  };
};
```
