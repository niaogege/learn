/**
 * 1.手写bind
 * 2.limitQuest
 * 3.async/await
 * 4.instanceof
 */

async function limitQuest(arr, limit, fn) {
  var queue = []; // 存放
  var res = [];
  for (let i = 0; i < arr.length; i++) {
    var p = Promise.resolve().then(() => fn(arr[i]));
    res.push(p);
    if (limit <= arr.length) {
      var q = Promise.resolve().then(() => {
        return queue.splice(queue.indexOf(q), 1);
      });
      queue.push(q);
      if (queue.length >= limit) {
        await Promise.race(queue);
      }
    }
  }
  return Promise.all(res);
}

function mockAsync(fn) {
  return (...rest) => {
    var asyncFn = fn(...rest);
    return new Promise((resolve, reject) => {
      step('next');
      function step(key, ...name) {
        var val;
        try {
          val = asyncFn[key](...name);
          if (val) {
            resolve(val);
          } else {
            Promise.resolve(val).then(
                (res) => {
                  return step('next', res);
                },
                (err) => {
                  return step('throw', err);
                },
              ),
          }
        } catch (e) {
          reject(e);
        }
      }
    });
  };
}

function myInstanceof(l, r) {
  l = l.__proto__;
  while (l) {
    if (l === r.prototype) {
      return true;
    }
    r = r.prototype;
  }
  return false;
}
// 判断一个实例是否是其父类或者祖先类型的实例
function myInstanceof2(l, r) {
  l = Object.getPrototypeOf(l);
  while (l) {
    if (l === r.prototype) {
      return true;
    }
    l = Object.getPrototypeOf(l);
  }
  return false;
}

function myInstanceof3(l, r) {
  return r.prototype.isPrototypeOf(l);
}

Function.prototype.myBind = function (context) {
  var self = this;
  var args = Array.prototype.slice.call(arguments, 1);
  var fBound = function () {
    var bindArgs = Array.prototype.slice.call(arguments);
    self.apply(this instanceof self ? this : context, args.concat(bindArgs));
  };
  var fBridge = function () {};
  fBridge.prototype = this.prototype;
  fBound.prototype = new fBridge();
  return fBound;
};
// 中序 左 根 右
function inorder(node, res = []) {
  if (!node) return res;
  var stack = [];
  var root = node;
  var res = [];
  while (root || stack.length) {
    if (root.left) {
      stack.push(root.left);
      root = root.left;
    } else {
      root = stack.pop();
      root && res.push(root.val);
      root.right && stack.push(root.right);
    }
  }
}
