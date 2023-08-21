/**
 * 1.手写es6中的extends
 * 2.手写es6中的class
 * 3.bind
 * 4.查找字符串中出现最多的字符和个数
 * 5.手写ts版Awaited<T>
 * 6.TS手写Unique 去重
 * 7.手写Object.create()的实现
 * 8.盛最多水的容器
 * 9.有效的括号
 * 10.二叉树的最小深度
 * 11.寄生组合式继承
 */

function myBind(context, ...rest) {
  const arg = rest.slice();
  var self = this;
  var bFun = function () {
    var arg2 = Array.prototype.slice.call(arguments);
    // true 构造函数调用 为 true 的时候 this 指向实例
    // false 普通函数调用 为false 的时候 this 指向window self指向绑定函数
    return self.apply(this instanceof self ? this : context, [...arg, ...arg2]);
  };
  var bridge = function () {};
  bridge.prototype = this.prototype;
  bFun.prototype = new bridge();
  return bFun;
}

function inheritedPrototype(child, parent) {
  // 第一步： 创建对象，基于父类原型创建一个副本 prototype
  var parentPrototype = Object.create(parent.prototype);
  // 第二步： 增强对象，弥补因重写原型而失去的默认的 constructor 属性
  parentPrototype.constructor = child;
  // 指定对象，将副本 prototype 赋值给子类型的原型属性
  child.prototype = parentPrototype;
}

function defineProperties(target, obj) {
  for (let key of obj) {
    Object.defineProperty(target, key, {
      configurable: true,
      writable: false,
      value: obj[key],
      enumerable: false,
    });
  }
}

function Person(name) {
  this.name = name;
}
function mockClass(con, proto, params) {
  proto && defineProperties(con.prototype, proto);
  defineProperties(con, params);
  return con;
}

var test1 = mockClass(
  Person,
  {
    getName() {
      return 'cpp';
    },
  },
  {
    staticName() {
      return 'staticName';
    },
  },
);

class Test {
  constructor(a, b) {}
}

function myExtends(child, parent) {
  const Parentprotype = Object.create(parent.prototype);
  Parentprotype.constructor = child;
  child.prototype = Parentprotype;
  // 继承静态属性和方法
  Object.setPrototypeOf(child, parent);
}

function myCreate(obj) {
  function F() {}
  F.prototype = obj;
  return new F();
}

// - 手写ts版Awaited
type MyAwaited<T extends Promise<unknown>> = T extends Promise<infer P>
  ? P extends Promise<unknown>
    ? MyAwaited<P>
    : P
  : T;
type PP1 = Promise<111>;
type PP2 = Promise<Promise<[2, 3, 4]>>;
type PP3 = MyAwaited<PP1>;
type PP4 = MyAwaited<PP2>;

type Equal<A, B = A> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
  ? true
  : false;
type E13 = Equal<string, string>; // true

type Has<A, O> = A extends [infer F, ...infer L]
  ? Equal<F, O> extends true
    ? true
    : Has<L, O>
  : false;

type PP7 = Equal<1, 2>;

type PP6 = Has<[1, 2, 3], 1>;

type Unique<T extends number[], R extends unknown[] = []> = T extends [
  infer F,
  ...infer L extends number[],
]
  ? Has<R, F> extends true
    ? Unique<L, R>
    : Unique<L, [F, ...R]>
  : R;
type PP5 = Unique<[1, 2, 3, 4, 5, 2]>;
/**
 * 给定一个二叉树，找出其最小深度。

最小深度是从根节点到最近叶子节点的最短路径上的节点数量。

说明：叶子节点是指没有子节点的节点。
 */
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var minDepth = function (root) {};
