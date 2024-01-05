/**
 * 1.单词拆分
 * 2.二叉树最大路径和
 * 3.三数之和
 * 4.打家劫舍II/III
 * 5.完全平方数
 * 6.搜索旋转排序数组
 * 7.二分查找
 * 8.插入排序
 * 9.选择排序
 * 10.堆排序
 * 11.买卖股票
 */

/**
 *   [0, 0, 4, 4, 5, 5]
输入：[7, 1, 5, 3, 6, 4]
输出：5
解释：在第 2 天（股票价格 = 1）的时候买入，在第 5 天（股票价格 = 6）的时候卖出，最大利润 = 6-1 = 5 。
     注意利润不能是 7-1 = 6, 因为卖出价格需要大于买入价格；同时，你不能在买入前卖出股票。 
 */

function buy(nums) {
  // 如何定义dp数组
  let dp = new Array(nums.length).fill(-Infinity);
  dp[0] = 0;
  for (let i = 1; i < nums.length; i++) {
    // 推导公式
    // 不知道那个是最小的
    dp[i] = Math.max(dp[i - 1], nums[i] - dp[min]);
  }
  return dp[nums.length - 1];
}

function swap(arr, i, j) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}
// 保持顺序 从i之后开始继续排序
function selectSort(arr) {
  let min = 0;
  for (let i = 0; i < arr.length; i++) {
    min = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[min] > arr[j]) {
        min = j;
      }
    }
    swap(arr, min, i);
  }
  return arr;
}
selectSort([33, 11, 2, 99, 1, 111]);

//插入排序 亮亮交换 保持顺序
function insertSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let j = i;
    while (j > 0 && arr[j - 1] > arr[j]) {
      swap(arr, j, j - 1);
      j--;
    }
  }
  return arr;
}
insertSort([22, 11, 3333, 1, 2, 3]);
// 二分查找
function binarySearch(nums, target) {
  let end = nums.length - 1;
  let start = 0;
  while (start <= end) {
    let mid = start + Math.floor((end - start) / 2);
    if (nums[mid] == target) {
      return mid;
    } else if (nums[mid] > target) {
      end = mid - 1;
    } else {
      start = mid - 1;
    }
  }
  return -1;
}

// 搜索旋转排序数组

// 在传递给函数之前，nums 在预先未知的某个下标 k（0 <= k < nums.length）上进行了 旋转，使数组变为 [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]（下标 从 0 开始 计数）。例如， [0,1,2,4,5,6,7] 在下标 3 处经旋转后可能变为 [4,5,6,7,0,1,2] 。
// 给你 旋转后 的数组 nums 和一个整数 target ，如果 nums 中存在这个目标值 target ，则返回它的下标，否则返回 -1 。
// 你必须设计一个时间复杂度为 O(log n) 的算法解决此问题。
// 输入：nums = [4,5,6,7,0,1,2], target = 0
// 输出：4
var search = function (nums, target) {
  let l = 0;
  let r = nums.length - 1;
  while (l <= r) {
    let mid = l + Math.floor((r - l) / 2);
    if (nums[mid] == target) return mid;
    // 左半段 还是右半段
    if (nums[mid] >= nums[l]) {
      if (target >= nums[l] && target < nums[mid]) {
        r = mid - 1;
      } else {
        l = mid + 1;
      }
    } else {
      if (target > nums[mid] && target <= nums[r]) {
        l = mid + 1;
      } else {
        r = mid - 1;
      }
    }
  }
  return -1;
};

// 三数之和

// 打家劫舍
/**
 * 
这个地方所有的房屋都 围成一圈 ，这意味着第一个房屋和最后一个房屋是紧挨着的。同时，相邻的房屋装有相互连通的防盗系统，如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警 
// 带有条件
// 如何让第一个和最后一个只能选一个大的
 */

// 考虑首 不考虑尾
// 不考虑首 考虑尾
var rob = function (nums) {
  var getMin = (nums) => {
    var dp = new Array(nums.length);
    dp[0] = nums[0];
    dp[1] = Math.max(nums[0], nums[1]);
    for (let i = 2; i < nums.length; i++) {
      dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);
    }
    return dp[nums.length - 1];
  };
  // 考虑尾
  let [_, ...rest] = nums;
  let getLast = getMin(rest);
  // 考虑首
  let firstArr = nums.slice(0, nums.length - 1);
  let getFirst = getMin(firstArr);
  return Math.max(getLast, getFirst);
};

/**
 * 二叉树中的 路径 被定义为一条节点序列，序列中每对相邻节点之间都存在一条边。同一个节点在一条路径序列中 至多出现一次 。该路径 至少包含一个 节点，且不一定经过根节点。
路径和 是路径中各节点值的总和。
给你一个二叉树的根节点 root ，返回其 最大路径和 。
 */

function maxPath(root) {
  if (root == null) return 0;
  let max = Number.MIN_SAFE_INTEGER;
  let dfs = (root) => {
    if (root == null) return 0;
    let left = dfs(root.left);
    let right = dfs(root.right);
    // 当前子树内部的最大路径和
    let innerSum = left + right + root.val;
    max = Math.max(innerSum, max);
    // 当前子树对外提供的最大和
    const outer = root.val + Math.max(0, left, right);
    return outer > 0 ? outer : 0;
  };
  dfs(root);
  return max;
}

function wordSplit(s, words) {
  let dp = new Array(s.length + 1).fill(false);
  dp[0] = true;
  // 先遍历背包在遍历物品
  for (let i = 1; i < s.length; i++) {
    for (let j = 0; j < i; j++) {
      let temp = s.slice(j, i);
      if (words.includes(temp) && dp[j] == true) {
        dp[i] = true;
      }
    }
  }
  return dp[s.length];
}

// 给你一个整数 n ，返回和为 n 的完全平方数的 最少数量 。
// 13 => 4 + 9
// 输入：n = 12
// 输出：3
// 解释：12 = 4 + 4 + 4
// dp[2] => dp[1] dp[2]
// 1 1
// 先遍历背包 在遍历物品
function square(n) {
  let dp = new Array(n + 1).fill(Infinity);
  dp[0] = 0; // 初始值给1还是0？
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j * j <= i; j++) {
      dp[i] = Math.min(dp[i], dp[i - j * j] + 1);
    }
  }
  return dp[n];
}

// 先遍历物品在遍历背包
function square2(n) {
  let dp = new Array(n + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i * i <= n; i++) {
    for (let j = i * i; j <= n; j++) {
      dp[j] = Math.min(dp[j], dp[j - i * i] + 1);
    }
  }
  return dp[n];
}
