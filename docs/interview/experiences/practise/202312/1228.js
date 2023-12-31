/**
 * 1.不同的二叉搜索树
 * 2.最后一块石头重量
 * 3.不定长数组的全排列
 * 4.零钱兑换I/II
 * 5.目标和
 * 6.实现SWR 机制,SWR 这个名字来自于 stale-while-revalidate
 * 7.[观察者模式](https://juejin.cn/post/7299357176928354313#heading-10)
 * 8.二叉树最大路径和
 * 9.对象扁平化
 * 10.字符串相乘
 */

// 完全平方数
var numSquares = function (n) {
  let dp = new Array(n + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i * i <= n; i++) {
    for (let j = i * i; j <= n; j++) {
      dp[j] = Math.min(dp[j], dp[j - i * i] + 1);
    }
  }
  return dp[n];
};

// 零钱兑换I/II

// 输入：coins = [1, 2, 5], amount = 11
// 输出：3
// 解释：11 = 5 + 5 + 1
function coinChange(coins, amount) {
  let dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let coin of coins) {
    for (let j = coin; j <= amount; j++) {
      dp[j] = Math.min(dp[j], dp[j - coin] + 1);
    }
  }
  console.log(dp, 'dp');
  return dp[amount] == Infinity ? -1 : dp[amount];
}
function flattenObj(obj, path = '', res = {}, isArray = false) {
  for (let [k, v] of Object.entries(obj)) {
    if (Array.isArray(v)) {
      let temp = isArray ? `${path}[${k}]` : `${path}${k}`;
      flattenObj(v, temp, res, true);
    } else if (v instanceof Object) {
      let temp = isArray ? `${path}[${k}].` : `${path}${k}.`;
      flattenObj(v, temp, res);
    } else {
      let key = isArray ? `${path}[${k}]` : `${path}${k}`;
      res[key] = v;
    }
  }
  return res;
}
flattenObj({
  a: {
    b: 1,
    c: 2,
  },
  b: [1, 3, { a: 2, b: 3 }],
});

// 12*130
function multiply(a, b) {
  let lenA = a.length;
  let lenB = b.length;
  let ans = new Array(lenA + lenB).fill(0);
  // 2*3
  for (let i = lenA - 1; i >= 0; i--) {
    for (let j = lenB - 1; j >= 0; j--) {
      let data = +a[i] * +b[j];
      let p1 = i + j; // 0
      let p2 = p1 + 1; // 1
      let sum = ans[p2] + data;
      ans[p2] = sum % 10;
      ans[p1] += Math.floor(sum / 10);
    }
  }
  if (ans[0] == 0) {
    ans.shift();
  }
  return ans.length ? ans.join('') : '0';
}
multiply('5', '31');
