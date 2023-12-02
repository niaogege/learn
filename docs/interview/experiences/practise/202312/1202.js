/**
 * 1.观察者模式
 * 2.发布订阅模式
 * 3.装饰者模式
 * 4.bind
 * 5.reduce
 *
 */

Array.prototype.myReduce = function (fn, init) {
  var arr = this || [];
  var res = init ? init : arr[0];
  for (let i = init ? 0 : 1; i < arr.length; i++) {
    res = fn.call(this, res, arr[i], i, arr);
  }
  return res;
};

Function.prototype.myBind = function (context) {
  var self = this;
  var arg = [].prototype.slice.call(arguments, 1);
  var fBound = function () {
    var arg2 = [].prototype.slice.call(arguments);
    self.apply(this instanceof self ? this : context, [...arg, ...arg2]);
  };
  var fBridge = function () {};
  fBridge.prototype = this.prototype;
  fBound.prototype = new fBridge();
  return fBound;
};

class Subject {
  constructor() {
    this.list = [];
  }
  addObserver(fn) {
    this.list.push(fn);
  }
  notify(...rest) {
    this.list.forEach((o) => o.upodate(...rest));
  }
}

class Observer {
  constructor(name) {
    this.name = name;
  }
  update(state) {
    console.log(this.name + state);
  }
}

var wather1 = new Observer('cpp');
var wather2 = new Observer('wmh');
var subject = new Subject();
subject.addObserver(wather1);
subject.addObserver(wather2);

subject.notify('change name');
