---
title: 手撕热门算法题3
order: 23
group:
  order: 0
  title: interview
nav:
  order: 3
  title: 'interview'
  path: /interview
---

> [Hot 100](https://leetcode.cn/studyplan/top-100-liked/)

```js
/**
 * 1.二叉树的最小深度和最大深度
 * 2.最长公共前缀
 * 3.删除升序链表中重复出现的所有节点
 */
```

## 删除升序链表中重复出现的所有节点

```js
// [1,2,3,3,4,4,5] => [1,2,5]
function removeNode(node) {
  let dummy = {
    value: null,
    next: node,
  };
  let cur = dummy;
  while (cur.next) {
    if (cur.value === cur.next.value) {
      cur.next = cur.next.next;
    }
    cur = cur.next;
  }
  return dummy.next;
}
```
