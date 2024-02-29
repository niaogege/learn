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

[二叉树](https://programmercarl.com/%E4%BA%8C%E5%8F%89%E6%A0%91%E7%90%86%E8%AE%BA%E5%9F%BA%E7%A1%80.html#%E4%BA%8C%E5%8F%89%E6%A0%91%E7%9A%84%E9%81%8D%E5%8E%86%E6%96%B9%E5%BC%8F)

## DFS

depth First Search

这里前中后，其实指的就是中间节点的遍历顺序，只要大家记住 前中后序指的就是中间节点的位置就可以了。

前序遍历：中左右中序遍历：左中右后序遍历：左右中

![前中后序遍历](https://code-thinking-1253855093.file.myqcloud.com/pics/20200806191109896.png)

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

- 前序遍历 **根左右** 先访问根节点，在访问左右节点

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
      inorder(node.left);
      arr.push(node.val);
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

### 二叉树层序遍历

```js
// dfs
function dfsLevel(root) {
  if (!tree) return [];
  var res = [];
  var dfs = (node, step) => {
    if (node != null) {
      if (!res[step]) {
        res[step] = [];
      }
      res[step].push(node.val);
      if (node.left) {
        dfs(node.left, step + 1);
      }
      if (node.right) {
        dfs(node.right, step + 1);
      }
    }
  };
  dfs(root, 0);
  return res;
}
```

### 多叉树 获取每一层的节点之和 DFS

```js
function layerSum(root) {
  if (!root) return [];
  let ans = [];
  let dfs = (node, step) => {
    if (node) {
      if (!ans[step]) {
        ans[step] = [];
      }
      ans[step].push(node.value);
      if (node.children && node.children.length) {
        node.children.forEach((child) => {
          dfs(child, step + 1);
        });
      }
    }
  };
  dfs(root, 0, []);
  console.log(ans);
  return ans.map((item) => item.reduce((a, b) => a + b, 0));
}

const res = layerSum({
  value: 2,
  children: [
    { value: 6, children: [{ value: 1 }] },
    { value: 3, children: [{ value: 2 }, { value: 3 }, { value: 4 }] },
    { value: 5, children: [{ value: 7 }, { value: 8 }] },
  ],
});
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
