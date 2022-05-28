---
title: 深度度优先遍历DFS
order: 2
group:
  order: 3
  title: 算法
  path: /interview/logic
nav:
  order: 3
  title: 'interview'
  path: /interview
---

## DFS

depth First Search

测试案例

```js
var node = {
  val: 1,
  left: {
    val: 2,
    left: {
      val: 4,
      left: null,
      right: null,
    },
    right: {
      val: 5,
      left: null,
      right: null,
    },
  },
  right: {
    val: 3,
    left: {
      val: 6,
      left: null,
      right: null,
    },
    right: {
      val: 7,
      left: null,
      right: null,
    },
  },
};
```

- 前序遍历 **根左右**

```js
var preTraversal = (root) => {
  var arr = [];
  var preorder = (node) => {
    if (node !== null) {
      arr.push(node.val);
      preorder(node.left);
      preorder(node.right);
    }
  };
  preorder(root);
  return arr;
};
preTraversal(node);
input: [1, 2, 3, 4, 5, 6, 7];
output: [1, 2, 4, 5, 3, 6, 7];
```

- 中序遍历 **左根右**

```js
function inorderTraversal(root) {
  var arr = [];
  let num = 1;
  var inorder = (node) => {
    if (node) {
      console.log(node, num++);
      inorder(node.left);
      arr.push(node.val);
      debugger;
      inorder(node.right);
    }
  };
  inorder(root);
  return arr;
}
input: [1, 2, 3, 4, 5, 6, 7];
output: [4, 2, 5, 1, 6, 3, 7];
```

- 后序遍历 **左右根**

```js
var postorderTraversal = function (root) {
  var arr = [];
  var postorder = (node) => {
    if (node) {
      postorder(node.left);
      postorder(node.right);
      arr.push(node.val);
    }
  };
  postorder(root);
  return arr;
};
input: [1, 2, 3, 4, 5, 6, 7];
output: [4, 5, 2, 6, 7, 3, 1];
```

### 困难题 [岛屿数量](https://leetcode.cn/problems/number-of-islands/)

20220513 题意第一次看都没理解，nnp，数据结构意识太差

```js
/**
 * @param {character[][]} grid
 * @return {number}
 */
var numIslands = function (grid) {
  var dfs = (grid, row, column) => {
    var nr = grid.length;
    var nc = grid[0].length;
    // 当前的值设为0表示已经遍历过
    grid[row][column] = '0';
    // 遍历上下左右
    if (row - 1 >= 0 && grid[row - 1][column] === '1') dfs(gird, row - 1, column);
    if (row + 1 < nr && grid[row + 1][column] === '1') dfs(grid, row + 1, column);
    if (column - 1 >= 0 && grid[column - 1][row] === '1') dfs(grid, row, column - 1);
    if (column + 1 < nc && grid[column + 1][row] === '1') dfs(grid, row, column + 1);
  };
  // 行数
  let nr = grid.length;
  if (!nr) return 0;
  let nc = grid[0].length;
  let num = 0;
  for (let i = 0; i < nr; i++) {
    for (let j = 0; j < nc; j++) {
      if (grid[i][j] === '1') {
        num++;
        dfs(grid, i, j);
      }
    }
  }
  return num;
};
```
