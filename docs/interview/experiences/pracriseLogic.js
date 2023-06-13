// 二分法找到某一个数

function binarySearch(nums, target) {
  var start = 0;
  var end = nums.length - 1;
  while (start <= end) {
    var mid = start + Math.floor((end - start) / 2);
    if (nums[mid] === target) {
      return mid;
    } else if (target > nums[mid]) {
      start = mid + 1;
    } else if (target < nums[mid]) {
      end = mid - 1;
    }
  }
  return -1;
}
binarySearch([-1, 2, 4, 9, 11], 9);
// 链表反转
function reverseNode(head) {
  let cur = head;
  let pre = null;
  while (cur) {
    let next = cur.next;
    cur.next = pre;
    pre = cur;
    cur = next;
  }
  return pre;
}
// 链表是否有环 快慢指针
function hasCycle(head) {
  var slow = head;
  var fast = head;
  while (slow && fast && fast.next) {
    if (slow == fast) {
      return true;
    }
    slow = slow.next;
    fast = fast.next.next;
  }
  return false;
}

// hash 链表中的环入口节点
function detectCycle(head) {
  var m = new Map();
  var cur = head;
  while (cur) {
    if (m.has(cur)) {
      return m.get(cur);
    }
    m.set(cur, cur);
    cur = cur.next;
  }
  return null;
}
// 不重复的最长子串
function noDup(s) {
  var arr = [];
  var max = 0;
  for (let i = 0; i < s.length; i++) {
    var index = s.indexOf(s[i]);
    if (index > -1) {
      arr.splice(0, index + 1);
    }
    arr.push(s[i]);
    max = Math.max(max, arr.length);
  }
  return max;
}
