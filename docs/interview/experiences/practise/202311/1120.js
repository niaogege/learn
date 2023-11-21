/**
 * 1.链表相交
 * 2.盛最多水的容器
 * 3.有效的括号
 * 4.归并排序
 * 5.无重复字符的最长子串
 * 6.三数之和
 * 7.实现数组的旋转
 * 8.堆排序
 */

// 示例用法
const array = [1, 2, 3, 4, 5]; // 4 5 1 2 3
const k = 2;
const rotatedArray = rotateArray(inputArray, k);
console.log(rotatedArray); // 输出: [4, 5, 1, 2, 3]

/**
 * @param {number[]} height
 * 给定一个长度为 n 的整数数组 height 。有 n 条垂线，第 i 条线的两个端点是 (i, 0) 和 (i, height[i]) 。
找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水。
返回容器可以储存的最大水量。
说明：你不能倾斜容器。
 * @return {number}
 */
var maxArea = function (height) {};

// 输入: s = "pwwkew"
// 输出: 3
// 解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。
//      请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。
var lengthOfLongestSubstring = function (s) {
  var max = 0;
  var res = [];
  for (let item of s) {
    var index = res.indexOf(item);
    if (index > -1) {
      console.log(res, index);
      res.splice(0, index + 1);
      console.log(res);
    } else {
      res.push(item);
    }
    max = Math.max(max, res.length);
  }
  return max;
};
lengthOfLongestSubstring('pwwkew');
