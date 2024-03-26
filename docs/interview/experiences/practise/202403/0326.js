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

// 打家劫舍

// 二叉树中第k小的元素
//  左根右
function binaryK(root, k) {
  let queue = [];
  let cur = root;
  while (cur || queue.length) {
    if (cur) {
      queue.push(cur);
      cur = cur.left;
    } else {
      cur = queue.pop();
      k--;
      if (k == 0) {
        break;
      }
      cur = cur.right;
    }
  }
  return cur.val;
}

var kthSmallest = function (tree, k) {
  let stack = [];
  let root = tree;
  while (stack.length || root) {
    if (root) {
      stack.push(root);
      root = root.left;
    } else {
      root = stack.pop();
      --k;
      if (k == 0) {
        break;
      }
      root = root.right;
    }
  }
  return root.val;
};

// 01 背包问题

// 搜索旋转排序数组
function rotateNums(arr, target) {
  let len = arr.length;
  let r = len;
  let l = 0;
  while (l <= r) {
    let mid = l + Math.floor((r - l) / 2);
    if (arr[mid] == target) return mid;
    if (arr[mid] >= arr[l]) {
      if (arr[mid] > target && target >= arr[l]) {
        r = mid - 1;
      } else {
        l = mid + 1;
      }
    } else {
      if (target > arr[mid] && target <= arr[r]) {
        l = mid + 1;
      } else {
        r = mid - 1;
      }
    }
  }
  return -1;
}

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
