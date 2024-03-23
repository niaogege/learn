/**
 * 1.setTimeout 实现 setInterval
 * 2.归并排序/堆排序
 * 3.判断是否是循环引用
 * 4.lodash.get/set
 * 5.合并有序链表
 * 6.删除链表里的倒数第N个节点
 * 7.排序链表
 * 8.重排链表
 * 9.链表相交
 * 10.合并有序链表
 * 11.反转链表II
 * 12.K个一组链表反转
 */

/**
 * @param {ListNode} head
 * @param {number} left
 * @param {number} right
 * @return {ListNode}
 */
var reverseBetween = function (head, left, right) {
  let dummy = { next: head, val: undefined };
  let pre = dummy;
  let i = 1;
  while (i < left) {
    pre = pre.next;
    i++;
  }
  let cur = pre.next;
  // 1 2 3 4 5
  // 1 4 3 2 5
  //  cur // 2
  //  pre // 1
  for (let i = 0; i < right - left; i++) {
    // 保存 3
    let next = cur.next;
    // 2 指向 4
    cur.next = next.next;
    // 3 指向 2
    next.next = pre.next;
    // 2 指向 3
    pre.next = next;
  }
  return dummy.next;
};
// bfs
function reverseL(head) {
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
// dfs
function dfsReverse(head) {
  if (head == null || head.next == null) return head;
  let last = dfsReverse(head.next);
  head.next.next = head;
  head.next = null;
  return last;
}
function reverseLink(head, k) {
  let dummy = { next: head, val: null };
  let pre = dummy;
  let cur = head;
  let len = 0;
  while (head) {
    head = head.next;
    len++;
  }
  const Len = Math.floor(len / k);
  for (let i = 0; i < Len; i++) {
    for (let j = 0; j < k - 1; j++) {
      // 记录2
      let tmp = cur.next;
      // 1指向3
      cur.next = cur.next.next;
      // 2指向1
      next.next = pre.next;
      // 头节点指向2
      pre.next = tmp;
    }
    // 移动头节点
    pre = cur;
    // 移动目前指向
    cur = pre.next;
  }
}

/**
输入：l1 = [1,2,4], l2 = [1,3,4]
输出：[1,1,2,3,4,4]
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
var mergeTwoLists = function (list1, list2) {
  let dummy = { next: null, val: null };
  let cur = dummy;
  while (list1 && list2) {
    if (list1.val > list2.val) {
      cur.next = list2;
      list2 = list2.next;
    } else {
      cur.next = list1;
      list1 = list1.next;
    }
    cur = cur.next;
  }
  cur.next = list1 || list2;
  return dummy.next;
};

/**
 * 输入：head = [1,2,3,4]
输出：[1,4,2,3]
 * @param {ListNode} head
 * @return {void} Do not return anything, modify head in-place instead.
 */
var reorderList = function (head) {
  let stack = [];
  let cur = head;
  let curr = head;
  while (curr) {
    stack.push(cur);
    curr = curr.next;
  }
  let end = stack.length - 1;
  let start = 0;
  while (start < end) {
    stack[start].next = stack[end];
    if (start == end) {
      break;
    }
    start++;
    stack[end].next = stack[start];
    end--;
  }
};

/**
输入：head = [4,2,1,3]
输出：[1,2,3,4]
 */
var sortList = function (head) {
  let dummy = { next: head, val: null };
  let cur = dummy.next;
  let ans = [];
  while (cur) {
    ans.push(cur.val);
    cur = cur.next;
  }
  ans.sort((a, b) => a - b);
  for (let item of ans) {
    cur = {
      val: item,
      next: null,
    };
    cur = cur.next;
  }
  return dummy.next;
};

var getIntersectionNode = function (headA, headB) {
  let m = new Set();
  let cur = headA;
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

function removeLink(head, k) {
  let dummy = { next: head, val: null };
  k = k + 1;
  let fast = dummy;
  let slow = dummy;
  while (k-- && fast) {
    fast = fast.next;
  }
  while (fast) {
    fast = fast.next;
    slow = slow.next;
  }
  slow.next = slow.next.next;
  return dummy;
}

// [[], [1], [1, 2], [2]];

function combinations(arr) {
  let ans = [];
  let backTrack = (path, start) => {
    if (path.length > arr.length) return;
    if (path.length <= arr.length) {
      ans.push(path.slice());
    }
    for (let i = start; i < arr.length; i++) {
      if (!path.includes(arr[i])) {
        path.push(arr[i]);
        backTrack(path, i);
        path.pop();
      }
    }
  };
  backTrack([], 0);
  return ans;
}
combinations([1, 2]);

function lodashGet(obj, path, defaultVal = 'undefined') {
  let paths = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  let res = obj;
  for (let p of paths) {
    res = res[p];
    if (!res) {
      return defaultVal;
    }
  }
  return res;
}

function lodashSet(obj, path, val) {
  let paths = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  paths.reduce((cur, pre, i, arr) => {
    if (i == arr.length - 1) {
      cur[pre] = val;
      return;
    } else if (pre in cur) {
      return cur[pre];
    } else {
      return (cur[pre] = {});
    }
  }, obj);
}
var obj = {
  cpp: {
    name: 'wmh',
  },
};
lodashSet(obj, 'cpp.name', 'cdp');
function isCycleDfs(obj) {
  let cache = new Set();
  let dfs = (obj) => {
    let values = Object.values(obj);
    for (let value of values) {
      if (cache.has(value)) {
        return true;
      }
      if (value != null || typeof value != 'object') continue;
      cache.add(value);
      if (dfs(value)) {
        return true;
      }
    }
    return false;
  };
  return dfs(obj);
}

function isCycleBfs(obj) {
  let cache = new Set();
  let queue = [obj];
  while (queue.length) {
    let cur = queue.shift();
    if (cache.has(cur)) {
      return true;
    }
    cache.add(cur);
    if (typeof cur != 'object' || cur == null) continue;
    queue.push(...Object.values(cur));
  }
  return false;
}

function mockInterval(fn, delay) {
  let timer;
  const timerFn = () => {
    fn();
    timer = setTimeout(timerFn, delay);
  };
  setTimeout(timerFn, delay);
  return {
    clear: clearTimeout(timer),
  };
}
