function flat(arr, depth = 1) {
  if (!Array.isArray(arr)) return arr;

  let stack = [...arr.map((item) => [item, depth])];
  let res = [];

  while (stack.length > 0) {
    let [top, dep] = stack.shift();
    if (Array.isArray(top) && dep > 0) {
      stack.unshift(...top.map((item) => [item, dep - 1]));
    } else {
      res.push(top);
    }
  }
  console.log(res, 'res');
  return res;
}
//flatten([1, [2], [3, [4, 5]]]);
flat([1, 2, undefined, [3, 4, [5, 6, [7, 8, [9, 10]]]]], Infinity);

function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}
bubbleSort([2, 1, 222, 11, 4, 555, 8]);

// 快速排序
function quickSort(arr) {
  // your code here
}

// 选择排序
function selectSort(arr) {
  let min, j;
  for (let i = 0; i < arr.length; i++) {
    min = i;
    while (arr[min] >= arr[j]) {
      min = j;
      j++;
    }
    [arr[min], arr[i]] = [arr[i], arr[min]];
  }
  return arr;
}
function selectSort(arr) {
  let min, j;
  for (let i = 0; i < arr.length; i++) {
    min = i;
    // j = i + 1;
    // while (arr[min] >= arr[j]) {
    //   min = j;
    //   j++;
    // }
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[min] > arr[j]) {
        min = j;
      }
    }
    [arr[min], arr[i]] = [arr[i], arr[min]];
  }
  return arr;
}

selectSort([2, 1, 222, 11, 4, 555, 8]);

// 插入排序 把后面小的插入到前面去
// 从 1 开始 始终保持排序序列中的元素有序
function insertSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let j = i;
    while (j > 0 && arr[j - 1] > arr[j]) {
      [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
      j--;
    }
  }
  return arr;
}
insertSort([2, 1, 222, 11, 4, 555, 8]);
// 二分法
function twoSplit(arr, target) {
  let l = 0;
  let r = arr.length - 1;
  while (l <= r) {
    let min = l + Math.floor((l + r) / 2);
    if (arr[min] == target) {
      return min;
    } else if (arr[min] < target) {
      l = min + 1;
    } else {
      r = min - 1;
    }
  }
}
// nums = [-1,0,3,5,9,12], target = 9 输出: 4 解释: 9 出现在 nums 中并且下标为 4
twoSplit(nums, 9);
function flat(arr, depth = 1) {
  if (depth === 0) return arr;
  let res = [];
  for (let i = 0; i < arr.length; i++) {
    let cur = arr[i];
    if (Array.isArray(cur)) {
      res.push(...flat(cur, depth - 1));
    } else {
      res.push(cur);
    }
  }
  return res;
}
function flat1(arr, depth = 1) {
  return depth
    ? arr.reduce((pre, cur) => {
        return [...pre, ...(Array.isArray(cur) ? flat1(cur, depth - 1) : [cur])];
      }, [])
    : arr;
}
flat1([1, [2, [3, [4, 5]]]]);

Array.prototype.myReduce = function (fn, init) {
  let arr = this || [];
  let res = init ? init : arr[0];
  let startIndex = init ? 0 : 1;
  for (let i = 0; i < startIndex; i++) {
    res = fn.call(this, res, arr[i], i, arr);
  }
  return res;
};
