/**
 * 为了目标不放弃 不抛弃 还要继续手写代码
 * 1.移动0/旋转数组
 * 2.跳跃游戏
 * 3.最大岛屿面积
 * 4.超时重传机制
 * 5.div拖拽
 * 6.排序 选择归并快速排序
 */

function quickSort(arr) {
  if (arr.length < 2) return arr;
  let base = arr[0];
  let left = [];
  let right = [];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > base) {
      right.push(arr[i]);
    } else {
      left.push(arr[i]);
    }
  }
  return [...quickSort(left), base, ...quickSort(right)];
}
quickSort([11, 2, 111, 2, 3, 4, 1111]);

function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        swap(arr, j, j + 1);
      }
    }
  }
  return arr;
}
function swap(arr, i, j) {
  let tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
}
bubbleSort([11, 2, 111, 2, 3, 4, 1111]);

// 输入：nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
// 输出：[1,2,2,3,5,6]
// 解释：需要合并 [1,2,3] 和 [2,5,6] 。
// 合并结果是 [1,2,2,3,5,6] ，其中斜体加粗标注的为 nums1 中的元素。
function mergeArr(nums1, nums2, m, n) {
  for (let i = m; i < m + n; i++) {
    nums1[i] = nums2[i - m];
  }
  return nums1.sort((a, b) => a + b);
}

/** 
const data = [3, 8];
const source = [[1, 2], [3, 4], [5, 8], [3, 6]];
输出:
true
*/
function coverArr(arr, data = []) {
  // 排序
  arr.sort((a, b) => a[0] - b[0]);
  let pre = arr[0];
  let ans = [];
  for (let i = 1; i < arr.length; i++) {
    let cur = arr[i];
    if (cur[0] > pre[1]) {
      ans.push(pre);
      pre = cur;
    } else {
      pre[1] = Math.max(pre[1], cur[1]);
    }
  }
  ans.push(pre);
  return ans.some((item) => item[0] <= data[0] && item[1] >= data[1]);
}
coverArr(
  [
    [1, 2],
    [3, 4],
    [5, 8],
    [3, 6],
  ],
  [3, 8],
);

function rotateArr(arr, k) {
  let nums = [];
  let len = arr.length;
  for (let i = 0; i < len; i++) {
    nums[(i + k) % len] = arr[i];
  }
  for (let i = 0; i < len; i++) {
    arr[i] = nums[i];
  }
  return arr;
}
rotateArr([1, 2, 3, 4, 5], 2);

// [1,2,0,3,4]
function moveZe(arr) {
  for (let i = 0; i < arr.length; i++) {
    const index = arr.indexOf(arr[i]);
    if (index > -1 && arr[i] == 0) {
      arr.splice(index, 1);
      arr.push(0);
    }
  }
  return arr;
}
moveZe([1, 2, 0, 3, 4]);
function moveZero(arr) {
  let j = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] != 0) {
      arr[j] = arr[i];
      j++;
    }
  }
  for (let i = j; i < arr.length; i++) {
    arr.push(0);
  }
  return arr;
}
moveZero([1, 2, 0, 3, 4]);
