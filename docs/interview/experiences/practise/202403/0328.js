/**
 * never give up
 * 1.vue render
 * 2.平衡二叉树
 * 3.二叉树中第k小的元素
 * 4.二叉树最大路径和
 * 5.x的平方根
 * 6.
 */

let mockInterval = {
  timer: null,
  setInterval: function (fn, delay) {
    let now = Date.now();
    const reqFn = () => {
      cur = Date.now();
      this.timer = requestAnimationFrame(reqFn);
      if (cur - now >= delay) {
        fn.apply(this);
        now = cur;
      }
    };
    requestAnimationFrame(reqFn);
  },
  clearInterval: function () {
    cancelAnimationFrame(this.timer);
  },
};

function balance(root) {
  if (root == null) return true;
  let left = maxDepth(root.left);
  let right = maxDepth(root.right);
  return Math.abs(left - right) <= 1 && balance(root.left) && balance(root.right);
}

function maxDepth(root) {
  if (root == null) return 0;
  let l = maxDepth(root.left);
  let r = maxDepth(root.right);
  return Math.max(l, r) + 1;
}

/**
 * @param {number} x
 * @return {number}
 */
var mySqrt = function (x) {
  if (x <= 1) return x;
  let l = 0;
  let r = x;
  while (l <= r) {
    let mid = l + Math.floor((r - l) / 2);
    if (mid * mid > x) {
      r = mid - 1;
    } else {
      l = mid + 1;
    }
  }
  return r;
};
mySqrt(4);

function binaryS(arr, target) {
  let l = 0;
  let r = arr.right;
  while (l < r) {
    let mid = l + Math.floor((r - l) / 2);
    if (arr[mid] == target) return mid;
    if (arr[mid] < target) {
      l = mid + 1;
    } else if (arr[mid] > target) {
      r = mid - 1;
    }
  }
}

/**
 * @param {TreeNode} root
 * @param {number} k
 * @return {number}
 */
var kthSmallest = function (tree, k) {
  let stack = [];
  let root = tree;
  while (stack.length || root) {
    if (root) {
      stack.push(root);
      root = root.left;
    } else {
      root = stack.pop();
      --k;
      if (k == 0) {
        break;
      }
      root = root.right;
    }
  }
  return root.val;
};

// 中序遍历 左跟右
function inorder(tree) {
  let ans = [];
  let stack = [];
  let root = tree;
  while (stack.length || root) {
    if (root) {
      stack.push(root);
      root = root.left;
    } else {
      root = stack.pop();
      ans.push(root.val);
      root = root.right;
    }
  }
  return ans;
}

function render(str, data) {
  let reg = /\{\{(\w+)\}\}/;
  if (reg.test(str)) {
    let key = reg.exec(str)[1];
    str = str.replace(reg, data[key]);
    return render(str, data);
  }
  return str;
}

render('{{msg}}::{{name}}', {
  msg: 'info',
  name: 'cpp',
});
