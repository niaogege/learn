/**
 * 1.extend手写
 * 2.mockClass手写
 * 3.requestIdleCallback
 * 4.滚动到底部无限加载
 * 5.Promise.allSettled
 * 6.数组拍平
 */

// > 五个最难

function mockExtend(child, parent, {}) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      configurable: true,
      enumerable: false,
      value: child,
      writable: true,
    },
  });
  // 用 Object.setPrototypeOf 继承静态属性和静态方法
  parent && Object.setPrototypeOf(child, parent);
}
// 用法
function superType(name) {
  this.name = name;
}
superType.staticFn = function () {
  console.log('staticFn');
};
superType.prototype.getName = function () {
  console.log('name: ' + this.name);
};

function subType(name, age) {
  superType.call(this, name);
  this.age = age;
}
// 必须在继承之后再往 subType 中添加原型方法，否则会被覆盖掉
subType.prototype.getAge = function () {
  console.log('age: ' + this.age);
};
let subTypeInstance = new subType('Twittytop', 29);
subType.staticFn();
subTypeInstance.getName();
subTypeInstance.getAge();
mockExtend(subType, superType, {});

function checkNew(instance, con) {
  if (!(instance instanceof con)) {
    throw new TypeError(`Class constructor ${con.name} cannot be invoked without 'new'`);
  }
}
function mockClass(con, proto, staticProps) {
  proto && defineProperties(con.prototype, proto);
  staticProps && defineProperties(con, staticProps);
  return con;
}
function defineProperties(target, obj) {
  for (let key in obj) {
    Object.defineProperty(target, key, {
      configurable: true,
      value: obj[key],
      enumerable: false,
      writable: true,
    });
  }
}
function MyName(name) {
  checkNew(this, MyName);
  this.name = name;
}
var t0 = new MyName('wmh');
var personClass = mockClass(
  MyName,
  {
    getName: function () {
      return this.name;
    },
  },
  {},
);

var t1 = new personClass('cpp');

console.log(t0, t1);

function requestIdleCallback(cb) {
  return setTimeout(() => {
    cb({
      didTimeout: false,
      timeRemaining: () => 1,
    });
  });
}

function bottomLoad() {}

class MyPromise {
  static allSettled(arr) {
    var res = [];
    return new Promise((resolve, reject) => {
      if (!arr.length) return resolve(res);
      for (let [index, item] of arr.entries()) {
        Promise.resolve(item).then(
          (val) => {
            res[index] = {
              value: val,
              status: 'fulfilled',
            };
            if (index === arr.length - 1) {
              resolve(res);
            }
          },
          (err) => {
            res[index] = {
              reason: err,
              status: 'rejected',
            };
            if (index === arr.length - 1) {
              resolve(res);
            }
          },
        );
      }
    });
  }
  static allSettled2(arr) {
    return Promise.all(
      arr.map((item) => {
        Promise.resolve(item).then(
          (val) => {
            return {
              status: 'fulfilled',
              value: val,
            };
          },
          (err) => {
            return {
              status: 'rejected',
              reason: err,
            };
          },
        );
      }),
    );
  }
}

const flatten = (list, level = +Infinity) => {
  var stack = [...list];
  var res = [];
  let i = 0;
  while (stack.length) {
    var cur = stack.pop();
    if (Array.isArray(cur) && i < level) {
      i++;
      stack.push(...cur);
    } else {
      res.push(cur);
    }
  }
  return res.reverse();
};
const array = [1, [2, [3, 4, [5]], 3], -4];
const list1 = flatten(array);
const list2 = flatten(array, 2);
console.log(list1); // [1, 2, 3, 4, 5, 3, -4]
console.log(list2); // [1, 2, 3, 4, [5], 3, -4]
