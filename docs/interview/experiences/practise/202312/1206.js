/**
 * 1.重排链表
 * 2.二叉树最近公共祖先
 * 3.岛屿数量
 * 4.LRU
 * 5.相交链表
 * 6.环形链表
 * 7.删除链表节点
 * 8.解构为搜索二叉树
 * 9.括号生成
 * 10.对称二叉树
 * 11.排序链表
 */

/**
 * 重排链表
 */

function reorderList(head) {
  if (head == null) return;
  let cur = head;
  let stack = [];
  while (cur) {
    stack.push(cur);
    cur = cur.next;
  }
  let i = 0;
  let j = stack.length - 1;
  while (i < j) {
    // 开头直接指向末尾
    stack[i].next = stack[j];
    i++;
    if (i == j) {
      break;
    }
    // 末尾直接指向开头
    stack[j].next = stack[i];
    j--;
  }
  stack[j].next = null;
}

function reverse(head) {
  let pre = null;
  let cur = head;
  while (cur) {
    let next = cur.next;
    cur.next = pre;
    pre = cur;
    cur = next;
  }
  return pre;
}

/**
 * 给你两个单链表的头节点 headA 和 headB ，请你找出并返回两个单链表相交的起始节点。如果两个链表不存在相交节点，返回 null 。
 */

/**
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode}
 */
var getIntersectionNode = function (headA, headB) {
  let cur = headA;
  let m = new Set();
  while (cur) {
    m.add(cur);
    cur = cur.next;
  }
  cur = headB;
  while (cur) {
    if (m.has(cur)) {
      return cur;
    }
    cur = cur.next;
  }
  return null;
};

class Lru {
  constructor(limit) {
    this.cache = new Map();
    this.limit = limit;
  }
  get(key) {
    if (this.cache.has(key)) {
      let val = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, val);
    } else {
      return -1;
    }
  }
  set(key, val) {
    let size = this.cache.size;
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else {
      if (this.limit <= size) {
        var oldKey = this.cache.keys().next().value;
        this.cache.delete(oldKey);
      }
    }
    this.cache.set(key, val);
  }
}
