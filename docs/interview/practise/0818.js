/**
 * 1.实现es6的class
 * 2.实现es6的extend继承
 * 3.手写虚拟DOM
 */

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

function createClass(constructor, proto, staticAttr) {
  proto && defineProperties(constructor.prototype, proto);
  staticAttr && defineProperties(con, staticAttr);
  return constructor;
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
