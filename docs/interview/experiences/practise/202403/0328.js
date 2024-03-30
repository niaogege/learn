/**
 * never give up
 * 1.vue render
 * 2.平衡二叉树
 * 3.二叉树中第k小的元素
 * 4.二叉树最大路径和
 * 5.x的平方根
 * 6.最长公共子序列
 * 7.最长重复子数组
 */
// 左跟右
function smallerK(root, k) {
  let cur = root;
  let queue = [];
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

/** 
A: [1,2,3,2,1]
B: [3,2,1,4,7]
输出：3
解释：长度最长的公共子数组是 [3, 2, 1] 。
*/

function sameLongest(a, b) {
  let max = 0;
  let [m, n] = [a.length, b.length];
  let dp = new Array(m + 1).fill().map(() => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] == b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      }
      max = Math.max(dp[i][j], max);
    }
  }
  return max;
}

/**
输入：text1 = "abcde", text2 = "ace"
输出：3
解释：最长公共子序列是 "ace"，它的长度为 3。
*/
function findPublicSame(a, b) {
  let [m, n] = [a.length, b.length];
  let dp = new Array(m + 1).fill().map(() => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] == b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[m][n];
}

function robs(nums) {
  let len = nums.length;
  let dp = new Array(len).fill(0);
  dp[0] = nums[0];
  dp[1] = Math.max(nums[0], nums[1]);
  for (let i = 2; i < len; i++) {
    // 偷与不偷
    dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);
  }
  return dp[len - 1];
}

function generate(n) {
  let dp = [[1]];
  for (let i = 1; i < n; i++) {
    dp[i] = new Array(i + 1).fill(1);
    for (let j = 1; j < i; j++) {
      dp[i][j] = dp[i - 1][j - 1] + dp[i - 1][j];
    }
  }
  return dp;
}
generate(5);

function xSqurt(x) {
  if (x <= 1) return x;
  let l = 0;
  let r = x;
  while (l <= r) {
    let mid = l + Math.floor((r - l) / 2);
    if (mid * mid > x) {
      r = mid - 1;
    } else {
      l = mid + 1;
    }
  }
  return r;
}

let mockInterval = {
  timer: null,
  setInterval: function (fn, delay) {
    let now = Date.now();
    const reqFn = () => {
      cur = Date.now();
      this.timer = requestAnimationFrame(reqFn);
      if (cur - now >= delay) {
        fn.apply(this);
        now = cur;
      }
    };
    requestAnimationFrame(reqFn);
  },
  clearInterval: function () {
    cancelAnimationFrame(this.timer);
  },
};

function balance(root) {
  if (root == null) return true;
  let left = maxDepth(root.left);
  let right = maxDepth(root.right);
  return Math.abs(left - right) <= 1 && balance(root.left) && balance(root.right);
}

function maxDepth(root) {
  if (root == null) return 0;
  let l = maxDepth(root.left);
  let r = maxDepth(root.right);
  return Math.max(l, r) + 1;
}

/**
 * @param {number} x
 * @return {number}
 */
var mySqrt = function (x) {
  if (x <= 1) return x;
  let l = 0;
  let r = x;
  while (l <= r) {
    let mid = l + Math.floor((r - l) / 2);
    if (mid * mid > x) {
      r = mid - 1;
    } else {
      l = mid + 1;
    }
  }
  return r;
};
mySqrt(4);

function binaryS(arr, target) {
  let l = 0;
  let r = arr.right;
  while (l < r) {
    let mid = l + Math.floor((r - l) / 2);
    if (arr[mid] == target) return mid;
    if (arr[mid] < target) {
      l = mid + 1;
    } else if (arr[mid] > target) {
      r = mid - 1;
    }
  }
}

/**
 * @param {TreeNode} root
 * @param {number} k
 * @return {number}
 */
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

// 中序遍历 左跟右
function inorder(tree) {
  let ans = [];
  let stack = [];
  let root = tree;
  while (stack.length || root) {
    if (root) {
      stack.push(root);
      root = root.left;
    } else {
      root = stack.pop();
      ans.push(root.val);
      root = root.right;
    }
  }
  return ans;
}

function render(str, data) {
  let reg = /\{\{(\w+)\}\}/;
  if (reg.test(str)) {
    let key = reg.exec(str)[1];
    str = str.replace(reg, data[key]);
    return render(str, data);
  }
  return str;
}
''.replace;

render('{{msg}}::{{name}}', {
  msg: 'info',
  name: 'cpp',
});
