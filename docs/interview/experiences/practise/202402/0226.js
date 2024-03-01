/**
 * 1.杨辉三角
 * 2.编辑距离
 * 3.最长回文子串
 * 4.和为k的子数组
 * 5.分发饼干
 * 6.不同的子序列
 * 7.判断子序列
 * 8.买股票的最佳时机
 * 9.前中后遍历
 * 10.层序遍历
 * 11.多叉树每层之和
 */

// [] 持有股票 不持有股票 卖出
var maxProfit = function (prices) {
  let len = prices.length;
  let dp = new Array(len).fill([0, 0]);
  dp[0] = [-prices[0], 0];
  for (let i = 1; i < len; i++) {
    dp[i][0] = Math.max(dp[i - 1][0], -prices[i]);
    dp[i][1] = Math.max(dp[i - 1][1], dp[i - 1][0] + prices[i]);
  }
  return dp[len - 1][1];
};

function layerSum(root) {
  let ans = [];
  let dfs = (data, path) => {
    if (data) {
      path.push(data.value);
      if (data.children && data.children.length) {
        for (let i = 0; i < data.children; i++) {
          dfs(data.children[i], path);
          ans[i].push(path.slice());
        }
      }
    }
  };
  dfs(root, []);
  return ans;
}

const res = layerSum({
  value: 2,
  children: [
    { value: 6, children: [{ value: 1 }] },
    { value: 3, children: [{ value: 2 }, { value: 3 }, { value: 4 }] },
    { value: 5, children: [{ value: 7 }, { value: 8 }] },
  ],
});

console.log(res);

// 层序遍历dfs
function levelDfs(node) {
  if (!node) return [];
  let ans = [];
  let dfs = (node, step) => {
    if (node) {
      if (!ans[step]) {
        ans[step] = [];
      }
      ans[step].push(node.val);
      if (node.left) {
        dfs(node.left, step + 1);
      }
      if (node.right) {
        dfs(node.right, step + 1);
      }
    }
  };
  dfs(node, 0);
  return ans;
}

// 层序遍历
function levelTraverse(tree) {
  let stack = [tree];
  let res = [];
  while (stack.length) {
    let arr = [];
    let len = stack.length;
    for (let i = 0; i < len; i++) {
      let cur = stack.shift();
      arr.push(cur.val);
      if (cur.left) {
        stack.push(cur.left);
      }
      if (cur.right) {
        stack.push(cur.right);
      }
    }
    res.push(arr);
  }
  return res;
}

// 前序 跟左右
function preOrder(tree) {
  let stack = [tree];
  let res = [];
  while (stack.length) {
    let cur = stack.pop();
    res.push(cur.val);
    // 右
    if (cur.right) {
      stack.push(cur.right);
    }
    // 左
    if (cur.left) {
      stack.push(cur.left);
    }
  }
  return res;
}

// 中 左根右
function inOrder(tree) {
  let stack = [];
  let res = [];
  let root = tree;
  while (root || stack.length) {
    if (root) {
      root = root.left;
      stack.push(root);
    } else {
      root = stack.pop();
      res.push(root.val);
      root = root.right;
    }
  }
}

// 后序post 左右跟
function postOrder(tree) {
  let stack = [tree];
  let res = [];
  while (stack.length) {
    let cur = stack.pop();
    res.push(cur.val);
    // 左
    if (cur.left) {
      stack.push(cur.left);
    }
    // 右
    if (cur.right) {
      stack.push(cur.right);
    }
  }
  return res.reverse();
}
// [[1],[1,1],[1,2,1],[1,3,3,1]]
function generate(num) {
  let dp = [];
  for (let i = 0; i < num; i++) {
    dp[i] = new Array(i + 1).fill(1);
    for (let j = 1; j < i; j++) {
      dp[i][j] = dp[i - 1][j - 1] + dp[i - 1][j];
    }
  }
  return dp;
}
generate(4);

// 最长回文子串
// 输入："ababc"
// 返回值：3
// 说明：最长的回文子串为"aba"与"bab"，长度都为3
function findLongest(str) {
  let len = str.length;
  let dp = new Array(len).fill().map(() => new Array(len).fill(false));
  let start = 0;
  let L = 0;
  for (let i = len; i >= 0; i--) {
    for (let j = i; j < len; j++) {
      if (str[i] == str[j]) {
        if (j - i <= 1) {
          dp[i][j] = true;
        } else {
          dp[i][j] = dp[i + 1][j - 1];
        }
      }
      if (dp[i][j] && j - i + 1 > L) {
        L = j - i + 1;
        start = i;
      }
    }
  }
  return str.slice(start, start + L);
}
findLongest('ababc');
