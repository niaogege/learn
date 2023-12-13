/**
 * 1.阿拉伯数组转换成中文数字
 * 2.最近公共祖先
 * 3.是否是对称二叉树
 * 4.前序和中序解构为二叉树/后序和中序解构二叉树
 * 5.螺旋矩阵
 * 6.将给定的十进制数转换为 36 进制表示
 */

function numToString(n) {
  n = n.toString();
  let units = ['', '十', '百', '千'];
  let nums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  if (n === '0') return nums[0];
  let res = '';
  let len = n.length;
  for (let i = 0; i < len; i++) {
    let num = n[i];
    if (num != '0') {
      if (i >= 1 && n[i - 1] === '0') {
        res = res + nums[0];
      }
      res = res + nums[num] + units[len - i - 1];
    }
  }
  if (len == 2 && n[0] === '1') {
    res = res.slice(1);
  }
  return res;
}

function trans(n) {
  const isLose = n < 0;
  n = Math.abs(n).toString();
  let units = ['', '万', '亿'];
  // 四个一拆分
  let res = [];
  let len = n.length;
  // 2345 1
  for (let i = len; i > 0; i -= 4) {
    let item = numToString(n.slice(Math.max(0, i - 4), i));
    res.push(item);
  }
  // 塞上万亿
  for (let i = 0; i < res.length; i++) {
    if (res[i] === '') continue;
    res[i] = res[i] + units[i];
  }
  console.log(res, 'res22');
  // 数组旋转
  if (isLose) {
    res.push('负');
  }
  return res.reverse().join('');
}
trans(12345);
function maxtir(nums) {
  if (!nums.length) return [];
  let res = [];
  let up = 0;
  let down = nums.length - 1;
  let left = 0;
  let right = nums[0].length - 1;
  while (true) {
    // 从左往右
    for (let i = left; i <= right; i++) {
      res.push(nums[up][i]);
    }
    if (++up > down) break;
    // 从上往下
    for (let i = up; i <= down; i++) {
      res.push(nums[i][right]);
    }
    if (--right < left) break;
    // 从右往左
    for (let i = right; i >= 0; i--) {
      res.push(nums[down][i]);
    }
    if (up > --down) break;
    // 从下往上
    for (let i = down; i >= 0; i--) {
      res.push(nums[i][left]);
    }
    if (right < ++left) break;
  }
  return res;
}

function buildTree2(inorder, postorder) {
  if (!inorder.length || !postorder.length) return null;
  let last = postorder.pop();
  let mid = inorder.indexOf(last);
  let tree = {
    val: last,
  };
  tree.left = buildTree(inorder.slice(0, mid), postorder.slice(0, mid));
  tree.right = buildTree(inorder.slice(mid + 1), postorder.slice(mid));
  return tree;
}

function buildTree(preorder, inOrder) {
  if (!preorder || !inOrder) return null;
  let first = preorder.shift();
  let mid = inOrder.indexOf(first);
  let tree = { val: first };
  tree.left = buildTree(preorder.slice(0, mid), inOrder.slice(0, mid));
  tree.right = buildTree(preorder.slice(mid), inOrder.slice(mid + 1));
  return tree;
}

// 是否对称二叉树
// 比较树的两边是否对称
var isSymmetric = function (root) {
  if (root == null) return true;
  var dfs = (left, right) => {
    if (left == null && right != null) return false;
    if (right == null && left != null) return false;
    if (left == null && right == null) return true;
    let outSide = dfs(left.left, right.right);
    let innerSide = dfs(left.right, right.left);
    return outSide && innerSide && left && right && left.val == right.val;
  };
  return dfs(root.left, root.right);
};
// bfs
function isSameBfs(root) {
  if (!root) return true;
  let queue = [root.left, root.right];
  while (queue.length) {
    let lefNode = queue.shift();
    let rightNode = queue.shift();
    if (rightNode == null && lefNode == null) {
      continue;
    }
    if (rightNode || lefNode || rightNode.val != lefNode.val) {
      return false;
    }
    queue.push(lefNode.left);
    queue.push(rightNode.right);
    queue.push(lefNode.right);
    queue.push(rightNode.left);
  }
  return true;
}

// dfs 最近公共祖先
function longest(root, p, q) {
  if (root == null || root == p || root == q) return root;
  let left = longest(root.left, p, q);
  let right = longest(root.right, p, q);
  if (left == null && right != null) {
    return right;
  } else if (right != null && left == null) {
    return left;
  } else if (right && left) {
    return root;
  } else {
    return null;
  }
}

/**
 * 12345 一万两千三百四十五
 * @param {number} num
 */
function NumToChina(n) {
  n = n.toString();
  let numbers = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  if (n === '0') return numbers[0];
  let units = ['', '十', '百', '千'];
  let len = n.length;
  let res = '';
  for (let i = 0; i < len; i++) {
    let num = Number(n[i]);
    if (num != 0) {
      if (i >= 1 && n[i - 1] === '0') res = res + numbers[0];
      res = res + numbers[num] + units[len - i - 1];
    }
  }
  // if (len == 2 && n[0] == '1') res = res.slice(1);
  return res;
}
NumToChina(101);
function numTo(n) {
  const isLose = n < 0;
  n = Math.abs(n).toString();
  let res = [];
  let len = n.length;
  for (let i = len; i > 0; i -= 4) {
    res.push(NumToChina(n.slice(Math.max(0, i - 4), i)));
  }
  const units = ['', '万', '亿'];
  for (let i = 0; i < res.length; i++) {
    if (res[i] == '') continue;
    res[i] = res[i] + units[i];
  }
  isLose && res.push('负');
  return res.reverse().join('');
}
numTo(12345);
