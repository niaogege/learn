/**
 * 1.once
 * 2.memo
 * 3.class
 * 4.TS手写IndexToUnion索引转联合类型
 * 5.二叉树的最小深度/最大深度
 * 6.手写Object.create()的实现
 * 7.查找字符串中出现最多的字符和个数
 * 8.[手写虚拟DOM](https://mp.weixin.qq.com/s/S-7w8KgG0R5mdFIcCT0Keg)
 * 9.手写ts版Awaited<T>
 * 10.[手写axios以及核心组件拦截器](https://mp.weixin.qq.com/s/nmKU-Z1Ewc75HH0NxgvcCw)
 * 11.二叉树迭代遍历
 */

function minDepth(root) {
  if (root == null) return 0;
  var leftDepth = minDepth(root.left);
  let rightDepth = minDepth(root.right);

  // 如果左子树为空 右子树不为空  1+右子树深度
  if (root.left == null && root.right) {
    return 1 + rightDepth;
  }
  if (root.left && root.right == null) {
    return 1 + leftDepth;
  }
  let res = Math.min(leftDepth, rightDepth) + 1;
  return res;
}

function treeMaxHeight(root) {
  if (root == null) return 0;
  let leftDepth = treeMaxHeight(root.left); // 左
  let rightDepth = treeMaxHeight(root.right); // 右
  let depth = 1 + Math.max(leftDepth, rightDepth); // 根
  return depth;
}

function maxDepth(root) {
  if (!root) return 0;
  var queue = [root];
  var depth = 0;
  while (queue.length) {
    depth++;
    for (let i = 0; i < queue.length; i++) {
      var node = queue.shift();
      node.left && queue.push(node.left);
      node.right && queue.push(node.right);
    }
  }
  return depth;
}

// preOrder 先序 根左右
function PreOrder(tree, res = []) {
  if (!tree) return res;
  var queue = [tree];
  while (queue.length) {
    // 入队
    var last = queue.pop();
    res.push(last.value);
    if (last.right) {
      queue.push(last.right);
    }
    if (last.left) {
      queue.push(last.left);
    }
  }
  return res;
}

// postOrder 后序 左右根
function PosrOrder(tree, res = []) {
  if (!tree) return res;
  var queue = [tree];
  while (queue.length) {
    // 入队
    var last = queue.pop();
    res.push(last.value);
    if (last.left) {
      queue.push(last.left);
    }
    if (last.right) {
      queue.push(last.right);
    }
  }
  // 根 右 左
  return res;
}

var tree = {
  tag: 'DIV',
  attrs: {
    id: 'app',
  },
  child: [
    {
      tag: 'SPAN',
      child: [
        {
          tag: 'A',
          children: [],
        },
      ],
    },
  ],
};
/**
 *
 * 通过 DOM 不同的 api (比如 document.createElement/document.createTextNode) 递归创建 dom 和设置属性(比如 dom.addEventListener/dom.setAttribute)，这就是 vdom 的渲染流程。」
 */
function render(node, root) {
  const mount = root ? (el) => root.appenChild(el) : (el) => el;
  if (node.type === 'text') {
    return mount(document.createTextNode(node));
  } else {
    var dom = mount(document.createElement(node.tag));
    for (const child of node.child) {
      render(child, dom);
    }
    for (const prop in node.props) {
      dom.setAttribute(prop, node.props[prop]);
    }
    return dom;
  }
}
render(tree, document.getElementById('#app'));

// 原型式继承 将传入的对象作为创建的对象的原型
function Create(fn) {
  function F() {}
  F.prototype = fn;
  return new F();
}

// TS手写IndexToUnion索引转联合类型

interface Cpp {
  name: string;
  age: number;
}

type Cpp2 = IndexToUnion2<Cpp>;

type IndexToUnion2<T> = {
  [K in keyof T]: {
    [K1 in K]: T[K1];
  };
}[keyof T];

type t1 = Promise<[1, 2, 3]>;
type AA1 = MyAwaited<t1>;
type AA2 = MyAwaited<Promise<Promise<[1, 2, 3]>>>;
type MyAwaited<T extends Promise<unknown>> = T extends Promise<infer P>
  ? P extends Promise<unknown>
    ? MyAwaited<P>
    : P
  : T;

function mtExtend(child, parent) {
  var parentPrototype = parent.prototype;
  parentPrototype.constructor = child;
  child.prototype = parentPrototype;
  // // 继承静态方法
  Object.setPrototypeOf(child, parent);
}

function memo(fn) {
  var cache = {};
  return (...rest) => {
    var key = JSON.stringify(rest);
    return cache[key] || (cache[key] = fn.apply(this, rest));
  };
}

function defineProperty(target, obj) {
  for (let key in obj) {
    Object.defineProperty(target, key, {
      value: obj[key],
      configurable: true,
      enumerable: true,
      writable: true,
    });
  }
}

function createClass(con, proto, staticAttr) {
  con && defineProperty(con.prototype, proto);
  staticAttr && defineProperty(con, staticAttr);
  return con;
}

const checkNew = function (instance, con) {
  if (!(instance instanceof con)) {
    throw new TypeError(`Class constructor ${con.name} cannot be invoked without 'new'`);
  }
};

function Person(name) {
  checkNew(this, Person);
  this.name = name;
}
var PersonClass = createClass(
  Person,
  {
    getName: function () {
      return this.name;
    },
  },
  {
    getAge: function () {},
  },
);
