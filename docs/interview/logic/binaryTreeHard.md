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
}
```
