---
title: 广度优先遍历BFS
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

## tree 前中后序迭代遍历

测试用例

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

### 中序

左根右

```js
const inorderTraversal = (root) => {
  let res = [];
  let stack = [];
  while (root || stack.length) {
    while (root) {
      stack.push(root);
      root = root.left;
    }
    root = stack.pop();
    res.push(root.val);
    root = root.right;
  }
  return res;
};
inorderTraversal(node);

function inorder(root, res = []) {
  if (!root) return res;
  var cur = root;
  var stack = [];
  while (cur || stack.length) {
    if (cur) {
      stack.push(cur);
      // 左
      cur = cur.left;
    } else {
      cur = stack.pop();
      // 根
      res.push(cur.val);
      // 右
      cur = cur.right;
    }
  }
}
```

### 前序遍历

根左右

```js
function preTraversal(root) {
  var stack = [];
  var res = [];
  while (root || stack.length) {
    while (root) {
      stack.push(root);
      res.push(root.val);
      root = root.left;
    }
    root = stack.pop();
    root = root.right;
  }
  return res;
}
function tarversePre(node) {
  var res = [];
  var stack = [node];
  while (stack && stack.length) {
    var first = stack.pop();
    if (first) {
      res.push(first.val);
    }
    first.right && stack.push(first.right);
    first.left && stack.push(first.left);
  }
  return res;
}
```

### 后序遍历

左右根

```js
function postOrderTraversal(root) {
  let stack = [];
  let res = [];
  while (root || stack.length) {
    while (root) {
      stack.push(root);
      res.unshift(root.val);
      root = root.right;
    }
    root = root.pop();
    root = root.left;
  }
  return res;
}

function tarversePost(node) {
  var res = [];
  var stack = [node];
  while (stack && stack.length) {
    var first = stack.pop();
    if (first) {
      res.push(first.val);
    }
    first.left && stack.push(first.left);
    first.right && stack.push(first.right);
  }
  return res.reverse();
}
```

### 层序遍历

```js
function levelNode(root) {
  if (!root) return [];
  let queue = [root];
  let res = [];
  while (queue.length) {
    let len = queue.length;
    let arr = [];
    for (let i = 0; i < len; i++) {
      let node = queue.shift();
      node && arr.push(node.val);
      if (node.left) {
        queue.push(node.left);
      }
      if (node.right) {
        queue.push(node.right);
      }
    }
    res.push(arr);
  }
  return res;
}
```
