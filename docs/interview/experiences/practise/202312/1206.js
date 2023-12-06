/**
 * 1.重排链表
 * 2.二叉树最近公共祖先
 * 3.岛屿数量
 * 4.LRU
 * 5.相交链表
 * 6.环形链表
 * 7.删除链表节点
 */

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
