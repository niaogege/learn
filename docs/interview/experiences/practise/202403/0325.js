/**
 * 1.计算乘积除以当前项
 * 2.滑动窗口最大值
 * 3.最小覆盖子串 直接放弃
 * 4.旋转图像
 * 5.螺旋矩阵
 * 6.分发糖果
 * 7.k个一组链表反转
 * 8.反转链表II
 * 9.最近公共祖先
 * 10.对称二叉树
 * 11.完全二叉树
 * 12.平衡二叉树
 * 13.三数之和
 * 14.两数相加
 * 15.搜索旋转排序数组
 * 16.堆排序
 */

/**
 * @param {number} n
 * @return {string[][]}
 */
var solveNQueens = function (n) {
  let board = new Array(n).fill().map(() => new Array(n).fill('.'));
  let ans = [];
  let backTrack = (board, row) => {
    if (row == n) {
      ans.push(transform(board));
      return;
    }
    for (let col = 0; col < n; col++) {
      if (isValid(board, row, col)) {
        board[row][col] = 'Q';
        backTrack(board, row + 1);
        board[row][col] = '.';
      }
    }
  };
  backTrack(board, 0);
  return ans;
};
function isValid(board, row, col) {
  // check col
  for (let i = 0; i < row; i++) {
    if (board[i][col] == 'Q') return false;
  }
  // check 45
  for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
    if (board[i][j] == 'Q') return false;
  }
  // check 135
  for (let i = row - 1, j = col + 1; i >= 0 && j >= 0; i--, j++) {
    if (board[i][j] == 'Q') return false;
  }
  return true;
}
function transform(board) {
  let ans = [];
  board.forEach((item) => {
    let str = '';
    item.forEach((child) => {
      str += child;
    });
    ans.push(str);
  });
  return ans;
}
function transform(board) {
  let ans = [];
  board.forEach((item) => {
    let str = '';
    item.forEach((child) => {
      str += child;
    });
    ans.push(str);
  });
  return ans;
}
/**
输入：nums = [1,2,3]
输出：[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
 */
var subsets = function (nums) {
  let ans = [];
  let backTrack = (path, start) => {
    if (path.length > nums.length) return;
    if (path.length <= nums.length) {
      ans.push(path.slice());
    }
    for (let i = start; i < nums.length; i++) {
      let cur = nums[i];
      if (!path.includes(cur)) {
        path.push(cur);
        backTrack(path, i);
        path.pop();
      }
    }
  };
  backTrack([], 0);
  return ans;
};
subsets([1, 2, 3]);
/**
输入：nums = [-1,0,1,2,-1,-4]
输出：[[-1,-1,2],[-1,0,1]]
 */
var threeSum = function (nums) {
  if (nums.length < 3) return [];
  nums.sort((a, b) => a - b);
  let ans = [];
  let len = nums.length;
  for (let i = 0; i < len; i++) {
    if (nums[i] > 0) break;
    if (i > 0 && nums[i - 1] == nums[i]) continue;
    let l = i + 1;
    let r = len - 1;
    let cur = nums[i];
    while (l < r) {
      let sum = cur + nums[l] + nums[r];
      if (sum == 0) {
        ans.push([cur, nums[l], nums[r]]);
        while (r > l && nums[r] == nums[r - 1]) {
          r--;
        }
        while (r > l && nums[l] == nums[l + 1]) {
          l++;
        }
        r--;
        l++;
      } else if (sum > 0) {
        r--;
      } else {
        l++;
      }
    }
  }
  return ans;
};

function bigAdd(a, b) {
  let [m, n] = [a.length, b.length];
  let len = Math.max(m, n);
  a = a.padStart(len, '0');
  b = b.padStart(len, '0');
  let flag = 0;
  let res = '';
  let i = len - 1;
  while (i >= 0) {
    let sum = Number(a[i]) + Number(b[i]) + flag;
    res = (sum % 10) + res;
    flag = Math.floor(sum / 10);
    i--;
  }
  if (flag == 1) {
    res = '1' + res;
  }
  return res;
}
bigAdd('111', '99');

function ListNode(val, next) {
  this.val = val == undefined ? 0 : val;
  this.next = next == undefined ? null : next;
}
function addTwoNumbers(l1, l2) {
  let dummy = new ListNode();
  let flag = 0;
  let cur = dummy;
  while (l1 || l2) {
    let a = (l1 && l1.val) || 0;
    let b = (l2 && l2.val) || 0;
    let sum = a + b + flag;
    cur = new ListNode(sum % 10);
    cur = cur.next;
    if (l1) {
      l1 = l1.next;
    }
    if (l2) {
      l2 = l2.next;
    }
    flag = Math.floor(sum / 10);
  }
  if (flag == 1) {
    cur.next = new ListNode(flag);
  }
  return dummy.next;
}

// 旋转图像
var rotate = function (matrix) {
  let len = matrix[0];
  let arr = new Array(len).fill().map(() => new Array(len).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      arr[j][n - i - 1] = matrix[i][j];
    }
  }
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      matrix[i][j] = arr[i][j];
    }
  }
};
/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var rotate = function (matrix) {
  let n = matrix.length;
  // 水平翻转
  for (let i = 0; i < Math.floor(n / 2); i++) {
    for (let j = 0; j < n; j++) {
      [matrix[i][j], matrix[n - i - 1][j]] = [matrix[n - i - 1][j], matrix[i][j]];
    }
  }
  // 对角线翻转
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }
};

