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
 * 5.最长公共子序列
 * 6.阶乘(迭代/递归/缓存)
 * 7.打家劫舍
 * 8.零钱兑换
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
 * 24.背包问题
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
