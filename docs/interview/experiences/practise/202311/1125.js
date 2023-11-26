/**
 * 1.虚拟列表滚动
 * 2.数组旋转
 * 3.买卖股票的最佳时机
 * 4.K 个一组翻转链表
 * 5.合并两个有序链表
 * 6.最长回文子串
 * 7.二叉树的层序遍历
 * 8.搜索旋转排序数组
 * 9.岛屿数量
 * 10.爬楼梯
 */

// 买卖股票的最佳时机
// 给定一个数组 prices ，它的第 i 个元素 prices[i] 表示一支给定股票第 i 天的价格。
// 你只能选择 某一天 买入这只股票，并选择在 未来的某一个不同的日子 卖出该股票。设计一个算法来计算你所能获取的最大利润。
// 返回你可以从这笔交易中获取的最大利润。如果你不能获取任何利润，返回 0

// 示例用法
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var rotate = function (nums, k) {};
const array = [1, 2, 3, 4, 5]; // 4 5 1 2 3
const k = 2;
const rotatedArray = rotateArray(inputArray, k);
console.log(rotatedArray); // 输出: [4, 5, 1, 2, 3]

function rotateArray(arr, k) {
  var first = arr.slice(0, arr.length - k);
  var nerArr = arr.reverse();
  var newArr2 = nerArr.slice(0, k).reverse();
  var res = [...newArr2, ...first];
  return res;
}
