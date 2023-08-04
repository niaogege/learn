/**
 * 1.手写二叉树前中后序迭代遍历an
 * 2.请求并发
 * 3.冒泡排序
 * 4.lRU
 * 5.实现Iterator
 * 6.async/await
 * 7.选择排序和插入排序
 * 8.归并排序
 */

class LRU {
  constructor(limit) {
    this.limit = limit;
    this.cache = new Map();
  }
  get(key) {}
  set(key, val) {}
}

async function asyncPool(limit, array, fn) {
  var res = [];
  var executing = [];
  for (let i = 0; i < array.length; i++) {
    var p1 = Promise.resolve().then(() => fn(array[i]));
    res.push(p1);
    if (array.length >= limit) {
      var p2 = p1.then(() => {
        return executing.splice(executing.indexOf(p2), 1);
      });
      executing.push(p2);
      if (executing.length >= limit) {
        await Promise.race(executing);
      }
    }
  }
  return Promise.all(res);
}

function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        var temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}
bubbleSort([22, 111, 2, 3, 4, 3, 55, 6666, 1]);
// 但是选择排序是将最小的元素存放在数组起始位置，再从剩下的未排序的序列中寻找最小的元素，然后将其放到已排序的序列后面。以此类推，直到排序完成。
function selectSort(arr) {
  let minIndex = 0;
  const len = arr.length;
  for (let i = 0; i < len - 1; i++) {
    minIndex = i;
    for (let j = i + 1; j < len; j++) {
      if (arr[minIndex] >= arr[j]) {
        minIndex = j;
      }
    }
    var temp = arr[i];
    arr[i] = arr[minIndex];
    arr[minIndex] = temp;
  }
  return arr;
}
selectSort([22, 111, 2, 3, 4, 3, 55, 6666, 1]);

function insertSort(arr) {
  var pre, cur;
  var len = arr.length;
  for (let i = 1; i < len; i++) {
    cur = arr[i];
    pre = i - 1;
    while (pre >= 0 && arr[pre] >= cur) {
      arr[pre + 1] = arr[pre];
      pre--;
    }
    arr[pre + 1] = cur;
  }
  return arr;
}
insertSort([22, 111, 2, 3, 4, 3, 55, 6666, 1]);

class MakeIterator {
  constructor(obj) {
    this.obj = obj;
    this.index = 0;
    this.len = Object.keys(obj).length;
  }
  [Symbol.iterator]() {
    return this;
  }
  next() {
    return this.index < this.length
      ? {
          done: false,
          value: this.obj[this.index++],
        }
      : {
          done: true,
          value: undefined,
        };
  }
}

// 前序
// 优先以后代节点的顺序访问每个节点的，跟中序不一样的是，先序遍历会优先访问节点本身，然后在访问她的左侧节点，最后是右侧子节点
// 应用场景是打印一个结构化的文档
// 根左右
function preOrder(tree) {
  var res = [];
  var dfs = (node) => {
    if (node) {
      res.push(node.val);
      dfs(node.right);
      dfs(node.left);
    }
  };
  dfs(tree);
  return res;
}
// 中序
// 左根右
function inOrder(tree) {
  var res = [];
  var dfs = (node) => {
    if (node) {
      dfs(node.left);
      res.push(node.val);
      dfs(node.right);
    }
  };
  dfs(tree);
  return res;
}

// 后序 先访问节点的后代节点，在访问节点本身 应用场景主要是计算一个目录及其子目录中所有文件所占空间的大小
// 左右根
function afterOrder(tree) {
  var dfs = (node) => {
    if (node) {
      dfs(node.left);
      dfs(node.right);
      res.push(node.val);
    }
  };
  dfs(tree);
  return res;
}

function mergeSort(arr) {}
