/**
 * 1.分饼干/分糖果
 * 2.删除有序数组的重复项
 * 3.二叉树直径
 * 4.背包问题
 * 5.括号生成
 * 6.判断子序列
 * 7.不同的子序列
 * 8.编辑距离
 * 9.平衡二叉树
 * 10.二叉树的最近公共祖先
 * 11.二叉树的最大深度和最小深度
 * 12.重排链表
 */

var isBalanced = function (root) {
  if (root == null) return true;
  let left = maxDepth(root.left);
  let right = maxDepth(root.right);
  return Math.abs(left - right) <= 1 && isBalanced(root.left) && isBalanced(root.right);
};
var maxDepth = (root) => {
  if (root == null) return 0;
  let left = maxDepth(root.left);
  let right = maxDepth(root.right);
  return Math.max(left, right) + 1;
};

var removeDuplicates = function (nums) {
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] == nums[i + 1]) {
      nums.splice(i, 1);
      i--;
    }
  }
  return nums.length;
};

// 最大深度
var maxDepth = function (root) {
  if (root == null) return 0;
  let left = maxDepth(root.left);
  let right = maxDepth(root.right);
  return 1 + Math.max(left, right);
};

/**
 * @param {number} n
 * @return {string[]}
 * 输入：n = 3
输出：["((()))","(()())","(())()","()(())","()()()"]
 */
var generateParenthesis = function (n) {
  let ans = [];
  let dfs = (paths, left, right) => {
    if (left > right || right > n) return;
    if (2 * n == paths.length) {
      ans.push(paths);
      return;
    }
    dfs(paths + '(', left + 1, right);
    dfs(paths + ')', left, right + 1);
  };
  dfs('', 0, 0);
  return ans;
};

/**
 * 
输入: g = [1,2,3], s = [1,1]
输出: 1
你有三个孩子和两块小饼干，3个孩子的胃口值分别是：1,2,3。
虽然你有两块小饼干，由于他们的尺寸都是1，你只能让胃口值是1的孩子满足。
所以你应该输出1。
输入: g = [1,2], s = [1,2,3]
输出: 2
你有两个孩子和三块小饼干，2个孩子的胃口值分别是1,2。
你拥有的饼干数量和尺寸都足以让所有孩子满足。
所以你应该输出2. 
 */
var findContentChildren = function (g, s) {
  g.sort((a, b) => a - b);
  s.sort((a, b) => a - b);
  let count = 0;
  let len = g.length - 1;
  for (let i = len; i >= 0; i--) {
    const last = s.slice(-1);
    if (last >= g[i]) {
      count++;
      s.pop();
    }
  }
  return s;
};
var findContentChildren = function (g, s) {
  let count = 0;
  let len = g.length - 1;
  let sLen = s.length - 1;
  for (let i = len; i >= 0; i--) {
    if (s[sLen] >= g[i]) {
      count++;
      sLen--;
    }
  }
  return s;
};

// weight 1/3/4
// value 15/20/30
function weightBag(values, weights, size) {
  let len = weights.length;
  // 包 横向
  // 物品纵向
  let dp = new Array(len).fill().map(() => new Array(size + 1).fill(0));
  // 初始化dp
  for (let i = weight[0]; i <= size; i++) {
    dp[0][i] = values[0];
  }
  // 先遍历物品在遍历背包
  for (let i = 1; i < len; i++) {
    for (let j = 0; j <= size; j++) {
      // 背包塞不下物品
      if (j < weights[i]) {
        dp[i][j] = dp[i - 1][j];
      } else {
        // 背包塞得下物品
        dp[i][j] = Math.max(dp[i - 1][j], dp[i - 1][j - weight[i]] + values[i]);
      }
    }
  }
  return dp[len - 1][size];
}

import { useEffect, useCallback } from 'react';
export function useEvent(handler) {
  let handlerRef = useRef();
  useEffect(() => {
    handlerRef.current = handler;
  });
  return useCallback((...arg) => {
    handlerRef.current(...arg);
  }, []);
}
