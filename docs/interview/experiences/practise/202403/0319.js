/**
 * 1.异步串行
 * 2.下一个排列
 * 3.无重叠区间
 * 4.删除链表的倒数第N个节点
 * 5.Promise
 * 6.删除有序数组中的重复项
 * 7.lodash.set/get
 * 8.多叉树, 获取每一层的节点之和
 * 9.二叉树右视图
 */

function mockLodashGet(obj, path, defaultVal = 'undefined') {
  let paths = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  let res = obj;
  for (let p of paths) {
    res = Object(res)[p];
    if (!res) {
      return defaultVal;
    }
  }
  return res;
}
var test = {
  name: {
    cpp: 'chendapeng',
  },
};
mockLodashGet(test, 'name.cpp');
mockLodashGet();
function mockLodashSet(obj, path, val) {
  let paths = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  console.log(paths, 'paths');
  paths.reduce((cur, pre, index, arr) => {
    if (index == arr.length - 1) {
      cur[pre] = val;
      return null;
    } else if (pre in cur) {
      return cur[pre];
    } else {
      return (cur[pre] = {});
    }
  }, obj);
}
var test = {
  name: {
    cpp: 'chendapeng',
  },
};
mockLodashSet(test, 'name.cpp', 'wmh');
function dfsLight(tree) {
  let level = 0;
  let ans = [];
  let dfs = (node, step) => {
    if (!node) return;
    if (step > level) {
      ans.push(node.val);
      level++;
    }
    if (node.right) {
      dfs(node.right, step + 1);
    }
    if (node.left) {
      dfs(node.left, step + 1);
    }
  };
  dfs(node, 1);
  return ans;
}

function lightBinary(tree) {
  let ans = [];
  let stack = [tree];
  while (stack.length) {
    let len = stack.length;
    let arr = [];
    for (let i = 0; i < len; i++) {
      let cur = stack.shift();
      arr.push(cur.val);
      if (cur.left) {
        stack.push(cur.left);
      }
      if (cur.right) {
        stack.push(cur.right);
      }
    }
    ans.push(arr.pop());
  }
  return ans;
}

// 输入：nums = [0,0,1,1,1,2,2,3,3,4]
// 输出：5, nums = [0,1,2,3,4]
function removeDup(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == arr[i + 1]) {
      arr.splice(i, 1);
      i--;
    }
  }
  return arr;
}
removeDup([0, 0, 1, 1, 2, 3, 4]);

class Promise {
  data = undefined;
  status = 'pending';
  onResolvedCbs = [];
  onRejectedCbs = [];
  constructor(exe) {
    const resolve = (val) => {
      setTimeout(() => {
        this.data = val;
        this.status = 'fulfilled';
        this.onResolvedCbs.forEach((fn) => fn(val));
      });
    };
    const reject = (res) => {
      setTimeout(() => {
        this.data = res;
        this.status = 'rejected';
        this.onRejectedCbs.forEach((fn) => fn(res));
      });
    };
    exe(resolve, reject);
  }
  then(onFulfilled, onRejected) {
    // 判断参数
    onFulfilled = typeof onFulfilled == 'function' ? onFulfilled : (e) => e;
    onRejected = typeof onRejected == 'function' ? onRejected : (e) => e;
    // 定义新的promise
    let p2 = new Promise((resolve, reject) => {
      if (this.status == 'pending') {
        this.onResolvedCbs.push(() => {
          let x = onFulfilled(this.data);
          this.parsePromise(p2, x, resolve, reject);
        });
        this.onRejectedCbs.push(() => {
          let x = onRejected(this.data);
          this.parsePromise(p2, x, resolve, reject);
        });
      }
      if (this.status === 'fulfilled') {
        try {
          let x = onFulfilled(this.data);
          this.parsePromise(p2, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      }
      if (this.status == 'rejected') {
        try {
          let x = onRejected(this.data);
          this.parsePromise(p2, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      }
    });
    return p2;
  }
  parsePromise(promise, x, resolve, reject) {
    if (promise == x) {
      reject(new TypeError('chaining circule'));
    }
    try {
      if (x instanceof Promise) {
        x.then(resolve);
      } else {
        resolve(x);
      }
    } catch (e) {
      reject(e);
    }
  }
}

function removeNode(head, k) {
  let dummy = { next: head, val: null };
  let cur = dummy;
  let fast = cur;
  let slow = cur;
  k = k + 1;
  while (k-- && fast) {
    fast = fast.next;
  }
  while (fast) {
    fast = fast.next;
    slow = slow.next;
  }
  slow.next = slow.next.next;
  return dummy.next;
}

// [1,2],[1,2], [2,3]
function noMergeArr(nums) {
  nums.sort((a, b) => a[0] - b[0]);
  let end = nums[0][1];
  let count = 0;
  for (let i = 1; i < nums.length; i++) {
    let cur = nums[i];
    // 重叠
    if (cur[0] >= end) {
      end = cur[1];
    } else {
      count++;
      end = Math.min(end, cur[1]);
    }
  }
  return count;
}

noMergeArr([
  [1, 2],
  [1, 2],
  [1, 2],
]);
function mergeArr(nums) {
  nums.sort((a, b) => a[0] - b[0]);
  let pre = nums[0];
  let ans = [];
  for (let i = 1; i < nums.length; i++) {
    let cur = nums[i];
    if (cur[0] > pre[1]) {
      ans.push(cur);
      pre = cur;
    } else {
      pre[1] = Math.max(cur[1], pre[1]);
    }
  }
  ans.push(pre);
  return ans;
}

function seriesParallel(...rest) {
  let [fn, ...last] = rest;
  return (...arg) => {
    return last.reduce((pre, cur) => {
      return Promise.resolve(pre).then((val) => cur(val));
    }, fn(...arg));
  };
}
