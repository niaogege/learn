function memo(fn, resolver = (...arg) => arg.join('_')) {
  let cache = new Map();
  return function (...arg) {
    const key = resolver(...arg);
    if (cache.has(key)) {
      return cache.get(key);
    }
    let val = fn.apply(this, arg);
    cache.set(key, val);
    return val;
  };
}

function render(str, data) {
  let reg = /\{\{(\w+)\}\}/gi;
  if (reg.test(str)) {
    let key = reg.exec(str)[1];
    str = str.replace(reg, data[key]);
    return render(str, data);
  }
  return str;
}

// rgb(255,255,255) => #ffffff
function rgbToHex(str) {
  let arr = str.split(/[\D]+/g);
  let [_, r, g, b] = arr;
  let tohex = (hex) => {
    hex = (+hex).toString(16);
    return hex.length == 1 ? '0' + hex : hex;
  };
  return `#${tohex(r)}${tohex(g)}${tohex(b)}`;
}
rgbToHex('rgb(255,255,255)');
// #ffffff => rgb(255,255,255)
function hexToRgb(str) {
  str = str.replace('#', '0x');
  let r = str >> 16;
  let g = (str >> 8) & 0xff;
  let b = str & 0xff;
  return `rgb(${r},${g},${b})`;
}
hexToRgb('#ffffff');

function thousand(str) {
  let [l, r] = str.split('.');
  if (r == undefined) {
    l = l.replace(/(?!^)(?=(\d{3})+$)/gi, ',');
  }
  return r ? l + '.' + r : l;
}
// thousand('12345');
// thousand('-12345');
thousand('12345.12345');

function phoneNum(str) {
  return str.replace(/(?=(\d{4})+$)/gi, '-');
}
phoneNum('18724009609');

function transfer(str) {
  return str.replace(/[@-_\s]+(.)?/gi, (a, _) => _.toUpperCase());
}
transfer('cpp-wmh');
/**
 * 1.实现Object.assign()
 * 2.detectType(1)
 * 3.实现async helper - `race()`
 * 4.Promise.any()
 */

// https://bigfrontend.dev/zh/problem/implement-async-helper-race
function race(arr) {
  return new Promise((resolve, reject) => {
    if (arr.length == 0) {
      return resolve([]);
    }
    let len = arr.length;
    for (let i = 0; i < len; i++) {
      Promise.resolve(arr[i]).then(
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
        },
      );
    }
  });
}
function all(arr) {
  return new Promise((resolve, reject) => {
    let res = [];
    if (arr.length == 0) {
      return resolve(res);
    }
    let len = arr.length;
    for (let i = 0; i < len; i++) {
      Promise.resolve(arr[i]).then(
        (res) => {
          res[i] = res;
          if (res.length == len) {
            resolve(res);
          }
        },
        (err) => {
          reject(err);
        },
      );
    }
  });
}
// type Callback = (error: Error, data: any) => void
// type AsyncFunc = (
//    callback: Callback,
//    data: any
// ) => void
const async1 = (callback) => {
  setTimeout(() => callback(undefined, 1), 300);
};
const async2 = (callback) => {
  setTimeout(() => callback(undefined, 2), 100);
};
const async3 = (callback) => {
  setTimeout(() => callback(undefined, 3), 200);
};

const first = race([async1, async2, async3]);
first((error, data) => {
  console.log(data);
  // 2, 因为2是第一个成功执行的结果
}, 1);

function detectType(data) {
  return Object.prototype.toString.call(data).slice(1, -1).split(' ')[1].toLowerCase();
}
detectType(1n);
