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
 * 3.重排链表
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

## 3.重排链表

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

## 7.打家劫舍

```js

```

## 8.零钱兑换

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
function layerSum(root) {}

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
      let p1 = i + j; // 0
      let p2 = i + j + 1; // 1
      let sum = res[p2] + mul; // 6
      res[p2] = sum % 10; // 6
      res[p1] = res[p1] + Math.floor(sum / 10); // 0
    }
  }
  while (res[0] == 0) {
    res.shift();
  }
  return res.length ? res.join('') : '0';
};
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

## [34.最长递增子序列](https://leetcode.cn/problems/longest-increasing-subsequence/)

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
```

## 36.最长公共子序列

```js
// abc aebdc
```

## 37.最小路径和

```js
function minPathSum(arr) {}
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

### 第二种

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
```
