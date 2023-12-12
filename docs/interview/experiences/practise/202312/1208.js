/**
 * 1.合并区间
 * 2.最近公共祖先
 * 3.岛屿数量
 * 4.解构为搜索二叉树
 * 5.括号生成
 * 6.对称二叉树
 * 7.翻转二叉树
 * 8.最长公共前缀
 * 9.
 */

// 长时间不做 肯定是记不住的

var isSymmetricBFS = function (root) {
  if (root == null) return true
  let queue = []
  queue.push(root.left)
  queue.push(root.right)
  while(queue.length){
    let left = queue.shift()
    let right = queue.shift()
    if (left == null && right == null) {
      continue
    }
    if (left !== null || right != null || left.val != right.val) {
      return false
    }
    // outside
    queue.push(left.left)
    queue.push(right.right)
    // inside
    queue.push(left.right)
    queue.push(right.left)
  }
  return true
}


var isSymmetricDFS = function(root) {
  if (root == null) return true
  // 1.确定两颗树参数和返回值
  var compare = (left, right) => {
    // 2.确定终止条件
    if (left == null && right == null) {
      return true
    } else if (left != null && right ==null) {
      return false
    } else if (left == null && right != null) {
      return false
    } else if (left.val != right.val) {
      return false
    }
    // 3.确定单层递归的逻辑
    let outSide = compare(left.left, right.right)
    let inside = compare(left.right, right.left) 
    return outSide && inside
  }
  return compare(root.left, root.right)
};




// dfs
var invertTree = function(root) {
  // 根左右
  if (root == null) return root
  let temp = invertTree(root.left)
  root.left = invertTree(root.right)
  root.right = temp
  return root
};
var invertTreeBfs = function (root) {
  const swap = (root, left, right) => {
    let temp = left
    left = right
    right = temp
    root.left = left
    root.right = right
  }
  if (root == null) return root
  let queue = [root]
  while(queue.length) {
    let len = queue.length
    while(len--) {
      let cur = queue.shift()
      swap(cur, cur.left, cur.right)
      cur.left && queue.push(cur.left)
      cur.right && queue.push(cur.right)
    }
  }
  return root
}

// 生成括号
function generateParenthesis(n) {
  if (n<= 0) return []
  let res = []
  var dfs = (paths, left, right) {
    if (right>left || left > n) return;
    if (2*n === paths.length) {
      res.push(paths)
      return
    }
    dfs(paths+'(', left+1, right)
    dfs(paths+')', left, right+1)
  }
  dfs('', 0, 0)
  return res
}

// 二叉树迭代遍历
// 先序遍历 根左右
function preorder(tree) {
  if (!tree) return [];
  let queue = [tree];
  let res = [];
  while (queue.length) {
    let cur = queue.pop();
    res.push(cur.val);
    // 右子节点入栈
    if (cur.right) {
      queue.push(cur.right);
    }
    // 左节点
    if (cur.left) {
      queue.push(cur.left);
    }
  }
}

// 后序遍历 左右跟
// 根右左 =》 左右跟
function postOrder(tree) {
  if (!tree) return [];
  let queue = [tree];
  let res = [];
  while (queue.length) {
    let cur = queue.pop();
    res.push(cur.val);
    // 左节点
    if (cur.left) {
      queue.push(cur.left);
    }
    // 右子节点入栈
    if (cur.right) {
      queue.push(cur.right);
    }
  }
  return res.reverse();
}

// 中序遍历 左根右 回溯
function inorder(tree) {
  if (!tree) return [];
  let queue = [];
  let cur = tree;
  while (queue.length || cur) {
    if (cur != null) {
      queue.push(cur);
      // 左
      cur = cur.left;
    } else {
      // 根
      cur = queue.pop();
      res.push(cur.val);
      // 右
      cur = cur.right;
    }
  }
  return res;
}

// 最近公共祖先
var lowestCommonAncestor = function (root, p, q) {
  if (root == null || p == root || q == root) return root;
  let left = lowestCommonAncestor(root.left, p, q);
  let right = lowestCommonAncestor(root.right, p, q);
  if (left != null && right != null) return root;
  if (left == null && right != null) {
    return right;
  } else if (left != null && right == null) {
    return left;
  } else {
    return null;
  }
};

// 合并区间
var merge = function (nums) {
  nums.sort((a, b) => a[0] - b[0]);
  var pre = nums[0];
  let res = [];
  for (let i = 1; i < nums.length; i++) {
    let cur = nums[i];
    if (cur[0] > pre[1]) {
      res.push(pre);
      pre = cur;
    } else {
      pre[1] = Math.max(pre[1], cur[1]);
    }
  }
  res.push(pre);
  return res;
};

var longestCommonPrefix = function (arr) {
  var findTwo = (str1, str2) => {
    let len = Math.min(str1.length, str2.length);
    let index = 0;
    while (index <= len && str1[index] == str2[index]) {
      index++;
    }
    return str1.slice(0, index);
  };
  if (!arr) return '';
  var prefix = '';
  for (let i = 0; i < arr.length; i++) {
    prefix = findTwo(prefix, arr[i]);
    if (prefix.length === 0) break;
  }
  return prefix;
};
