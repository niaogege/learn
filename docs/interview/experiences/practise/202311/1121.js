/**
 * 0.二分法
 * 1.盛最多水的容器
 * 2.有效的括号
 * 3.全排列
 */
// 给定一个  n  个元素有序的（升序）整型数组  nums 和一个目标值  target  ，写一个函数搜索  nums  中的 target，如果目标值存在返回下标，否则返回 -1。
// 输入: nums = [-1,0,3,5,9,12], target = 9 输出: 4 解释: 9 出现在 nums 中并且下标为 4
function binary(arr, target) {
  var end = arr.length - 1;
  var start = 0;
  while (start <= end) {
    var mid = start + Math.floor(end - start / 2);
    if (arr[mid] > target) {
      end = mid - 1;
    } else if (arr[mid] < target) {
      start = mid + 1;
    } else {
      return mid;
    }
  }
  return -1;
}
binary([-1, 0, 3, 5, 9, 12], 9);
// 给定一个长度为 n 的整数数组 height 。有 n 条垂线，第 i 条线的两个端点是 (i, 0) 和 (i, height[i]) 。
// 找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水。
// 返回容器可以储存的最大水量。

// 输入：[1,8,6,2,5,4,8,3,7]
// 输出：49
// 解释：图中垂直线代表输入数组 [1,8,6,2,5,4,8,3,7]。在此情况下，容器能够容纳水（表示为蓝色部分）的最大值为 49。

/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function (height) {
  var max = 0;
  var end = height.length - 1;
  var start = 0;
  while (start <= end) {
    var w = end - start;
    var h = Math.min(height[start], height[end]);
    max = Math.max(max, h * w);
    if (height[right] > height[left]) {
      left++;
    } else {
      right--;
    }
  }
  return max;
};

function maxArea2(height) {
  var max = 0;
  var end = height.length - 1;
  var start = 0;
  while (start < end) {
    max =
      height[start] < height[end]
        ? Math.max(max, (end - start) * height[start++])
        : Math.max(max, (end - start) * height[end--]);
  }
  return max;
}
maxArea2([1, 8, 6, 2, 5, 4, 8, 3, 7]);
// 给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。
// 有效字符串需满足：
// 左括号必须用相同类型的右括号闭合。
// 左括号必须以正确的顺序闭合。
// 每个右括号都有一个对应的相同类型的左括号。
// 输入：s = "()"
// 输出：true
// 输入：s = "()[]{}"
// 输出：true
// 输入：s = "(]"
// 输出：false

function isValid(str) {
  var m = new Map([
    [')', '('],
    ['}', '{'],
    [']', '['],
  ]);
  let res = [];
  for (let i of str) {
    var comp = m.get(i);
    var last = res.slice(-1)[0];
    if (comp && comp === last) {
      res.pop();
    } else {
      res.push(i);
    }
  }
  return res.length === 0;
}
isValid('()');

function permute(nums, res = []) {
  var backTrack = (arr, path, res) => {
    if (arr.length === path.length) {
      res.push(path.slice());
      return;
    }
    for (let i = 0; i < arr.length; i++) {
      if (!path.includes(arr[i])) {
        path.push(arr[i]);
        backTrack(arr, path, res);
        path.pop();
      }
    }
  };
  backTrack(nums, [], res);
  return res;
}
permute([1, 2, 3]);
