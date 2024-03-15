/**
 * 1.拼接url参数 和解析url
 * 2.用栈实现队列
 * 3.无限累加的函数
 * 4.最长公共前缀
 * 5.手写-如何找到数组中第一个没出现的最小正整数
 * 6.如何将文字超出元素的部分变成省略号
 * 7.useTimeout(fn, delay)
 * 8.数字转中文
 * 9.K 个一组链表反转
 * 10.岛屿的最大面积
 * 11.loadsh.get
 * 12.旋转数组
 * 13.不能使用新数组，给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。
 */

// 岛屿的最大面积
/**
给你一个大小为 m x n 的二进制矩阵 grid 。
岛屿 是由一些相邻的 1 (代表土地) 构成的组合，这里的「相邻」要求两个 1 必须在 水平或者竖直的四个方向上 相邻。你可以假设 grid 的四个边缘都被 0（代表水）包围着。
岛屿的面积是岛上值为 1 的单元格的数目。
计算并返回 grid 中最大的岛屿面积。如果没有岛屿，则返回面积为 0 。
 */
function maxArea(grid) {
  let max = 0;
  let r = grid.length;
  let c = grid[0].length;
  for (let i = 0; i < r; i++) {
    for (let j = 0; j < c; j++) {
      if (grid[i][j] == '1') {
        const count = dfs(grid, i, j);
        max = Math.max(max, count);
      }
    }
  }
  return count;
}
function dfs(grid, i, j) {
  if (!isArea(grid, i, j) || grid[i][j] != '1') return;
  grid[i][j] = '2';
  // 上下左右
  return 1 + dfs(grid, i - 1, j) + dfs(grid, i + 1, j) + dfs(grid, i, j - 1) + dfs(grid, i, j + 1);
}
function isArea(grid, i, j) {
  return i < grid.length && i >= 0 && j < grid[0].length && j >= 0;
}

// [1,2,3,4,5] [4,5,1,2,3]
function rotateArr(arr, k) {
  let ans = [];
  let len = arr.length;
  for (let i = 0; i < len; i++) {
    ans[(i + k) % len] = arr[i];
  }
  for (let j = 0; j < len; j++) {
    arr[j] = ans[j];
  }
  return arr;
}
rotateArr([1, 2, 3, 4, 5], 2);

// ['flower', 'flos', 'flll']
// 横向扫描
function findPublicHor(arr) {
  let len = arr.length;
  let prefix = arr[0];
  for (let i = 1; i < len; i++) {
    prefix = findTwo(prefix, arr[i]);
    if (prefix.length == '') {
      return '';
    }
  }
  return prefix;
}
function findTwo(a, b) {
  let [m, n] = [a.length, b.length];
  let max = Math.min(m, n);
  let i = 0;
  while (a[i] == b[i] && i < max) {
    i++;
  }
  return a.slice(0, i);
}
findPublicHor(['flower', 'flos', 'flll']);
function Zfind(arr) {
  let len = arr.length;
  let prefix = arr[0];
  for (let i = 0; i < prefix.length; i++) {
    for (let j = 0; j < len; j++) {
      if (prefix[i] != arr[j][i]) {
        return prefix.slice(0, i);
      }
    }
  }
  return '';
}
Zfind(['flower', 'flos', 'flll']);

// [1,2,0,3,4,0] => [1,2,3,4,0]
function moveZero(num) {
  let j = 0;
  for (let i = 0; i < num.length; i++) {
    if (num[i] != 0) {
      num[j] = num[i];
      j++;
    }
  }
  console.log(j, 'j');
  for (let i = j; i < num.length; i++) {
    num[i] = 0;
  }
  console.log(num);
}
moveZero([1, 2, 0, 3, 4, 0]);
function moveZero1(nums) {
  for (let i = 0; i < nums.length; i++) {
    const index = nums.indexOf(nums[i]);
    if (index > -1 && nums[i] == 0) {
      nums.splice(index, 1);
      nums.push(0);
    }
  }
  return nums;
}

// css:

// // flex:1
// flex-grow:1
// flex-shrink: 1
// flex-basis: 0

const useTimeout = (fn, delay) => {
  const fnRef = useRef();
  useEffect(() => {
    fnRef.current = fn;
  }, []);
  useEffect(() => {
    if (delay > 0) {
      let timer = setTimeout(() => {
        fnRef.current();
      }, delay);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [delay]);
};

class Queue {
  constructor() {
    this.stackIn = [];
    this.stackOut = [];
  }
  push(x) {
    this.stackIn.push(x);
  }
  pop() {
    if (this.stackOut.length == 0) {
      while (this.stackIn.length) {
        this.stackOut.push(this.stackIn.pop());
      }
    }
    return this.stackOut.pop();
  }
  peak() {
    let x = this.pop();
    this.stackOut.push(x);
    return x;
  }
  isEmpty() {
    return !this.stackIn.length && !this.stackOut.length;
  }
}

function insertSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let j = i;
    while (j > 0 && arr[j - 1] > arr[j]) {
      swap(arr, j - 1, j);
      j--;
    }
  }
  return arr;
}
function swap(arr, i, j) {
  let tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
}
insertSort([11, 22, 333, 1, 233, 8]);
function memo(fn) {
  let cache = {};
  return (...rest) => {
    let key = JSON.stringify(rest);
    return cache[key] || (cache[key] = fn.call(this, rest));
  };
}

function parseUrl(url = '') {
  let queryParams = new URLSearchParams(url);
  let obj = {};
  for (let [key, val] of queryParams.entries()) {
    obj[key] = val;
  }
  return obj;
}

function addBig(a, b) {
  let [m, n] = [a.length, b.length];
  let len = Math.max(m, n);
  a = a.padStart(len, '0');
  b = b.padStart(len, '0');
  let flag = 0;
  let res = '';
  let i = len - 1;
  while (i >= 0) {
    flag = Number(a[i]) + Number(b[i]) + flag;
    res = (flag % 10) + res;
    flag = Math.floor(flag / 10);
    i--;
  }
  return flag == 1 ? '1' + res : res;
}
addBig('99', '100');
function multiply(a, b) {
  let [m, n] = [a.length, b.length];
  let res = new Array(m + n).fill(0);
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      let p1 = i + j;
      let p2 = p1 + 1;
      let ans = Number(a[i]) * Number(b[j]);
      let data = res[p2] + ans;
      res[p2] = data % 10;
      res[p1] += Math.floor(data / 10);
    }
  }
  while (res[0] == 0) {
    res.shift();
  }
  return res.join('');
}
multiply('13', '13');
function sum(...rest) {
  const add = (...arg) => sum(...arg, ...rest);
  add.valueOf = () => rest.reduce((a, b) => a + b);
  return add;
}
sum(1)(2)(3).valueOf();
