/**
 * 1.asyncPool
 * 2.promisify 把回调函数转成 promise 形式
 * 3.手写jsonp
 * 4.手写ajax
 * 5.手写async/await
 * 6.手写遍历器
 * 7.URL参数解析
 * 8.手写插入和选择排序
 * 9.前中后序遍历
 * 10.手写useFetch
 */

async function asyncPool(limit, array, fn) {
  var res = [];
  var executing = [];
  for (let i = 0; i < array.length; i++) {
    var p1 = Promise.resolve().then(() => fn(array[i], array));
    res.push(p1);
    if (array.length >= limit) {
      var p2 = p1.then(() => {
        return executing.splice(executing.indexOf(p2), 1);
      });
      executing.push(p2);
      if (executing.length >= limit) {
        await Promise.race(executing);
      }
    }
  }
  return Promise.all(res);
}

class Iterator {
  constructor(obj) {
    this.obj = obj;
    this.index = 0;
    this.length = Object.keys(obj).length;
  }
  [Symbol.iterator]() {
    return this;
  }
  next() {
    return this.length > this.index
      ? { value: this.obj[this.index++], done: false }
      : { done: true, value: undefined };
  }
}

Promise.prototype.allSettled = function (arr) {
  var res = [];
  return new Promise((resolve, reject) => {
    for (let i = 0; i < arr.length; i++) {
      Promise.resolve(arr[i]).then(
        (val) => {
          var value = {
            value: val,
            status: 'fulfilled',
          };
          res[i] = value;
          if (arr.length === i + 1) {
            resolve(res);
          }
        },
        (err) => {
          var value = {
            reason: err,
            status: 'rejected',
          };
          res[i] = value;
          if (arr.length === i + 1) {
            reject(res);
          }
        },
      );
    }
  });
};

Promise.prototype.myAllSettled2 = function (arr) {
  return Promise.all(
    arr.map((e) => {
      return Promise.resolve(e).then(
        (res) => {
          return { status: 'fulfilled', value: res };
        },
        (err) => {
          return { status: 'rejected', reason: err };
        },
      );
    }),
  );
};

// 插入排序
function insertSort(arr) {}

// 选择排序
function selectSort(arr) {}

//回调函数转成 promise 形式
function promisify(fn) {
  return (...rest) => {
    return new Promise((resolve, reject) => {
      fn(rest[0], function (err, con) {
        if (err) {
          reject(err);
        } else {
          resolve(con);
        }
      });
    });
  };
}

function promisify2(fn) {
  return (...rest) =>
    new Promise((resolve, reject) => {
      rest.push(function (err, con) {
        if (err) {
          reject(err);
        } else {
          resolve(con);
        }
      });
      fn.apply(this, rest);
    });
}
