/**
 * 1.分发饼干
 * 2.摆动序列
 */

var wiggleMaxLength = function (nums) {
  let max = 0;
  let dp = new Array(nums.length + 1).fill(0);
  dp[0] = 1;
  for (let i = 1; i <= nums.length; i++) {}
};

就只有8号上午的时间;
// 大姨二姨舅舅 上午走完 4个
// 二姑小姑 中午 2个 总共6个 小朋友俩个红包
/**
 * 
输入: g = [1,2,3], s = [1,1]
输出: 1
解释: 
你有三个孩子和两块小饼干，3个孩子的胃口值分别是：1,2,3。
你的目标是尽可能满足越多数量的孩子，并输出这个最大数值。
*/
var findContentChildren = function (g, s) {
  s.sort((a, b) => a - b);
  g.sort((a, b) => a - b);
  let count = 0;
  let sLen = s.length - 1;
  for (let item of g) {
    if (sLen >= 0 && s[sLen] >= item) {
      count++;
      sLen--;
    }
  }
  return count;
};
