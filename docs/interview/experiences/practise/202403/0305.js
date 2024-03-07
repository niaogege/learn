/**
 * 1.零钱兑换
 * 2.打家劫舍
 * 3.合并区间
 * 4.爬楼梯
 * 5.螺旋矩阵
 * 6.字符串相乘
 * 7.最长重复子数组
 * 8.最长公共序列
 * 9.接雨水
 * 10.二叉树的最近公共祖先
 * 11.二叉树中的最大路径和
 */

/**
 * 
输入：amount = 5, coins = [1, 2, 5]
输出：4
解释：有四种方式可以凑成总金额：
5=5
5=2+2+1
5=2+1+1+1
5=1+1+1+1+1
 */
var change = function (amount, coins) {
  let dp = new Array(amount + 1).fill(0);
  dp[0] = 1;
  for (let coin of coins) {
    for (let j = coin; j <= amount; j++) {
      dp[j] += dp[j - coin];
    }
  }
  return dp[amount];
};

// 1/2 5总共有几种可能
function clim(n) {
  let dp = new Array(n + 1).fill(0);
  dp[1] = 1;
  dp[2] = 2;
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}
/**
给你一个整数数组 coins ，表示不同面额的硬币；以及一个整数 amount ，表示总金额。
计算并返回可以凑成总金额所需的 最少的硬币个数 。如果没有任何一种硬币组合能组成总金额，返回 -1 。
你可以认为每种硬币的数量是无限的。
示例 1：
输入：coins = [1, 2, 5], amount = 11
输出：3 
解释：11 = 5 + 5 + 1
 */
var coinChange = function (coins, amount) {
  let dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let coin of coins) {
    for (let j = coin; j <= amount; j++) {
      dp[j] = Math.min(dp[j], dp[j - coin] + 1);
    }
  }
  return dp[amount] == Infinity ? '-1' : dp[amount];
};

/**
输入：root = [1,2,3], targetSum = 5
输出：false
解释：树中存在两条根节点到叶子节点的路径：
(1 --> 2): 和为 3
(1 --> 3): 和为 4
不存在 sum = 5 的根节点到叶子节点的路径。
 */
var hasPathSum = function (root, targetSum) {
  if (!root) return false;
  if (root.left == null && root.right == null) {
    return targetSum - root.val == 0;
  }
  return (
    hasPathSum(root.left, targetSum - root.val) || hasPathSum(root.right, targetSum - root.val)
  );
};

var hasPathSum = function (root, targetSum) {
  if (!root) return false;
  let queue = [root];
  let valQueue = [root.val];
  while (queue.length || valQueue.length) {
    let node = queue.shift();
    let val = valQueue.shift;
    if (node.left == null && node.right == null) {
      return val - targetSum == 0;
    }
    if (node.left) {
      queue.push(node.left);
      valQueue.push(val + node.left.val);
    }
    if (node.right) {
      queue.push(node.right);
      valQueue.push(val + node.right.val);
    }
  }
  return false;
};

var hasPathSum = function (root, targetSum) {
  if (!root) return false;
  let dfs = (node, sum) => {
    if (!node) return;
    if (node.left == null && node.right == null) {
      return targetSum == sum;
    }
    if (node.left) {
      dfs(node.left, sum + node.val);
    }
    if (node.right) {
      dfs(node.right, sum + node.val);
    }
  };
  dfs(root, 0);
  return false;
};

/**
输入：root = [-10,9,20,null,null,15,7]
输出：42
解释：最优路径是 15 -> 20 -> 7 ，路径和为 15 + 20 + 7 = 42
 */
var maxPathSum = function (root) {};

/**
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 *
 */
var lowestCommonAncestor = function (root, p, q) {
  if (p == root || root == q || root == null) return root;
  let left = lowestCommonAncestor(root.left, p, q);
  let right = lowestCommonAncestor(root.right, p, q);
  if (left !== null && right !== null) return root;
  if (left == null && right !== null) return right;
  if (left != null && right == null) return left;
  return null;
};

/**
输入：height = [0,1,0,2,1,0,1,3,2,1,2,1]
输出：6
解释：上面是由数组 [0,1,0,2,1,0,1,3,2,1,2,1] 表示的高度图，在这种情况下，可以接 6 个单位的雨水（蓝色部分表示雨水）。 
 */

