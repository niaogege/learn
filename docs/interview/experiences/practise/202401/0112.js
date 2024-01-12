/**
 * 1.判断子序列
 * 2.买卖股票I/II
 * 3.判断子序列
 * 4.不同的子序列
 * 5.两个字符串的删除操作
 */

function maxProfit1(nums) {
  let len = nums.length;
  let dp = new Array(len).fill([0, 0]); // [持有, 不持有股票 也就是最大现金]
  dp[0] = [-nums[0], 0];
  for (let i = 1; i < len; i++) {
    // 持有股票 保持现状 第I天买入股票
    dp[i][0] = Math.max(dp[i - 1][0], -nums[i]);
    // 不持有股票 保持现状 第I天卖出股票
    dp[i][1] = Math.max(dp[i - 1][1], dp[i - 1][0] + nums[i]);
  }
  return dp[len - 1][1];
}

function maxProfit2(nums) {
  let len = nums.length;
  let dp = new Array(len).fill([0, 0]); // [持有, 不持有股票 也就是最大现金]
  dp[0] = [-nums[0], 0];
  for (let i = 1; i < len; i++) {
    // 持有股票 保持现状 昨天不持有股票的所得现金减去 今天的股票价格
    dp[i][0] = Math.max(dp[i - 1][0], dp[i - 1][1] - nums[i]);
    // 不持有股票 保持现状 第I天卖出股票
    dp[i][1] = Math.max(dp[i - 1][1], dp[i - 1][0] + nums[i]);
  }
  return dp[len - 1][1];
}

function isChildSeq(s, t) {
  if (s.length == 0) return true;
  let j = 0;
  for (let i = 0; i < t.length; i++) {
    if (s[j] == t[i]) {
      j = j + 1;
      if (j == s.length) {
        return true;
      }
    }
  }
  return false;
}
isChildSeq('abc', 'ahbgdc');
