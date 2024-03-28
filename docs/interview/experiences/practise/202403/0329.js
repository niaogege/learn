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
