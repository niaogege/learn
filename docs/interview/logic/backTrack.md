---
title: 回溯
order: 10
group:
  order: 3
  title: 算法
  path: /interview/logic
nav:
  order: 3
  title: 'interview'
  path: /interview
---

感谢卡子哥提供的技术支持[代码随想录](https://programmercarl.com/%E5%9B%9E%E6%BA%AF%E7%AE%97%E6%B3%95%E7%90%86%E8%AE%BA%E5%9F%BA%E7%A1%80.html#%E9%A2%98%E7%9B%AE%E5%88%86%E7%B1%BB%E5%A4%A7%E7%BA%B2%E5%A6%82%E4%B8%8B)

### 题目

- [46.全排列](https://leetcode.cn/problems/permutations/)
- [77.组合](https://leetcode.cn/problems/combinations/)
- [17.电话号码组合](https://leetcode.cn/problems/letter-combinations-of-a-phone-number/)
- [39. 组合总和](https://leetcode.cn/problems/combination-sum/)
- [40. 组合总和 II](https://leetcode.cn/problems/combination-sum-ii)
- [131.分割回文串](https://leetcode.cn/problems/palindrome-partitioning/)
- [93. 复原 IP 地址](https://leetcode.cn/problems/restore-ip-addresses/)
- [78. 子集](https://leetcode.cn/problems/subsets/)
- [491. 递增子序列](https://leetcode.cn/problems/increasing-subsequences/)
- [47. 全排列 II](https://leetcode.cn/problems/permutations-ii/)
- [22. 括号生成](https://leetcode.cn/problems/generate-parentheses/)
- [79. 单词搜索](https://leetcode.cn/problems/word-search/)

### 模板

```js
const backTrack = (arr, temp, i) => {
  if (temp.length === arr.length) {
    res.push(temp.slice())
    return
  }
  for (let i = 0; i < arr.length; i ++) {
    if () {
      temp.push(arr[i])
      backTrack(arr, temp, i)
      temp.pop()
    }
  }
}

```

### [46.全排列](https://leetcode.cn/problems/permutations/)

```js
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permute = function (nums) {
  var res = [];
  var used = new Array(nums.lengtg);
  var backTrack = (path) => {
    if (path.length === nums.length) {
      res.push(path);
      return false;
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      path.push(nums[i]);
      backTrack(path.slice());
      path.pop();
      used[i] = false;
    }
  };
  backTrack([]);
  return res;
};
```

### [77.组合](https://leetcode.cn/problems/combinations/)

给定两个整数 n 和 k，返回范围 [1, n] 中所有可能的 k 个数的组合。

你可以按 任何顺序 返回答案。

```js
输入：n = 4, k = 2
输出：
[
  [2,4],
  [3,4],
  [2,3],
  [1,2],
  [1,3],
  [1,4],
]
```

```js
/**
 * @param {number} n
 * @param {number} k
 * @return {number[][]}
 */
var combine = function (n, k) {
  var res = [];
  const backTrack = (n, temp = [], len, i) => {
    if (temp.length === len) {
      res.push(temp.slice());
      return;
    }
    for (let i = 0; i < n; i++) {
      if (!temp.includes(n)) {
        temp.push(n);
        backTrack(n, temp, len, i);
        temp.pop();
      }
    }
  };
  return res;
};
```

### [17.电话号码组合](https://leetcode.cn/problems/letter-combinations-of-a-phone-number/)

给定一个仅包含数字  2-9  的字符串，返回所有它能表示的字母组合。答案可以按 任意顺序 返回。

给出数字到字母的映射如下（与电话按键相同）。注意 1 不对应任何字母。

```js
/**
 * @param {string} digits
 * @return {string[]}
 */
var letterCombinations = function (digits) {
  if (digits === '') return [];
  var m = new Map([
    ['2', 'abc'],
    ['3', 'def'],
    ['4', 'ghi'],
    ['5', 'jkl'],
    ['6', 'mno'],
    ['7', 'pqrs'],
    ['8', 'tuv'],
    ['9', 'wxyz'],
  ]);
  var res = [];
  var arr = digits.length > 0 ? digits.split('') : [digits];
  var backTrack = (temp, start) => {
    if (temp.length > arr.length) return;
    if (arr.length === temp.length) {
      console.log(temp);
      res.push(temp.slice().join(''));
      return;
    }
    for (let i = start; i < arr.length; i++) {
      var vals = m.get(arr[i]);
      for (let j = 0; j < vals.length; j++) {
        temp.push(vals[j]);
        backTrack(temp, i + 1);
        temp.pop();
      }
    }
  };
  backTrack([], 0);
  return res;
};
```

优化下

```js
var letterCombinations = function (digits) {
  const len = digits.length;
  const map = ['', '', 'abc', 'def', 'ghi', 'jkl', 'mno', 'pqrs', 'tuv', 'wxyz'];
  if (!len) return [];
  if (len === 1) return map[digits].split('');
  const res = [],
    path = [];
  backTrack(digits, len, 0);
  return res;
  function backTrack(n, k, start) {
    if (k === path.length) {
      res.push(path.slice().join(''));
      return;
    }
    for (const v of map[n[start]]) {
      path.push(v);
      backTrack(n, k, start + 1);
      path.pop();
    }
  }
};
```

### [39. 组合总和](https://leetcode.cn/problems/combination-sum/)

```js
/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
var combinationSum = function (candidates, target) {
  var res = [],
    path = [];
  var backTrack = (sum, start) => {
    if (sum > target) return;
    if (sum === target) {
      res.push(path.slice());
      return;
    }
    for (let i = start; i < candidates.length; i++) {
      var val = candidates[i];
      path.push(val);
      backTrack(sum + val, i);
      path.pop();
    }
  };
  backTrack(0, 0);
  return res;
};
```

### [40. 组合总和 II](https://leetcode.cn/problems/combination-sum-ii)

给定一个候选人编号的集合  candidates  和一个目标数  target ，找出  candidates  中所有可以使数字和为  target  的组合。

candidates  中的每个数字在每个组合中只能使用   一次  。

注意：解集不能包含重复的组合。  示例

```js
输入: candidates = [10,1,2,7,6,1,5], target = 8,
输出:
[
[1,1,6],
[1,2,5],
[1,7],
[2,6]
]
```

答案：

```js
var combinationSum2 = function (candidates, target) {
  candidates = candidates.sort((a, b) => a - b);
  var res = [],
    path = [];
  var backTrack = (start, sum) => {
    if (sum > target) return;
    if (sum === target) {
      res.push(path.slice());
      return;
    }
    for (let i = start; i < candidates.length; i++) {
      var val = candidates[i];
      // 去掉重复的值
      if (i - start > 0 && candidates[i - 1] === candidates[i]) {
        continue;
      }
      path.push(val);
      backTrack(i + 1, sum + val);
      path.pop();
    }
  };
  backTrack(0, 0);
  return res;
};
```

### [131.分割回文串](https://leetcode.cn/problems/palindrome-partitioning/)

需要解决的难点： 1.切割问题 2.回文的判断

先判断是不是有效的回文字符串，再去切割

#### 回溯三部曲

- 递归函数参数本题递归函数参数还需要**startIndex**，因为切割过的地方，不能重复切割，和组合问题也是保持一致的。

- 递归函数的终止条件

切割线切到了字符串最后面，说明找到了一种切割方法，此时就是本层递归的终止终止条件。

```js
if (startIndex >= s.length) {
  res.push(path.slice());
  return;
}
```

- 单层搜索逻辑

在递归循环中，如何截取子串呢

```js
for (let i = start; i < length; i++) {
  if (isPalindrome(s, start, i)) {
    var str = s.substr();
  }
}
```

- 判断回文

可以使用双指针法，一个指针从前向后，一个指针从后先前，如果前后指针所指向的元素是相等的，就是回文字符串了。

```js
function isPalindrome(s, start, end) {
  for (let i = start, j = end; i < j; i++, j--) {
    if (s[i] !== s[j]) {
      return false;
    }
  }
  return true;
}
```

最终答案

```js
var partition = function (s) {
  if (s.length <= 1) return [s];
  var res = [],
    path = [];
  var len = s.length;
  var backTrack = (start) => {
    if (path.length > len) return;
    if (start >= s.length) {
      res.push(path.slice());
    }
    for (let i = start; i < len; i++) {
      if (isPalindrome(s, start, i)) {
        //   var val = s.substr(start, i - start + 1); // ok
        //   var val1 = s.slice(start, i+1); // ok
        var val2 = s.substring(start, i + 1);
        path.push(val2);
        backTrack(i + 1);
        path.pop();
      }
    }
  };
  backTrack(0);
  return res;
};
function isPalindrome(s, start, end) {
  for (let i = start, j = end; i < j; i++, j--) {
    if (s[i] !== s[j]) {
      return false;
    }
  }
  return true;
}
```

### [93. 复原 IP 地址](https://leetcode.cn/problems/restore-ip-addresses/)

有效 IP 地址 正好由四个整数（每个整数位于 0 到 255 之间组成，且不能含有前导 0），整数之间用 '.' 分隔。

例如："0.1.2.201" 和 "192.168.1.1" 是 有效 IP 地址，但是 "0.011.255.245"、"192.168.1.312" 和 "192.168@1.1" 是 无效 IP 地址。给定一个只包含数字的字符串 s ，用以表示一个 IP 地址，返回所有可能的有效 IP 地址，这些地址可以通过在 s 中插入  '.' 来形成。你 不能   重新排序或删除 s 中的任何数字。你可以按 任何 顺序返回答案。

```js
输入：s = "25525511135"
输出：["255.255.11.135","255.255.111.35"]
```

递归三部曲

- 递归函数参数

startIndex 一定是需要的，因为不能重复分割，记录下一层递归分割的起始位置

- 终止条件

分割结束且 path 数组个数===4

```js
if (startIndex === screen.length && path.length === 4) {
  res.push(path.slice().join('.'));
  return;
}
```

- 单层搜索逻辑需要剪枝
- 如果当前值的个数>3 或者数值大于 255，则退出当前阶段循环
- 如果当前值个数>1 且首个数字等于 0，则退出

最终答案

```js
/**
 * @param {string} s
 * @return {string[]}
 */
var restoreIpAddresses = function (s) {
  var res = [],
    path = [];
  var backTrack = (start) => {
    if (path.length > 4) return;
    if (path.length === 4 && start === s.length) {
      res.push(path.join('.'));
      return;
    }
    for (let i = start; i < s.length; i++) {
      var str = s.substr(start, i - start + 1);
      if (str.length > 3 || +str > 255) break;
      if (str.length > 1 && str[0] === '0') break;
      path.push(str);
      backTrack(i + 1);
      path.pop();
    }
  };
  backTrack(0);
  return res;
};
```

### [78. 子集](https://leetcode.cn/problems/subsets/)

给你一个整数数组 nums ，数组中的元素 互不相同 。返回该数组所有可能的子集（幂集）。

解集 不能 包含重复的子集。你可以按 任意顺序 返回解集。

```js
输入：nums = [1,2,3]
输出：[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
```

结果：

```js
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var subsets = function (nums) {
  var res = [],
    path = [];
  var backTrack = (start) => {
    if (path.length > nums.length) return;
    res.push(path.slice());
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      backTrack(i + 1);
      path.pop();
    }
  };
  backTrack(0);
  return res;
};
```

### [491. 递增子序列](https://leetcode.cn/problems/increasing-subsequences/)

#### 解题思路

![image.png](https://pic.leetcode-cn.com/1661699038-hnMqwX-image.png)

#### 代码

回溯三部曲

- 递归函数参数一个元素不能重复使用，所以需要 start，调整下一层递归的起始位置

- 递归函数的终止条件

题目要求递增子序列大小至少为 2

```js
if (path.length >= 2) {
  res.push(path.slice());
  // 注意这里没有return 还要继续取树上节点
}
```

- 单层搜索逻辑

同一父节点下的同层上使用过的元素就不能在使用了，这里需要一种 Set 数据格式，来存储每个合格的 path,下次遇到重复的不加入 path 即可

同时还要满足递增的要求，即 path 的最好一项要大于当前，否则也是不加入 path,

即当使用过或者 path 的最好一项要小于当前两个条件任意满足一个就需要结束本轮循环

```js
let m = new Set();
for (let i = start; i < length; i++) {
  let cur = nums[i];
  if ((path.length && path[path.length - 1] < cur) || m.has(cur)) {
    continue;
  }
  m.add(cur);
  path.push(cur);
  backTrack(i + 1);
  path.pop();
}
```

最终代码如下：

```javascript
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var findSubsequences = function (nums) {
  var res = [];
  var backTrack = (start, path) => {
    if (path.length >= 2) {
      res.push(path.slice());
    }
    var m = new Set();
    for (let i = start; i < nums.length; i++) {
      const val = nums[i];
      if ((path.length && val < path[path.length - 1]) || m.has(val)) {
        continue;
      }
      m.add(val);
      path.push(val);
      backTrack(i + 1, path);
      path.pop();
    }
  };
  backTrack(0, []);
  return res;
};
```

### [47. 全排列 II](https://leetcode.cn/problems/permutations-ii/)

给定一个可包含**重复**数字的序列 nums ，按任意顺序 返回所有不重复的全排列。

> 去重一定要对元素进行排序，这样我们才方便通过相邻的节点来判断是否重复使用了。

示例

```js
输入：nums = [1,1,2]
输出：
[[1,1,2],
 [1,2,1],
 [2,1,1]]
```

基础版

最难理解的一点是

```js
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permuteUnique = function (nums) {
  nums.sort((a, b) => a - b);
  var res = [],
    path = [],
    used = new Array(nums.length).fill(false);
  var backTrack = () => {
    console.log(path, 'path');
    if (path.length === nums.length) {
      res.push(path.slice());
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (i > 0 && nums[i] === nums[i - 1]) continue;
      if (!used[i]) {
        used[i] = true;
        path.push(nums[i]);
        backTrack();
        path.pop();
        used[i] = false;
      }
    }
  };
  backTrack();
  return res;
};
```

set 去重

```js
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permuteUnique = function (nums) {
  nums.sort((a, b) => a - b);
  const res = [],
    path = [],
    used = new Array(nums.length).fill(false);
  var backTrack = () => {
    if (path.length === nums.length) {
      res.push(path.slice());
      return;
    }
    var set = new Set();
    for (let i = 0; i < nums.length; i++) {
      if (set.has(nums[i])) continue;
      if (!used[i]) {
        used[i] = true;
        set.add(nums[i]);
        path.push(nums[i]);
        backTrack();
        path.pop();
        used[i] = false;
      }
    }
  };
  backTrack();
  return res;
};
```
