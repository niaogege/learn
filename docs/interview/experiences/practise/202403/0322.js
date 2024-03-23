/**
 * 1.除自身以外的数组乘积
 * 2.和为k的子数组
 * 3.删除有序数组的重复项
 * 4.合并俩个有序数组
 * 5.合并区间
 * 6.无重叠区间
 * 7.螺旋矩阵
 * 8.最长的有效括号
 * 9.用栈实现队列
 * 10.用队列实现栈
 * 11.最近公共祖先
 */

function publicAns(root, p, q) {
  if (root == null || p == root || q == root) return root;
  let left = publicAns(root.left, p, q);
  let right = publicAns(root.right, p, q);
  if (left == null && right != null) return right;
  if (left != null && right == null) return left;
  if (left && right) return root;
  if (left == null && right == null) return null;
}

function isSymmetric(root) {
  if (root == null) return true;
  let dfs = (l, r) => {
    // 终止条件
    if ((l == null && r != null) || (l != null && r == null)) return false;
    if (l == null && r == null) return true;
    if (l.val !== r.val) return false;
    let outSide = dfs(l.left, r.right);
    let innerSide = dfs(l.right, r.left);
    return innerSide && outSide;
  };
  return dfs(root.left, root.right);
}

// 合并区间
/** 
输入: intervals = [[1,3],[2,6],[8,10],[15,18]]
输出: [[1,6],[8,10],[15,18]]
解释: 区间 [1,3] 和 [2,6] 重叠, 将它们合并为 [1,6].
*/
function mergeArr2(arr) {
  arr.sort((a, b) => a[0] - b[0]);
  let pre = arr[0];
  let res = [];
  for (let i = 1; i < arr.length; i++) {
    let cur = arr[i];
    if (cur[0] > pre[1]) {
      res.push(pre);
      pre = cur;
    } else {
      pre[1] = Math.max(pre[1], cur[1]);
    }
  }
  res.push(pre);
  return res;
}
mergeArr2([
  [1, 3],
  [2, 6],
  [8, 10],
  [15, 18],
]);

// 无重叠区间
/**
输入: [ [1,2], [1,2], [1,2] ]
输出: 2
解释: 你需要移除两个 [1,2] 来使剩下的区间没有重叠
 */
function noMerge(arr) {
  // 左区间
  arr.sort((a, b) => a[0] - b[0]);
  let count = 0;
  let end = arr[0][1];
  for (let i = 1; i < arr.length; i++) {
    let cur = arr[i];
    // 没有覆盖
    if (cur[0] >= end) {
      end = cur[0];
    } else {
      count++;
      end = Math.min(end, cur[1]);
    }
  }
  return count;
}
noMerge([
  [1, 2],
  [1, 2],
  [1, 2],
]);

function noMerge2(arr) {
  // 右区间
  arr.sort((a, b) => a[1] - b[1]);
  let end = arr[0][1];
  let count = 1;
  for (let i = 1; i < arr.length; i++) {
    if (arr[i][0] >= end) {
      count++;
      end = arr[i][1];
    }
  }
  return arr.length - count;
}
// 输入：nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
// 输出：[1,2,2,3,5,6]
// 解释：需要合并 [1,2,3] 和 [2,5,6] 。
// 合并结果是 [1,2,2,3,5,6] ，其中斜体加粗标注的为 nums1 中的元素
function mergeArr(nums1, nums2, m, n) {
  // for (let i = m; i < m + n; i++) {
  //   nums1[i] = nums2[i - m];
  // }
  nums1.splice(m, nums1.length - m, ...nums2);
  return nums1.sort((a, b) => a - b);
}

function removeDup(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == arr[i + 1]) {
      arr.splice(i, 1);
      i--;
    }
  }
  return arr;
}
removeDup([1, 2, 2, 3, 3, 4, 5]);
class MyQueue {
  constructor() {
    this.stackIn = [];
    this.stackOut = [];
  }
  push(x) {
    this.stackIn.push(x);
  }
  pop() {
    if (this.stackOut.length == 0) {
      while (this.stackIn.length) {
        this.stackOut.push(this.stackIn.pop());
      }
    }
    return this.stackOut.pop();
  }
  peak() {
    let x = this.pop();
    this.stackOut.push(x);
    return x;
  }
  isEmpty() {
    return this.stackIn.length && this.stackOut.length;
  }
}

class MyStack {
  constructor() {
    this.queue = [];
  }
  push(x) {
    this.queue.push(x);
  }
  // 先进后出
  pop() {
    let len = this.queue.length;
    while (len--) {
      this.queue.push(this.queue.shift());
    }
    return this.queue.shift();
  }
  peak() {
    let x = this.queue.pop();
    this.queue.push(x);
    return x;
  }
  isEmpty() {
    return this.queue.length == 0;
  }
}
