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

> 20240319 生活太无聊 那就多刷点，防止老年失忆

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
 * 13.k个一组链表反转
 * 14.字母异位词分组
 * 15.滑动窗口最大值
 * 16.最小覆盖子串
 * 17.旋转图像
 * 18.将有序数组转换为二叉搜索树
 * 19.小孩报数问题
 * 20.单词搜索
 * 21.分割回文串
 * 22.划分字母区间
 * 23.多数元素
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

## 12.两两交换链表节点

```js
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var swapPairs = function (head) {
  let dummy = {
    next: head,
    val: null,
  };
  let cur = dummy;
  while (cur.next != null && cur.next.next != null) {
    let tmp1 = cur.next; // 1
    let tmp2 = cur.next.next.next; // 3
    // cur -> 2
    cur.next = cur.next.next;
    // 2 -> 1
    cur.next.next = tmp1;
    // 1 - > 3
    tmp1.next = tmp2;
    // 移动2
    cur = cue.next.next;
  }
  return dummy.next;
};
```

## 19.小孩报数问题

有 30 个小孩儿，编号从 1-30，围成一圈依此报数，1、2、3 数到 3 的小孩儿退出这个圈， 然后下一个小孩 重新报数 1、2、3，问最后剩下的那个小孩儿的编号是多少?
