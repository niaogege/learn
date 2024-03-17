/**
 * 1.岛屿的最大面积
 * 2.计算质数
 * 3.回文链表
 * 4.多个数组的交集
 * 5.复原IP地址
 * 6.下一个排列
 * 7.字符串转换整数
 * 8.滑动窗口最大值
 * 9.37.用栈实现队列
 * 10.无重叠区间
 */
// 右区间
var eraseOverlapIntervals = function (intervals) {
  intervals.sort((a, b) => a[1] - b[1]);
  let end = intervals[0][1];
  let count = 1;
  for (let i = 1; i < intervals.length; i++) {
    let cur = intervals[i];
    if (cur[0] >= end) {
      count++;
      end = cur[1];
    }
  }
  return intervals.length - count;
};
// 左区间
var eraseOverlapIntervals = function (nums) {
  nums.sort((a, b) => a[0] - b[0]);
  let end = nums[0][1];
  let count = 0;
  for (let i = 1; i < nums.length; i++) {
    let cur = nums[i];
    if (cur[0] >= end) {
      end = cur[1];
    } else {
      count++;
      end = Math.min(end, cur[1]);
    }
  }
  return count;
};

// 合并区间
// intervals = [[1,3],[2,6],[8,10],[15,18]]
function mergerArr(arrs) {
  arrs.sort((a, b) => a[0] - b[0]);
  let ans = [];
  let pre = arrs[0];
  for (let i = 1; i < arrs.length; i++) {
    let cur = arrs[i];
    if (cur[0] > pre[1]) {
      ans.push(cur);
      pre = cur;
    } else {
      pre[1] = Math.max(pre[1], cur[1]);
    }
  }
  ans.push(pre);
  return ans;
}
// 无重叠区间

// 输入：candidates = [2,3,6,7], target = 7
// 输出：[[2,2,3],[7]]

/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
var combinationSum = function (candidates, target) {
  let ans = [];
  // 下一层从第二个开始
  let backTrack = (path, start, sum) => {
    if (sum > target) return;
    if (path.length && sum == target) {
      ans.push(path.slice());
      return;
    }
    for (let i = start; i < candidates.length; i++) {
      path.push(candidates[i]);
      sum += candidates[i];
      backTrack(path, i, sum);
      sum -= candidates[i];
      path.pop();
    }
  };
  backTrack([], 0, 0);
  return ans;
};

输入: (candidates = [2, 5, 2, 1, 2]), (target = 5), [1, 2, 2, 2, 5];
输出: [[1, 2, 2], [5]];
var combinationSum2 = function (candidates, target) {
  candidates.sort((a, b) => a - b);
  let ans = [];
  let backTrack = (path, start, sum, used) => {
    if (sum > target) return;
    if (path.length && sum == target) {
      ans.push(path.slice());
      return;
    }
    for (let i = start; i < candidates.length; i++) {
      // 剪枝操作
      if (i > start && candidates[i - 1] == candidates[i]) continue;
      path.push(candidates[i]);
      backTrack(path, i, sum + candidates[i]);
      path.pop();
    }
  };
  backTrack([], 0, used);
  return ans;
};
combinationSum2([2, 3, 6, 7], 7);
function generateN(n) {
  if (n < 1) return [];
  let ans = [];
  let backTrack = (path = '', left, right) => {
    if (left > right || right > n) return;
    if (path.length == 2 * n) {
      ans.push(path);
      return;
    }
    backTrack('(' + path, left + 1, right);
    backTrack(')' + path, left, right + 1);
  };
  backTrack('', 0, 0);
  return ans;
}
generateN(3);

/**
输入：n = 4, k = 2
输出：
[
  [2,4],
  [3,4],
  [2,3],
  [1,2],
  [1,3],
  [1,4],
]
 * @return {number[][]}
 */
var combine = function (n, k) {
  let ans = [];
  let backTrack = (res, path, start) => {
    if (path.length == k) {
      res.push(path.slice());
      return;
    }
    for (let i = start; i <= n; i++) {
      if (!path.includes(i)) {
        path.push(i);
        backTrack(res, path, i);
        path.pop();
      }
    }
  };
  backTrack(ans, [], 1);
  return ans;
};
combine(4, 2);

var intersection = function (nums1, nums2) {
  nums1 = [...new Set(num1)];
  nums2 = [...new Set(nums2)];
  let ans = [];
  for (let num of nums1) {
    if (nums2.includes(num)) {
      ans.push(num);
    }
  }
  return ans;
};

class MyStack {
  constructor() {
    this.queue = [];
  }
  push(x) {
    this.queue.push(x);
  }
  pop() {
    let len = this.queue.length;
    while (len-- > 1) {
      this.queue.push(this.queue.shift());
    }
    return this.queue.shift();
  }
  top() {
    const x = this.pop();
    this.queue.push(x);
    return x;
  }
  empty() {
    return this.queue.length == 0;
  }
}

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
    const x = this.pop();
    this.stackOut.push(x);
    return x;
  }
  isEmpty() {
    return !this.stackIn.length && !this.stackOut.length;
  }
}
