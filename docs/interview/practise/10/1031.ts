/**
 * 1.hsl和rgb转化
 * 2.大数相加
 * 3.树转数组
 * 4.数组转树
 * 5.二叉树遍历迭代/递归
 */
var node = {
  val: 1,
  left: {
    val: 2,
    left: null,
    right: {
      val: 3,
      left: null,
      right: null,
    },
  },
  right: {
    val: 4,
    left: null,
    right: {
      val: 5,
      left: {
        val: 6,
        left: null,
        right: null,
      },
      right: {
        val: 7,
        left: null,
        right: null,
      },
    },
  },
};

// 层序遍历
function levelOrder(node) {
  var queue = [node];
  var res = [];
  while (queue.length) {
    var arr = [];
    const len = queue.length;
    for (let i = 0; i < len; i++) {
      var last = queue.shift();
      last && arr.push(last.val);
      if (last.left) {
        queue.push(last.left);
      }
      if (last.right) {
        queue.push(last.right);
      }
    }
    res.push(arr);
  }
  return res;
}
levelOrder(node);
//前 中 后
// 前 根左右
function preOrder(node) {
  var res = [];
  var dfs = (node) => {
    if (node) {
      res.push(node.val);
      dfs(node.left);
      dfs(node.right);
    }
  };
  dfs(node);
  return res;
}
preOrder(node);

// 根左右
// 入栈 右左
// 出栈 左右
function tarversePre(node) {
  var res = [];
  var stack = [node];
  while (stack && stack.length) {
    var first = stack.pop();
    if (first) {
      res.push(first.val);
    }
    first.right && stack.push(first.right);
    first.left && stack.push(first.left);
  }
  return res;
}
tarversePre(node);
// 中 左根右
function inOrder(node) {
  var res = [];
  var dfs = (node) => {
    if (node) {
      dfs(node.left);
      res.push(node.val);
      dfs(node.right);
    }
  };
  dfs(node);
  return res;
}

// 左 根 左右

function tarverseIn(node) {
  if (!node) {
    return [];
  }
  var res = [];
  var stack = [];
  let cur = node;
  while (cur || stack.length) {
    if (cur) {
      // 左
      stack.push(cur);
      cur = cur.left;
    } else {
      cur = stack.pop();
      res.push(cur.val);
      cur = cur.right;
    }
  }
  return res;
}
tarverseIn(node);

// 后 左右根
function postOrder(node) {
  var res = [];
  var dfs = (node) => {
    if (node) {
      dfs(node.left);
      dfs(node.right);
      res.push(node.val);
    }
  };
  dfs(node);
  return res;
}
// 入栈 根左右
function tarversePost(node) {
  var res = [];
  var stack = [node];
  while (stack && stack.length) {
    var first = stack.pop();
    if (first) {
      res.push(first.val);
    }
    first.left && stack.push(first.left);
    first.right && stack.push(first.right);
  }
  return res.reverse();
}
tarversePre(node);

// 123456789+987654321
function addBigInt(a, b) {
  var len = Math.max(a.length, b.length);
  a = a.padStart(len, '0');
  b = b.padStart(len, '0');
  var res = '';
  var flag = 0;
  for (let i = len - 1; i >= 0; i--) {
    flag = Number(a[i]) + Number(b[i]) + flag;
    res = (flag % 10) + res;
    flag = Math.floor(flag / 10);
  }
  return flag === 1 ? 1 + res : res;
}
addBigInt('1230', '123');

// #ffffff => rgb(255,255,255)
function hexToRgb(str) {
  var rgbs = str.replace('#', '0x');
  var r = rgbs >> 16;
  var g = (rgbs >> 8) & 0xff;
  var b = rgbs & 0xff;
  return `rgb(${r}, ${g}, ${b})`;
}

// rgb(255,255,255) => #ffffff
function rgbToHex(str) {
  var rgbs = str.split(/[^\d]+/);
  console.log('rgbs', rgbs);
  var [, r, g, b] = rgbs;
  var toHex = (hex) => {
    var res = Number(hex).toString(16);
    return res.length === 1 ? `0${res}` : res;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
rgbToHex('rgb(255, 255, 255)');