// 单调栈
var trap = function (arr) {
  if (!arr.length) return 0;
  let len = arr.length;
  let stack = [0];
  let ans = 0;
  for (let i = 1; i < len; i++) {
    let cur = arr[i];
    if (cur < arr[stack.slice(-1)]) {
      stack.push(i);
    } else {
      while (cur && cur > arr[stack.slice(-1)]) {
        // 左中右
        const top = stack.pop();
        if (stack.length !== 0) {
          const lastItem = stack.slice(-1);
          // 宽度
          let w = i - lastItem - 1;
          // 高度
          let h = Math.min(arr[i], arr[lastItem]) - arr[top];
          ans += h * w;
        }
      }
      stack.push(i);
    }
  }
  return ans;
};

function longSame(a, b) {
  let [aLen, bLen] = [a.length, b.length];
  let dp = new Array(aLen + 1).fill().map(() => new Array(bLen + 1).fill(0));
  let max = 0;
  for (let i = 1; i <= aLen; i++) {
    for (let j = 1; j <= bLen; j++) {
      if (a[i - 1] == b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      }
      max = Math.max(dp[i][j], max);
    }
  }
  return max;
}

function longestPublicArr(a, b) {
  let [aLen, bLen] = [a.length, b.length];
  let dp = new Array(aLen + 1).fill().map(() => new Array(bLen + 1).fill(0));
  let max = 0;
  for (let i = 1; i <= aLen; i++) {
    for (let j = 1; j <= bLen; j++) {
      if (a[i - 1] == b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[aLen][bLen];
}

function mulStr(a, b) {
  const [aLen, bLen] = [a.length, b.length];
  let arr = new Array(aLen + bLen).fill(0);
  for (let i = aLen - 1; i >= 0; i--) {
    for (let j = bLen - 1; j >= 0; j--) {
      let p1 = i + j;
      let p2 = p1 + 1;
      let mul = +a[i] * +b[j];
      let data = mul + arr[p2];
      arr[p2] = data % 10;
      arr[p1] = Math.floor(data / 10) + arr[p1];
    }
  }
  console.log(arr, 'arr');
  while (arr[0] == 0) {
    arr.shift();
  }
  return arr.length ? arr.join('') : '0';
}
mulStr('11', '33');

function matrix(arr) {
  if (!arr.length) return [];
  let up = 0;
  let down = arr.length - 1;
  let left = 0;
  let right = arr[0].length - 1;
  let ans = [];
  while (true) {
    // 从左到右
    for (let i = left; i <= right; i++) {
      ans.push(arr[up][i]);
    }
    if (++up > down) break;
    // 从上到下
    for (let i = up; i <= down; i++) {
      ans.push(arr[i][right]);
    }
    if (left > --right) break;
    // 从右往左
    for (let i = right; i >= left; i--) {
      ans.push(arr[down][i]);
    }
    if (up > --down) break;
    // 从下往上
    for (let i = down; i >= up; i--) {
      ans.push(arr[i][left]);
    }
    if (++left > right) break;
  }
  return ans;
}

function threeSum(arr) {
  if (!arr.length) return [];
  if (arr.length < 3) return arr;
  arr.sort((a, b) => a - b);
  let ans = [];
  for (let i = 0; i < arr.length; i++) {
    let cur = arr[i];
    if (cur > 0) continue;
    if (i > 0 && arr[i] == arr[i - 1]) continue;
    let l = i + 1;
    let r = arr.length - 1;
    while (l < r) {
      let sum = arr[l] + arr[r] + cur;
      if (sum == 0) {
        ans.push([cur, arr[l], arr[r]]);
        while (l < r && arr[r] == arr[r - 1]) {
          r--;
        }
        while (l < r && arr[l] == arr[l + 1]) {
          l++;
        }
        l++;
        r--;
      } else if (sum > 0) {
        r--;
      } else {
        l++;
      }
    }
  }
}

function rob(arr) {
  let len = arr.length;
  let dp = new Array(len).fill(0);
  dp[0] = arr[0];
  dp[1] = Math.max(arr[0], arr[1]);
  for (let i = 2; i < len; i++) {
    dp[i] = Math.max(dp[i - 1], dp[i - 2] + arr[i]);
  }
  return dp[len - 1];
}
