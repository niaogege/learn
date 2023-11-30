/**
 * 1.实现一个 immutable
 * 2.惰性函数
 * 3.虚拟列表滚动
 * 4.搜索旋转排序数组
 * 5.买卖股票的最佳时机
 * 6.有效的括号
 * 7.合并两个有序数组
 * 8.岛屿数量
 * 9.环形链表
 */
// 贪婪
var maxProfit = function (prices) {
  var max = 0;
  var min = prices[0];
  for (let item of prices) {
    min = Math.min(min, item);
    max = Math.max(max, i - min);
  }
  return max;
};

var maxProfit2 = function (prices) {
  var len = prices.length;
  var dp = new Array(len).fill([0, 0]);
  dp[0] = [-prices[0], 0];
  for (let i = 1; i < len; i++) {
    dp[i][0] = Math.max(dp[i - 1][0], -prices[0]);
    dp[i][1] = Math.max(dp[i - 1][0] + prices[i], dp[i - 1][1]);
  }
  return dp[len - 1][1];
};
