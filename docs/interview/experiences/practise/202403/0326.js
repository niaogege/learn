/**
 * 1.旋转图像
 * 2.搜索旋转排序数组
 * 3.两数相加
 * 4.分割回文串
 * 5.电话号码组合
 * 6.01背包
 * 7.杨辉三角形
 * 8.打家劫舍
 * 9.完全二叉树
 * 10.二叉树中第k小的元素
 * 11.平衡二叉树
 * 12.两两交换链表
 */

// 01 背包问题

// 搜索旋转排序数组

// 两两交换
function twoSwap(head) {}

function rotateImg(matrix) {
  let len = matrix.length;
  // 构建新数组
  let arr = new Array(len).fill().map(() => new Array(len).fill('0'));
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len; j++) {
      arr[j][len - i - 1] = matrix[i][j];
    }
  }
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len; j++) {
      matrix[i][j] = arr[i][j];
    }
  }
}
rotateImg([
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
]);

// 123
// 456
// 975
function twoSum(a, b) {
  let dummy = new ListNode(0);
  let cur = dummy;
  let flag = 0;
  while (a || b) {
    let A = +a.val || 0;
    let B = +b.val || 0;
    let sum = A + B + flag;
    cur = new ListNode(sum % 10);
    cur = cur.next;
    if (a) {
      a = a.next;
    }
    if (b) {
      b = b.next;
    }
    flag = Math.floor(sum / 10);
  }
  if (flag == 1) {
    cur.next = new ListNode(flag);
  }
  return dummy.next;
}

function ListNode(val, next) {
  return {
    val: val != undefined ? val : 0,
    next: next != undefined ? next : null,
  };
}
