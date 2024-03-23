/**
 * 1.如何判断两个数组内容相等
 * 2.螺旋矩阵
 * 3.最长的有效括号
 * 4.和为k的子数组
 * 5.计算乘积除以当前项
 * 6.把数组平分，实现 fn,跟上面相反
 * 7.k个一组链表反转
 */
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
