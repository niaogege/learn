/**
 * never give up
 * 1.字符串转换整数
 * 2.x的平方根
 * 3.实现 es6 extends
 * 4.编辑距离
 * 5.零钱兑换
 * 6.最长回文子串
 * 7.最长递增子序列
 * 8.最长连续递增子序列
 * 9.买股票的最佳时期
 * 10.不同路径
 * 11.长度最小的子数组
 * 12.打乱数组
 */

function xQurt(x) {
  if (x < 2) return x;
  let l = 0;
  let r = x;
  while (l < r) {
    let mid = l + Math.floor((r - l) / 2);
    if (mid * mid > x) {
      r = mid - 1;
    } else {
      l = mid + 1;
    }
  }
  return r;
}

function randomArr(arr) {
  for (let i = 1; i < arr.length; i++) {
    let tmp = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[tmp]] = [arr[tmp], arr[i]];
  }
  return arr;
}
randomArr([1, 2, 3, 4, 5, 6, 7, 8]);

// 实现 es6 extends
function mockExtends(Child, Parent, staticProps) {
  let proto = Object.create(Parent.prototype);
  proto.constructor = Child;
  Child.prototype = proto;
}

function add(a, b) {
  let dummy = new ListNode(0);
  let cur = dummy;
  let flag;
  while (a || b) {
    let A = (a && a.val) || 0;
    let B = (b && b.val) || 0;
    let sum = A + B + flag;
    cur = new ListNode(sum / 10);
    cur.next = cur;
    flag = Math.floor(sum / 10);
    if (a) {
      a = a.next;
    }
    if (b) {
      b = b.next;
    }
  }
  if (flag == '1') {
    cur.next = new ListNode(flag);
  }
  return dummy.next;
}
function ListNode(val, next) {
  return {
    val: val !== undefined ? val : 0,
    next: next != undefined ? next : null,
  };
}
