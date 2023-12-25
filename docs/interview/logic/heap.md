---
title: 二叉堆
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

### [二叉树分类](https://segmentfault.com/a/1190000039329060)

二叉树分为满二叉树(full binary tree)和完全二叉树(complete binary tree)。

- 满二叉树：一棵深度为 k 且有 2 ^ k - 1 个节点的二叉树称为满二叉树
- 完全二叉树：完全二叉树是指最后一层左边是满的，右边可能满也可能不满，然后其余层都是满的二叉树称为完全二叉树(满二叉树也是一种完全二叉树)

### 二叉树结构

从图中我们可以看出二叉树是从上到下依次排列下来，可想而知可以用一个数组来表示二叉树的结构，从下标 index( 0 - 8 ) 从上到下依次排列。

![二叉树结构](https://segmentfault.com/img/remote/1460000039329065)

- 二叉树左侧节点表达式 index\*2 + 1。例如：以根节点为例求左侧节点，根节点的下标为 0，则左侧节点的序数是 1 ，对应数组中的值为 1
- 二叉树右侧节点表达式 index\*2 + 2。例如：以根节点为例求右侧节点，根节点的下标为 0，则右侧节点的序数是 2 ，对应数组中的值为 8
- 二叉树叶子节点表达式 序数 >= floor( N / 2 )都是叶子节点（N 是数组的长度）。例如：floor( 9 / 2 ) = 4 ，则从下标 4 开始的值都为叶子节点

### 二叉堆特征

二叉堆是一个**完全二叉树**，父节点与子节点要保持固定的大小关系，并且每个节点的左子树和右子树都是一个二叉堆。

#### 二叉堆根据排序不同，可以分为最大堆和最小堆

- 最大堆：根节点的键值是所有堆节点键值中最大者，且每个父节点的值都比子节点的值大
- 最小堆：根节点的键值是所有堆节点键值中最小者，且每个父节点的值都比子节点的值小

![二叉堆](https://segmentfault.com/img/remote/1460000039329064)

通过上面的讲述想必大家对二叉堆有了一定的理解，那么接下来就是如何实现。以最大堆为例，首先要初始化数组然后通过交换位置形成最大堆。

```js
class Heap {
  constructor(arr) {
    this.data = [...arr];
    this.size = arr.length;
    this.rebuildHeap = this.rebuildHeap.bind(this);
    this.isHeap = this.isHeap.bind(this);
    this.sort = this.sort.bind(this);
    this.insert = this.insert.bind(this);
    this.delete = this.delete.bind(this);
    this.maxHeapify = this.maxHeapify.bind(this);
    this.swap = this.swap.bind(this);
  }
  swap(arr, i, j) {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  maxHeapify(i) {
    let max = i;
    if (i >= this.size) return;
    // 当前序号的左节点
    let left = i * 2 + 1;
    // 当前序号的右节点
    let right = i * 2 + 2;
    if (left < this.size && this.data[left] > this.data[max]) {
      max = left;
    }
    if (right < this.size && this.data[right] > this.data[max]) {
      max = right;
    }
    // 最终max节点是其本身,则已经满足最大堆性质，停止操作
    if (max == i) return;
    this.swap(this.data, i, max);
    return this.maxHeapify(max);
  }
  rebuildHeap() {
    const L = Math.floor(this.size / 2);
    for (let i = L - 1; i >= 0; i--) {
      this.maxHeapify(i);
    }
  }
  sort() {
    for (let = this.size - 1; i > 0; i--) {
      this.swap(this.data, 0, i);
      this.size--;
      this.maxHeapify(0);
    }
  }
  isHeap() {
    const L = Math.floor(this.size / 2);
    for (let i = L - 1; i >= 0; i--) {
      const l = this.data[left(i)] || Number.MIN_SAFE_INTEGER;
      const r = this.data[right(i)] || Number.MIN_SAFE_INTEGER;
      const max = Math.max(this.data[i], l, r);
      if (max !== this.data[i]) {
        return false;
      }
      return true;
    }
  }
  insert(key) {
    this.data[this.size] = key;
    this.size++;
    if (this.isHeap()) {
      return;
    }
    this.rebuildHeap();
  }
  delete(index) {
    if (index >= this.size) {
      return;
    }
    this.data.splice(index, 1);
    this.size--;
    if (this.isHeap()) {
      return;
    }
    this.rebuildHeap();
  }
}
```

```js
const arr = [15, 12, 8, 2, 5, 2, 3, 4, 7];
const fun = new Heap(arr);
fun.rebuildHeap(); // 形成最大堆的结构
fun.sort(); // 通过排序，生成一个升序的数组
console.log(fun.data); // [2, 2, 3, 4, 5, 7, 8, 12, 15]
```

### [堆排序](https://github.com/DangoSky/algorithm/tree/master/Algorithm-notes#%E5%A0%86%E6%8E%92%E5%BA%8F)

堆排序包含两个过程，建堆和排序。

- 首先构建一个大顶堆，也就是将最大值存储在根节点(i = 1)，每次取大顶堆的根节点与堆的最后一个节点进行交换，此时最大值放入了有效序列的最后一位，并且有效序列减 1，有效堆依然保持完全二叉树的结构，然后进行堆化成为新的大顶堆。重复此操作，直到有效堆的长度为 0，排序完成。

```js
function heapSort(arr) {
  buildHeap(arr);
  // 循环n-1次，每次循环后交换堆顶元素和堆底元素并重新调整堆结构
  for (let i = arr.length - 1; i > 0; i--) {
    swap(arr, i, 0);
    heapify(arr, i, 0);
  }
  return arr;
}
// 构建大顶堆
function buildHeap(arr) {
  let len = arr.length;
  // 注意这里的头节点是从0开始的，所以最后一个非叶子结点是 Math.floor(nums.length/2)-1
  let start = Math.floor(len / 2) - 1;
  // 从最后一个非叶子结点开始调整，直至堆顶。
  for (let i = start; i >= 0; i--) {
    heapify(arr, len, i);
  }
}
// 堆化 下沉
function heapify(arr, len, i) {
  while (true) {
    let max = i;
    let l = i * 2 + 1; // 左
    let r = i * 2 + 2; // 右
    if (l < len && arr[max] < arr[l]) {
      max = l;
    }
    if (r < len && arr[max] < arr[r]) {
      max = r;
    }
    if (i != max) {
      swap(arr, i, max);
      i = max;
    } else {
      break;
    }
  }
}
function swap(arr, i, j) {
  let t = arr[i];
  arr[i] = arr[j];
  arr[j] = t;
}
heapSort([2, 111, 1, 4, 33, 8, 9]);
```

### [希尔排序](https://github.com/DangoSky/algorithm/tree/master/Algorithm-notes#%E5%A0%86%E6%8E%92%E5%BA%8F)

```js
function shellSort(nums) {
  let len = nums.length;
  // 初始步数
  let gap = parseInt(len / 2);
  // 逐渐缩小步数
  while (gap) {
    // 从第gap个元素开始遍历
    for (let i = gap; i < len; i++) {
      // 逐步其和前面其他的组成员进行比较和交换
      for (let j = i - gap; j >= 0; j -= gap) {
        if (nums[j] > nums[j + gap]) {
          // [nums[j], nums[j + gap]] = [nums[j + gap], nums[j]];
          swap(nums, j, j + gap);
        } else {
          break;
        }
      }
    }
    gap = parseInt(gap / 2);
  }
}
function swap(arr, i, j) {
  let t = arr[i];
  arr[i] = arr[j];
  arr[j] = t;
}
```
