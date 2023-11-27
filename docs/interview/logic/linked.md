---
title: 链表相关
order: 8
group:
  order: 3
  title: 算法
  path: /interview/logic
nav:
  order: 3
  title: 'interview'
  path: /interview
---

需要干掉的归纳：

- 1.反转链表
- 2.回文链表
- 3.环形链表
- 4.两两交换链表中的节点
- 5.链表中倒数第 k 个节点
- 7.从尾到头打印链表
- 8.合并两个有序链表
- 9.相交链表
- 10.链表中环的入口节点
- 11.删除链表的节点
- 12.删除链表的倒数第 N 个结点
- 13.移除链表元素
- 14.两数相加
- 15.二叉搜索树转链表
- [16.K 个一组翻转链表](https://leetcode.cn/problems/reverse-nodes-in-k-group/description/)

## 回一下链表的数据结构：

数组跟链表的区别

数组（Array）是一种线性表数据结构。它用一组连续的内存空间，来存储一组具有相同类型的数据。数组支持随机访问，根据下标随机访问的时间复杂度为 O(1)。在进行数组的插入、删除操作时，为了保持内存数据的连续性，需要做大量的数据搬移，所以时间复杂度是 O(n)。

而在链表中插入或者删除一个数据，我们并不需要为了保持内存的连续性而搬移结点，因为链表的存储空间本身就不是连续的。所以，在链表中插入和删除一个数据是非常快速的。针对链表的插入和删除操作，我们只需要考虑相邻结点的指针改变，所以对应的时间复杂度是 O(1)。

链表随机访问的性能没有数组好，需要 O(n) 的时间复杂度。

- 数组随机访问时间复杂度 O(1),插入/删除时间复杂度 O(n)
- 链表随机访问时间复杂度 O(n),插入/删除时间复杂度 O(1)

## 环形链表 1

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} head
 * @return {boolean}
 */
var hasCycle = function (head) {};
```

## 反转链表

```js
var test = {
  val: 1,
  next: {
    val: 2,
    next: {
      val: 3,
      next: {
        val: 4,
        next: {
          val: 5,
          next: undefined,
        },
      },
    },
  },
};
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function (head) {
  var pre = null;
  var cur = head;
  while (cur) {
    var next = cur.next;
    cur.next = pre;
    pre = cur;
    cur = next;
  }
  return pre;
};
```

## 排序链表

最初的最笨的方法

```js
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var deleteDuplicates = function (head) {
  var arr = [];
  while (head) {
    arr.push(head.val);
    head = head.next;
  }
  arr = [...new Set(arr)];
  if (!arr.length) {
    return null;
  }
  var temp = new ListNode(-1);
  var res = temp;
  for (let i = 0; i < arr.length; i++) {
    res.next = {
      val: arr[i],
      next: null,
    };
    res = res.next;
  }
  return temp.next;
};
```

稍微精简一点的答案

```js
var deleteDuplicates = function (head) {
  var cur = head;
  while (cur && cur.next) {
    if (cur.val === cur.next.val) {
      cur.next = cur.next.next;
    } else {
      cur = cur.next;
    }
  }
  return head;
};
```

## [合并两个有序链表](https://leetcode.cn/problems/merge-two-sorted-lists/)

将两个升序链表合并为一个新的 升序 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。

#### 第一种遍历方式

```js
var mergeTwoLists = function (l1, l2) {
  // 哨兵节点
  var dummy = {
    val: 0,
    next: null,
  };
  var cur = dummy;
  while (l1 != null && l2 != null) {
    if (l1.val >= l2.val) {
      cur.next = l2;
      l2 = l2.next;
    } else {
      cur.next = l1;
      l1 = l1.next;
    }
    cur = cur.next;
  }
  // 合并后 l1 和 l2 最多只有一个还未被合并完，我们直接将链表末尾指向未合并完的链表即可
  cur.next = l1 == null ? l2 : l1;
  return dummy.next;
};
```

#### [递归](https://leetcode.cn/problems/merge-two-sorted-lists/solutions/226408/he-bing-liang-ge-you-xu-lian-biao-by-leetcode-solu/)

如果 l1 或者 l2 一开始就是空链表 ，那么没有任何操作需要合并，所以我们只需要返回非空链表。否则，我们要判断 l1 和 l2 哪一个链表的头节点的值更小，然后递归地决定下一个添加到结果里的节点。如果两个链表有一个为空，递归结束

```js
var mergeTwoLists = function (l1, l2) {
  if (l1 === null) {
    return l2;
  } else if (l2 === null) {
    return l1;
  } else if (l1.val < l2.val) {
    l1.next = mergeTwoLists(l1.next, l2);
    return l1;
  } else {
    l2.next = mergeTwoLists(l1, l2.next);
    return l2;
  }
};
```

```js
/**
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
var mergeTwoLists = function (list1, list2) {
  let arr = [];
  while (list1) {
    arr.push(list1.val);
    list1 = list1.next;
  }
  while (list2) {
    arr.push(list2.val);
    list2 = list2.next;
  }
  var sum = arr.sort((a, b) => a - b);
  var dummy = {
    val: 1,
    next: null,
  };
  var cur = dummy;
  for (let i = 0; i < sum.length; i++) {
    cur.next = {
      val: sum[i],
      next: null,
    };
    cur = cur.next;
  }
  return dummy.next;
};
```

## 删除节点

```js
var deleteNode = function (head, val) {
  let dummy = {
    val: 0,
    next: head,
  };
  let cur = head;
  while (cur.next) {
    if (cur.next.val === val) {
      cur.next = cur.next.next;
      break;
    }
    cur = cur.next;
  }
  return dummy.next;
};
var test = {
  val: 1,
  next: {
    val: 2,
    next: {
      val: 3,
      next: {
        val: 4,
        next: {
          val: 5,
          next: undefined,
        },
      },
    },
  },
};
deleteNode(test, 3);
```

## [16.K 个一组翻转链表](https://leetcode.cn/problems/reverse-nodes-in-k-group/description/)
