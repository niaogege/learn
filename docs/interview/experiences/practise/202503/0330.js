// 如何完成170+道题？

/**
 * 0.throttle
 * 1.debounce
 * 3.mockAsync
 * 4.curry
 * 5.composition pipe
 * 6.打乱数组
 * 7.memo记忆化函数
 * 8.
 * 9.
 */

function memo(func, resolver) {
  // your code here
  let key = Array.prototype.slice.call(arguments, 1)[0];
  if (typeof resolver === 'function') {
    key = resolver.call(this);
  }
  let cache = {};
  return (...arg) => {
    return cache[key] || (cache[key] = func.apply(this, ...arg));
  };
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let tmp = arr[i];
    arr[i] = tmp;
    tmp = arr[j];
  }
  return arr;
}
shuffle([1, 2, 3]);

// 防抖
function debounce(func, wait) {
  // your code here
  let timer = null;
  return function (...arg) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this, arg);
      timer = null;
    }, wait);
  };
}

// 节流
function throttle(func, wait) {
  let waiting = false;
  let lastArg = null;

  let timeout = () =>
    setTimeout(() => {
      if (lastArg) {
        func.apply(this, lastArg);
        waiting = true;
        lastArg = null;
        timeout();
      } else {
        waiting = false;
      }
    }, wait);

  return function (...arg) {
    if (!waiting) {
      func.apply(this, arg);
      waiting = true;
      timeout.call(this);
    } else {
      lastArg = arg;
    }
  };
}
function throttle(func, wait) {
  // your code here
  let timeId = null;
  return function (...arg) {
    if (timeId) {
      clearTimeout(timeId);
    }
    timeId = setTimeout(() => {
      func.apply(this, arg);
    }, wait);
  };
}

function mockAsync(fn) {
  return function (...arg) {
    let asyncFn = fn.apply(this, arg);
    return new Promise((resolve, reject) => {
      return step('next');
      function step(key, param) {}
    });
  };
}

function pipe(func) {
  if (func.length == 0 || !Array.isArray(func)) return (arg) => arg;
  if (func.length == 1) return func[0];
  return function (arg1) {
    return func.reduce((pre, cur) => cur(pre), arg1);
  };
}
function pipe(...func) {
  console.log(func, 'func');
  if (func.length == 0 || !Array.isArray(func)) return (arg) => arg;
  if (func.length == 1) return func[0];
  return function (arg1) {
    return func.reduce((pre, cur) => cur(pre), arg1);
  };
}
var times = (y) => (x) => x * y;
var fn = pipe([times(2), times(3)]);
console.log(fn);
fn(10);
