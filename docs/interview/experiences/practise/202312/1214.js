/**
 * 1.每日温度
 * 2.接雨水
 */

// 输入: temperatures = [73,74,75,71,69,72,76,73]
// 输出: [1,1,4,2,1,1,0,0]
function dailyTem(nums) {
  if (!nums.length) return [];
  let len = nums.length;
  let res = new Array(len).fill(0);
  let stack = [0]; // 单调栈
  for (let i = 1; i < len; i++) {
    // 如果栈顶元素 当前元素
    let cur = nums[i];
    // 当前元素小于栈顶元素 放到栈里
    if (cur <= nums[stack.slice(-1)]) {
      stack.push(i);
    } else {
      while (cur && cur > nums[stack.slice(-1)]) {
        let top = stack.pop();
        res[top] = i - top;
      }
      stack.push(i);
    }
  }
  console.log(res);
  return res;
}
dailyTem([73, 74, 75, 71, 69, 72, 76, 73]);

/**
 * 给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。
 * 输入：height = [0,1,0,2,1,0,1,3,2,1,2,1]
输出：6
解释：上面是由数组 [0,1,0,2,1,0,1,3,2,1,2,1] 表示的高度图，在这种情况下，可以接 6 个单位的雨水（蓝色部分表示雨水）。 
示例 2：
输入：height = [4,2,0,3,2,5]
输出：9
 */

function rain(nums) {
  if (!nums.length) return 0;
  let len = nums.length;
  let res = new Array(len).fill(0);
  let stack = [0];
  for (let i = 0; i < len; i++) {
    let cur = nums[i];
    // 遍历当前元素盒栈顶元素进行比较
    // 如果当前元素小于栈顶元素 放到栈里
    if (cur < nums[stack.slice(-1)]) {
      stack.push(i);
    } else {
      // 如果当前元素大于栈顶元素则需要进行计算面积
      while (cur && cur >= nums[stack.slice(-1)]) {
        let top = stack.pop();
        // 长*宽 = h*w
        // Math.min(左边和右边)-cur * (i-top-1)
        res[top] = (Math.min(nums[stack.slice(-1)], cur) - nums[top]) * (i - stack.slice(-1) - 1);
      }
      stack.push(i);
    }
  }
  return res;
}
rain([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]);
