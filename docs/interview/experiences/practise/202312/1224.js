/**
 * 1.1049.最后一块石头的重量II
 * 2.目标和
 * 3.一和零
 * 4.零钱兑换
 * 5.完全二叉树的节点个数
 */

// 目标和
// 如何转化背包问题 容量和物品
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var findTargetSumWays = function (nums, target) {
  let sum = nums.reduce((a, b) => a + b);
  let bagSize = (sum + target) / 2; // 5 3 背包容量4
  if (Math.abs(target) > sum || sum + (target % 2) == 1) return 0;
  let dp = new Array(bagSize + 1).fill(0);
  dp[0] = 1;
  for (let i = 0; i < nums.length; i++) {
    for (let j = bagSize; j >= nums[i]; j--) {
      dp[j] += dp[j - nums[i]];
    }
  }
  return dp[bagSize];
};

/**
 * 背包stones
 * 容量 容量最小即可
 * 本题其实就是尽量让石头分成重量相同的两堆，相撞之后剩下的石头最小，这样就化解成01背包问题了。
 * @param {number[]} stones
 * @return {number}
 */
var lastStoneWeightII = function (stones) {
  let len = stones.length;
  let sum = stones.reduce((a, b) => a + b);
  let dpLen = Math.floor(sum / 2);
  let dp = new Array(dpLen + 1).fill(0);
  for (let i = 0; i < len; i++) {
    for (let j = dpLen; j >= stones[i]; j--) {
      dp[j] = Math.max(dp[j], dp[j - stones[i]] + stones[i]);
    }
  }
  return sum - dp[dpLen] - dp[dpLen];
};

function weightBagOne(weight, value, size) {
  let dp = new Array(size + 1).fill(0);
  // 遍历顺序
  for (let i = 0; i < weight.length; i++) {
    for (let j = size; j >= weight[i]; j--) {
      dp[j] = Math.max(dp[j], dp[j - weight[i]] + value[i]);
    }
  }
  console.table(dp);
  return dp[size];
}
weightBagOne([1, 3, 4, 5], [15, 20, 30, 55], 6);
weightBagOne([1, 3, 4], [15, 20, 30], 6);

// https://github.com/DangoSky/algorithm/tree/master/LeetCode

function heapSort(arr) {
  buildHeap(arr);
  let heapSize = arr.length - 1;
  for (let i = arr.length - 1; i > 0; i--) {
    // 交换堆顶元素与最后一个有效子元素
    swap(arr, 1, i);
    // 有效序列长度减 1
    heapSize--;
    // 堆化有效序列
    heapify(arr, heapSize, 1);
  }
  return arr;
}
// 构建大顶堆
function buildHeap(arr) {
  let len = arr.length;
  for (let i = Math.floor(len / 2) - 1; i >= 0; i--) {
    heapify(arr, len, i);
  }
}
// 堆化 下沉
function heapify(arr, len, i) {
  if (i >= len) return;
  let l = i * 2 + 1; // 左
  let r = i * 2 + 2; // 右
  let max = i;
  if (l < len && arr[max] < arr[l]) {
    max = l;
  }
  if (r < len && arr[max] < arr[r]) {
    max = r;
  }
  if (max != i) {
    swap(arr, i, max);
    i = max;
    heapify(arr, len, i);
  }
}
function swap(arr, i, j) {
  let t = arr[i];
  arr[i] = arr[j];
  arr[j] = t;
}
heapSort([2, 111, 1, 4, 33, 8, 9]);
