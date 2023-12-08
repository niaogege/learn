/**
 * 1.回到顶部
 * 2.最近公共祖先
 * 3.对称二叉树
 * 4.重排链表
 * 5.数组转树/树转数组
 * 6.合并区间
 * 7.虚拟dom转真实dom
 * 8.链表中环的入口节点
 * 9.全排列2
 */


function thousand(str) {
  return str.replace(//, ',')
}

function render(str, data) {
  let reg = /\{\{(\w+)\}\}/
  if (reg.test(str)) {
    var key = reg.exec(str)[1]
    str = str.replace(reg, data[key])
    return render(str, data)
  }
  return str
}
// 给定一个可包含重复数字的序列 nums ，按任意顺序 返回所有不重复的全排列。
// 输入：nums = [1,2,3]
// 输出：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
var permuteUnique = function (nums) {
  nums.sort((a, b) => a - b);
  let used = new Array(nums.length).fill(false);
  var res = [];
  let backTrack = (res, path, i) => {
    if (path.length === nums.length) {
      res.push(path.slice());
      return;
    }
    let s = new Set();
    for (let i = 0; i < nums.length; i++) {
      if (s.has(nums[i])) continue;
      if (!used[i]) {
        used[i] = true;
        s.add(nums[i]);
        path.push(nums[i]);
        backTrack(res, path, i);
        path.pop();
        used[i] = false;
      }
    }
  };
  backTrack(res, [], 0);
  return res;
};

function detectCycle(head) {
  let cur = head;
  let m = new Map();
  while (cur) {
    if (m.has(cur)) {
      return cur;
    } else {
      m.set(cur, true);
    }
    cur = cur.next;
  }
  return null;
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
// BFS
function treeToArr(tree) {
  if (!tree) return [];
  let queue = [];
  queue = queue.concat(tree);
  let res = [];
  while (queue.length) {
    let cur = queue.shift();
    if (cur.children && cur.children.length) {
      queue = queue.concat(cur.children);
      delete cur.children;
    }
    res.push(cur);
  }
  return res;
}
treeToArr(listTree);

function treeToArrDfs(tree) {
  let res = [];
  var dfs = (tree, res) => {
    for (let item of tree) {
      if (item.children) {
        dfs(item.children, res);
        delete item.children;
      }
      res.push(item);
    }
  };
  dfs(tree, res);
  return res;
}

const vnode = {
  tag: 'DIV',
  attrs: {
    id: 'app',
  },
  children: [
    {
      tag: 'SPAN',
      children: [
        {
          tag: 'A',
          children: [],
        },
      ],
    },
    {
      tag: 'SPAN',
      children: [
        {
          tag: 'A',
          children: [],
        },
        {
          tag: 'A',
          children: [],
        },
      ],
    },
  ],
};

function render(vnode) {}

var arr = [
  {
    id: 2,
    name: '部门B',
    parentId: 0,
  },
  {
    id: 3,
    name: '部门C',
    parentId: 1,
  },
  {
    id: 1,
    name: '部门A',
    parentId: 2,
  },
  {
    id: 4,
    name: '部门D',
    parentId: 1,
  },
  {
    id: 5,
    name: '部门E',
    parentId: 2,
  },
  {
    id: 6,
    name: '部门F',
    parentId: 3,
  },
  {
    id: 7,
    name: '部门G',
    parentId: 2,
  },
  {
    id: 8,
    name: '部门H',
    parentId: 4,
  },
];

function arrToTree(arr) {
  var res = [];
  var dfs = (arr, res, parentId) => {
    for (let item of arr) {
      if (item.parentId === parentId) {
        let newItem = { ...item, children: [] };
        res.push(newItem);
        dfs(arr, newItem.children, item.id);
      }
    }
  };
  dfs(arr, res, 0);
  return res;
}
arrToTree(arr);
function backTop() {
  let top = document.documentElement.scrollTop;
  if (top > 0) {
    window.requestAnimationFrame(backTop);
    window.scrollTo(0, top / 8);
  }
}

Function.prototype.instanceOf = function (l, r) {
  l = Object.getPrototypeOf(l);
  while (l !== null) {
    if (l == r.prototype) {
      return true;
    }
    l = Object.getPrototypeOf(L);
  }
  return false;
};

function ISTanceof(l, r) {
  // return Object.setPrototypeOf(l.__proto__, r.prototype)
  return r.prototype.isPrototypeOf(l);
}
