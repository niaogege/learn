/**
 * 1.链表中倒数第k个节点
 * 2.长度最小的子数组
 * 3.接雨水
 * 4.旋转图像
 * 5.分发糖果
 * 6.复原IP地址
 * 7.最长连续递增子序列
 * 8.背包问题
 */

// 复原IP地址
/**
 * @param {string} s
 * @return {string[]}
 */
var restoreIpAddresses = function (s) {
  let ans = [];
  var backTrack = (path, start) => {
    // 终止递归
    if (path.length > 4) return;
    if (path.length == 4 && start == s.length) {
      ans.push(path.slice().join('.'));
      return;
    }
    // 如何切割 以及判断是否是合法的ip
    for (let i = start; i < s.length; i++) {
      let cur = s.slice(start, i + 1);
      if (cur.length > 3 || +cur > 255) continue;
      if (cur.length > 1 && cur[0] == '0') continue;
      path.push(cur);
      backTrack(path, i + 1);
      path.pop();
    }
  };
  backTrack([], 0);
  return ans;
};

function oneBag(weights, values, target) {
  let [m] = [weights.length];
  let dp = new Array(m).fill().map(() => new Array(target + 1).fill(0));
  for (let j = values[0]; j <= target; j++) {
    dp[0][j] = values[0];
  }
  for (let i = 1; i < m; i++) {
    for (let j = 0; j <= target; j++) {
      // 当前物品的大小
      if (weights[i] > j) {
        dp[i][j] = dp[i - 1][j];
      } else {
        // 放于不放这个物品
        dp[i][j] = Math.max(dp[j - weights[i]] + values[i], dp[i - 1][j]);
      }
    }
  }
  return dp[m - 1][tag];
}
oneBag([1, 2, 3, 4], [10, 15, 20, 40], 6);

function longestSubChild(nums) {
  let len = nums.length;
  let max = 1,
    count = 1;
  for (let i = 1; i < len; i++) {
    if (nums[i] > nums[i - 1]) {
      count++;
    } else {
      count = 1;
    }
    max = Math.max(max, count);
  }
  return max;
}
