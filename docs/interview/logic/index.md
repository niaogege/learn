---
title: 数据结构和算法综述
order: 0
group:
  order: 3
  title: 算法
  path: /interview/logic
nav:
  order: 3
  title: 'interview'
  path: /interview
---

算法一道坎，好像迈的过去，又好像迈不过，这咋办...

> 迈不过也得迈 读书破万卷 下笔如有神

> 20231208 重新开始背算法题，写算法题

> 20231209 刷不到 200 算法题 不会轻易去看 BOSS，看了也白看，真丢人

## 参考资料

- [向大佬致敬](https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzIxMjExNzQxMQ==&action=getalbum&album_id=2856240521298657286&scene=173&from_msgid=2247489721&from_itemidx=1&count=3&nolastread=1#wechat_redirect)

- [代码随想录](https://programmercarl.com/%E8%83%8C%E5%8C%85%E7%90%86%E8%AE%BA%E5%9F%BA%E7%A1%8001%E8%83%8C%E5%8C%85-1.html)

- [前端算法面试（高频题库&题目解析）](https://github.com/hovinghuang/fe-agorithm-interview/tree/main)

> 需要自己整理一份面试，花点时间

## 分类

- DP
- 二叉树
- 回溯
- 链表
- 栈
- 贪婪算法
- 字符串

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
var inorderTraversal = function (root) {
  var arr = [];
  var inorder = (node) => {
    if (node) {
      inorder(node.left);
      arr.push(node.val);
      inorder(node.right);
    }
  };
  inorder(root);
  return arr;
};
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

## BFS

广度优先遍历

### 层序遍历

- 199 二叉树的右视图

```js
// first
var rightSideView = function (root, k = 0, res = []) {
  if (!root) return res;
  if (!res[step]) {
    res[step] = root.val;
  }
  rightSideView(root.right, k + 1, res);
  rightSideView(root.left, k + 1, res);
  return res;
};
// second
var rightSideView = function (root) {
  let res = [];
  let level = 0;
  const dfs = (node, depth = 1) => {
    if (node === null) return;
    if (depth > level) {
      res.push(node.val);
      level++;
    }
    dfs(node.right, depth + 1);
    dfs(node.left, depth + 1);
  };
  dfs(root);
  return res;
};
```
