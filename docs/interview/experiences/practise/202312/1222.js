/**
 * 1.快速排序
 * 2.堆排序
 * 3.归并排序
 */
function swap(arr, i, j) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

function bubbleSort(arr) {
  let len = arr.length;
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        swap(arr, j, j + 1);
      }
    }
  }
  return arr;
}
bubbleSort([22, 111, 2, 3, 4, 55, 1]);

// 选择排序
function selectSort(arr) {
  let len = arr.length;
  let min = 0;
  for (let i = 0; i < len; i++) {
    min = i;
    for (let j = i + 1; j < len; j++) {
      if (arr[min] > arr[j]) {
        min = j;
      }
    }
    swap(arr, i, min);
  }
  return arr;
}
selectSort([22, 111, 2, 3, 4, 55, 1]);

// 插入排序
function insertSort(arr) {
  let pre, cur;
  for (let i = 1; i < arr.length; i++) {
    pre = i - 1;
    cur = arr[i];
    while (pre >= 0 && arr[pre] > cur) {
      arr[pre + 1] = arr[pre];
      pre--;
    }
    arr[pre + 1] = cur;
  }
  return arr;
}
insertSort([22, 111, 2, 3, 4, 55, 1]);

function insertSort2(arr) {
  for (let i = 1; i < arr.length; i++) {
    let j = i;
    while (j > 0 && arr[j - 1] > arr[j]) {
      swap(arr, j, j - 1);
      j--;
    }
  }
}
function swap(arr, i, j) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}
insertSort([22, 111, 2, 3, 4, 55, 1]);

function merge(arr) {
  let sort = (left, right) => {
    let i = 0,
      j = 0;
    let res = [];
    while (left.length > i && right.length > j) {
      if (left[i] > right[j]) {
        res.push(right[j++]);
      } else {
        res.push(left[i++]);
      }
    }
    while (i < left.length) {
      res.push(left[i++]);
    }
    while (j < right.length) {
      res.push(right[j++]);
    }
    return res;
  };
  let mergeSort = (arr) => {
    if (arr.length == 1) return arr;
    let mid = Math.floor(arr.length / 2);
    let left = arr.slice(0, mid);
    let right = arr.slice(mid);
    return sort(merge(left), merge(right));
  };
  return mergeSort(arr);
}
merge([22, 111, 2, 3, 4, 55, 1]);

function countingSort(arr, maxValue) {
  let bucket = new Array(maxValue + 1),
    sortedIndex = 0;
  let arrLen = arr.length,
    bucketLen = maxValue + 1;
  for (var i = 0; i < arrLen; i++) {
    if (!bucket[arr[i]]) {
      bucket[arr[i]] = 0;
    }
    bucket[arr[i]]++;
  }
  for (var j = 0; j < bucketLen; j++) {
    while (bucket[j] > 0) {
      arr[sortedIndex++] = j;
      bucket[j]--;
    }
  }
  return arr;
}
countingSort([22, 111, 2, 3, 4, 55, 1], 122);

var sortArray = function (nums) {
  var partion = (nums, left, right) => {
    let pivot = right;
    let leftIndex = left;
    for (let i = left; i < right; i++) {
      if (nums[pivot] > nums[i]) {
        swap(nums, leftIndex, i);
        leftIndex++;
      }
    }
    swap(nums, leftIndex, pivot);
    return leftIndex;
  };
  var quickSort = (arr, left, right) => {
    if (left >= right) return;
    mid = partion(arr, left, right);
    quickSort(arr, left, mid - 1);
    quickSort(arr, mid + 1, right);
    return nums;
  };
  if (nums.length < 2) return nums;
  return quickSort(nums, 0, nums.length - 1);
};
function swap(arr, i, j) {
  var temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

var sortArray = function (nums) {
  var partion = (nums, left, right, pivot) => {
    let pivot = right;
    let leftIndex = left;
    for (let i = left; i < right; i++) {
      if (nums[pivot] > nums[i]) {
        swap(nums, leftIndex, i);
        leftIndex++;
      }
    }
    swap(nums, leftIndex, pivot);
    return leftIndex;
  };
  var quickSort = (arr, left, right, pivot) => {
    if (left >= right) return;
    mid = partion(arr, left, right, pivot);
    quickSort(arr, left, mid - 1);
    quickSort(arr, mid + 1, right);
    return nums;
  };
  if (nums.length < 2) return nums;
  let pivot = getRandom(0, nums.length - 1);
  return quickSort(nums, 0, nums.length - 1, pivot);
};
function swap(arr, i, j) {
  var temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}
function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
