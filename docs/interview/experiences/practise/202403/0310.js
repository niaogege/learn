/**
 * 1.永远不要放弃，我可能离成功就差一步之遥
 * 2.前端架构和框架，前面准备了那么久，时刻厚积薄发一下了
 * 3.不定长二维数组全排列
 */

function thousand(str) {
  return str.replace(/(?!^)(?=(\d{3})+$)/g, ',');
}
thousand('123456789');

var inputArray = [
  { id: 1, parentId: null, name: 'Node 1' },
  { id: 2, parentId: 1, name: 'Node 1.1' },
  { id: 3, parentId: 1, name: 'Node 1.2' },
  { id: 4, parentId: 2, name: 'Node 1.1.1' },
  { id: 5, parentId: null, name: 'Node 2' },
  { id: 6, parentId: 5, name: 'Node 2.1' },
];
// 数组转树
function arrToTree(arr) {
  let res = [];
  let dfs = (arr, res, parentId) => {
    for (let item of arr) {
      if (parentId == item.parentId) {
        var newItem = {
          ...item,
          children: [],
        };
        res.push(newItem);
        dfs(arr, newItem.children, item.id);
      }
    }
  };
  dfs(arr, res, null);
  return res;
}
arrToTree(inputArray);
function treeToArr(arr) {
  let res = [];
  var dfs = (arr, res) => {
    for (let item of arr) {
      res.push(item);
      if (item.children && item.children.length) {
        dfs(item.children, res);
      }
      delete item.children;
    }
  };
  dfs(arr, res);
  return res;
}

function treeToArrBfs(arr) {
  let queue = [...arr];
  let res = [];
  while (queue.length) {
    let cur = queue.shift();
    res.push(cur);
    if (cur.children && cur.children.length) {
      queue.push(...cur.children);
    }
    delete cur.children;
  }
  return res;
}

var listTree = [
  {
    id: 1,
    name: '部门1',
    pid: 0,
    children: [
      {
        id: 2,
        name: '部门1-1',
        pid: 1,
        children: [
          {
            id: 4,
            name: '部门1-1-1',
            pid: 2,
            children: [],
          },
        ],
      },
      {
        id: 3,
        name: '部门1-2',
        pid: 1,
        children: [
          {
            id: 5,
            name: '部门1-2-1',
            pid: 3,
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: 6,
    name: '部门2',
    pid: 0,
    children: [
      {
        id: 7,
        name: '部门2-1',
        pid: 6,
        children: [],
      },
    ],
  },
  {
    id: 8,
    name: '部门3',
    pid: 0,
    children: [],
  },
];

treeToArr(listTree);

function per(arr) {
  let ans = [];
  let backTrack = (arr, path, row) => {
    if (path.length == arr.length) {
      ans.push(path.slice());
      return;
    }
    for (let i = 0; i < arr[row].length; i++) {
      path.push(arr[row][i]);
      backTrack(arr, path, row + 1);
      path.pop();
    }
  };
  backTrack(arr, [], 0);
  return ans;
}
per([
  ['A', 'B'],
  [1, 2, 3],
  ['a', 'b'],
]);
A1a;
A1b;
A2a;
A2b;
B1a;
B1b;
