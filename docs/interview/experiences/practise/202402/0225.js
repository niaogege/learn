/**
 * 1.flattenObj
 * 2.手写二分法
 * 3.手写发布订阅模式
 * 4.手写 async/await
 * 5.Promise.all/any/race/allSettled
 * 6.请求并发控制
 * 7.手写ajax
 * 8.手写jsonp
 * 9.手写去重
 * 10.mockReduce
 */
class MyPromise {
  constructor(exe) {}
  static all(arr) {
    return new Promise((resolve, reject) => {
      let ans = [];
      for (let [index, item] of Object.entries(arr)) {
        Promise.resolve(item).then(
          (val) => {
            if (index + 1 == arr.length) {
              resolve(ans);
            }
            ans[index] = val;
          },
          (err) => {
            reject(err);
          },
        );
      }
    });
  }
  static race(arr) {}
  static allSettled(arr) {}
}
function binarySearch(arr, target) {
  let l = 0;
  let r = arr.length - 1;
  while (l <= r) {
    let base = l + Math.floor(r - l / 2);
    if (arr[base] === target) {
      return base;
    } else if (arr[base] > target) {
      r = r - 1;
    } else {
      l = l + 1;
    }
  }
  return -1;
}

class EventEmitter {
  constructor() {}
}

function flattenObj(obj, res = {}, key = '', isArray = false) {}

async function limitRequest(limit, arr, fn) {
  let res = [];
  let queue = [];
  for (let i = 0; i < arr.length; i++) {
    let p1 = Promise.resolve().then(() => fn(arr[i]));
    res.push(p1);
    if (arr.length >= limit) {
      let p2 = p1.then(() => {
        return queue.splice(queue.indexOf(p2), 1);
      });
      queue.push(p2);
      if (queue.length >= limit) {
        try {
          await Promise.race(queue);
        } catch (e) {}
      }
    }
  }
  return Promise.all(res);
}

function mockAsync(fn) {
  return (...rest) => {
    let gen = fn.apply(this, rest);
    return new Promise((resolve, reject) => {
      step('next');
      function step(key, arg) {
        let res;
        try {
          res = gen[key](arg);
        } catch (e) {
          return Promise.reject(e);
        }
        const { done, value } = res;
        if (done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(
            (val) => {
              return step('next', val);
            },
            (err) => {
              return step('throw', err);
            },
          );
        }
      }
    });
  };
}
