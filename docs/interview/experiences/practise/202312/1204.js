/**
 * 1.排序
 * 2.二叉树路径总和
 * 3.129.求根节点到叶节点数字之和
 * 4.二叉树最近公共祖先
 * 5.二叉树最小深度和最大深度
 * 6.最长公共前缀
 * 7.爬楼梯
 * 8.最长公共子序列
 * 9.括号生成
 * 10.大数相加
 */
// 二叉树最近公共祖先

function bigIntAdd(a, b) {
  let len = Math.max(a.length, b.length);
  a = a.padStart(len, '0');
  b = b.padStart(len, '0');
  var flag = 0,
    res = '';
  for (let i = len - 1; i >= 0; i--) {
    flag = Number(a[i]) + Number(b[i]) + flag;
    res = (flag % 10) + res;
    flag = Math.floor(flag / 10);
  }
  return flag === 1 ? 1 + res : res;
}
bigIntAdd('9', '7');

var climbStairs = function (n) {
  var dp = [];
  dp[1] = 1;
  dp[2] = 2;
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
};

/**
 * @param {number} n
 * @return {number}
 * 假设你正在爬楼梯。需要 n 阶你才能到达楼顶。
   每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？
 */
var climbStairs = function (n) {};

/** 
输入：strs = ["flower","flow","flight"]
输出："fl"
*/
// 横向扫描
var findMax = (str1, str2) => {
  let len = Math.min(str1.length, str2.length);
  let index = 0;
  while (index < len && str1[index] == str2[index]) {
    index++;
  }
  return str1.substr(0, index);
};
var longestCommonPrefix = function (arr) {
  if (!arr || arr[0].length === 0) return '';
  let prefix = arr[0];
  let len = arr.length;
  for (let i = 0; i < len; i++) {
    prefix = findMax(prefix, arr[i]);
    if (prefix.length === 0) break;
  }
  return prefix;
};

// 纵向扫描

/** 
给定一个二叉树，找出其最小深度。
最小深度是从根节点到最近叶子节点的最短路径上的节点数量。
说明：叶子节点是指没有子节点的节点。
*/
/**
 * @param {TreeNode} root
 * @return {number}
 */
var minDepth = function (root) {
  if (!root) return 0;
  let leftH = minDepth(root.left);
  let rightH = minDepth(root.right);
  if (root.left != null && root.right == null) {
    return leftH + 1;
  }
  if (root.left == null && root.right != null) {
    return rightH + 1;
  }
  return 1 + Math.min(leftH, rightH);
};

/**
 * @param {TreeNode} root
 * @return {number}
 * 给定一个二叉树 root ，返回其最大深度。
    二叉树的 最大深度 是指从根节点到最远叶子节点的最长路径上的节点数。
 */
var maxDepth = function (root) {
  if (root == null) {
    return 0;
  } else {
    let leftH = maxDepth(root.left);
    let rightH = maxDepth(root.right);
    let max = 1 + Math.max(leftH, rightH);
    return max;
  }
};

var maxDepth = function (root) {
  if (!root) return 0;
  let max = 0;
  let queue = [root];
  while (queue.length) {
    var len = queue.length;
    for (let i = 0; i < len; i++) {
      var cur = queue.shift();
      if (cur.left) {
        queue.push(cur.left);
      }
      if (cur.right) {
        queue.push(cur.right);
      }
    }
    max = max + 1;
  }
  return max;
};
/**
 * @param {TreeNode} root
 * @return {number}
 */
var sumNumbers = function (root) {
  if (!root) return 0;
  let res = [];
  var backTrack = (node, path) => {
    if (!node) return;
    var tempPath = [...path, node.val];
    if (node.left === null && node.right === null) {
      res.push(tempPath.reduce((a, b) => `${a}${b}`));
      return;
    }
    backTrack(node.left, tempPath);
    backTrack(node.right, tempPath);
  };
  backTrack(root, []);
  return res.reduce((a, b) => +a + +b, 0);
};

var sumNumbers = function (root) {
  if (!root) return 0;
  var nodeArr = [root];
  var valArr = [root.val];
  let num;
  while (nodeArr.length) {
    var curNode = nodeArr.shift();
    var curVal = valArr.shift();
    if (curNode.left == null && curNode.right == null) {
      num = num + curVal;
    }
    if (curNode.left) {
      nodeArr.push(curNode.left);
      valArr.push(curNode.left * 10 + curVal);
    }
    if (curNode.right) {
      nodeArr.push(curNode.right);
      valArr.push(curNode.right * 10 + curVal);
    }
  }
  return num;
};

/**
 * 二叉树路径总和
 * @param {TreeNode} root
 * @param {number} targetSum
 * @return {boolean}
 */

var hasPathSum = function (root, targetSum) {
  if (!root) return false;
  var nodeArr = [root];
  var valArr = [root.val];
  while (nodeArr.length) {
    var curNode = nodeArr.shift();
    var curVal = valArr.shift();
    if (curNode.left == null && curNode.right === null) {
      if (curVal === targetSum) {
        return true;
      }
      continue;
    }
    if (curNode.left) {
      nodeArr.push(curNode.left);
      valArr.push(curNode.left.val + curVal);
    }
    if (curNode.right) {
      nodeArr.push(curNode.right);
      valArr.push(curNode.right.val + curVal);
    }
  }
  return false;
};

function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        var temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}
bubbleSort([22, 1, 22, 33, 4, 5, 333]);

/**
 * 插入排序
 */
function insertSort(arr) {
  let pre;
  let cur;
  for (let i = 1; i < arr.length; i++) {
    pre = i - 1;
    cur = arr[i];
    while (pre >= 0 && arr[pre] > cur) {
      arr[pre + 1] = arr[pre];
      pre--;
    }
    arr[pre + 1] = cur;
  }
  return arr;
}
insertSort([22, 1, 22, 33, 4, 5, 333]);
/**
 * 选择排序
 */
function selectSort(arr) {
  var min;
  for (let i = 0; i < arr.length; i++) {
    min = i;
    for (let j = i; j < arr.length; j++) {
      if (arr[min] > arr[j]) {
        min = j;
      }
    }
    var temp = arr[i];
    arr[i] = arr[min];
    arr[min] = temp;
  }
  return arr;
}
selectSort([22, 1, 22, 33, 4, 5, 333]);
