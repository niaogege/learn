/**
 * 1.校验 html 是否合法
 * 2.二叉树最大路径和
 * 3.三数之和
 * 4.打家劫舍
 * 5.
 */
// 打家劫舍II

// 打家劫舍
/**
 * @param {number[]} nums
 * @return {number}
 */
var rob = function (nums) {
  var dp = new Array(nums.length + 1).fill(0);
  dp[0] = nums[0];
  dp[1] = Math.max(nums[0], nums[1]);
  for (let i = 2; i < nums.length; i++) {
    dp[i] = Math.max(dp[i - 2] + nums[i], dp[i - 1]);
  }
  return dp[nums.length];
};

var rob = function (nums) {
  if (nums.length == 0) return 0;
  if (nums.length == 1) return nums[0];
  let sum1 = nums[0];
  let sum2 = nums[1];
  for (let i = 2; i < nums.length; i++) {
    let temp = sum1;
    if (sum2 > sum1) {
      sum1 = sum2;
    }
    sum2 = temp + nums[i];
  }
  return Math.max(sum1, sum2);
};
var rob = function (nums) {
  let pre = 0;
  let cur = 0;
  for (let item of nums) {
    let temp = Math.max(cur, pre + item);
    pre = cur;
    cur = temp;
  }
  return cur;
};