/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var rotate = function (matrix) {
  let len = matrix.length;
  let ans = [];
  for (let i = 0; i < len; i++) {
    let item = [];
    for (let j = 0; j < len; j++) {
      item.push(matrix[j][len - i - 1]);
    }
    ans.push(item);
  }
  console.log(ans, 'ans');
  return ans;
};

var maxSlidingWindow = function (nums, k) {
  let res = [];
  let i = 0,
    j = 0;
  let queue = new MyQueue();
  while (j < k) {
    queue.push(nums[j++]);
  }
  // 添加第一个元素
  res.push(queue.top());
  while (j < nums.length) {
    queue.pop(nums[i]);
    queue.push(nums[j]);
    res.push(queue.top());
    i++;
    j++;
  }
  return res;
};

class MyQueue {
  queue;
  constructor() {
    this.queue = [];
  }
  pop(x) {
    if (this.top() == x) {
      this.queue.shift();
    }
  }
  // 添加的时候 移除队尾比x小的元素 始终保持队头>队尾
  // 入队 x 大于 队尾元素 则将队尾元素删除
  push(x) {
    let last = this.queue[this.queue.length - 1];
    while (last !== undefined && x > last) {
      this.queue.pop();
      last = this.queue[this.queue.length - 1];
    }
    this.queue.push(x);
  }
  top() {
    return this.queue[0];
  }
}

/**
 * @param {number[]} ratings
 * @return {number}
 */
var candy = function (ratings) {
  let len = ratings.length;
  let ans = new Array(len).fill(1);
  // 右边比左边大的糖果
  for (let i = 1; i < len; i++) {
    if (ratings[i] > ratings[i - 1]) {
      ans[i] = ans[i - 1] + 1;
    }
  }
  // 左边比右边大
  for (let i = len - 2; i >= 0; i--) {
    if (ratings[i] > ratings[i + 1]) {
      ans[i] = Math.max(ans[i], ans[i + 1] + 1);
    }
  }
  return ans.reduce((a, b) => a + b);
};

function findPublic(root, p, q) {
  if (root == null || p == root || q == root) return root;
  let left = findPublic(root.left, p, q);
  let right = findPublic(root.right, p, q);
  if (left == null && right != null) {
    return right;
  } else if (left != null && right == null) {
    return left;
  } else if (left != null && right != null) {
    return root;
  } else {
    return null;
  }
}

// 左右
function isSymmetric(root) {
  if (root == null) return true;
  let dfs = (l, r) => {
    // 终止条件
    if ((l == null && r != null) || (r == null && l != null)) return false;
    if (l == null && r == null) return true;
    if (l.val != r.val) return false;
    let outSide = dfs(l.left, r.right);
    let innerSide = dfs(l.right, r.left);
    return outSide && innerSide;
  };
  return dfs(root.left, root.right);
}

// 1->2->3->4->5 2
// 2->1->4->3->5
function reverseK(head, k) {
  let dummy = {
    next: head,
    val: null,
  };
  let cur = head;
  let len = 0;
  let pre = dummy;
  while (head) {
    len++;
    head = head.next;
  }
  const kLen = Math.floor(len / k);
  for (let i = 0; i < kLen; i++) {
    for (let j = 0; j < k - 1; j++) {
      let next = cur.next;
      cur.next = cur.next.next;
      next.next = pre.next;
      pre.next = next;
    }
    pre = cur;
    cur = pre.next;
  }
  return dummy.next;
}
// 1->2->3->4->5 3 4
// 1->2->4->3->5
function reverseLink(head, l, r) {
  let dummy = {
    next: head,
    val: null,
  };
  let pre = dummy;
  let i = 1;
  while (i < l) {
    pre = pre.next;
    i++;
  }
  let cur = pre.next;
  for (let i = 0; i < r - l; i++) {
    let tmp = cur.next;
    cur.next = tmp.next;
    tmp.next = pre.next;
    pre.next = tmp;
  }
  return dummy.next;
}
function reverseLink(head) {
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

function maxTrix(arr) {
  let ans = [];
  let top = 0;
  let bottom = arr.length - 1;
  let left = 0;
  let right = arr[0].length - 1;
  while (true) {
    // 从上左到上右
    for (let i = left; i <= right; i++) {
      ans.push(arr[top][i]);
    }
    if (++top > bottom) break;

    // 从右上到右下
    for (let i = top; i <= bottom; i++) {
      ans.push(arr[i][right]);
    }
    if (left > --right) break;

    // 从右到左
    for (let i = right; i >= 0; i--) {
      ans.push(arr[bottom][i]);
    }
    if (top > --bottom) break;

    // 从左下到左上
    for (let i = bottom; i >= 0; i--) {
      ans.push(arr[i][left]);
    }
    if (++left > right) break;
  }
  return ans;
}

maxTrix([
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
]);
function mul(arr) {
  let right = 1;
  let res = [1];
  let len = arr.length;
  //
  for (let i = 1; i < len; i++) {
    res[i] = res[i - 1] * arr[i - 1];
  }
  for (let j = len - 2; j >= 0; j--) {
    right *= arr[j + 1];
    res[j] *= right;
  }
  return res;
}
mul([1, 2, 3, 4]);
// 24 12 8 6
