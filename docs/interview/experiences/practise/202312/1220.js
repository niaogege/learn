/**
 * 1.多叉树的每一层的节点之和 树转数组  数组转树
 * 2.实现阶乘(迭代/递归)
 * 3.两个字符串对比, 得出结论都做了什么操作, 比如插入或者删除
 * 4.实现一个函数，将给定的十进制数转换为 36 进制表示
 * 5.LCR 026. 重排链表
 */

/**
 * @param {ListNode} head
 * @return {void} Do not return anything, modify head in-place instead.
 */
var reorderList = function (head) {
  if (!head) return null;
  let cur = head;
  let map = [];
  while (cur) {
    map.push(cur);
    cur = cur.next;
  }
  // for (let item of map) {
  //   let last = map.pop()
  //   head.next = last
  //   let first = map.shift()
  //   last.next = first
  //   last = last.next
  //   first = first.next
  // }
  let i = 0;
  let j = map.length - 1;
  while (i < j) {
    stack[i].next = stack[j];
    i++;
    if (i === j) {
      break;
    }
    stack[j].next = stack[i];
    j--;
  }
  stack[j].next = null;
};

// 树转数组 平铺即可
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

function treeToArrDFS(tree) {
  let res = [];
  var dfs = (tree) => {
    for (let item of tree) {
      if (item.children && item.children.length) {
        dfs(item.children);
        delete item.children;
      }
      res.push(item);
    }
  };
  dfs(tree);
  return res;
}
function treeToArrBFS(tree) {
  let queue = [...tree];
  let res = [];
  while (queue.length) {
    let cur = queue.shift();
    if (cur.children && cur.children.length) {
      queue.push(...cur.children);
      delete cur.children;
    }
    res.push(cur);
  }
  return res;
}
treeToArrBFS(listTree);
var inputArray = [
  { id: 1, parentId: null, name: 'Node 1' },
  { id: 2, parentId: 1, name: 'Node 1.1' },
  { id: 3, parentId: 1, name: 'Node 1.2' },
  { id: 4, parentId: 2, name: 'Node 1.1.1' },
  { id: 5, parentId: null, name: 'Node 2' },
  { id: 6, parentId: 5, name: 'Node 2.1' },
];

// 数组转树 通过parentId来关联
function arrToTree(arr) {
  let res = [];
  var dfs = (tree, res, parentId) => {
    for (let item of tree) {
      if (item.parentId == parentId) {
        var curItem = {
          ...item,
          children: [],
        };
        res.push(curItem);
        dfs(tree, curItem.children, item.id);
      }
    }
  };
  dfs(arr, res, null);
  return res;
}
arrToTree(inputArray);

function weightBag(weight, value, size) {
  // dp定义和下标含义
  // 递推公式
  // dp初始化
  // 遍历顺序
  var len = weight.length;
  var dp = new Array(len).fill().map(() => new Array(size + 1).fill(0));
  for (let i = weight[0]; i <= size; i++) {
    dp[0][i] = value[0];
  }
  for (let i = 1; i < len; i++) {
    for (let j = 0; j <= size; j++) {
      if (weight[i] > j) {
        dp[i][j] = dp[i - 1][j];
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i - 1][j - weight[i]] + value[i]);
      }
    }
  }
  console.table(dp);
  return dp[len - 1][size];
}
weightBag([1, 3, 4, 5], [15, 20, 30, 55], 6);

var res = layerSum({
  value: 2,
  children: [
    { value: 6, children: [{ value: 1 }] },
    { value: 3, children: [{ value: 2 }, { value: 3 }, { value: 4 }] },
    { value: 5, children: [{ value: 7 }, { value: 8 }] },
  ],
});

function layerSum(root) {
  var res = [];
  var dfs = (node, depth) => {
    if (node) {
      if (!res[depth]) {
        res[depth] = [];
      }
      res[depth].push(node.value);
      if (node.children) {
        node.children.forEach((child) => {
          dfs(child, depth + 1);
        });
        delete node.children;
      }
    }
  };
  dfs(root, 0);
  return res.map((item) => item.reduce((a, b) => a + b, 0));
}
console.log(res, 'res');

//二叉树的每一层节点 也就是层序遍历
function levelTraBFS(root) {
  if (!root) return 0;
  let queue = [root];
  let res = [];
  while (queue.length) {
    let arr = [];
    let len = queue.length;
    for (let i = 0; i < len; i++) {
      let cur = queue.shift();
      arr.push(cur.val);
      if (cur.left) {
        queue.push(cur.left);
      }
      if (cur.right) {
        queue.push(cur.right);
      }
    }
    res.push(arr);
  }
  return res;
}
// 二叉树的层序遍历
var levelOrder = function (root) {
  if (!root) return [];
  var res = [];
  var dfs = (root, depth) => {
    if (!root) return;
    if (!res[depth]) {
      res[depth] = [];
    }
    root.val != null && res[depth].push(root.val);
    if (root.left) {
      dfs(root.left, depth + 1);
    }
    if (root.right) {
      dfs(root.right, depth + 1);
    }
  };
  dfs(root, 0);
  return res;
};

pre = 'abcde123';
now = '1abc123';

// a前面插入了1, c后面删除了de
