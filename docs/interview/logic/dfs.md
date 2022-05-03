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

- 层序遍历

```js

```
