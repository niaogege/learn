/**
 * 1.手写jsonp
 * 2.请求限制
 * 3.async/await
 * 4.手写虚拟DOM
 * 5.图片懒加载实现
 * 6.实现ES6的Class/extends
 * 7.手写axios以及核心组件拦截器
 * 8.实现一个 immutable
 * 9.查找字符串中出现最多的字符和个数
 * 10.二叉树的最小深度/最大深度
 */

function maxDepth(node) {
  return 1;
}

function checkNew2(instance, con) {
  if (!(instance instanceof con)) {
    throw new TypeError('con');
  }
}
function setObject(target, obj) {
  for (let prop in obj) {
    Object.defineProperty(target, prop, {
      value: obj[prop],
      writable: true,
      configurable: true,
      enumerable: false,
    });
  }
}

function mockClass(con, proto, staticAttr) {
  setObject(con.prototype, proto);
  staticAttr && setObject(con, staticAttr);
  return con;
}

class One {
  constructor() {
    console.log('con');
  }
  play() {
    console.log('play');
  }
}
var instance1 = new One();
instance1.play();

function OneClass(name) {
  checkNew2(this, OneClass);
  this.name = name;
}
var mockClassIn = mockClass(
  OneClass,
  {
    getName() {
      return 'getName';
    },
  },
  {
    getAge() {
      return '33';
    },
  },
);
var ttt = new mockClassIn('cpp');
console.log(ttt, 'ttt');

function mockExtends(child, parent, prop) {
  var parentProto = parent.prototype;
  child.prototype = parentProto;
  parentProto.constructor = child;
  // 继承静态属性
  Object.setPrototypeOf(child, parent);
  return child;
}

let vnode = {
  tag: 'div',
  props: {},
  children: [],
};
function render22(vNode, parent) {
  var mount = parent ? (el) => parent.appenChild(el) : (el) => el;
  if (typeof vNode === 'string') {
    return mount(document.createTextNode(vNode.tag));
  } else {
    var dom = mount(document.createElement(vNode.tag));
    // 对子元素进行遍历
    for (let child of vNode['children']) {
      document.appendChild(render22(child, dom));
    }
    // 设置属性
    for (let prop in vNode.props) {
      dom.setAttribute(prop, vNode.props[prop]);
    }
    return dom;
  }
}

render22(vnode, document.getElementById('app'));

function JSONP({ url, cb }) {
  var funName = 'JSONP_' + Math.random().toString().slice(2);
  var script = document.createElement('script');
  script.src = url + '?cb=' + funName;
  document.body.appendChild(script);
  window[funName] = function (res) {
    cb && cb(res);
    delete window[funName];
    document.body.removeChild(script);
  };
}
JSONP({
  url: 'http://localhost',
  cb(res) {
    console.log(res);
  },
});

async function asyncPool(limit, arr, fn) {
  var res = [];
  var queue = [];
  for (let i = 0; i < arr.length; i++) {
    var p1 = Promise.resolve().then((res) => fn(arr[i]));
    res.push(p1);
    if (arr.length >= limit) {
      var e = p1.then(() => {
        return queue.splice(queue.indexOf(e), 1);
      });
      // 保存正在执行的异步任务
      queue.push(e);
      if (queue.length >= limit) {
        await Promise.race(queue);
      }
    }
  }
  return Promise.all(res);
}

function asyncToGenerator(G) {
  return (...rest) => {
    const gen = G.apply(this, rest);
    return new Promise((resolve, reject) => {
      function step(key, ...arg) {
        const { done, value } = gen[key](...arg);
        if (done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(
            (res) => {
              step('next', res);
            },
            (err) => {
              step('throw', err);
            },
          );
        }
      }
      step('next');
    });
  };
}
