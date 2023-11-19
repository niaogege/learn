/**
 * 1.对象数组去重
 * 2.基数排序
 * 3.堆排序
 * 4.桶排序
 * 5.手写Object.create()的实现
 * 6.树转数组
 * 7.数组转树
 * 8.如何实现上拉加载下拉刷新
 * 9.冒泡排序/选择排序/插入排序/快排
 */

function scrollPage() {
  var scrollHeight = document.body.scrollHeight || document.documentElement.scrollHeight; // 文档内容的总高度
  var scrollBarTop = document.body.scrollTop || document.documentElement.scrollTop; // 滚动条的滚动距离
  const distance = 50; // 距离底部还有50的时候 加载下一页
  var clientHeight = window.innerHeight;
  if (scrollBarTop + clientHeight + distance >= scrollHeight) {
    console.log('toBottom');
  }
}
window.addEventListener('scroll', scrollPage);
window.removeEventListener('scroll', scrollPage);
// 上拉加载
function bottomFetchData() {}
window.addEventListener('scroll', bottomFetchData);
window.removeEventListener('scroll', bottomFetchData);
// 下拉刷新
function downFresh() {}
/**
 * ES5 Object.create 的模拟实现，将传入的对象作为创建的对象的原型,阔以理解成对传入对象的浅复制缺点：引用类型的原型属性会被实例共享
 * @param target
 * @returns
 */
function MyObject(target) {
  function F() {}
  F.prototype = target;
  return new F();
}

function bubbleSort(arr) {
  var len = arr.length;
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - i - 1; j++) {
      if (arr[j] >= arr[j + 1]) {
        var temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}
bubbleSort([33, 1, 23, 44, 5, 7, 99]);

// 选择最小的进行
function selectSort(arr) {
  var min;
  for (let i = 0; i < arr.length; i++) {
    min = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[min] >= arr[j]) {
        min = j;
      }
    }
    var temp = arr[min];
    arr[min] = arr[i];
    arr[i] = temp;
  }
  return arr;
}
selectSort([33, 1, 23, 44, 5, 7, 99]);

function insertSort(arr) {
  var prev;
  for (let i = 1; i < arr.length; i++) {
    prev = i - 1;
    var cur = arr[i];
    while (prev >= 0 && arr[prev] > cur) {
      arr[prev + 1] = arr[prev];
      prev--;
    }
    arr[prev] = cur;
  }
  return arr;
}

// 对于未排序的数据，在已排序的序列中从后往前扫描，找到相应的位置进行插入，始终保持排序序列中的元素有序
function insertSort2(arr) {
  var prev;
  for (let i = 1; i < arr.length; i++) {
    prev = i;
    var cur = arr[i];
    while (prev - 1 >= 0 && arr[prev - 1] > cur) {
      arr[prev] = arr[prev - 1];
      prev--;
    }
    arr[prev] = cur;
  }
  return arr;
}
insertSort2([33, 1, 23, 44, 5, 7, 99]);

function quickSort(arr) {
  if (arr.length < 2) return arr;
  var base = arr[0];
  var left = [];
  var right = [];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] >= base) {
      right.push(arr[i]);
    } else {
      left.push(arr[i]);
    }
  }
  return [...quickSort(left), base, ...quickSort(right)];
}
quickSort([33, 1, 23, 44, 5, 7, 99]);
