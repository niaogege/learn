/**
 * 1.前序和中序构造二叉树
 * 2.对称二叉树
 * 3.翻转二叉树
 * 4.最近公共祖先
 * 5.最小深度和最大深度
 * 6.有序数组转换二叉搜索树
 * 7.滑动窗口最大值
 * 8.平衡二叉树
 * 9.路径总和
 * 10.二叉树展开链表
 */

// 最大深度
function maxDepth(root) {
  if (root == null) return 0;
  let left = maxDepth(root.left);
  let right = maxDepth(root.right);
  let max = Math.max(left, right);
  return max + 1;
}

function minDepth(root) {
  if (root == null) return 0;
  let left = maxDepth(root.left);
  let right = maxDepth(root.right);
  if (root.left == null && root.right != null) {
    return right + 1;
  } else if (root.right == null && root.left != null) {
    return left + 1;
  }
  let min = Math.min(left, right);
  return min + 1;
}

// 翻转二叉树
function reverseTree(root) {
  if (root == null) return root;
  let left = reverseTree(root.left);
  root.left = reverseTree(root.right);
  root.right = left;
  return root;
}

// 二叉树最近公共祖先
// 后序遍历 左右中
function findPublic(root, p, q) {
  if (root == null || p == root || q == root) return root;
  if (p == null && q != null) {
    return q;
  } else if (p != null && q == null) {
    return q;
  } else {
    let left = findPublic(root.left, p, q);
    let right = findPublic(root.right, p, q);
  }
}

// 二叉树最近公共祖先
// 后序遍历 左右中
function findPublic(root, p, q) {
  if (root == null || p == root || q == root) return root;
  let left = findPublic(root.left, p, q); // 左
  let right = findPublic(root.right, p, q); // 右
  // 中
  if (left == null && right != null) {
    return right;
  } else if (left != null && right == null) {
    return left;
  } else if (left && right) {
    return root;
  } else {
    return null;
  }
}

// 对称二叉树
/**
 * @param {TreeNode} root
 * @return {boolean}
 * // 左子树的左 右子树右
 * // 左子树右 右子树左
 */
var isSymmetric = function (root) {
  if (root == null) return true;
  let dfs = (root) => {
    if (root == null) return;
    let left = dfs(root.left);
    let right = dfs(root.right);
  };
  return dfs(root);
};
var isSymmetric = function (root) {
  if (root == null) return true;
  let dfs = (left, right) => {
    // 终止条件
    if ((left == null && right != null) || (right == null && left != null)) {
      return false;
    } else if (left == null && right == null) {
      return true;
    } else if (left.val != right.val) {
      return false;
    }
    let outSide = dfs(left.left, right.right);
    let innerSide = dfs(left.right, right.left);
    return outSide && innerSide;
  };
  return dfs(root.left, root.right);
};
/**
 * 
给你一个整数数组 nums，有一个大小为 k 的滑动窗口从数组的最左侧移动到数组的最右侧。你只可以看到在滑动窗口内的 k 个数字。滑动窗口每次只向右移动一位。
返回 滑动窗口中的最大值 。

输入：nums = [1,3,-1,-3,5,3,6,7], k = 3
输出：[3,3,5,5,6,7]
*/
var maxSlidingWindow = function (nums, k) {
  let queue = nums.slice(0, k);
  let ans = [];
  let len = nums.length;
  for (let i = k - 1; i <= len - k; i++) {
    ans.push(Math.max(...queue));
    queue.shift();
    queue.push(nums[i]);
  }
  return ans;
};
class MonoClass {
  queue;
  constructor() {
    this.queue = [];
  }
  pop(val) {
    let top = this.top();
    if (val == top) {
      this.queue.shift();
    }
  }
  push(x) {
    let last = this.queue[this.queue.length - 1];
    while (last != undefined && last < x) {
      this.queue.pop();
      last = this.queue[this.queue.length - 1];
    }
    this.queue.push(x);
  }
  top() {
    return this.queue[0];
  }
}
var maxSlidingWindow = function (nums, k) {
  let queue = new MonoClass();
  let i = 0,
    j = 0;
  let res = [];
  while (j < k) {
    queue.push(nums[j++]);
  }
  res.push(queue.top());
  while (j < nums.length) {
    queue.push(nums[j]);
    queue.pop(nums[i]);
    res.push(queue.top());
    i++;
    j++;
  }
  return res;
};

/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isBalanced = function (root) {
  if (root == null) return true;
  let left = maxDepth(root.left);
  let right = maxDepth(root.right);
  return Math.abs(left - right) <= 1 && isBalanced(root.left) && isBalanced(root.right);
};
function maxDepth(root) {
  if (root == null) return 0;
  let left = maxDepth(root.left);
  let right = maxDepth(root.right);
  return Math.max(left, right) + 1;
}
