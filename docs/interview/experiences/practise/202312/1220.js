/**
 * 1.多叉树的每一层的节点之和 树转数组  数组转树
 * 2.实现阶乘(迭代/递归)
 * 3.两个字符串对比, 得出结论都做了什么操作, 比如插入或者删除
 * 4.实现一个函数，将给定的十进制数转换为 36 进制表示
 */

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
