/**
 * 1.洗牌算法
 * 2.requestIdleCallback
 * 3.滚动到底部
 * 4.手写router历史模式和hash模式
 * 5.mockGenerator手写生成器函数
 * 6.实现异步并行函数
 * 7.实现异步串行函数
 * 8.私有变量的实现
 * 9.出现次数最多的字符串
 * 10.链表是否有环？
 * 11.自定义迭代器遍历斐波那契数列
 */

function hasCycle(node) {
  var m = new Map();
  var cur = node;
  while (cur) {
    if (m.has(cur)) {
      return true;
    } else {
      m.set(cur, cur.value);
    }
    cur = cur.next;
  }
  return false;
}

function MockGenerator(fn) {
  return (...arg) => {
    var genFn = fn.apply(this, arg);
    return new Promise((resolve, reject) => {
      function step(key, ...rest) {
        var genRes;
        try {
          genRes = genFn[key](...rest);
        } catch (e) {
          reject(e);
        }
        var { done, value } = genRes;
        if (done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(
            (res) => {
              return step('next', res);
            },
            (err) => {
              return step('throw');
            },
          );
        }
      }
      step('next');
    });
  };
}

function sort(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i - 1));
    console.log(j);
    var temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }
  return arr;
}
sort([1, 2, 3, 4, 5, 6, 7]);

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    // // 生成 0 到 i 之间的随机索引
    const j = Math.floor(Math.random() * (i - 1));
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}
shuffleArray([1, 2, 3, 4, 5]);

let fibonacci = {
  [Symbol.iterator]() {
    let pre = 0,
      cur = 1;
    return {
      next() {
        [pre, cur] = [cur, pre + cur];
        return { value: cur, done: false };
      },
    };
  },
};
for (let num of fibonacci) {
  if (num > 100) break;
  console.log(num);
}

// 输出：
// 1
// 2
// 3
// 5
// ...

var p1 = (name) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('p1' + name);
      resolve('p1' + name);
    }, 1000);
  });
};
var p2 = (name) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('p2' + name);
      resolve('p2' + name);
    }, 2000);
  });
};

var p3 = (name) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('p3' + name);
      resolve('p3' + name);
    }, 1000);
  });
};

// 异步串行
function asynSerial(...fns) {
  const [first, ...others] = fns;
  return (...args) => {
    return others.reduce((pre, cur) => {
      return Promise.resolve(pre).then((val) => cur(val));
    }, first(...args));
  };
}
var serial = asynSerial(p1, p2, p3);
serial('cpp');
// 异步并行
function asyncParaller(...fns) {
  return (...arg) => {
    const tasks = fns.map((fn) => fn(...arg));
    return Promise.all(tasks);
  };
}
var paraller = asyncParaller(p1, p2, p3);
paraller('wmh');
function Private() {
  var data = new WeakMap();
  Private = function () {
    data.set(this, Math.random());
  };
  Private.prototype.doSth = function () {
    return data.get(this);
  };
  return new Private();
}

var p1 = new Private();
var p2 = new Private();

console.log(p1.doSth());
console.log(p2.doSth());
console.log(p1.doSth());

// 查找字符串中出现最多的字符和个数
function maxCount(str) {
  var arr = str.split('').sort().join();
}
maxCount('abcabcabcbbccccc');

function requestIdleCallback(cb) {
  return setTimeout(() => {
    cb({
      didTimeout: false,
      timeRemaining: () => 1,
    });
  });
}
/**
 *
 */
function bottomLoad() {
  // 滚动距离+innerHeight >= 页面的总高度
  // 滚动距离
  var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
  var innerHeight = +window.innerHeight;
  // 页面的总高度
  var allHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
  if (scrollTop + innerHeight >= allHeight) {
  }
}

function scrollPage() {
  var scrollHeight = document.body.scrollHeight || document.documentElement.scrollHeight; // 文档内容的总高度
  var scrollBarTop = document.body.scrollTop || document.documentElement.scrollTop; // 滚动条的滚动距离
  const distance = 50; // 距离底部还有50的时候 加载下一页
  var clientHeight = window.innerHeight;
  if (scrollBarTop + clientHeight + distance >= scrollHeight) {
    console.log('toBottom');
  }
}
window.addEventListener('scroll', scrollPage);
window.removeEventListener('scroll', scrollPage);
