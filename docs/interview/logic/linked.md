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

回一下链表的数据结构：

数组跟链表的区别

数组（Array）是一种线性表数据结构。它用一组连续的内存空间，来存储一组具有相同类型的数据。数组支持随机访问，根据下标随机访问的时间复杂度为 O(1)。在进行数组的插入、删除操作时，为了保持内存数据的连续性，需要做大量的数据搬移，所以时间复杂度是 O(n)。

而在链表中插入或者删除一个数据，我们并不需要为了保持内存的连续性而搬移结点，因为链表的存储空间本身就不是连续的。所以，在链表中插入和删除一个数据是非常快速的。针对链表的插入和删除操作，我们只需要考虑相邻结点的指针改变，所以对应的时间复杂度是 O(1)。

链表随机访问的性能没有数组好，需要 O(n) 的时间复杂度。

- 数组随机访问时间复杂度 O(1),插入/删除时间复杂度 O(n)
- 链表随机访问时间复杂度 O(n),插入/删除时间复杂度 O(1)

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

### 排序链表

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

### LRU
