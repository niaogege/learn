/**
 * 1.路由的2种模式
 * 2.异步串行
 * 3.异步并行
 * 4.url参数解析
 * 5.自定义遍历器计算斐波那契数列
 * 6.展示所有扑克
 */

var allList = {
  suits: ['♣️', '♦️', '♥️', '♠️'],
  court: ['J', 'Q', 'K', 'A'],
  *[Symbol.iterator]() {
    for (let suit of this.suits) {
      for (let i = 2; i <= 10; i++) {
        yield i + suit;
      }
      for (let c of this.court) {
        yield c + suit;
      }
    }
  },
};
console.log([...allList]);

var fibnonace = {
  [Symbol.iterator]() {
    var pre = 0,
      cur = 1;
    return {
      next() {
        [pre, cur] = [cur, cur + pre];
        return {
          done: false,
          value: cur,
        };
      },
    };
  },
};

for (let i of fibnonace) {
  if (i > 100) break;
  console.log(i);
}

var p1 = (name) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('p1:' + name);
      resolve('p1:' + name);
    }, 1000);
  });
var p2 = (name) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('p2:' + name);
      resolve('p2:' + name);
    }, 1000);
  });
var p3 = (name) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('p3:' + name);
      resolve('p3:' + name);
    }, 1000);
  });
function asyncSeries(...fns) {
  var [first, ...others] = fns;
  return (...args) => {
    return others.reduce((pre, cur) => {
      return Promise.resolve(pre).then((res) => cur(res));
    }, first.call(this, ...args));
  };
}
var serial = asyncSeries(p1, p2, p3);
serial('come on');

function asyncParaller(...fns) {
  return (...args) => {
    var tasks = fns.map((fn) => fn.call(this, ...args));
    return Promise.all(tasks);
  };
}

function parseUrl() {
  var obj = new URLSearchParams(location.search);
  var res = {};
  for (let [key, value] of obj.entries()) {
    res[key] = value;
  }
  return res;
}
parseUrl();

var fibnonace = {
  [Symbol.iterator]() {
    let pre = 0,
      cur = 1;
    return {
      next() {
        [pre, cur] = [cur, cur + pre];
        return {
          done: false,
          value: cur,
        };
      },
    };
  },
};

for (let item of fibnonace) {
  if (item > 100) break;
  console.log(item);
}
