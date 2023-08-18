/**
 * 1.链表相交
 * 2.层序遍历
 * 3.call/apply
 * 4.new
 * 5.bind
 * 6.函数重载
 * 7.compose
 */

function levelOrder(root) {
  if (!root) return [];
  var res = [];
  var queue = [root];
  while (queue.length) {
    var len = queue.length;
    var arr = [];
    for (let i = 0; i < len; i++) {
      var cur = queue.shift();
      arr.push(cur);
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

function myNew(fn, ...rest) {
  var target = Object.create(fn.prototype);
  var res = fn.apply(target, rest);
  return res instanceof 'Object' ? res : target;
}
function Person(name) {
  this.name = name;
}

/**
 * @param {*} fn
 * @param  {...any} rest
 * @returns
 * 1.将空对象的隐式原型（proto）指向构造函数的 prototype。
 * 2.使用 apply 改变 this 的指向
 * 3.如果无返回值或者返回一个非对象值，则将 obj 返回作为新对象；如果返回值是一个新对象的话那么直接返回该对象。
 */
function myNew(fn, ...rest) {
  var target = Object.create(fn.prototype);
  var res = fn.apply(target, rest);
  return res instanceof Object ? res : target;
}

myNew(Person, 'cpp');
Function.prototype.myCall = function (context, ...rest) {
  var con = Object(context) || window;
  var sym = Symbol();
  con[sym] = this;
  var res = con[sym].apply(context, rest);
  delete con[sym];
  return res;
};

/**
 * 返回一个新函数阔以传入多个参数难点主要是在于：一个绑定函数也能使用 new 操作符创建对象：这种行为就像把原函数当成构造器。提供的 this 值被忽略，同时调用时的参数被提供给模拟函数。
 */
Function.prototype.myBind = function (context) {
  var arg = Array.prototype.slice.call(arguments, 1);
  var con = this;
  var bindFn = function () {
    var args = Array.prototype.slice.call(arguments);
    con.apply(this instanceof con ? this : context, [...args, ...arg]);
  };
  var fnBridge = function () {};
  fnBridge.prototype = this.prototype;
  bindFn.prototype = new fnBridge();
  return bindFn;
};

function compose(middlewares) {
  return function (context, next) {
    return dispatch(0);
    function dispatch(i) {
      var fn = middlewares[i];
      if (i === middlewares.length) fn = next;
      if (!fn) return Promise.resolve();
      try {
        return Promise.resolve(fn(context, () => dispatch(i + 1)));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  };
}
