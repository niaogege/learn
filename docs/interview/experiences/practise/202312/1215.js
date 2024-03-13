/**
 * 1.搜索旋转数组
 * 2.接雨水
 * 3.二叉树的直径
 * 4.手写Promise
 * 5.二叉树的最小深度和最大深度
 * 6.二叉树最大路径和(hard)
 * 7.最近公共祖先
 * 8.完全二叉树的节点个数
 * 9.平衡二叉树
 * 10.二叉树路径和
 * 11.验证二叉搜索树
 * 12.二叉树中第K小的元素
 */

// 二叉树最大路径和(hard)

/**
 * 路径每到一个节点，有 3 种选择：1. 停在当前节点。2. 走到左子节点。3. 走到右子节点。
走到子节点，又面临这 3 种选择，递归适合处理这种规模不同的同一问题。
注意，不能走进一个分支又掉头回来走另一个分支，路径会重叠，不符合题目要求。
 */
var maxPathSum = function (root) {
  if (root == null) return 0;
  let max = Number.MIN_SAFE_INTEGER;
  var dfs = (root) => {
    if (root == null) return 0;
    let left = dfs(root.left);
    let right = dfs(root.right);
    let innerMax = root.val + left + right;
    max = Math.max(max, innerMax);
    let outerMax = root.val + Math.max(0, left, right);
    return outerMax;
  };
  dfs(root);
  return max;
};

// bfs
function isValidBfs(root) {
  const queue = [];
  let cur = root;
  let pre;
  while (queue.length || cur) {
    if (cur) {
      queue.push(cur);
      cur = cur.left;
    } else {
      cur = queue.pop();
      if (pre != null && pre.val >= cur.val) {
        return false;
      }
      pre = cur;
      cur = cur.right;
    }
  }
  return true;
}

// 中序 迭代遍历二叉树
function bstBfs(root) {
  const queue = [];
  let cur = root;
  let res = [];
  while (cur || queue.length) {
    // 左根右
    if (cur) {
      queue.push(cur);
      cur = cur.left; // left
    } else {
      cur = queue.pop();
      res.push(cur.val); // root
      cur = cur.right; // 右
    }
  }
  return res;
}

var isValidBSTDFS = function (root) {
  let pre;
  // 左 根 右
  const inOrder = (root) => {
    if (root == null) return true;
    let left = inOrder(root.left);
    if (pre != null && root.val <= pre.val) {
      return false;
    }
    // 记录前一个节点
    pre = root;
    let right = inOrder(root.right);
    return left && right;
  };
  return inOrder(root);
};

var isValidDFS = function (root) {
  // 中序 左 根 右
  let res = [];
  var dfs = (root) => {
    if (root) {
      dfs(root.left);
      res.push(root.val);
      dfs(root.right);
    }
  };
  dfs(root);
  // 如何验证是一个递增的序列 前一个大于当前这个 说明不是
  for (let i = 1; i < res.length; i++) {
    if (res[i - 1] >= res[i]) {
      return false;
    }
  }
  return true;
};

// 完全二叉树的节点个数 dfs
var countNodes2 = function (root) {
  const getNodeSum = (root) => {
    if (!root) return 0;
    let left = getNodeSum(root.left);
    let right = getNodeSum(root.right);
    return left + right + 1;
  };
  return getNodeSum(root);
};

// 利用完全二叉树性质
var countNodes = function (root) {
  if (!root) return 0;
  let left = root.left;
  let right = root.right;
  let leftDepth = 0;
  let rightDepth = 0;
  while (left) {
    left = left.left;
    leftDepth++;
  }
  while (right) {
    right = right.right;
    rightDepth++;
  }
  if (leftDepth == rightDepth) {
    // return 2 << (leftDepth - 1);
    return Math.pow(2, leftDepth + 1) - 1;
  }
  let leftTree = countNodes(root.left);
  let rightTree = countNodes(root.right);
  return leftTree + rightTree + 1;
};

var hasPathSum = function (root, targetSum) {
  let res = [];
  // 根左右 前序
  var dfs = (root, sum) => {
    if (root == null) return;
    sum = sum + root.val;
    if (root.left == null && root.right == null) {
      res.push(sum);
      return;
    }
    if (root.left) {
      root.left.val = root.val + dfs(root.left, sum);
    }
    if (root.right) {
      root.right.val = root.val + dfs(root.right, sum);
    }
  };
  dfs(root, 0);
  return res.includes(targetSum);
};

var hasPathSum = function (root, targetSum) {
  if (!root) return false;
  let queue_node = [root];
  let queue_val = [root.val];
  while (queue_node.length) {
    let cur_node = queue_node.shift();
    let cur_val = queue_val.shift();
    if (cur_node.right == null && cur_node.left == null) {
      if (cur_val == targetSum) return true;
      continue;
    }
    if (cur_node.left) {
      queue_node.push(cur_node.left);
      queue_val.push(cur_node.left.val + cur_val);
    }
    if (cur_node.right) {
      queue_node.push(cur_node.right);
      queue_val.push(cur_node.right.val + cur_val);
    }
  }
  return false;
};

