/**
 * 1.如何判断两个数组内容相等
 * 2.螺旋矩阵
 * 3.最长的有效括号
 * 4.和为k的子数组
 * 5.计算乘积除以当前项
 * 6.把数组平分，实现 fn,跟上面相反
 * 7.k个一组链表反转
 * 8.分割回文串
 * 9.电话号码组合
 * 10.移动0
 * 11.轮转数组
 */

function rotate2(arr, k) {
  let len = arr.length;
  k %= len;
  // 旋转所有
  reverseK(arr, 0, len - 1);
  // 旋转0，k-1
  reverseK(arr, 0, k - 1);
  // 旋转k到后面
  reverseK(arr, k, len - 1);
}
function reverseK(arr, l, r) {
  while (l < r) {
    let tmp = arr[l];
    arr[l] = arr[r];
    arr[r] = tmp;
    l++;
    r--;
  }
}

function rotate(arr, k) {
  let ans = [];
  let len = arr.length;
  for (let i = 0; i < len; i++) {
    ans[(k + i) % len] = arr[i];
  }
  for (let i = 0; i < arr.length; i++) {
    arr[i] = ans[i];
  }
  return arr;
}
rotate([1, 2, 3, 4, 5], 2);
/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var moveZeroes = function (nums) {
  let arr = [];
  let j = 0;
  for (let num of nums) {
    if (num != 0) {
      arr.push(num);
      j++;
    }
  }
  for (let i = j; i < nums.length; i++) {
    arr.push(0);
  }
  console.log(arr, 'arr', j);
};
var moveZeroes = function (nums) {
  let len = nums.length;
  for (let i = 0; i < len; i++) {
    let cur = nums[i];
    let index = nums.indexOf(cur);
    if (index > -1 && cur == 0) {
      nums.splice(index, 1);
      nums.push(0);
    }
  }
  return nums;
};
moveZeroes([0, 1, 0, 3, 12]);

/**
输入：s = "aab"
输出：[["a","a","b"],["aa","b"]]
 * @param {string} s
 * @return {string[][]}
 */
var partition = function (s) {
  let ans = [];
  let len = s.length;
  var backTrack = (path, start) => {
    if (path <= len && start == len) {
      ans.push(path.slice());
      return;
    }
    for (let i = start; i < len; i++) {
      let cur = s.slice(start, i + 1);
      if (isValid(cur)) {
        path.push(cur);
        backTrack(path, i + 1);
        path.pop();
      }
    }
  };
  backTrack([], 0);
  return ans;
};
function isValid(str) {
  let a = str.split('').reverse().join('');
  return a == str;
}

function revertIp(s) {
  let ans = [];
  let len = s.length;
  var backTrack = (path, start) => {
    if (start == len && path.length == 4) {
      ans.push(path.slice().join('.'));
      return;
    }
    for (let i = start; i < len; i++) {
      let cur = s.slice(start, i + 1);
      if (+cur > 255 || cur.length > 3) continue;
      if (cur.length == 2 && cur[0] == '0') continue;
      path.push(cur);
      backTrack(path, i + 1);
      path.pop();
    }
  };
  backTrack([], 0);
  return ans;
}
revertIp('0000');

function noLenArr(arr) {
  let ans = [];
  let backTrack = (path, start) => {
    if (path.length == arr.length) {
      ans.push(path.slice().join(''));
      return;
    }
    for (let i = 0; i < arr[start].length; i++) {
      let cur = arr[start][i];
      path.push(cur);
      backTrack(path, start + 1);
      path.pop();
    }
  };
  backTrack([], 0);
  return ans;
}
noLenArr([
  [1, 2],
  ['a', 'b', 'c'],
]);

/**
 * @param {string} digits
 * @return {string[]}
 */
var letterCombinations = function (digits) {};

function mockNew(fn, ...rest) {
  let target = Object.create(fn.prototype);
  let res = fn.apply(target, rest);
  return res instanceof Object ? res : target;
}

// 1,2,3,4,5 2
// 2,1,4,3,5
function reverseK(head, k) {
  let dummy = { next: head, val: null };
  let pre = dummy;
  let cur = head;
  let len = 0;
  while (head) {
    head = head.next;
    len++;
  }
  let kLen = Math.floor(len / k);
  for (let i = 0; i < kLen; i++) {
    for (let j = 0; j < k - 1; j++) {
      // 保存2
      let tmp1 = cur.next;
      cur.next = cur.next.next;
      cur.next.next = pre.next;
      pre.next = tmp1;
    }
    pre = cur;
    cur = pre.next;
  }
  return dummy.next;
}

var array = [0, 1, 2, 3, 4];

var ruleFn = (item, index, array) => {
  return item % 2 == 0 ? 'odd' : 'even';
};

Array.prototype.group = function (fn) {
  let arr = this || [];
  let res = {};
  for (let i = 0; i < arr.length; i++) {
    let cur = fn.call(this, arr[i], i, arr);
    res[cur] = res[cur] && res[cur].length ? [arr[i], ...res[cur]] : [arr[i]];
  }
  return res;
};
console.log(array.group(ruleFn), 'array.group(ruleFn);');
//结果如下

// {odd:[1,3],even:[0,2,4]}

fn(); //结果为[[1,2],[3,4],[5]]
function flattenObj(arr, count) {
  let stack = [...arr];
  let res = [];
  while (stack.length) {
    let arr = [];
    for (let i = 0; i < count; i++) {
      let cur = stack.shift();
      if (cur) {
        arr.push(cur);
      }
    }
    res.push(arr);
  }
  return res;
}
flattenObj([1, 2, 3, 4, 5], 2);
function flattenObj1(arr, depth) {
  let stack = [...arr];
  let start = 0;
  let res = [];
  while (stack.length) {
    let cur = stack.pop();
    if (Array.isArray(cur) && start < depth) {
      stack.push(...cur);
      start++;
    } else {
      res.push(cur);
    }
  }
  return res;
}
//计算乘积除以当前项
//传参 [1,2,3,4]
//输出 [24,12,8,6]
function mul(arr) {
  let total = arr.reduce((pre, cur) => pre * cur, 1);
  let ans = [];
  for (let item of arr) {
    let cur = total / item;
    ans.push(cur);
  }
  return ans;
}
mul([4, 2, 2, 1]);
function mul(arr) {
  // 先处理i左边 在处理i右边
  let res = [1];
  let right = 1;
  let len = arr.length;
  for (let i = 1; i < len; i++) {
    res[i] = res[i - 1] * arr[i - 1];
  }
  for (let j = len - 1; j >= 0; j--) {
    res[j] *= right;
    right *= arr[j];
  }
  return res;
}
mul([4, 2, 2, 1]);

/**
输入：s = "(()"
输出：2
解释：最长有效括号子串是 "()"
 */
function isValidStr(s) {
  if (s.length < 2) return 0;
  let stack = [-1];
  let max = 0;
  for (let i = 0; i < s.length; i++) {
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
}

function isSameArr(a, b) {
  if (a.length != b.length) return false;
  let m = new Map();
  // a塞到m
  for (let item of a) {
    if (m.has(item)) {
      m.set(item, m.get(item) + 1);
    } else {
      m.set(item, 1);
    }
  }
  for (let item of b) {
    let val = m.get(item);
    if (val == undefined || val < 1) return false;
    m.set(item, val - 1);
  }
  return true;
}
