/**
 * 20231203 小米面试
 * 1.最大子序和
 * 2.合并两个有序链表
 * 3.最长回文子串
 * 4.二叉树的最近公共祖先
 * 5.二叉树的锯齿形层序遍历
 * 6.路径和
 * 7.
 */

/**
 * 二叉树路径和
 * 不知道是第几次做了 还是不会
 *
 * DFS
 */

var hasPathSum = function (root, targetSum) {
  var res = [];
  var dfs = (root) => {
    if (root) {
      var cur = root.val;
      if (cur.left) {
        cur.left.val = cur.left.val + cur;
        dfs(cur.left);
      } else {
        res.push(cur);
      }
      if (cur.right) {
        cur.right.val = cur.right.val + cur;
        dfs(cur.left);
      } else {
        res.push(cur);
      }
    }
  };
  dfs(root);
  console.log(res, 'res');
  return res.includes(targetSum);
};

var hasPathSum = function (root, targetSum) {
  if (!root) return false;
  if (root.left == null && root.right == null) {
    return targetSum - root.val === 0;
  }
  return (
    hasPathSum(root.left, targetSum - root.val) || hasPathSum(root.right, targetSum - root.val)
  );
};

/**
 * BFS
 * @param {*} root
 * @returns
 */
var hasPathSum = function (root, targetSum) {
  if (!root) return false;
  var nodeA = [root];
  var valA = [root.val];
  while (nodeA.length) {
    var curNode = nodeA.shift();
    var curVal = valA.shift();
    if (curNode.right == null && curNode.left == null) {
      if (curVal === targetSum) {
        return true;
      }
      continue;
    }
    if (curNode.left) {
      nodeA.push(curNode.left);
      valA.push(curNode.left.val + curVal);
    }
    if (curNode.right) {
      nodeA.push(curNode.right);
      valA.push(curNode.right.val + curVal);
    }
  }
  return false;
};

var zigzagLevelOrder = function (root) {
  if (!root) return [];
  let res = [];
  let stack = [root];
  let j = 0;
  while (stack.length) {
    let arr = [];
    let len = stack.length;
    for (let i = 0; i < len; i++) {
      const cur = stack.shift();
      arr.push(cur.val);
      if (cur.left) {
        stack.push(cur.left);
      }
      if (cur.right) {
        stack.push(cur.right);
      }
    }
    if (arr.length) {
      j++;
      console.log(j, j % 2);
      res.push(j % 2 == 0 ? arr.reverse() : arr);
    }
  }
  return res;
};

// 输入：nums = [-2,1,-3,4,-1,2,1,-5,4]
// 输出：6
// 解释：连续子数组 [4,-1,2,1] 的和最大，为 6

// 迭代方式
var maxSubArray = function (nums) {
  var max = 0;
  var total = nums[0];
  for (let i of nums) {
    if (total > 0) {
      total = total + i;
    } else {
      total = i;
    }
    max = Math.max(max, total);
  }
  console.log(max, 'max');
  return max;
};
maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]);

// dp 方式
var maxSubArray = function (nums) {
  var len = nums.length;
  var max = nums[0];
  var dp = new Array(len);
  dp[0] = nums[0];
  for (let i = 1; i < len; i++) {
    if (dp[i - 1] > 0) {
      dp[i] = dp[i - 1] + i;
    } else {
      dp[i] = i;
    }
    max = Math.max(dp[i], max);
  }
  return max;
};
