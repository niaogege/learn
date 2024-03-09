/**
 * 1.每天都在写，到底记住了多少？离03月20日还剩两周，今天要做的就是反思回想
 * 心态放开一点，不要给自己太大的压力，一切都要向前看
 * 2.不同路径
 * 3.从中序和后序遍历构造二叉树
 * 4.青蛙跳台阶问题
 * 5.二叉树的层次遍历
 * 6.寻找重复数
 * 7.复原IP地址
 * 8.检测循环依赖
 * 9.括号生成
 * 10.最大深度和最小深度
 * 11.判断子序列
 * 12.不同的子序列
 * 111.两个字符串删除操作
 * 13.编辑距离
 */

var minDistance = function (word1, word2) {
  let [a, b] = [word1.length, word2.length];
  let dp = new Array(a + 1).fill().map(() => new Array(b + 1).fill(0));
  for (let i = 1; i <= a; i++) {
    dp[i][0] = i;
  }
  for (let j = 0; j <= b; j++) {
    dp[0][j] = j;
  }
  for (let i = 1; i <= a; i++) {
    for (let j = 1; j <= b; j++) {
      if (word1[i - 1] == word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1] + 2);
        dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1;
      }
    }
  }
  return dp[a][b];
};

/** 
 * 中序和后序遍历构造二叉树
输入：inorder = [9,3,15,20,7], postorder = [9,15,7,20,3]
输出：[3,9,20,null,null,15,7]
 * @param {number[]} inorder
 * @param {number[]} postorder
 * @return {TreeNode}
 */
var buildTree = function (inorder, postorder) {
  if (!inorder.length || !postorder.length) return null;
  let last = postorder.pop();
  let index = inorder.indexOf(last);
  var root = {
    val: last,
  };
  root.left = buildTree(inorder.slice(0, index), postorder.slice(0, index));
  root.right = buildTree(inorder.slice(index + 1), postorder.slice(index));
  return root;
};

/**
 * 不同的子序列
 * @param {*} s  babgbag
 * @param {*} t bag
 */
function diffChild(s, t) {
  let [a, b] = [s.length, t.length];
  let dp = new Array(a + 1).fill().map(() => new Array(b + 1).fill(0));
  for (let i = 0; i <= b; i++) {
    dp[0][i] = 1;
  }
  for (let i = 1; i <= a; i++) {
    for (let j = 1; j <= b; j++) {
      if (s[i - 1] == t[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + dp[i - 1][j];
      } else {
        dp[i][j] = dp[i - 1][j];
      }
    }
  }
  return dp[a][b];
}

/**
给定两个整数 n 和 k，返回范围 [1, n] 中所有可能的 k 个数的组合。
你可以按 任何顺序 返回答案。
输入：n = 4, k = 2
输出：
[
  [2,4],
  [3,4],
  [2,3],
  [1,2],
  [1,3],
  [1,4],
]
 */
var combine = function (n, k) {
  let ans = [];
  var backTrack = (path, start) => {
    if (path.length == k) {
      ans.push(path.slice());
      return;
    }
    for (let i = start; i <= n; i++) {
      if (!path.includes(i)) {
        path.push(i);
        backTrack(path, i);
        path.pop();
      }
    }
  };
  backTrack([], 1);
  return ans;
};
combine(4, 2);

/**
 * 
有效 IP 地址 正好由四个整数（每个整数位于 0 到 255 之间组成，且不能含有前导 0），整数之间用 '.' 分隔。
例如："0.1.2.201" 和 "192.168.1.1" 是 有效 IP 地址，但是 "0.011.255.245"、"192.168.1.312" 和 "192.168@1.1" 是 无效 IP 地址。
给定一个只包含数字的字符串 s ，用以表示一个 IP 地址，返回所有可能的有效 IP 地址，这些地址可以通过在 s 中插入 '.' 来形成。你 不能 重新排序或删除 s 中的任何数字。你可以按 任何 顺序返回答案。
示例 1：
输入：s = "25525511135"
输出：["255.255.11.135","255.255.111.35"]} 
 */
/**
 * @param {string} s
 * @return {string[]}
 */
var restoreIpAddresses = function (s) {
  let ans = [];
  var backTrack = (arr, path, pos) => {
    if (pos === arr.length - 1) {
      ans.push(path.slice().join('.'));
      return;
    }
    // 剪枝
    for (let i = 0; i < arr.length; i++) {
      let cur = arr[i];
    }
  };
  backTrack(s, [], 0);
  return ans;
};

// 给定字符串 s 和 t ，判断 s 是否为 t 的子序列
// 判断子序列
// 输入：s = "abc", t = "ahbgdc"
// 输出：true
// 示例 2：
// 输入：s = "axc", t = "ahbgdc"
// 输出：false
function isChild(s, t) {
  let [a, b] = [s.length, t.length];
  let dp = new Array(a + 1).fill().map(() => new Array(b + 1).fill(0));
  for (let i = 1; i <= a; i++) {
    for (let j = 1; j <= b; j++) {
      if (s[i - 1] == t[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = dp[i][j - 1];
      }
    }
  }
  return dp[a][b] == a ? true : false;
}

function isChild(s, t) {
  if (s.length == 0) return true;
  let j = 0;
  for (let i = 0; i < t.length; i++) {
    if (t[i] == s[j]) {
      j++;
      if (j == s.length) {
        return true;
      }
    }
  }
  return false;
}
isChild('abc', 'ahbdc');
// 背包问题
function weightBag(values, weights, size) {
  // 先遍历物品在遍历背包
  let len = weights.length;
  let dp = new Array(len).fill().map(() => new Array(size + 1).fill(0));
  // 首行进行初始化
  for (let i = 0; i <= size; i++) {
    dp[0][i] = values[0];
  }
  for (let i = 1; i < len; i++) {
    for (let j = 0; j <= size; j++) {
      if (weights[i] > j) {
        dp[i][j] = dp[i - 1][j];
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i - 1][j - weights[i]] + values[i]);
      }
    }
  }
  return dp[len - 1][size];
}

function reverseNode(root) {
  let pre = null;
  let cur = root;
  while (cur) {
    let next = cur.next;
    cur.next = pre;
    pre = cur;
    cur = next;
  }
  return pre;
}

function maxDepth(tree) {
  if (tree == null) return 0;
  let left = maxDepth(tree.left);
  let right = maxDepth(tree.right);
  return Math.max(left, right) + 1;
}

function minDepth(tree) {
  if (tree == null) return 0;
  let left = minDepth(tree.left);
  let right = minDepth(tree.right);
  if (left == null && right != null) return right + 1;
  if (left != null && right == null) return left + 1;
  return 1 + Math.min(left, right);
}

function generate(n) {
  if (n == 0) return '';
  let ans = [];
  let dfs = (paths, left, right) => {
    if (left < right || left > n) return;
    if (2 * n == paths.length) {
      ans.push(paths);
      return;
    }
    dfs(paths + '(', left + 1, right);
    dfs(paths + ')', left, right + 1);
  };
  dfs('', 0, 0);
  return ans;
}

function removeDup(arr) {
  arr.sort((a, b) => a - b);
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == arr[i + 1]) {
      arr.splice(i, 1);
      i--;
    }
  }
  return arr;
}
removeDup([1, 1, 2, 2, 3, 3, 3, 4, 5, 6, 6]);
function scrollTop() {
  let top = window.document.scrollTop;
  if (top > 0) {
    window.requestAnimationFrame(scrollTop);
    window.scrollTo(0, top - top / 8);
  }
}
