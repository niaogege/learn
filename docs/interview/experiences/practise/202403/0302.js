/**
 * 1.按照prize和size进行排序
 * 2.requestIdleCallback
 * 3.防抖和节流
 * 4.K 个一组翻转链表
 * 5.反转链表
 * 6.三数之和
 * 7.合并两个有序链表
 * 8.搜索旋转排序数组
 * 9.岛屿数量
 * 10.合并两个有序数组
 * 11.二叉树的最近公共祖先
 * 12.螺旋矩阵
 * 13.合并K个排序链表
 * 14.字符串相加
 * 15.最长上升子序列
 * 16.最长连续递增子序列
 */

function bigNumAdd(a, b) {
  let len = Math.max(a.length, b.length);
  a = a.padStart(len, '0');
  b = b.padStart(len, '0');
  let flag = 0;
  let res = '';
  let i = len - 1;
  while (i >= 0) {
    flag = Number(a[i]) + Number(b[i]) + flag;
    res = (flag % 10) + res;
    flag = Math.floor(flag / 10);
    i--;
  }
  return flag == 1 ? '1' + res : res;
}
bigNumAdd('22', '88');

function longsetUpper(arr) {
  let len = arr.length;
  let dp = new Array(len).fill(1);
  let max = 0;
  for (let i = 1; i < len; i++) {
    for (let j = 0; j < i; j++) {
      if (arr[i] > arr[j]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
      max = Math.max(dp[i], max);
    }
  }
  return max;
}
longsetUpper([1, 2, 4, 3, 6]);
function sortCon(arr) {
  return arr.sort((a, b) => {
    if (a.prize != b.prize) {
      return a.prize - b.prize;
    } else {
      return a.size - b.size;
    }
  });
}
sortCon([
  {
    prize: 1,
    size: 1,
  },
  {
    prize: 3,
    size: 3,
  },
  {
    prize: 4,
    size: 1,
  },
]);

/**
 * @param {ListNode[]} lists
 * @return {ListNode}
 */
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode[]} lists
 * @return {ListNode}
 */
var mergeKLists = function (lists) {
  let arr = [];
  for (let item of lists) {
    let test = [];
    while (item) {
      test.push(item.val);
      item = item.next;
    }
    arr.push(test);
  }
  let res = arr.flat().sort((a, b) => a - b);
  let dummy = {
    next: null,
    val: null,
  };
  let pre = dummy;
  while (res.length) {
    pre.next = {
      next: null,
      val: res.shift(),
    };
    pre = pre.next;
  }
  return dummy.next;
};

var mergeTwoLists = function (l1, l2) {
  let dummy = {
    next: null,
    val: 0,
  };
  let cur = dummy.next;
  while (l1 && l2) {
    if (l1.val > l2.val) {
      cur.next = l2;
      l2 = l2.next;
    } else {
      cur.next = l1;
      l1 = l1.next;
    }
    cur = cur.next;
  }
  cur.next = l1 || l2;
  return dummy.next;
};

// 反转链表
function reverseLink(node) {
  let pre = null;
  let cur = node;
  while (cur) {
    let next = cur.next;
    cur.next = pre;
    pre = cur;
    cur = next;
  }
  return pre;
}

/**
 * @param {character[][]} grid
 * @return {number}
 */
var numIslands = function (grid) {
  let r = grid.length;
  let c = grid[0].length;
  let i = 0;
  for (let i = 0; i < r; i++) {
    for (let j = 0; j < c; j++) {
      if (grid[i][j] == '1') {
        dfs(grid, i, j);
        i++;
      }
    }
  }
  return i;
};
function dfs(grid, r, c) {
  if (!isValid(grid, r, c) || dp[r][c] !== '1') return;
  grid[r][c] = '2';
  // 上下左右
  dfs(grid, r - 1, c);
  dfs(grid, r + 1, c);
  dfs(grid, r, c - 1);
  dfs(grid, r, c + 1);
}
function isValid(grid, i, j) {
  return i >= 0 && i < grid.length && j < grid[0].length && j >= 0;
}

function debounce(fn, delay) {
  let timer = null;
  return function (...agr) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, arg);
      timer = null;
    }, delay);
  };
}
// 时间戳般
function throttle(fn, delay) {
  let cur = 0;
  return function (...arg) {
    let now = new Date().getTime();
    if (now - cur >= delay) {
      fn.apply(this, arg);
      cur = now;
    }
  };
}
// 定时器版
function throttle2(fn, delay) {
  let timer = null;
  return function (...arg) {
    if (!timer) {
      setTimeout(() => {
        fn.apply(this, arg);
        timer = null;
      }, delay);
    }
  };
}

const requestIdleCallback = function (cb) {
  let start = new Date();
  return setTimeout(() => {
    cb({
      didTimeout: false,
      timeRemaining: function () {
        return Math.max(0, 50 - (Date.now() - start));
      },
    });
  }, 1);
};

// 最长上升子序列

var lengthOfLIS = function (nums) {
  let len = nums.length;
  let dp = new Array(len).fill(1);
  let max = 0;
  for (let i = 1; i < len; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[i] > nums[j]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
      max = Math.max(max, dp[i]);
    }
  }
};

// 最长连续递增子序列
var findLengthOfLCIS = function (nums) {
  let len = nums.length;
  let dp = new Array(len + 1).fill(1); // 数组的长度
  dp[0] = 1;
  let max = 0;
  for (let i = 1; i <= len; i++) {
    if (nums[i] > nums[i - 1]) {
      dp[i] = Math.max(dp[i - 1] + 1, dp[i]);
    }
    max = Math.max(max, dp[i]);
  }
  return max;
};
findLengthOfLCIS([1, 2, 7, 3, 6, 8, 9, 10]);
