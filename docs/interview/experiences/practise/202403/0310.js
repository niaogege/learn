/**
 * 1.永远不要放弃，我可能离成功就差一步之遥
 * 2.前端架构和框架，前面准备了那么久，时刻厚积薄发一下了
 * 3.不定长二维数组全排列
 * 4.二叉树的直径
 * 5.重复的子字符串
 * 6.嵌套对象扁平化
 * 7.阿拉伯数字转成中文
 * 8.最长的有效括号
 * 9.10进制转换36进制
 * 10.删除链表的倒数第 N 个结点
 * 11.重排链表
 * 12.怎么实现图片懒加载的
 */

function longestValid(str) {
  let stack = [-1];
  let max = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] == '(') {
      stack.push(i);
    } else {
      stack.pop();
      if (stack.length == 0) {
        stack.push(i);
      } else {
        max = Math.max(max, i - stack.slice(-1));
      }
    }
  }
  return stack.length;
}

function loadImg(url, option) {
  return new Promise((resolve, reject) => {
    const img = new Image(option);
    img.src = url;
    img.onload = function () {
      resolve(img);
    };
    img.onerror = function () {
      reject(e);
    };
  });
}
loadImg('', {}).then((res) => console.log());

function flattenObj(obj, res = {}, path = '', isArray = false) {
  for (let [k, val] of Object.entries(obj)) {
    if (Array.isArray(val)) {
      let tmp = isArray ? `${path}[${k}]` : `${path}${k}`;
      flattenObj(val, res, tmp, true);
    } else if (typeof val == 'object') {
      let tmp = isArray ? `${path}[${k}].` : `${path}${k}.`;
      flattenObj(val, res, tmp, false);
    } else {
      let tmp = isArray ? `${path}[${k}]` : `${path}${k}`;
      res[tmp] = val;
    }
  }
  return res;
}
flattenObj({
  a: {
    b: 1,
    c: [1, 2, 3, 4],
  },
});

/**
 * @param {ListNode} head
 * @param {number} n
 输入：head = [1,2,3,4,5], n = 2
 输出：[1,2,3,5]
 */
var removeNthFromEnd = function (head, n) {
  let dummy = { next: head, val: null };
  let fast = dummy;
  let slow = dummy;
  n = n + 1;
  while (n-- && fast != null) {
    fast = fast.next;
  }
  while (fast != null) {
    fast = fast.next;
    slow = slow.next;
  }
  slow.next = slow.next.next;
  return dummy.next;
};

/**
 * @param {ListNode} head
 * @return {void} Do not return anything, modify head in-place instead.
 */
var reorderList = function (head) {
  let stack = [];
  let cur = head;
  while (cur) {
    stack.push(cur);
    cur = cur.next;
  }
  let i = 0;
  let j = stack.length - 1;
  while (i < j) {
    // 开头执行末尾
    stack[i].next = stack[j];
    i++;
    if (i == j) break;
    // 末尾指向开头
    stack[j].next = stack[i];
    j--;
  }
  stack[j].next = null;
};

// 括号生成
function generate(n) {
  if (n < 1) return '';
  let ans = [];
  let dfs = (paths, left, right) => {
    if (left < right || left > n) return;
    if (paths.length == 2 * n) {
      ans.push(paths.slice());
      return;
    }
    dfs(paths + '(', left + 1, right);
    dfs(paths + ')', left, right + 1);
  };
  dfs('', 0, 0);
  return ans;
}
generate(3);

/** 
输入：s = "(()"
输出：2
解释：最长有效括号子串是 "()"
*/
var longestValidParentheses = function (s) {
  if (s.length < 2) return 0;
  let stack = [-1];
  let len = s.length;
  let max;
  for (let i = 0; i < len; i++) {
    if (s[i] == '(') {
      stack.push(i);
    } else {
      stack.pop();
      if (stack.length == 0) {
        stack.push(i);
      } else {
        max = Math.max(max, i - stack.slice(-1));
      }
    }
  }
  return max;
};

function numTrans(str) {
  str = Math.abs(str).toString();
  let res = [];
  let units = ['', '万', '亿'];
  let len = str.length;
  for (let i = len; i > 0; i -= 4) {
    let cur = str.slice(Math.max(0, i - 4), i);
    let item = transfer(cur);
    res.push(item);
  }
  for (let i = 0; i < res.length; i++) {
    res[i] += units[i];
  }
  return res.reverse().join('');
}
function transfer(str) {
  str = '' + str;
  let res = [];
  let base = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  let gran = ['', '十', '百', '千'];
  let len = str.length;
  for (let i = 0; i < str.length; i++) {
    let num = str[i];
    if (num !== '0') {
      if (i >= 1 && str[i - 1] == '0') res += base[0];
      res += base[num] + gran[len - i - 1];
    }
  }
  if (len == 2 && str[0] == '1') {
    res = res.slice(1);
  }
  return res;
}
numTrans('102');
// 一千二百三十四

function allPer(arr) {
  let ans = [];
  let backTrack = (arr, path, start) => {
    if (arr.length == path.length) {
      ans.push(path.slice());
      return;
    }
    for (let i = 0; i < arr[start].length; i++) {
      path.push(arr[start][i]);
      backTrack(arr, path, start + 1);
      path.pop();
    }
  };
  backTrack(arr, [], 0);
  return ans;
}
allPer([
  ['a', 'b'],
  [1, 2, 3, 4],
]);
function to36(str, base = 36) {
  str = +str;
  let radix = '0123456789abcdefghijklmnopqrstuvwxyz';
  let res = '';
  let flag;
  while (str > 0) {
    flag = str % base;
    res = radix[flag] + res;
    str = Math.floor(str / base);
  }
  return res;
}
to36(360);

// 最大直径
var diameterOfBinaryTree = function (root) {
  if (root == null) return 0;
  let len = 0;
  let dfs = (root) => {
    if (root == null) return 0;
    let left = dfs(root.left);
    let right = dfs(root.right);
    len = Math.max(len, left + right);
    return Math.max(left, right) + 1;
  };
  dfs(root);
  return len;
};

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
  [1, 2, 3, 4],
  ['a', 'b'],
]);
A1a;
A1b;
A2a;
A2b;
B1a;
B1b;