var lowestCommonAncestor = function (root, p, q) {
  if (root == null || p == root || q == root) return root;
  let left = lowestCommonAncestor(root.left, p, q);
  let right = lowestCommonAncestor(root.right, p, q);
  if (left != null && right != null) return root;
  if (left != null && right == null) return left;
  if (left == null && right != null) return right;
  if (left == null && right == null) return null;
};

var diameterOfBinaryTree = (root) => {
  let total = 0;
  var dfs = (root) => {
    if (root == null) return 0;
    let left = dfs(root.left);
    let right = dfs(root.right);
    total = Math.max(left + right, total);
    return Math.max(left, right) + 1;
  };
  dfs(root);
  return total;
};

var maxDepth = function (root) {
  if (!root) return 0;
  let leftH = maxDepth(root.left);
  let rightH = maxDepth(root.right);
  let h = 1 + Math.max(leftH, rightH);
  return h;
};

var minDepth = function (root) {
  if (root == null) {
    return 0;
  }
  let leftH = minDepth(root.left);
  let rightH = minDepth(root.right);
  if (root.left == null && root.right != null) {
    return rightH + 1;
  } else if (left != null && right == null) {
    return leftH + 1;
  }
  let h = 1 + Math.min(leftH, rightH);
  return h;
};

// 二叉树直径
// 给你一棵二叉树的根节点，返回该树的 直径 。
// 二叉树的 直径 是指树中任意两个节点之间最长路径的 长度 。这条路径可能经过也可能不经过根节点 root 。
// 两节点之间路径的 长度 由它们之间边数表示。
/**
 * @param {TreeNode} root
 * @return {number}
 */
var diameterOfBinaryTree = function (root) {
  if (root == null) return 0;
  let max = 0;
  let dfs = (root) => {
    if (root == null) return 0;
    let left = dfs(root.left);
    let right = dfs(root.right);
    max = Math.max(max, right + left);
    return Math.max(left, right) + 1;
  };
  return max;
};

function acceptWater(nums) {
  if (!nums.length) return 0;
  let stack = [0];
  let len = nums.length;
  let res = 0;
  for (let i = 1; i < len; i++) {
    let cur = nums[i];
    // 如果当前元素小于栈顶元素 则入栈
    if (cur < nums[stack.slice(-1)]) {
      stack.push(i);
    } else {
      while (cur && cur >= nums[stack.slice(-1)]) {
        if (stack.length > 0) {
          let top = stack.pop();
          let h = Math.mim(cur, nums[stack.slice(-1)]) - nums[top];
          let w = cur - stack.slice(-1) - 1;
          res += h * w;
        }
      }
      stack.push(i);
    }
  }
  return res;
}

class Promise {
  constructor(exe) {
    let data;
    this.status = 'pending';
    this.value = undefined;
    this.reason = undefined;
    this.onResolvedCbs = [];
    this.onRejectedCbs = [];
    const resolve = (val) => {
      if (this.status === 'pending') {
        setTimeout(() => {
          this.value = val;
          this.status = 'fulfilled';
          this.onRejectedCbs.forEach((fn) => fn(val));
        });
      }
    };
    const reject = (reason) => {
      if (this.status === 'pending') {
        setTimeout(() => {
          this.reason = reason;
          this.status = 'rejected';
          this.onRejectedCbs.forEach((fn) => fn(reason));
        });
      }
    };
    try {
      exe(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
  then(onFulfilled, onRejected) {
    let p1 = new Promise((resolve, reject) => {
      const resolvePromise = (cb) => {
        try {
          const val = cb(this.value);
          if (val == p1) {
            throw new Error('不能返回自身');
          }
          if (val instanceof Promise) {
            val.then(resolve, reject);
          } else {
            resolve(val);
          }
        } catch (e) {
          reject(e);
          throw new Error('error');
        }
      };
      if (this.status === 'pending') {
        this.onResolvedCbs.push(resolvePromise.bind(this, onFulfilled));
        this.onRejectedCbs.push(resolvePromise.bind(this, onRejected));
      } else if (this.status === 'fulfilled') {
        onFulfilled(this.value);
      } else if (this.status === 'rejected') {
        onRejected(this.reason);
      }
    });
    return p1;
  }
  static resolve(val) {
    return new Promise((resolve, reject) => {
      if (val instanceof Promise) {
        val.then(resolve);
      } else {
        resolve(val);
      }
    });
  }
  static reject(err) {
    return Promise.reject(err);
  }
  finally(cb) {
    // return Promise.resolve(cb()).then(
    //   (res) => {
    //     return res;
    //   },
    //   (err) => {
    //     return err;
    //   },
    // );
    return this.then(
      (val) => Promise.resolve(cb()).then(() => val),
      (err) => Promise.resolve(cb()).then(() => err),
    );
  }
}
