---
title: 0703面试积累
order: 12
group:
  order: 0
  title: interview
nav:
  order: 3
  title: 'interview'
  path: /interview
---

[5 年前端，面试经验](https://mp.weixin.qq.com/s/HfN-ULy9KD86vTuzDDFIiw)

- vue 和 react 在虚拟 dom 的 diff 上，做了哪些改进使得速度很快?
- vue 的 keep-alive 原理以及生命周期

- 【代码题】 实现一个节流函数? 如果想要最后一次必须执行的话怎么实现?

- 【代码题】 实现一个批量请求函数, 能够限制并发量?
- 使用 Promise 实现一个异步流量控制的函数, 比如一共 10 个请求, 每个请求的快慢不同, 最多同时 3 个请求发出, 快的一个请求返回后, 就从剩下的 7 个请求里再找一个放进请求池里, 如此循环。

- 数组转树结构

```js
const arr = [
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
```

- 去除字符串中出现次数最少的字符，不改变原字符串的顺序

```js
“ababac” —— “ababa”
“aaabbbcceeff” —— “aaabbb”
```

- 写出一个函数 trans，将数字转换成汉语的输出，输入为不超过 10000 亿的数字。

```js
trans(123456) —— 十二万三千四百五十六
trans（100010001）—— 一亿零一万零一
```

- async await 的原理是什么?
- redux 原理
- webscoket 的连接原理
- 数组转树, 写完后问如果要在树中新增节点或者删除节点, 函数应该怎么扩展

```js
const arr = [
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
[
  {
    id: 0,
    name: '',
    children: [
      {
        id: 2,
        name: '部门B',
        children: [
          {
            id: 1,
            name: '部门A',
            children: [
              {
                id: 3,
                name: '部门C',
                children: [],
              },
            ],
          },
          {
            id: 5,
            name: '部门D',
            children: [],
          },
        ],
      },
    ],
  },
];

function arrToTree(arr) {
  let ans = [];
  var dfs = (arr, res, parentId) => {
    for (let item of arr) {
      if (parentId == item.parentId) {
        const one = {
          ...item,
          children: [],
        };
        res.push(one);
        dfs(arr, one.children, item.id);
        delete item.children;
      }
    }
  };
  dfs(arr, ans, 0);
  return ans;
}
```

树转数组

```js
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
function treeToArr(tree) {
  let ans = [];
  var dfs = (arr, res) => {
    for (let child of arr) {
      res.push(child);
      if (child.children.length) {
        dfs(child.children, res);
      }
      delete child.children;
    }
  };
  dfs(tree, ans);
  return ans;
}
treeToArr(listTree);
```

- Node 是怎么部署的? pm2 守护进程的原理?
- Node 的日志和负载均衡怎么做的
- Node 开启子进程的方法有哪些?
- node 服务治理
- 给一个字符串, 找到第一个不重复的字符

```js
ababcbdsa;
abcdefg;
```

- Promise then 第二个参数和 catch 的区别是什么?
- Promise finally 怎么实现的
- useRef / ref / forwardsRef 的区别是什么?

- 各种缓存的优先级, memory disk http2 push?
- 小程序为什么会有两个线程? 怎么设计?
- xss? 如何防范?

- 多叉树, 获取每一层的节点之和

```js
function layerSum(root) {}

const res = layerSum({
  value: 2,
  children: [
    { value: 6, children: [{ value: 1 }] },
    { value: 3, children: [{ value: 2 }, { value: 3 }, { value: 4 }] },
    { value: 5, children: [{ value: 7 }, { value: 8 }] },
  ],
});

console.log(res);
```

- 多叉树指定层节点的个数
- 二叉树层序遍历, 每层的节点放到一个数组里
- 截图怎么实现
- js 超过 Number 最大值的数怎么处理?
