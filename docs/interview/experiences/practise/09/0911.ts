/**
 * 1.axios
 * 2.图片懒加载
 * 3.requestIdleCallback
 * 10.二叉树的最小深度/最大深度
 * 5.单例模式手写
 * 6.观察者模式
 */

function maxDepth2(node) {
  // 如果没有root 返回 0
  if (!node) return 0;
  var leftD = maxDepth2(node.left); // ⬅️
  var rightD = maxDepth2(node.right); // 右
  var depth = 1 + Math.max(leftD, rightD); // 跟
  return depth;
}

class InterceptorManager {
  public handlers;
  constructor() {
    this.handlers = [];
  }
  use({ fulfilled, rejected }) {
    this.handlers.push({
      fulfilled,
      rejected,
    });
    return this.handlers.length - 1;
  }
  eject(id) {
    if (id) {
      this.handlers[id] = null;
    }
  }
  foreach(fn) {
    if (this.handlers) {
      this.handlers.foreach((item) => {
        item && fn(item);
      });
    }
  }
}

function requestIdleCallback(cb) {
  var start = Date.now();
  return setTimeout(() => {
    cb({
      didTimeout: false,
      timeRemaining: function () {
        return Math.max(0, 50 - (Date.now() - start));
      },
    });
  }, 1);
}

function cancelIdleCallback(id) {
  clearTimeout(id);
}
