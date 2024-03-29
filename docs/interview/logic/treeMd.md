---
title: 二叉树中等
order: 4
group:
  order: 3
  title: 算法
  path: /interview/logic
nav:
  order: 3
  title: 'interview'
  path: /interview
---

- [112.路径总和](https://leetcode-cn.com/problems/path-sum/)
- [113.路径总和二](https://leetcode.cn/problems/path-sum-ii/)
- [437. 路径总和 III](https://leetcode.cn/problems/path-sum-iii/)
- [根节点到叶子节点的数字之和](https://leetcode-cn.com/problems/3Etpl5/)
- [105.从前序和中序遍历构造二叉树](https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)
- 二叉树展开为链表
- [二叉树的最近公共祖先](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/)

### [112. 路径总和](https://leetcode-cn.com/problems/path-sum/)

- DFS

```js
/**
 * @param {TreeNode} root
 * @param {number} targetSum
 * @return {boolean}
 */
var hasPathSum = function (root, targetSum) {
  if (!root) return false;
  if (root.left == null && root.right == null) {
    return targetSum - root.val === 0;
  }
  return (
    hasPathSum(root.left, targetSum - root.val) || hasPathSum(root.right, targetSum - root.val)
  );
};
```

- BFS

```js
/**
 * @param {TreeNode} root
 * @param {number} targetSum
 * @return {boolean}
 */
var hasPathSum = function (root, targetSum) {
  if (!root) return false;
  var que_node = [root];
  var que_val = [root.val];
  while (que_node.length) {
    var now = que_node.shift();
    var val = que_val.shift();
    if (now.left == null && now.right == null) {
      if (val === targetSum) return true;
      continue;
    }
    if (now.left) {
      que_node.push(now.left);
      que_val.push(val + now.left.val);
    }
    if (now.right) {
      que_node.push(now.right);
      que_val.push(val + now.right.val);
    }
  }
  return false;
};
```

### [根节点到叶子节点的数字之和](https://leetcode-cn.com/problems/3Etpl5/)

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
// DFS
var sumNumbers = function (root) {
  if (!root) return 0;
  let num = 0;
  var dfs = (root) => {
    // 叶子节点
    if (root.left == null && root.right == null) {
      num += Number(root.val);
    }
    if (root.left) {
      root.left.val = `${root.val}${root.left.val}`;
      dfs(root.left);
    }
    if (root.right) {
      root.right.val = `${root.val}${root.right.val}`;
      dfs(root.right);
    }
  };
  dfs(root);
  return num;
};
// BFS
var sumNumbers = function (root) {
  if (!root) return 0;
  var nodeArr = [root];
  var valArr = [root.val];
  let num = 0;
  while (nodeArr.length) {
    var curNode = nodeArr.shift();
    var curVal = valArr.shift();
    if (curNode.left == null && curNode.right == null) {
      num = num + Number(curVal);
      continue;
    }
    if (curNode.left) {
      nodeArr.push(curNode.left);
      valArr.push(`${curVal}${curNode.left.val}`);
    }
    if (curNode.right) {
      nodeArr.push(curNode.right);
      valArr.push(`${curVal}${curNode.right.val}`);
    }
  }
  return num;
};
```

### 路径总和二

2022.05.10 最笨的方法

```js
/**
 * @param {TreeNode} root
 * @param {number} targetSum
 * @return {number[][]}
 */
var pathSum = function (root, targetSum) {
  if (!root) return [];
  let queue_node = [root];
  let queue_val = [root.val];
  let res = [];
  while (queue_node.length) {
    var len = queue_node.length;
    for (let i = 0; i < len; i++) {
      let node = queue_node.shift();
      let val = queue_val.shift();
      if (node.right === null && node.left === null) {
        // 满足条件的时候放到数组
        let sum = ('' + val).includes(',') ? val.split(',').map((e) => +e) : [+val];
        let total = sum.reduce((a, b) => a + b, 0);
        if (total === targetSum) {
          res.push(sum);
        }
      }
      if (node.left) {
        node.left.val = val + ',' + node.left.val;
        queue_node.push(node.left);
        queue_val.push(node.left.val);
      }
      if (node.right) {
        node.right.val = val + ',' + node.right.val;
        queue_node.push(node.right);
        queue_val.push(node.right.val);
      }
    }
  }
  return res;
};
```

2022.05.11

- 两个队列改成一个队列
- 记录下当前的数组
- 同时还需要一个地方保存累计值，改变当前的值 最后遍历的值即时最末尾的累加值

```js
/**
 * @param {TreeNode} root
 * @param {number} targetSum
 * @return {number[][]}
 */
var pathSum = function (root, targetSum) {
  if (!root) return [];
  let queue = [[root, [root.val]]];
  let res = [];
  while (queue.length) {
    let len = queue.length;
    for (let i = 0; i < len; i++) {
      var [node, path] = queue.shift();
      if (node.val === targetSum && node.left === null && node.right === null) {
        res.push(path.slice());
      }
      if (node.left) {
        let new_path = [...path, node.left.val];
        node.left.val = val + node.left.val;
        queue.push([node.left, new_path]);
      }
      if (node.right) {
        let new_path = [...path, node.right.val];
        node.right.val = val + node.right.val;
        queue.push([node.right, new_path]);
      }
    }
  }
  return res;
};
```

### [437. 路径总和 III](https://leetcode.cn/problems/path-sum-iii/)

```js
/** 
  1.不需要从根节点开始
  2.不需要在叶子结点结束
  3.路径只能是向下
*/
/**
 * @param {TreeNode} root
 * @param {number} targetSum
 * @return {number}
 */
var pathSum = function (root, targetSum) {
  if (!root) return 0;
  let res = helper(root, targetSum);
  res += pathSum(root.left, targetSum);
  res += pathSum(root.right, targetSum);
  return res;
};
var helper = (root, targetSum) => {
  let num = 0;
  if (!root) return 0;
  if (root.val === targetSum) {
    num++;
  }
  num += helper(root.left, targetSum - root.left.val);
  num += helper(root.right, targetSum - root.right.val);
  return num;
};
```

### [105.从前序和中序遍历构造二叉树](https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)

```js
/**
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode}
 */
var buildTree = function (preorder, inorder) {};
```

### [106.从中序与后序遍历序列构造二叉树](https://leetcode.cn/problems/construct-binary-tree-from-inorder-and-postorder-traversal/)

```js
/**
 * @param {number[]} inorder
 * @param {number[]} postorder
 * @return {TreeNode}
 */
var buildTree = function(inorder, postorder) {
  if (!inorder.length || !postorder.length) return null;
  var first = postorder.pop()
  var tree = new TreeNode(first)
  var mid = inorder.indexOf(first)
  tree.left = buildTree(inorder.slice(0, mid), postorder.slice(0, mid))
  tree.right = buildTree(inorder.slice(mid + 1), postorder(mid)))
  return tree
};
```
