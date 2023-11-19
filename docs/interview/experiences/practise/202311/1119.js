/**
 * 1.tree转数组
 * 2.数组转树
 * 3.hashRouter和historyRouter
 * 4.归并排序
 * 5.滑动窗口，无重复字符的最长子串
 */

var mergeSort = (arr) => {
  const merge = (right, left) => {
    var res = [];
    let i = 0,
      j = 0;
    while (i < left.length && j < right.length) {
      if (right[j] > left[i]) {
        res.push(left[i++]);
      } else {
        res.push(right[j++]);
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
  const sort = (arr) => {
    if (arr.length === 1) return arr;
    var mid = Math.floor(arr.length / 2);
    var left = arr.slice(0, mid);
    var right = arr.slice(mid);
    return merge(mergeSort(left), mergeSort(right));
  };
  return sort(arr);
};
mergeSort([33, 11, 3, 4, 66, 1]);
var tree = [
  {
    id: 1,
    name: 'Node 1',
    children: [
      {
        id: 2,
        name: 'Node 1.1',
        children: [
          {
            id: 4,
            name: 'Node 1.1.1',
          },
        ],
      },
      {
        id: 3,
        name: 'Node 1.2',
      },
    ],
  },
  {
    id: 5,
    name: 'Node 2',
    children: [
      {
        id: 6,
        name: 'Node 2.1',
      },
    ],
  },
];
// 树转数组
// 多层嵌套转为扁平化
function treeToArr(tree) {
  var res = [];
  var stack = [];
  stack = stack.concat(tree);
  while (stack.length) {
    var cur = stack.shift();
    if (cur.children) {
      stack = stack.concat(cur.children);
      delete cur.children;
    }
    res.push(cur);
  }
  return res;
}
treeToArr(tree);

// 递归遍历
function treeToArr2(tree) {
  var res = [];
  getChild(tree, res);
  return res;
}
function getChild(tree, res) {
  for (let i = 0; i < tree.length; i++) {
    if (tree[i].children) {
      getChild(tree[i].children, res);
      delete tree[i].children;
    }
    res.push(tree[i]);
  }
  return res;
}
treeToArr2(tree);

var arr = [
  { id: 1, parentId: null, name: 'Node 1' },
  { id: 2, parentId: 1, name: 'Node 1.1' },
  { id: 3, parentId: 1, name: 'Node 1.2' },
  { id: 4, parentId: 2, name: 'Node 1.1.1' },
  { id: 5, parentId: null, name: 'Node 2' },
  { id: 6, parentId: 5, name: 'Node 2.1' },
];

// 扁平变为嵌套关系

// 数组转树
function arrToTree(arr) {
  var res = [];
  getChildTree(arr, res, null);
  return res;
}

function getChildTree(arr, res, pid) {
  for (let i = 0; i < arr.length; i++) {
    var item = arr[i];
    if (pid === item.parentId) {
      var child = {
        ...item,
        children: [],
      };
      getChildTree(arr, child.children, item.id);
      res.push(child);
    }
  }
}
arrToTree(arr);
