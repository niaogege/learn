---
title: 二叉树
order: 3
group:
  order: 3
  title: 算法
  path: /interview/logic
nav:
  order: 3
  title: 'interview'
  path: /interview
---

> 还是不理解二叉树的递归遍历流程，在此记录刷过的二叉树题目

> 20231209 还是不理解二叉树的递归

- [110.平衡二叉树](https://leetcode-cn.com/problems/balanced-binary-tree/)
- [100.相同的树](https://leetcode-cn.com/problems/same-tree/)
- [98.验证二叉搜索树](https://leetcode-cn.com/problems/validate-binary-search-tree/)
- [二叉树的最大深度](https://leetcode-cn.com/problems/maximum-depth-of-binary-tree/])
- [对称二叉树](https://leetcode-cn.com/problems/symmetric-tree/)
- [二叉树的直径](https://leetcode-cn.com/problems/diameter-of-binary-tree/)
- [226.翻转二叉树](https://leetcode-cn.com/problems/invert-binary-tree/)
- [111.二叉树的最小深度](https://leetcode-cn.com/problems/minimum-depth-of-binary-tree/)
- [662.二叉树的最大宽度](https://leetcode-cn.com/problems/maximum-width-of-binary-tree/)

深度优先遍历包含递归和迭代两种方法广度优先遍历包含层序遍历

### [110.平衡二叉树](https://leetcode-cn.com/problems/balanced-binary-tree/)

```js
/**
 * @param {TreeNode} root
 * @return {boolean}
 // 左子树平衡且右子树平衡
 // 左子树和右子树的高度差不能超过1
 */
var isBalanced = function (root) {
  if (!root) return true;
  const leftD = maxDepth(root.left);
  const rightD = maxDepth(root.right);
  return Math.abs(leftD - rightD) <= 1 && isBalanced(root.left) && isBalanced(root.right);
};
var maxDepth = (root) => {
  if (!root) {
    return 0;
  } else {
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
  }
};
```

### 相同的树

```js
/**
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {boolean}
 * 确定入参
 * 确定终止条件
 * 单层递归逻辑
 */
var isSameTree = function (p, q) {
  if (!p && !q) return true;
  if ((p && !q) || (!p && q)) return false;
  return p.val === q.val && isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
};
```

### 验证二叉搜索树

```js
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isValidBST = function (root) {
  return isValid(root, null, null);
};
var isValid = (root, min, max) => {
  if (root == null) return true;
  if (min != null && root.val <= min.val) return false;
  if (max != null && root.val >= max.val) return false;
  return isValid(root.left, min, root) && isValid(root.right, root, max);
};
```

### 二叉树的最大深度

递归算法

```js
/**
 * @param {TreeNode} root
 * @return {number}
 */
var maxDepth = function (root) {
  if (root === null) {
    return 0;
  } else {
    let leftD = maxDepth(root.left);
    let rightD = maxDepth(root.right);
    return 1 + Math.max(leftD, rightD);
  }
};
```

迭代方法

```js
function maxDepth(root) {
  if (root == null) return 0;
  let depth = 0;
  let queue = [root];
  while (queue.length) {
    let len = queue.length;
    for (let i = 0; i < len; i++) {
      let node = queue.shift();
      if (node.left) {
        queue.push(node.left);
      }
      if (node.right) {
        queue.push(node.right);
      }
    }
    depth++;
  }
  return depth;
}
```

### [平衡二叉树](https://leetcode-cn.com/problems/balanced-binary-tree/)

一个二叉树每个节点 的左右两个子树的高度差的绝对值不超过 1 。

```js
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isBalanced = function (root) {
  if (!root) return true;
  let left = maxDepth(root.left);
  let right = maxDepth(root.right);
  return Math.abs(left - right) <= 1 && isBalanced(root.left) && isBalanced(root.right);
};
var maxDepth = function (root) {
  if (root === null) {
    return 0;
  } else {
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
  }
};
```

### [对称二叉树](https://leetcode-cn.com/problems/symmetric-tree/)

```js
//dfs
var isSymmetric = function (root) {
  if (root == null) return true;
  const dfs = (p, q) => {
    if (!p && !q) return true;
    if (!p || !q) return false;
    if (p.val !== q.val) return false;
    if (dfs(p.left, q.right) && dfs(p.right, q.left)) {
      return true;
    }
    return false;
  };
  return dfs(root, root);
};
// bfs
var isSymmetric = function (root) {
  const isMirror = (l, r) => {
    const queue = [l, r];
    while (queue.length) {
      const u = queue.shift();
      const v = queue.shift();
      if (!v && !u) continue;
      if (!v || !u || v.val != u.val) return false;
      queue.push(u.left, v.right);
      queue.push(u.right, v.left);
    }
    return true;
  };
  return isMirror(root, root);
};
```

### [二叉树的直径](https://leetcode-cn.com/problems/diameter-of-binary-tree/)

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 * 左节点高度+右节点高度
 */
var diameterOfBinaryTree = function (root) {
  let max = 0;
  const dfs = (root) => {
    if (!root) return 0;
    let l = dfs(root.left);
    let r = dfs(root.right);
    if (l + r > max) {
      max = l + r;
    }
    return Math.max(l, r) + 1;
  };
  return max;
};
```

### [二叉树的最小深度](https://leetcode-cn.com/problems/minimum-depth-of-binary-tree/)

```js
/**
 * @param {TreeNode} root
 * @return {number}
 */
var minDepth = function (root) {
  if (root == null) return 0;
  if (root.left == null && root.right === null) return 1;
  let ans = -Infinity;
  if (root.left) {
    ans = Math.min(minDepth(root.left), ans);
  }
  if (root.right) {
    ans = Math.min(minDepth(root.right), ans);
  }
  return ans + 1;
};
```

### [226.翻转二叉树](https://leetcode-cn.com/problems/invert-binary-tree/)

```js
/**
 * @param {TreeNode} root
 * @return {TreeNode}
 */
var invertTree = function (root) {
  if (root == null) return null;
  let temp = root.left;
  root.left = root.right;
  root.right = temp;
  invertTree(root.left);
  invertTree(root.right);
  return root;
};
```

### [二叉树最大宽度](https://leetcode-cn.com/problems/maximum-width-of-binary-tree/)

```js
var widthOfBinaryTree = function (root) {
  if (root == null) return 0;
  let queue = [[0n, root]];
  let ans = 1n;
  while (queue.length) {
    let width = queue[queue.length - 1][0] - queue[0][0] + 1n;
    if (width > ans) {
      ans = width;
    }
    let temp = [];
    for (const [i, q] of queue) {
      q.left && temp.push([i * 2n, q.left]);
      q.right && temp.push([i * 2n + 1n, q.right]);
    }
    queue = temp;
  }
  return Number(ans);
};
```

后面的几个测试案例目前还是没有通过的

```js
/**
 * @param {TreeNode} root
 * @return {number}
 */
var widthOfBinaryTree = function (root) {
  if (!root) return 0;
  let queue = [root]; // 存储节点
  let numArr = [0]; // 存储索引
  let max = 1;
  while (queue.length) {
    let tempQueue = [],
      tempNumarr = [];
    while (queue.length) {
      let node = queue.shift();
      let num = numArr.shift();
      if (node.left) {
        tempQueue.push(node.left);
        tempNumarr.push(num * 2 + 1);
      }
      if (node.right) {
        tempQueue.push(node.right);
        tempNumarr.push(num * 2 + 2);
      }
    }
    let tempMax = 0;
    if (tempNumarr.length) {
      tempMax = tempNumarr[tempNumarr.length - 1] - tempNumarr[0] + 1;
    }
    max = Math.max(max, tempMax);
    queue = tempQueue;
    numArr = tempNumarr;
  }
  return max;
};
```
