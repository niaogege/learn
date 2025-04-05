/**
 * 1.模拟实现数据Map
 * 2.大数加减
 */

/**
 * @param {string} num1
 * @param {string} num2
 * @return {string}
 */
function add(num1, num2) {
  let len = Math.max(num1.length, num2.length);
  num1 = num1.padStart(len, '0');
  num2 = num2.padStart(len, '0');
  let res = '';
  let flag = 0;
  let i = len - 1;
  while (i >= 0) {
    flag = Number(num1[i]) + Number(num2[i]) + flag;
    res = (flag % 10) + res;
    flag = Math.floor(flag / 10);
    i--;
  }
  return flag === 1 ? '1' + res : res;
}
console.log(add('1', '0'));
class NodeStore {
  set(node, value) {}

  get(node) {}

  has(node) {}
}

function momo(func, resolver = (...arg) => arg.join('_')) {
  let cache = new Map();
  return function (...arg) {
    let key = resolver(...arg);
    if (cache.has(key)) {
      return cache.get(key);
    }
    let val = func.apply(this, arg);
    cache.set(key, val);
    return val;
  };
}
var func = (a, b) => a + b;
var test1 = memo(func);
test1(1, 2); // key 1_2

function shuffle(arr) {
  for (let i = arr.length - 1; i >= 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
shuffle([1, 2, 3, 4]);

function debounce(fn, wait) {
  let timer = null;
  return function (...arg) {
    if (!timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, arg);
      timer = null;
    }, wait);
  };
}
/**
 * @param {(...args:any[]) => any} func
 * @param {number} wait
 * @returns {(...args:any[]) => any}
 */
function throttle(func, wait) {
  let lastArg = null;
  let waiting = false;
  return function (...arg) {
    if (!waiting) {
      waiting = true;
      func.apply(this, arg);
      setTimeout(() => {
        waiting = false;
        if (lastArg) {
          func.apply(this, lastArg);
        }
      }, wait);
    } else {
      lastArg = arg;
    }
  };
}

function throttle(func, wait) {
  let lastArg = null;
  let waiting = false;
  return function (...arg) {
    if (!waiting) {
      waiting = true;
      func.apply(this, arg);
      let timeout = () => {
        return setTimeout(() => {
          waiting = false;
          if (lastArg) {
            func.apply(this, lastArg);
            waiting = true;
            lastArg = null;
            timeout();
          }
        }, wait);
      };
      timeout();
    } else {
      lastArg = arg;
    }
  };
}
