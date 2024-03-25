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
 * 17.单词搜索
 * 18.将有序数组转换为二叉搜索树
 * 19.小孩报数问题
 * 20.N皇后
 * 21.分割回文串
 * 22.划分字母区间
 * 23.多数元素
 * 24.反转链表II
 * 25.判断两个数组内容相等
 * 26.最长连续序列
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

> 一级难！！！还是不能理解

```js
function reverseLink(head, k) {
  let dummy = { next: head, val: null };
  let pre = dummy;
  let cur = head;
  let len = 0;
  while (head) {
    len++;
    head = head.next;
  }
  let count = Math.floor(len / k);
  for (let i = 0; i < count; i++) {
    for (let j = 0; j < k - 1; j++) {
      // pre-1-2-3-4
      // pre-2-1-3-4
      // 记录2
      let next = cur.next;
      // 1指向 3
      cur.next = cur.next.next;
      // 2指向 1
      next.next = pre.next;
      // 头节点指向2
      pre.next = next;
    }
    pre = cur;
    cur = pre.next;
  }
  return dummy.next;
}
```

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

## 9.打乱数组

```js
function shufttle(arr) {
  for (let i = arr.length - 1; i >= 0; i--) {
    let tmp = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[tmp]] = [arr[tmp], arr[i]];
  }
  return arr;
}
shufttle([1, 2, 3, 4, 5, 6]);
```

## 10.复原 IP 地址

```js
// 0000 => [0.0.0.0]
function reverseIp(s) {
  let ans = [];
  let backTrack = (path, start) => {
    if (path.length == 4 && start == s.length) {
      ans.push(path.slice().join('.'));
      return;
    }
    for (let i = start; i < s.length; i++) {
      let cur = s.slice(start, i + 1);
      if (+cur > 255 || cur.length > 3) continue;
      if (cur.length > 1 && cur[0] == '0') continue;
      path.push(cur);
      backTrack(path, i + 1);
      path.pop();
    }
  };
  backTrack([], 0);
  return ans;
}
reverseIp('0000');
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

## 24.反转链表 II

> 跟 k 个一组链表反转 好容易混淆

```js
// 1->2->3->4->5 2,4
// 1->4->3->3->5
function reverseLink(head, left, right) {
  let dummy = {
    next: head,
    val: null,
  };
  let pre = dummy;
  let i = 1;
  while (i < left) {
    pre = pre.next;
    i++;
  }
  let cur = pre.next;
  for (let i = 0; i < right - left; i++) {
    let next = cur.next;
    cur.next = next.next;
    next.next = pre.next;
    pre.next = next;
  }
  return dummy.next;
}
```

## [26.最长连续序列](https://leetcode.cn/problems/longest-consecutive-sequence/description/)

```js
/**
 * 给定一个未排序的整数数组 nums ，找出数字连续的最长序列（不要求序列元素在原数组中连续）的长度。
请你设计并实现时间复杂度为 O(n) 的算法解决此问题。
输入：nums = [100,4,200,1,3,2]
输出：4
解释：最长数字连续序列是 [1, 2, 3, 4]。它的长度为 4。
 */
```
