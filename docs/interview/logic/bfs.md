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
  return res;
}
```

### 前序遍历

根左右

```js
function tarversePre(node) {
  var res = [];
  var stack = [node];
  while (stack && stack.length) {
    var first = stack.pop();
    res.push(first.val);
    first.right && stack.push(first.right);
    first.left && stack.push(first.left);
  }
  return res;
}
```

### 后序遍历

左右根

```js
function tarversePost(node) {
  var res = [];
  var stack = [node];
  while (stack && stack.length) {
    var first = stack.pop();
    res.push(first.val);
    first.left && stack.push(first.left);
    first.right && stack.push(first.right);
  }
  return res.reverse();
}
```

### [层序遍历](https://leetcode.cn/problems/binary-tree-level-order-traversal/)

```js
// bfs 迭代遍历
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

### 多叉树 获取每一层的节点之和 BFS

```js
const res = layerSum({
  value: 2,
  children: [
    { value: 6, children: [{ value: 1 }] },
    { value: 3, children: [{ value: 2 }, { value: 3 }, { value: 4 }] },
    { value: 5, children: [{ value: 7 }, { value: 8 }] },
  ],
});
console.log(res); // [2,14,25]
function layerSum(root) {
  if (!root) return [];
  let ans = [];
  let stack = [root];
  while (stack.length) {
    let sum = 0;
    let len = stack.length;
    for (let i = 0; i < len; i++) {
      let cur = stack.shift();
      sum += cur.value;
      if (cur.children) {
        cur.children.forEach((child) => {
          stack.push(child);
        });
        delete cur.children;
      }
    }
    ans.push(sum);
  }
  return ans;
}
```
