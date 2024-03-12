---
title: 手撕热门算法题2
order: 19
group:
  order: 0
  title: interview
nav:
  order: 3
  title: 'interview'
  path: /interview
---

汇总题目来源于[codetop](https://codetop.cc/home)

> 如果能积累 hot100 道题，基本面试算法没啥大问题 1120

> [Hot 100](https://leetcode.cn/studyplan/top-100-liked/)

> [面试经典 150 题](https://leetcode.cn/studyplan/top-interview-150/)

> 算法虐你三千遍，依然要保持热爱

```js
/**
 * 1.二叉树路径和
 * 2.二叉树路径和II
 * 3.最长的有效括号
 * 4.最长公共前缀
 * 5.最长公共子串
 * 6.阶乘(迭代/递归/缓存)
 * 7.打家劫舍I/打家劫舍II
 * 8.零钱兑换I/零钱兑换II
 * 9.删除链表的节点
 * 10.括号生成
 * 11.数组旋转
 * 12.多叉树, 获取每一层的节点之和
 * 13.全排列II
 * 14.寻找字符串中连续重复次数最多的字符
 * 15.乘积最大子数组
 * 16.螺旋打印二维数组
 * 17.按照版本号对数组排序
 * 18.翻转二叉树，二叉树的左右节点翻转
 * 19.每日温度
 * 20.二叉树直径
 * 21.二叉树的最大路径和
 * 22.二叉树的第K小的元素
 * 23.将有序数组展开为二叉搜索树
 * 24.01背包问题
 * 25.多个数组交集
 * 26.删除有序数组中的重复项
 * 27.不定长二维数组全排列
 * 28.字符串相乘
 * 29.完全平方数
 * 30.单词拆分
 * 31.无重叠区间
 * 32.寻找两个正序数组的中位数
 * 33.分发糖果
 * 34.最长递增子序列
 * 35.最长连续递增序列
 * 36.最长公共子序列
 * 37.最小路径和
 * 38.移动0
 * 39.最长有效括号(连续)
 * 40.判断子序列
 * 41.不同的子序列
 * 42.两个字符串的删除操作
 * 43.杨辉三角形
 * 44.最长重复子数组
 * 45.最小覆盖子串
 * 46.回文子串
 * 47.和为 K 的子数组
 * 48.滑动窗口最大值
 * 49.除自身以外数组的乘积
 * 50.旋转图像
 * 51.分发饼干
 * 52.跳跃游戏
 */
```

## 1/2 路径和 II

```js
var pathSum = function (root, targetSum) {
  if (!root) return [];
  var res = [];
  var backTrack = (root, path) => {
    if (root == null) return;
    path.push(root.val);
    if (root.right == null && root.left == null) {
      if (path.reduce((a, b) => a + b) === targetSum) {
        res.push(path.slice());
      }
    }
    backTrack(root.left, path);
    backTrack(root.right, path);
    path.pop();
  };
  backTrack(root, []);
  return res;
};
// dfs
var pathSum = function (root, targetSum) {
  if (!root) return [];
  var res = [];
  var dfs = (root, path, sum) => {
    if (!root) return;
    sum = sum + root.val;
    var tempPath = [...path, root.val];
    if (sum === targetSum && root.left == null && root.right == null) {
      res.push(tempPath);
    }
    dfs(root.left, tempPath, sum);
    dfs(root.right, tempPath, sum);
  };
  dfs(root, [], 0);
};
```

## [3.最长的有效括号](https://leetcode.cn/problems/longest-valid-parentheses/description/)

```js
/**
 * @param {string} s
 * @return {number}
 * 输入：s = ")()())"
 * 输出：4
 * 解释：最长有效括号子串是 "()()"
 */
var longestValidParentheses = function (s) {
  if (s.length < 2) return 0;
  let stack = [-1];
  let len = s.length;
  let max = 0;
  for (let i = 0; i < len; i++) {
    if (s[i] == '(') {
      stack.push(i);
    } else {
      stack.pop();
      if (stack.length == 0) {
        stack.push(i);
      } else {
        max = Math.max(max, i - stack.slice(-1));
      }
    }
  }
  return max;
};
```

## 4.最长公共前缀

```js
// 输入：strs = ["flower","flow","flight"]
// 输出："fl"
// 横行扫描
function longFind(strs) {
  if (!strs.length) return '';
  let prefix = strs[0];
  for (let i = 0; i < strs.length; i++) {
    prefix = findL(prefix, strs[i]);
    if (prefix.length == 0) break;
  }
  return prefix;
}
function findL(a, b) {
  let len = Math.min(a.length, b.length);
  let index = 0;
  while (a[index] == b[index] && index < len) {
    index++;
  }
  return a.slice(0, index);
}
longFind(['flower', 'flow', 'flight']);
// 纵向扫描
function longFindHor(strs) {
  if (!strs.length) return [];
  let prefix = strs[0];
  for (let i = 0; i < prefix.length; i++) {
    for (let j = 1; j < strs.length; j++) {
      if (strs[j][i] != prefix[i]) {
        return prefix.slice(0, i);
      }
    }
  }
  return prefix;
}
longFindHor(['flower', 'flow', 'flight']);
```

## [5.最长公共子串/最长重复子数组](https://leetcode.cn/problems/maximum-length-of-repeated-subarray/description/)

```js
[1, 2, 3, 2, 1][(4, 5, 3, 2, 1)];
function longChild(nums1, nums2) {
  let len1 = nums1.length;
  let len2 = nums2.length;
  let dp = new Array(len1 + 1).fill().map(() => new Array(len2 + 1).fill(0));
  let max = 0;
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      let a = dp[i - 1];
      let b = dp[j - 1];
      if (a == b) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      }
      max = Math.max(dp[i][j], max);
    }
  }
  return max;
}
```

## 6.阶乘(迭代/递归/缓存)

```js
// bfs
function count(n) {
  if (n < 0) return undefined;
  let total = 1;
  for (let i = n; i > 1; i--) {
    total = total * i;
  }
  return total;
}
count(3);
// dfs
function coun2(n) {
  if (n <= 1) {
    return 1;
  } else {
    return n * coun2(n - 1);
  }
}
coun2(3);
// cache
function count3(n) {
  var m = new Map();
  var fn = (n) => {
    if (n <= 1) return 1;
    if (m.has(n)) return m.get(n);
    let res = n * fn(n - 1);
    m.set(n, res);
    return res;
  };
  return fn(n);
}
count3(3);
```

## [7.打家劫舍 I/II/III](https://leetcode.cn/problems/house-robber/)

```js
// 给定一个代表每个房屋存放金额的非负整数数组，计算你 不触动警报装置的情况下 ，一夜之内能够偷窃到的最高金额。
// 输入：[2,7,9,3,1]
// 输出：12 解释：偷窃 1 号房屋 (金额 = 2), 偷窃 3 号房屋 (金额 = 9)，接着偷窃 5 号房屋 (金额 = 1)。   偷窃到的最高金额 = 2 + 9 + 1 = 12 。
function houseRobber(nums) {
  let len = nums.length;
  let dp = new Array(len).fill(0);
  dp[0] = nums[0];
  dp[1] = Math.max(nums[0], nums[1]);
  for (let i = 2; i < len; i++) {
    dp[i] = Math.max(dp[i - 2] + nums[i], dp[i - 1]);
  }
  return dp[len - 1];
}
houseRobber([1, 2, 3, 1]);
```

## [8.零钱兑换 I/II](https://leetcode.cn/problems/coin-change/)

```js
/**
给你一个整数数组 coins ，表示不同面额的硬币；以及一个整数 amount ，表示总金额。
计算并返回可以凑成总金额所需的 最少的硬币个数 。如果没有任何一种硬币组合能组成总金额，返回 -1 。
你可以认为每种硬币的数量是无限的。
示例 1：
输入：coins = [1, 2, 5], amount = 11
输出：3 
解释：11 = 5 + 5 + 1
 */
var coinChange = function (coins, amount) {
  let dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let coin of coins) {
    for (let j = coin; j <= amount; j++) {
      dp[j] = Math.min(dp[j], dp[j - coin] + 1);
    }
  }
  return dp[amount] == Infinity ? '-1' : dp[amount];
};
```

零钱兑换 II

```js
/**
输入：amount = 5, coins = [1, 2, 5]
输出：4
解释：有四种方式可以凑成总金额：
5=5
5=2+2+1
5=2+1+1+1
5=1+1+1+1+1
 */
var change = function (amount, coins) {
  let dp = new Array(amount + 1).fill(0);
  dp[0] = 1;
  for (let coin of coins) {
    for (let j = coin; j <= amount; j++) {
      dp[j] += dp[j - coin];
    }
  }
  return dp[amount];
};
```

## 9.[剑指 Offer 18. 删除链表的节点](https://leetcode.cn/problems/shan-chu-lian-biao-de-jie-dian-lcof/)

```js
/**
 * 给定单向链表的头指针和一个要删除的节点的值，定义一个函数删除该节点。返回删除后的链表的头节点。
 * 示例： 输入: head = [4,5,1,9], val = 5
输出: [4,1,9]
解释: 给定你链表中值为 5 的第二个节点，那么在调用了你的函数之后，该链表应变为 4 -> 1 -> 9.
 * @param {ListNode} head
 * @param {number} val
 * @return {ListNode}
 * 节点next指针直接指向下下一个节点
 */
var deleteNode = function (head, val) {
  var dummy = {
    next: head,
    val: null,
  };
  let cur = dummy;
  while (cur) {
    if (cur.next && cur.next.val === val) {
      let next = cur.next.next;
      cur.next = next;
      continue;
    }
    cur = cur.next;
  }
  return dummy.next;
};
```

## 11.数组旋转

```js
// 构建新数组
function rotateArray(arr, k) {
  var len = arr.length;
  var newArr = [];
  for (let i = 0; i < len; i++) {
    newArr[(i + k) % len] = arr[i];
  }
  for (let i = 0; i < len; i++) {
    arr[i] = newArr[i];
  }
  return arr;
}
rotateArray([1, 2, 3, 4, 5], 2);
```

## 12.多叉树 获取每一层的节点之和

```js
function layerSum(root) {
  let queue = [root];
  let ans = [];
  while (queue.length) {
    let sum = 0;
    let len = queue.length;
    while (len--) {
      let cur = queue.shift();
      sum += cur.value;
      if (cur && cur.children) {
        queue.push(...cur.children);
        delete cur.children;
      }
    }
    ans.push(sum);
  }
  return ans;
}

const res = layerSum({
  value: 2,
  children: [
    { value: 6, children: [{ value: 1 }] },
    { value: 3, children: [{ value: 2 }, { value: 3 }, { value: 4 }] },
    { value: 5, children: [{ value: 7 }, { value: 8 }] },
  ],
});

console.log(res);
```

## [13.全排列 II](https://leetcode.cn/problems/permutations-ii/description/)

```js
// 给定一个可包含重复数字的序列 nums ，按任意顺序 返回所有不重复的全排列。
var permuteUnique = function (nums) {
  nums.sort((a, b) => a - b);
  let used = new Array(nums.length).fill(false);
  var res = [];
  let backTrack = (res, path, i) => {
    if (path.length === nums.length) {
      res.push(path.slice());
      return;
    }
    let s = new Set();
    for (let i = 0; i < nums.length; i++) {
      if (s.has(nums[i])) continue;
      if (!used[i]) {
        used[i] = true;
        s.add(nums[i]);
        path.push(nums[i]);
        backTrack(res, path, i);
        path.pop();
        used[i] = false;
      }
    }
  };
  backTrack(res, [], 0);
  return res;
};
```

## 14.寻找字符串中连续重复次数最多的字符

```js

- 编写 maxContinuousString 函数，寻找字符串中连续重复次数最多的字符：
-
- 输入 aaabbbbccbbcccccc，返回 { string: 'c', count: 6} \*/


// 给定一个字符串 s ，请你找出其中不含有重复字符的 最长子串 的长度。
var lengthOfLongestSubstring = function(s) {
    if (s && s.length <= 1) return 1
    s = s.split('')
    let res = {
      string: '',
      count: 0
    }
    let arr = [] // 滑动的窗口
    for(let i = 0; i < s.length;i++) {
        let cur = s[i]
        if(!arr.includes(cur)) {
            arr.push(cur)
        } else {
            let index = arr.indexOf(cur)
            arr.splice(0, index + 1)
            arr.push(cur)
        }
        res.count = Math.max(res.count, arr.length)
        if (res.count === arr.length) {
          res.string = arr.join('')
        }
    }
    return res
};
lengthOfLongestSubstring('abcabcbb')
```

## [15.乘积最大子数组](https://leetcode.cn/problems/maximum-product-subarray/)

## [16.螺旋打印二维数组]()

```js
function matrix(nums) {
  if (!nums.length) return [];
  let res = [];
  let up = 0;
  let down = nums.length - 1;
  let left = 0;
  let right = nums[0].length - 1;
  while (true) {
    // 从右往左
    for (let i = left; i <= right; i++) {
      res.push(nums[up][i]);
    }
    if (++up > down) break;

    // 从上往下
    for (let i = up; i <= down; i++) {
      res.push(nums[i][right]);
    }
    if (--right < left) break;

    //从右往左
    for (let i = right; i >= left; i--) {
      res.push(nums[down][i]);
    }
    if (up > --down) break;

    // 从下往上
    for (let i = down; i >= up; i--) {
      res.push(nums[i][left]);
    }
    if (++left > right) break;
  }
  return res;
}
```

## [19.每日温度](https://leetcode.cn/problems/daily-temperatures/)

```js
// 输入: temperatures = [73,74,75,71,69,72,76,73]
// 输出: [1,1,4,2,1,1,0,0]
function dailyTemp(nums) {
  if (!nums.length) return [];
  let len = nums.length;
  let res = new Array(len).fill(0);
  let stack = [0];
  for (let i = 0; i < len; i++) {
    let cur = nums[i];
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
  return res;
}
dailyTemp([73, 74, 75, 71, 69, 72, 76, 73]);
```

## [20. 二叉树的直径](https://leetcode.cn/problems/diameter-of-binary-tree/)

```js
// 给你一棵二叉树的根节点，返回该树的 直径 。
// 二叉树的 直径 是指树中任意两个节点之间最长路径的 长度 。这条路径可能经过也可能不经过根节点 root 。
// 两节点之间路径的 长度 由它们之间边数表示。

var diameterOfBinaryTree = function (root) {
  if (!root) return 0;
  let total = 0;
  var dfs = (root) => {
    if (!root) return 0;
    let left = dfs(oot.left);
    let right = dfs(root.right);
    total = Math.max(total, left + right);
    return 1 + Math.max(left, right);
  };
  dfs(root);
  return total;
};
```

## 24.背包问题

```js
function weightBag(weight, value, size) {
  let len = weight.length;
  let dp = new Array(len).fill().map(() => new Array(size + 1).fill(0));
  // 首行设置0
  for (let i = weight[0]; i <= size; i++) {
    dp[0][i] = value[0];
  }
  // 注意遍历顺序
  for (let i = 1; i < len; i++) {
    for (let j = 0; j <= size; j++) {
      if (weight[i] > j) {
        dp[i][j] = dp[i - 1][j];
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i - 1][j - weight[i]] + value[i]);
      }
    }
  }
  console.table(dp);
  return dp[len - 1][size];
}
weightBag([1, 3, 4], [15, 20, 30], 6);
```

## 25.多个数组交集

```js
/**
 * 多个数组交集 [[3,1,2,4,5],[1,2,3,4],[3,4,5,6]]
 */
// 横向扫描
function intersect2(nums) {
  if (!nums.length) return [];
  let prefix = nums[0];
  for (let i = 1; i < nums.length; i++) {
    prefix = findT(prefix, nums[i]);
    if (prefix.length == 0) break;
  }
  return prefix;
}
function findT(a, b) {
  let ans = [];
  for (let item of a) {
    let index = b.indexOf(item);
    if (index > -1) {
      ans.push(item);
      b.splice(index, 1);
    }
  }
  return ans;
}
intersect2([
  [3, 1, 2, 4, 5],
  [1, 2, 3, 4],
  [3, 4, 5, 6],
]);

// hash
function intersect3(nums) {
  let m = new Map();
  let ans = [];
  for (let item of nums) {
    for (let i of item) {
      if (!m.has(i)) {
        m.set(i, 0);
      }
      let count = m.get(i);
      m.set(i, count + 1);
    }
  }
  for (let [key, value] of m.entries()) {
    if (value == nums.length) {
      ans.push(key);
    }
  }
  return ans;
}
intersect3([
  [3, 1, 2, 4, 5],
  [1, 2, 3, 4],
  [3, 4, 5, 6],
]);
```

## [26.删除有序数组中的重复项](https://leetcode.cn/problems/remove-duplicates-from-sorted-array/)

```js
// 输入：nums = [0,0,1,1,1,2,2,3,3,4]
// 输出：5, nums = [0,1,2,3,4]
/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function (nums) {
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] == nums[i + 1]) {
      const v = nums.splice(i, 1);
      i--;
    }
  }
  return nums.length;
};
removeDuplicates([1, 1, 2]);
function removeDuplicates2(nums) {
  if (nums.length == 0) return 0;
  let slow = 0,
    fast = 1;
  while (fast < nums.length) {
    if (nums[fast] != nums[slow]) {
      slow = slow + 1;
      nums[slow] = nums[fast];
    }
    fast = fast + 1;
  }
  return slow + 1;
}
//[1,4,1,6]
function once(nums) {
  nums.sort((a. b) => a-b)
  let ans = []
  for(let i=0;i<nums.length;i++) {
    if (nums[i] != nums[i++]) {
      ans.push(nums[i++])
    } else {
      if (ans.length) {
        ans.pop()
      }
    }
  }
  return ans
}
```

## 27.不定长二维数组全排列

```js
//  [['A', 'B'],[1, 2],['a', 'b']]
function allPer(nums) {
  let ans = [];
  let backTrack = (nums, path, row) => {
    if (nums.length === path.length) {
      ans.push(path.slice().join(''));
      return;
    }
    for (let i = 0; i < nums[row].length; i++) {
      path.push(nums[row][i]);
      backTrack(nums, path, row + 1);
      path.pop();
    }
  };
  backTrack(nums, [], 0);
  return ans;
}
allPer([
  ['A', 'B'],
  [1, 2],
  ['a', 'b'],
]);
```

## [28.字符串相乘](https://leetcode.cn/problems/multiply-strings/)

```js
var multiply = function (num1, num2) {
  let m = num1.length,
    n = num2.length;
  let res = new Array(m + n).fill(0);
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      let mul = +num1[i] * +num2[j];
      let p1 = i + j;
      let p2 = i + j + 1; // 最靠右边
      let sum = res[p2] + mul;
      res[p2] = sum % 10;
      res[p1] = res[p1] + Math.floor(sum / 10);
    }
  }
  // res [0,'7','2','6']
  while (res[0] == 0) {
    res.shift();
  }
  return res.length ? res.join('') : '0';
};
multiply('22', '33');
```

## [29.完全平方数](https://leetcode.cn/problems/perfect-squares/)

```js
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

// 先遍历物品 在遍历背包
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
```

## 30.单词拆分

```js
// leetcode => ['leet', 'code']
// 输入: s = "leetcode", wordDict = ["leet", "code"]
// 输出: true
// 解释: 返回 true 因为 "leetcode" 可以被拆分成 "leet code"。
function wordSplit(s, words) {
  let dp = new Array(s.length + 1).fill(false);
  dp[0] = true;
  // 排列 先遍历背包 在遍历物品
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
}
```

## [31.无重叠区间](https://leetcode.cn/problems/non-overlapping-intervals/)

## [32.寻找两个正序数组的中位数](https://leetcode.cn/problems/median-of-two-sorted-arrays/description/)

## [33.分发糖果](https://leetcode.cn/problems/candy/description/)

```js
/**
 * @param {number[]} ratings
 * @return {number}
 */
var candy = function (ratings) {
  let len = ratings.length;
  const candy = new Array(len).fill(1);
  // 右边比左边大 正序遍历
  for (let i = 1; i < len; i++) {
    if (ratings[i] > ratings[i - 1]) {
      candy[i] = candy[i - 1] + 1;
    }
  }
  // 左边比右边大 倒序遍历
  for (let i = len - 2; i >= 0; i--) {
    if (ratings[i] > ratings[i + 1]) {
      candy[i] = Math.max(candy[i], candy[i + 1] + 1);
    }
  }
  return candy.reduce((a, b) => a + b);
};
```

## [34.最长递增子序列](https://leetcode.cn/problems/longest-increasing-subsequence/)

```js
// 输入：nums = [10,9,2,5,3,7,101,18]
// 输出：4
// 解释：最长递增子序列是 [2,3,7,101]，因此长度为 4 。
function longestUpChildSeq(nums) {}
```

## [35.最长连续递增序列](https://leetcode.cn/problems/longest-continuous-increasing-subsequence/description/)

```js
// 贪心算法
var findLengthOfLCIS = function (nums) {
  let ans = 1;
  let count = 1;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > nums[i - 1]) {
      count = count + 1;
    } else {
      count = 1;
    }
    ans = Math.max(ans, count);
  }
  return ans;
};
// dp解法
```

## [36.最长公共子序列](https://leetcode.cn/problems/longest-common-subsequence/description/)

```js
/**
输入：text1 = "abcde", text2 = "ace" 
输出：3  
解释：最长公共子序列是 "ace" ，它的长度为 3 。
 */
var longestCommonSubsequence = function (text1, text2) {
  let [len1, len2] = [text1.length, text2.length];
  let dp = new Array(len1 + 1).fill().map(() => new Array(len2 + 1).fill(0));
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (text1[i - 1] == text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[len1][len2];
};
```

## 37.最小路径和

```js
/**
 * 给定一个包含非负整数的 m x n 网格 grid ，请找出一条从左上角到右下角的路径，使得路径上的数字总和为最小。说明：每次只能向下或者向右移动一步。
 * 输入：grid = [[1,3,1],[1,5,1],[4,2,1]
 * 输出：7
 * 解释：因为路径 1→3→1→1→1 的总和最小。
 */
// 最小路径和
var minPathSum = function (grid) {
  let [m, n] = [grid.length, grid[0].length];
  let dp = new Array(m).fill().map(() => new Array(n).fill(0));
  dp[0][0] = grid[0][0];
  // 首行
  for (let i = 1; i < n; i++) {
    dp[0][i] = dp[0][i - 1] + grid[0][i];
  }
  // 首列
  for (let j = 1; j < m; j++) {
    dp[j][0] = dp[j - 1][0] + grid[i][0];
  }
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j];
    }
  }
  return dp[m - 1][n - 1];
};
```

## [38.移动 0](https://leetcode.cn/problems/move-zeroes/)

### 第一种非 0 的移动到前面，用 j 记录下 然后在遍历 j,替换成 0

```js
// [1,0,22,3,1,0] => [1,22,3,1,0,0]
function moveZero(nums) {
  let j = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] != 0) {
      nums[j] = nums[i];
      j++;
    }
  }
  for (let i = j; i < nums.length; i++) {
    nums[i] = 0;
  }
  return nums;
}
moveZero([1, 0, 22, 3, 1, 0]);
```

### 第二种，一边移动一边删除 同时增加 0

```js
// [1,0,22,3,1,0] => [1,22,3,1,0,0]
function moveZero(nums) {
  for (let i = 0; i < nums.length; i++) {
    let index = nums.indexOf(nums[i]);
    if (index > -1) {
      nums.splice(index, 1);
      nums.push(0);
    }
  }
  return nums;
}
```

### 第三种,参考快排思想

```js
function moveZero(nums) {
  let j = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] != 0) {
      let temp = nums[i];
      nums[i] = nums[j];
      nums[j] = temp;
      j = j + 1;
    }
  }
}
```

## 39.最长有效括号(连续)

```js
// ()) ((())
function findLongestValid(str) {
  let stack = [-1];
  let max = 0;
  for (let i = 0; i < str.length; i++) {
    let s = str[i];
    if (s == '(') {
      stack.push(i);
    } else {
      stack.pop();
      if (stack.length == 0) {
        stack.push(i);
      } else {
        max = Math.max(max, i - stack.slice(-1));
      }
    }
  }
  return max;
}
```

## 40.判断子序列

```js
输入：s = "abc", t = "ahbgdc"
输出：true
输入：s = "axc", t = "ahbgdc"
输出：false

function isChildSeq(s, t) {
  if (s.length == 0) return true;
  let j = 0;
  for (let i = 0; i < t.length; i++) {
    if (s[j] == t[i]) {
      j = j + 1;
      // 如何s的长度 == j 则完全包含
      if (j == s.length) {
        return true;
      }
    }
  }
  return false;
}
isChildSeq('abc', 'ahbgdc');
// dp
function isChild(s, t) {
  let [m, n] = [s.length, t.length];
  let dp = new Array(m).fill().map(() => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s[i - 1] == t[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = dp[i][j - 1] + 1;
      }
    }
  }
  return dp[m][n] == m ? true : false;
}
```

## 41.不同的子序列

## [42.两个字符串的删除操作](https://leetcode.cn/problems/delete-operation-for-two-strings/)

```js
/**
 * 输入: "sea", "eat"
 * 输出: 2
 * 解释: 第一步将"sea"变为"ea"，第二步将"eat"变为"ea"
 */
function twoCharDelete(a, b) {
  let [m, n] = [a.length, b.length];
  let dp = new Array(m + 1).fill().map(() => new Array(n + 1).fill(0));
  // 首列初始化
  for (let i = 0; i <= m; i++) {
    dp[i][0] = i;
  }
  // 首行初始化
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] == b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + 2);
      }
    }
  }
  return dp[m][n];
}
```

## 43.杨辉三角形

```js
function generate(n) {
  let dp = [];
  for (let i = 0; i < n; i++) {
    dp[i] = new Array(i + 1).fill(1);
    for (let j = 1; j < i; j++) {
      dp[i][j] = dp[i - 1][j - 1] + dp[i - 1][j];
    }
  }
  return dp;
}
generate(5);
```

## [44.最长重复子数组](https://leetcode.cn/problems/maximum-length-of-repeated-subarray/description/)

```js
/**
输入：nums1 = [1,2,3,2,1],
     nums2 = [3,2,1,4,7]
输出：3
解释：长度最长的公共子数组是 [3,2,1] 。
 */
var findLength = function (nums1, nums2) {
  const [len1, len2] = [nums1.length, nums2.length];
  let dp = new Array(len1 + 1).fill().map(() => new Array(len2 + 1).fill(0));
  let max = 0;
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (nums1[i - 1] == nums2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      }
      max = Math.max(dp[i][j], max);
    }
  }
  return max;
};
findLength([1, 2, 3, 2, 1], [3, 2, 1, 4, 7]);
```

## [45.最小覆盖子串](https://leetcode.cn/problems/minimum-window-substring/description/)

## [47.和为 K 的子数组](https://leetcode.cn/problems/subarray-sum-equals-k/)

> (前缀和)

```js
// 给你一个整数数组 nums 和一个整数 k ，请你统计并返回 该数组中和为 k 的子数组的个数 。
// 子数组是数组中元素的连续非空序列。
// 输入：nums = [1,1,1], k = 2
// 输出：2
var subArraySum = function (nums, k) {
  let sum = 0,
    count = 0;
  let m = new Map([[0, 1]]);
  for (let num of nums) {
    sum += num;
    if (m.has(sum - k)) {
      count += m.get(sum - k);
    }
    if (m.has(sum)) {
      m.set(sum, m.get(sum) + 1);
    } else {
      m.set(sum, 1);
    }
  }
};
```

## 48.滑动窗口最大值

## 49.除自身以外数组的乘积

```js
function mul(arr) {
  // I左边的相乘 在乘以I右边的
  let right = 1;
  let len = arr.length;
  let res = [1];

  for (let i = 1; i < len; i++) {
    res[i] = res[i - 1] * arr[i - 1];
  }
  for (let j = len - 1; j >= 0; j--) {
    res[j] *= right;
    right *= arr[j];
  }
  return res;
}
// [24, 12, 8, 6]
mul([1, 2, 3, 4]);
```

## 50.旋转图像

## [51.分发饼干](https://leetcode.cn/problems/assign-cookies/description/)

> 尽量用大饼干喂胃口大的孩子

```js
/**
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
  let gLen = g.length - 1;
  for (let i = gLen; i >= 0; i--) {
    let item = g[i];
    if (sLen >= 0 && s[sLen] >= item) {
      count++;
      sLen--;
    }
  }
  return count;
};
```

## 52.跳跃游戏

```js
// first
function canJump(nums) {
  let len = nums.length;
  let distance = len - 1;
  let max = nums[0];
  for (let i = 0; i < len; i++) {
    let cur = nums[i];
    if (max >= distance) return true;
    max = Math.max(max, cur + i);
  }
  return false;
}
// second
function canJump(nums) {
  let len = nums.length;
  let distance = len - 1;
  let cover = 0;
  for (let i = 0; i <= cover; i++) {
    cover = Math.max(cover, i + nums[i]);
    if (cover >= distance) {
      return true;
    }
  }
  return false;
}
```
