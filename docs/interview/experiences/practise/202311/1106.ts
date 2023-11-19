/**
 * 1.树转数组
 * 2.数组转树
 * 3.层序遍历
 */
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
function loop2(tree) {
  if (!tree.length) return [];
  var res = [];
  for (let i = 0; i < tree.length; i++) {
    var item = tree[i];
    res.push({
      id: item.id,
      name: item.name,
      pid: item.pid,
    });
    if (item.children) {
      const last = loop2(item.children);
      if (Array.isArray(last)) {
        res.push(...last.flat());
      } else {
        last && res.push(last);
      }
    }
  }
  return res;
}
loop2(listTree);

function loop3(tree, childName = 'children') {
  let queen = [];
  const res = [];
  queen = queen.concat(tree);
  while (queen.length) {
    const first = queen.shift();
    if (first[childName]) {
      queen = queen.concat(first[childName]);
      delete first[childName];
    }
    res.push(first);
  }
  return res;
}

function dfs(tree, res) {
  for (let i = 0; i < tree.length; i++) {
    if (tree[i].children) {
      dfs(tree[i].children, res);
      delete tree[i].children;
    }
    res.push(tree[i]);
  }
  return res;
}
function loop4(tree) {
  const res = [];
  dfs(tree, res);
  return res;
}

const list = [
  { id: 1, name: '部门1', pid: 0 },
  { id: 2, name: '部门1-1', pid: 1 },
  { id: 3, name: '部门1-2', pid: 1 },
  { id: 4, name: '部门1-1-1', pid: 2 },
  { id: 5, name: '部门1-2-1', pid: 3 },
  { id: 6, name: '部门2', pid: 0 },
  { id: 7, name: '部门2-1', pid: 6 },
  { id: 8, name: '部门3', pid: 0 },
];
