/**
 * 1.数组随机展示数字
 * 3.手写Nossr
 * 7.手写去重
 * 9.如何实现无限累加的一个函数
 * 10.手写函数重载
 * 2.滑动窗口，无重复字符的字串
 * 8.手写jsonp
 * 6.手写前端路由history和hash
 * 5.最大子序和
 * 4.二叉树迭代遍历
 */

function everSum(...rest) {
  var f = (...arg) => everSum(...rest, ...arg);
  f.valueOf = () => rest.reduce((a, b) => a + b, 0);
  return f;
}
everSum(1, 2)(3, 4)(5).valueOf();

import { useEffect, useState } from 'react';

const NoSSR = (props) => {
  const { children } = props;
  const [init, setInit] = useState(false);
  useEffect(() => {
    setInit(true);
  }, []);
  if (init) {
    return <>{children}</>;
  } else {
    return null;
  }
};

function removeDup(arr) {
  //1
  var res = [...new Set(arr)];
  // 2
  var res = arr.filter((e, index) => index === arr.indexOf(e));
  return res;
}
removeDup([1, 2, 3, 4, 5, 6, 7, 8, 9, 7, 6, 5]);

function heavyLoad(obj, name, fn) {
  var oldFn = obj[name];
  obj[name] = function (...rest) {
    if (rest.length === fn.length) {
      fn.apply(this, rest);
    } else {
      oldFn.apply(this, rest);
    }
  };
}
var test = { name: 'cpp' };
heavyLoad(test, 'show', () => {
  console.log('show one');
});
heavyLoad(test, 'show', (a, b) => {
  console.log('show two', a, b);
});
test.show();
test.show('wmh', 'cpp');

// 无重复的最长子串
/**
输入: s = "abcabcbb"
输出: 3 
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
 */
function maxLen(str) {
  var max = 0;
  var res = [];
  for (let i = 0; i < str.length; i++) {
    var cur = str[i];
    var index = res.indexOf(cur);
    if (index > -1) {
      res.splice(0, index + 1);
    }
    res.push(cur);
    max = Math.max(res.length, max);
  }
  return max;
}
maxLen('abcabcbb');

var node = {
  val: 1,
  left: {
    val: 2,
    left: {
      val: 4,
      left: null,
      right: null,
    },
    right: {
      val: 5,
      left: null,
      right: null,
    },
  },
  right: {
    val: 3,
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
};

// 根左右
// 入栈 右 左
// 出栈 根 左 右
// 先加入右孩子 然后说加入左孩子 出栈才能是左孩子有孩子
function preorderTraversal(node, res = []) {
  if (!node) return [];
  var stack = [node];
  while (stack.length) {
    var cur = stack.pop();
    res.push(cur.val);
    if (cur.right) {
      stack.push(cur.right);
    } else if (cur.left) {
      stack.push(cur.left);
    }
  }
  return res;
}

// 中序遍历 左  根 右 访问的元素和处理的元素不一致
//
function inorder(root, res = []) {
  if (!root) return res;
  var cur = root;
  var stack = [];
  while (cur && stack.length) {
    if (cur) {
      stack.push(cur);
      // 左
      cur = cur.left;
    } else {
      cur = stack.pop();
      // 根
      res.push(cur.val);
      // 右
      cur = cur.right;
    }
  }
}

// 后序遍历 左右根
// 再来看后序遍历，先序遍历是中左右，后续遍历是左右中，那么我们只需要调整一下先序遍历的代码顺序，就变成中右左的遍历顺序，然后在反转result数组，输出的结果顺序就是左右中了

// 根左右 =》 根右左 =》 左右根
function postorder(root, res = []) {
  if (!root) return res;
  var stack = [root];
  while (cur && stack.length) {
    var cur = stack.pop();
    res.push(cur.val);
    if (cur.left) {
      stack.push(cur.left);
    }
    if (cur.right) {
      stack.push(cur.right);
    }
  }
  return res.reverse();
}
postorder(node);

function jsonp(url, cb) {
  const funName = 'JSONP_callBack';
  var srcipt = document.createElement('script');
  url = url + '?callback=' + funName;
  srcipt.src = url;
  script.type = 'text/javascript';
  document.body.appendChild(srcipt);
  window[funName] = function (data) {
    cb && cb(data);
    delete window[cb];
    document.body.removeChild(srcipt);
  };
}
jsonp('http://127.0.0.1', (res) => {
  console.log(res);
});
