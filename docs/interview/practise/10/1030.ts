/**
 * 1.memory/once
 * 2.apply
 * 3.new
 * 4.bind
 * 5.lru
 * 6.compose
 * 7.render
 */

Function.prototype.myApply = function (context, rest) {
  context = Object(context) || window;
  var sys = Symbol();
  context[sys] = this;
  var res = context[sys](...rest);
  delete context[sys];
  return res;
};

Function.prototype.mockApply = function (context, rest) {
  var fn = Object(context) || window;
  var sym = Symbol('');
  fn[sym] = this;
  var res = fn[sym](...rest);
  delete fn[sym];
  return res;
};

function sayName(name) {
  this.name = name;
}
var obj = {
  name: 'cpp',
};
sayName.apply(obj, ['cpp']);

function mockNew(Fn, ...rest) {
  var target = Object.create(Fn.prototype);
  var res = Fn.apply(target, rest);
  return res instanceof Object ? res : target;
}

function Test(name) {
  this.name = name;
}
var t1 = new Test('cpp');
var t2 = mockNew(Test, 'cpp');

function momory(fn) {
  var cache = {};
  return (...rest) => {
    var arg = JSON.stringify(rest);
    return cache[arg] || (cache[arg] = fn(...rest));
  };
}

function once(fn) {
  var isFirst = true;
  var cache;
  return (...rest) => {
    if (!isFirst) return cache;
    cache = fn(...rest);
    isFirst = false;
    return cache;
  };
}

function render(vnode, parent) {
  var mount = parent ? (el) => parent.appendChild(el) : (el) => el;
  if (typeof vnode === 'string') {
    return mount(document.createTextNode(vnode));
  } else {
    var dom = mount(document.createElement(vnode.type));
    // props
    Object.keys(vnode.props).forEach((key) => {
      dom.setAttribute(key, vnode.props[key]);
    });
    // child
    vnode.children.forEach((child) => {
      dom.appendChild(render(child, parent));
    });
    return dom;
  }
}

function compose(middlewares) {
  return (ctx, next) => {
    return dispatch(0);
    function dispatch(i) {
      var fn = middlewares[i];
      if (i === middlewares.length) fn = next;
      if (!fn) return Promise.resolve();
      try {
        // return Promise.resolve(fn(dispatch.bind(this, i+1)));
        return Promise.resolve(fn(ctx, dispatch(i + 1)));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  };
}

class LRU {
  public limit;
  public cache;
  constructor(limit) {
    this.limit = limit;
    this.cache = new Map();
  }
  get(key) {
    if (this.cache.has(key)) {
      var val = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, val);
    } else {
      return -1;
    }
  }
  set(key, val) {
    var value = this.cache.get(key);
    var len = this.cache.size;
    if (value) {
      this.cache.delete(key);
    } else if (this.limit <= len) {
      var oldkey = this.cache.keys().next().value;
      this.cache.delete(oldkey);
    }
    this.cache.set(key, val);
  }
}
