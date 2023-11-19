/**
 * 1.数组转树
 * 2.树转数组
 * 3.Dom对象转对象
 * 4.虚拟DOM 对象转DOM
 * 5.历史路由和hash路由
 * 6.数组旋转
 */
// DOM对象转对象
function domToTree(dom) {
  var res = {};
  res.tagName = dom.tagName;
  res.children = [];
  dom.childNodes.forEach((node) => {
    res.children.push(domToTree(node));
  });
  return res;
}
var dom = document.getElementById('parent');
domToTree(dom);
function renderToDom(tree) {
  if (typeof tree === 'string') {
    document.appendChild(document.createTextNode(tree));
  } else {
    var dom = document.createElement(tree.tag);
    Object.keys(tree.props).forEach((prop) => {
      dom.setAttribute(prop, tree.props[prop]);
    });
    tree.children.forEach((child) => {
      document.appendChild(renderToDom(child));
    });
    return dom;
  }
}

const listTree = [
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

// tree 转数组
function treeToArr(tree) {
  var res = [];
  var stack = [];
  stack.concat(tree);
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

function levelOrder(tree) {
  var stack = [tree];
  var res = [];
  while (stack.length) {
    var len = stack.length;
    var arr = [];
    for (let i = 0; i < len; i++) {
      var cur = stack.shift();
      arr.push(cur.value);
      if (cur.left) {
        stack.push(cur.left);
      }
      if (cur.right) {
        stack.push(cur.right);
      }
    }
    res.push(arr);
  }
  return res;
}

// 数组转树
var inputArray = [
  { id: 1, parentId: null, name: 'Node 1' },
  { id: 2, parentId: 1, name: 'Node 1.1' },
  { id: 3, parentId: 1, name: 'Node 1.2' },
  { id: 4, parentId: 2, name: 'Node 1.1.1' },
  { id: 5, parentId: null, name: 'Node 2' },
  { id: 6, parentId: 5, name: 'Node 2.1' },
];

// 递归
function getChild(arr, res, pid) {
  for (let item of arr) {
    if (item.parentId === pid) {
      var newItem = {
        ...item,
        children: [],
      };
      res.push(newItem);
      getChild(arr, newItem.children, item.id);
    }
  }
}

function arrToTree(arr, pid = null) {
  var res = [];
  getChild(arr, res, pid);
  return res;
}
arrToTree(inputArray);
// 遍历
function mapArrToTree(arr) {
  var res = [];
  var map = {};
  for (let item of arr) {
    var id = item.id;
    var pid = item.parentId;
    if (!map[id]) {
      map[id] = {
        children: [],
      };
    }
    map[id] = {
      ...item,
      children: map[id]['children'],
    };
    var temp = map[id];
    if (pid === null) {
      res.push(temp);
    } else {
      map[pid].children.push(temp);
    }
  }
  return res;
}
mapArrToTree(inputArray);
function rotateArray(arr, k) {}

const array = [1, 2, 3, 4, 5]; // 4 5 1 2 3
const k = 2;
const rotatedArray = rotateArray(inputArray, k);
console.log(rotatedArray); // 输出: [4, 5, 1, 2, 3]
