/**
 * 1.岛屿数量
 * 2.螺旋矩阵
 * 3.最长公共子序列
 * 4.前序和中序遍历构造二叉树
 */

// 螺旋矩阵

/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
var spiralOrder = function (matrix) {
  if (!matrix.length) return [];
  let res = [];
  let upper = 0; //
  let down = matrix.length - 1;
  let left = 0;
  let right = matrix[0].length - 1;
  while (true) {
    // 从左往右
    for (let i = left; i <= right; i++) {
      res.push(matrix[upper][i]);
    }
    // 前缀版（++i）：操作符位于变量的前面，表示**先递增(递减)**，后执行语
    if (++upper > down) break;
    // 从上往下
    for (let i = upper; i <= down; i++) {
      res.push(matrix[i][right]);
    }
    if (--right < left) break;
    // 从右往左
    for (let i = right; i >= left; i--) {
      res.push(matrix[down][i]);
    }
    if (upper > --down) break;
    // 从下往上
    for (let i = down; i >= upper; i--) {
      res.push(matrix[i][left]);
    }
    if (right < ++left) break;
  }
  return res;
};

// DP 岛屿数量

/**
 * @param {character[][]} grid
 * @return {number}
 */
var numIslands = function (grid) {
  let count = 0;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] == '1') {
        count = count + 1;
        dfs(grid, r, c);
      }
    }
  }
  return count;
};
var dfs = (grid, r, c) => {
  if (!isArea(grid, r, c) || grid[r][c] != '1') {
    return '0';
  }
  grid[r][c] = '2';
  dfs(grid, r - 1, c);
  dfs(grid, r + 1, c);
  dfs(grid, r, c - 1);
  dfs(grid, r, c + 1);
};
var isArea = (grid, r, c) => {
  return 0 <= r && r < grid.length && c >= 0 && c < grid[0].length;
};

var buildTree = function (preorder, inorder) {
  if (!preorder.length || !inorder) return null;
  let tree = {};
  var first = preorder.shift();
  let mid = inorder.indexOf(first);
  tree.val = first;
  tree.left = buildTree(preorder.slice(0, mid), inorder.slice(0, mid));
  tree.right = buildTree(preorder.slice(mid), inorder.slice(mid + 1));
  return tree;
};

var tree = {
  val: 8,
  left: {
    val: 10,
    left: {
      val: 1,
      left: null,
      right: null,
    },
    right: {
      val: 7,
      left: {
        val: 6,
        left: null,
        right: null,
      },
      right: {
        val: 5,
        left: null,
        right: null,
      },
    },
  },
  right: {
    val: 4,
    left: null,
    right: null,
  },
};
var p = { val: 6, left: null, right: null };
var q = { val: 5, left: null, right: null };

// 1.最近公共祖先
var lowestCommonAncestor = function (root, p, q) {
  if (root == null || p == root || q == root) return root;
  let left = lowestCommonAncestor(root.left, p, q);
  let right = lowestCommonAncestor(root.right, p, q);
  if (right != null && left != null) return root;
  if (left != null) return left;
  if (right != null) return right;
  return null;
};
lowestCommonAncestor(tree, p, q);
// 2.对称二叉树
// dfs
function isSymmetricDFS(root) {
  if (root == null) return true;
  let compare = (left, right) => {
    if (left == null && right != null) {
      return false;
    } else if (right == null && left != null) {
      return false;
    } else if (right == null && left == null) {
      return true;
    } else if (left.val !== right.val) {
      return false;
    }
    // 左子树左边 右子树右边
    let outSide = compare(left.left, right.right);
    let innerSide = compare(left.right, right.left);
    return outSide && innerSide;
  };
  return compare(root.left, root.right);
}

function isSymmetricBFS(root) {
  if (root == null) return true;
  let queue = [];
  queue.push(root.left);
  queue.push(root.right);
  while (queue.length) {
    let left = queue.shift();
    let right = queue.shift();
    if (left && right) {
      continue;
    }
    if (left == null || right == null || left.val != right.val) {
      return false;
    }
    // outside
    queue.push(left.left);
    queue.push(right.right);
    // inside
    queue.push(left.right);
    queue.push(right.left);
  }
  return false;
}

// 3.翻转二叉树
function reverseTree(root) {
  if (root == null) return;
  let temp = reverseTree(root.left);
  root.left = reverseTree(root.right);
  root.right = temp;
  return root;
}

// 4.合并区间
function merge(nums) {
  nums.sort((a, b) => a[0], b[0]);
  let pre = nums[0];
  let res = [];
  for (let i = 1; i < nums.length; i++) {
    let cur = nums[i];
    if (cur[0] > pre[1]) {
      res.push(pre);
      pre = cur;
    } else {
      pre[1] = Math.max(cur[1], pre[1]);
    }
  }
  res.push(pre);
  return res;
}
