/**
 * 1.不用紧张，平常心对待，认真对待即可
 * 2.手写深拷贝
 * 3.检测循环依赖
 * 4.青蛙跳台阶
 * 5.环形链表
 * 6.和为k的子数组
 * 7.重复的子字符串
 * 8.跳跃游戏
 * 9.k个链表反转
 */

var deleteNode = function (head, val) {
  let dummy = {
    next: head,
    val: null,
  };
  let cur = dummy;
  while (cur && cur.next) {
    if (cur.next.val === val) {
      cur.next = cur.next.next;
      continue;
    }
    cur = cur.netx;
  }
  return dummy.next;
};
/**
 * @param {ListNode} head
 * @param {number} k
 * @return {ListNode}
 */
var reverseKGroup = function (head, k) {};

function reverseNode(head) {
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
 * @param {ListNode} head
 * @return {ListNode}
 */
var detectCycle = function (head) {
  let cur = head;
  let m = new Map();
  while (cur) {
    if (m.has(cur)) {
      return m.get(cur);
    }
    m.set(cur, cur);
    cur = cur.next;
  }
  return null;
};

function canJump(nums) {
  let len = nums.length;
  let distance = len - 1;
  let max = nums[0];
  for (let i = 0; i < len; i++) {
    let cur = nums[i];
    if (max >= distance) return true;
    max = Math.max(max, cur + i);
  }
  return false;
}

class MyPromise {
  constructor(exe) {
    let data = undefined;
    let cbs = [];
    const resolve = function (val) {
      setTimeout(() => {
        this.data = val;
        cbs.forEach((fn) => fn(val));
      });
    };
    exe(resolve);
  }
  then(onFulfilled) {
    return new MyPromise((resolve) => {
      this.cbs.push(() => {
        const val = onFulfilled(this.data);
        if (val instanceof MyPromise) {
          val.then(resolve);
        } else {
          resolve(val);
        }
      });
    });
  }
}

function deepClone(obj) {
  if (typeof obj !== 'object') return obj;
  let ans = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnproperty(key)) {
      ans[key] = typeof obj[key] == 'object' ? deepClone(obj[key]) : obj[key];
    }
  }
  return ans;
}

/**
 * @param {ListNode} head
 * @return {boolean}
 */
var hasCycle = function (head) {
  let m = new Map();
  let cur = head;
  while (cur) {
    if (m.has(cur)) {
      return true;
    } else {
      m.set(cur, cur);
    }
    cur = cur.next;
  }
  return false;
};
