/**
 * 1.手写bind
 */

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
