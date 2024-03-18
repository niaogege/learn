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

> 20240315 never give up

```js
/**
 * 1.二叉树的最小深度和最大深度
 * 2.用队列实现栈
 * 3.删除升序链表中重复出现的所有节点
 * 4.数组转树
 * 5.树转数组
 * 6.k个一组反转链表
 * 7.计算质数的个数
 * 8.二叉树展开链表
 * 9.打乱数组
 * 10.复原IP地址
 * 11.回文链表
 * 12.两两交换链表中的节点
 */
```

## [2.用队列实现栈](https://leetcode.cn/problems/implement-stack-using-queues/description/)

```js
class MyStack {
  constructor() {
    this.queue = [];
  }
  push(x) {
    this.queue.push(x);
  }
  // 移除并返回栈顶元素
  // 先进后出 后出先进
  pop() {
    let len = this.queue.length;
    while (len--) {
      this.queue.push(this.queue.shift());
    }
    return this.queue.shift();
  }
  //  返回栈顶元素。
  top() {
    let x = this.pop();
    this.queue.push(x);
    return x;
  }
  empty() {
    return this.queue.length == 0;
  }
}
```

## 3.删除升序链表中重复出现的所有节点

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

## 6.k 个一组反转链表

> 一级难！！！

## [7.计算质数的个数](https://leetcode.cn/problems/count-primes/)

```js
function countPrime(n) {
  let count = 0;
  let dp = new Array(n).fill(true);
  for (let i = 2; i * i <= n; i++) {
    if (dp[i]) {
      for (let j = i * i; j < n; j += i) {
        dp[j] = false;
      }
    }
  }
  for (let i = 2; i < n; i++) {
    if (dp[i]) {
      count++;
    }
  }
  return count;
}
```
