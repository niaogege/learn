/**
 * 1.实现es6的class
 * 2.实现es6的extend继承
 * 3.手写虚拟DOM
 * 4.数组扁平化实现
 * 5.[手写观察者模式](https://mp.weixin.qq.com/s/uKPVedfQkgEPYoRUtwyeQQ)
 */

function myFlatten(arr) {
  return arr.reduce((pre, cur) => {
    return pre.concat(Array.isArray(cur) ? myFlatten(cur) : cur);
  }, []);
}

function myFlatten2(arr) {
  return arr.reduce((pre, cur) => {
    if (Array.isArray(cur)) {
      const other = myFlatten2(cur);
      return [...pre, ...other];
    }
    return [...pre, cur];
  }, []);
}
myFlatten2([1, [2, 3], [4, [5, 6]]]);

function checkNew(instance, con) {
  if (!instance instanceof con) {
    throw new TypeError(`Class constructor ${con.name} cannot be invoked without 'new'`);
  }
}
const defineProperties = function (target, obj) {
  for (const key in obj) {
    Object.defineProperty(target, key, {
      configurable: true,
      enumerable: false,
      value: obj[key],
      writable: true,
    });
  }
};

function createClass(con, proto, staticAttr) {
  proto && defineProperties(con.prototype, proto);
  staticAttr && defineProperties(con, staticAttr);
  return con;
}

// test
function Person(name) {
  checkNew(this, Person);
  this.name = name;
}

var p2 = createClass(Person, {
  getName() {
    return this.name;
  },
});
var t2 = new p2('wmh');
console.log(t2);

class Person {
  constructor(name) {
    this.name = name;
  }
  getName() {
    return this.name;
  }
}

var p1 = new Person('cpp');
console.log(p1);

function extend(Child, Parent, proto) {
  var prototype = Object.create(Parent.prototype); // 1
  prototype.constructor = Child; // 2 父类的构造函数指向子类
  Child.prototype = prototype; // 3 子类的原型执行父类原型
  Object.setPrototypeOf(Child, Parent); // 类的静态属性需要子类继承
  for (var k in proto) {
    Child.prototype[k] = proto[k];
  }
}

function extend2(Child, Parent) {
  Child.prototype = Object.create(Parent.prototype, {
    constructor: {
      configurable: true,
      enumerable: false,
      value: subType,
      writable: true,
    },
  });
  Object.setPrototypeOf(Child, Parent);
}

// Object => dom
function render(vnode) {
  if (typeof vnode === 'number' || typeof vnode === 'string') {
    return document.createTextNode(vnode);
  }
  let dom = document.createElement(vnode.type);
  if (vnode.attrs) {
    Object.keys(vnode.attrs).forEach((key) => {
      const attr = vnode.attrs[key];
      dom.setAttribute(key, attr);
    });
  }
  vnode.children.forEach((child) => {
    dom.appendChild(render(child));
  });
  return vnode;
}
