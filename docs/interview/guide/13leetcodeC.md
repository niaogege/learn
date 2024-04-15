---
title: 手撕热门算法题3
order: 23
group:
  order: 0
  title: /interview/guide
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
 * 1.最大二叉树
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
 * 24.随机链表的复制
 * 25.判断两个数组内容相等
 * 26.最长连续序列
 * 27.二叉搜索树中第k小的元素
 * 28.查找有序二维数组的目标值
 * 29.电话号码组合
 * 30.课程表
 * 31.搜索二维矩阵II
 * 32.寻找旋转排序数组中的最小值
 * 33.字符串解码
 * 34.前 K 个高频元素
 * 35.反转字符串里的单词
 * 36.快乐数
 * 37.四数之和
 * 38.
 * 39。
 * 40.
 * 41.
 * 42.
 * 43.
 * 44.
 * 45.
 * 46.
 * 47.
 * 48.
 * 49.
 * 50.
 */
```

## 1.最大二叉树

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

> 拆分 回溯

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
      let cur = s.slice(start, i + 1); // important
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

## 14.字母异位词分组

给你一个字符串数组，请你将 字母异位词 组合在一起。可以按任意顺序返回结果列表。字母异位词 是由重新排列源单词的所有字母得到的一个新单词。

```js
// 输入: strs = ["eat", "tea", "tan", "ate", "nat", "bat"]
// 输出: [["bat"],["nat","tan"],["ate","eat","tea"]]
/**
 * @param {string[]} strs
 * @return {string[][]}
 */
var groupAnagrams = function (strs) {
  let m = new Map();
  for (let str of strs) {
    let cur = str.split('').sort().join('');
    if (m.has(cur)) {
      let arr = m.get(cur);
      arr.push(str);
      m.set(cur, arr);
    } else {
      m.set(cur, [str]);
    }
  }
  return Array.from(m.values());
};
```

## 19.小孩报数问题

有 30 个小孩儿，编号从 1-30，围成一圈依此报数，1、2、3 数到 3 的小孩儿退出这个圈， 然后下一个小孩 重新报数 1、2、3，问最后剩下的那个小孩儿的编号是多少?

## [22.划分字母区间](https://leetcode.cn/problems/partition-labels/)

```js
/**
 * @param {string} s
 * @return {number[]}
 */
var partitionLabels = function (s) {
  let m = new Map();
  let ans = [];
  for (let i = 0; i < s.length; i++) {
    let cur = s[i];
    m.set(cur, i);
  }
  let left = 0;
  let right = 0;
  for (let i = 0; i < s.length; i++) {
    let cur = s[i];
    right = Math.max(right, m.get(cur));
    if (i == right) {
      ans.push(right - left + 1);
      left = i + 1;
    }
  }
  return ans;
};
```

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

## [29.电话号码组合](https://leetcode.cn/problems/letter-combinations-of-a-phone-number/)

```js
/**
 * @param {string} digits
 * @return {string[]}
 */
var letterCombinations = function (digits) {
  let map = {
    2: ['a', 'b', 'c'],
    3: ['d', 'e', 'f'],
    4: ['g', 'h', 'i'],
    5: ['j', 'k', 'l'],
    6: ['m', 'n', 'o'],
    7: ['p', 'q', 'r', 's'],
    8: ['t', 'u', 'v'],
    9: ['w', 'x', 'y', 'z'],
  };
  let temp = [];
  for (let n of digits) {
    temp.push(map[n]);
  }
  let ans = [];
  let backTrack = (path, row) => {
    if (path.length === temp.length) {
      if (path.length) {
        ans.push(path.slice().join(''));
      }
      return;
    }
    for (let i = 0; i < temp[row].length; i++) {
      let cur = temp[row][i];
      path.push(cur);
      backTrack(path, row + 1);
      path.pop();
    }
  };
  backTrack([], 0);
  return ans;
};
```

## [34.前 K 个高频元素](https://leetcode.cn/problems/top-k-frequent-elements/)

```js
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var topKFrequent = function (nums, k) {
  let m = new Map();
  for (let num of nums) {
    if (m.has(num)) {
      let count = m.get(num);
      m.set(num, count + 1);
    } else {
      m.set(num, 1);
    }
  }
  let ans = [];
  for (let [k, val] of m.entries()) {
    ans.push(val);
  }
  // 排序
  return [...m.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map((i) => i[0]);
};
```

## [35.反转字符串里的单词](https://leetcode.cn/problems/reverse-words-in-a-string/)

示例：输入：s = "the sky is blue" 输出："blue is sky the"

```js
/**
 * @param {string} s
 * @return {string}
 */
var reverseWords = function (s) {
  let arr = s.trim().split(' ').filter(Boolean);
  let l = 0;
  let r = arr.length;
  while (l < r) {
    let tmp = arr[l];
    arr[l] = arr[r];
    arr[r] = tmp;
    l++;
    r--;
  }
  return arr.join('');
};
```

## [36.快乐数](https://leetcode.cn/problems/happy-number/description/)

快乐数定义：

- 1.对于一个正整数，每一次将该数替换为它每个位置上的数字的平方和
- 2.然后重复这个过程直到这个数变为 1，也可能是 无限循环 但始终变不到 1。
- 3.如果这个过程 结果为 1，那么这个数就是快乐数
- 4.如果 n 是 快乐数 就返回 true ；不是，则返回 false 。

### 使用快慢指针

```js
/**
 * @param {number} n
 * @return {boolean}
 */
var isHappy = function (n) {
  let slow = n;
  let fast = n;
  while (fast != 1) {
    slow = getSum(slow);
    fast = getSum(fast);
    fast = getSum(fast);
    // 有环
    if (slow == fast) {
      return false;
    }
  }
  return true;
};
function getSum(n) {
  let sum = 0;
  while (n > 0) {
    sum += Math.pow(n % 10, 2);
    n = Math.floor(n / 10);
  }
  return sum;
}
```

### 第二种使用 Set 数据结构

```js
function isHappy(n) {
  let set = new Set();
  // 如果循环中某个值重复出现 说明进入死循环 说明不是快乐数
  while (n != 1 && !set.has(n)) {
    set.add(n);
    n = getSum(n);
  }
  return n == 1;
}
function getSum(n) {
  let sum = 0;
  while (n > 0) {
    sum += Math.pow(n % 10, 2);
    n = Math.floor(n / 10);
  }
  return sum;
}
```

## 38.
