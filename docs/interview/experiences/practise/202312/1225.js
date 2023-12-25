/**
 * 1.堆排序
 * 2.希尔排序
 * 3.插入排序
 */
function swap(arr, i, j) {
  let t = arr[i];
  arr[i] = arr[j];
  arr[j] = t;
}
function heapSort(arr) {
  // build
  buildHeap(arr);
  // heapify
  for (let i = arr.length - 1; i > 0; i--) {
    swap(arr, i, 0);
    heapify(arr, 0, i);
  }
  return arr;
}
function buildHeap(arr) {
  // 最后一个非叶子结点是Math.floor(len / 2) - 1;
  let len = arr.length;
  let start = Math.floor(len / 2) - 1;
  // 从最后一个非叶子结点开始调整 直至d堆顶
  for (let i = start; i >= 0; i--) {
    heapify(arr, i, len);
  }
}
function heapify(arr, i, len) {
  while (true) {
    let max = i;
    let l = i * 2 + 1;
    let r = i * 2 + 2;
    while (l < len && arr[max] < arr[l]) {
      max = l;
    }
    while (r < len && arr[max] < arr[r]) {
      max = r;
    }
    if (max != i) {
      swap(arr, i, max);
      i = max;
    } else {
      break;
    }
  }
}
heapSort([22, 11, 444, 3, 4, 6, 1]);

function insertSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let j = i;
    while (j >= 1 && arr[j - 1] > arr[j]) {
      swap(arr, j, j - 1);
      j--;
    }
  }
  return arr;
}

insertSort([22, 11, 444, 3, 4, 6, 1]);
