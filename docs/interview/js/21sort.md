---
title: 手写各类排序
order: 21
group:
  order: 1
  title: js Basic
  path: /interview/js
nav:
  order: 3
  title: 'interview'
  path: /interview
---

> 到底什么时候才会手写各类排序 20220701

## 冒泡排序

```js
var bubble = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
};
var tt = [11, 3, 2, 111, 5, 6];
bubble(tt);
```

## 插入排序

[插入排序](https://segmentfault.com/img/bVDcJz)

对于未排序的数据，在已排序的序列中从后往前扫描，找到相应的位置进行插入，始终保持排序序列中的元素有序

```js
var insertSort = (arr) => {
  const len = arr.length;
  for (let i = 1; i < len; i++) {
    let j = i;
    let temp = arr[i];
    while (j >= 0 && arr[j - 1] > temp) {
      arr[j] = arr[j - 1];
      j--;
    }
    arr[j] = temp;
  }
  return arr;
};
var tt = [11, 3, 2, 111, 5, 6];
insertSort(tt);
```

> 从 1 开始 始终保持排序序列中的元素有序

```js
var insertSort2 = (arr) => {
  const len = arr.length;
  for (let i = 1; i < len; i++) {
    let prev = i - 1;
    let temp = arr[i];
    while (prev >= 0 && arr[prev] > temp) {
      arr[prev + 1] = arr[prev];
      prev--;
    }
    arr[prev] = temp;
  }
  return arr;
};
```

## 选择排序

选择排序和插入排序有些类似，也分已排序序列和未排序序列。

但是选择排序是将最小的元素存放在数组起始位置，再从剩下的未排序的序列中寻找最小的元素，然后将其放到已排序的序列后面

```js
var selectSort = (arr) => {
  const len = arr.length;
  let min;
  for (let i = 0; i < len - 1; i++) {
    min = i;
    for (let j = i + 1; j < len; j++) {
      if (arr[j] < arr[min]) {
        min = j;
      }
    }
    // [arr[min], arr[i]] = [arr[i], arr[min]]
    let temp = arr[i];
    arr[i] = arr[min];
    arr[min] = temp;
  }
  return arr;
};
var tt = [11, 3, 2, 111, 5, 6];
selectSort(tt);
```

## 快速排序

```js
var quickSort = (arr) => {
  if (arr.length < 2) return arr;
  var base = arr[0]
  var left = []
  var right = []
  for(let i = 1; i<arr.length;i++) {
    if (arr[i] < base) {
      left.push(arr[i])
    } else {
      right.push(arr[i])
    }
  }
  return [...quickSort(left), base, ...quickSort(right)
}
var tt = [11,3, 2,111,5,6]
quickSort(tt)
```

## 归并排序

顾名思义，分而治之。一般分为以下三个过程：

分解：将原问题分解成一系列子问题。解决：递归求解各个子问题，若子问题足够小，则直接求解。合并：将子问题的结果合并成原问题。

```js
var mergerSort = (arr) => {
  var merge = (a, b) => {};
  var sort = (arr) => {
    if (arr.length < 2) {
      return arr;
    }
    let middle = arr.length >> 1;
    let left = arr.slice(0, middle);
    let right = arr.slice(middle + 1);
    return merge(mergerSort(left), mergerSort(right));
  };
  return sort(arr);
};
var tt = [11, 3, 2, 111, 5, 6];
mergerSort(tt);
```

## 桶排序

## 基数排序

## 堆排序

## 参考

- [手撕前端面试之经典排序算法 (动图+视频)](https://segmentfault.com/a/1190000039294642)
