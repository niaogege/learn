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

function mockJonp(url, cb = () => {}) {
  let funName = '?jsonp=' + new Date().getTime()
  let link = document.createElement('script')
  link.src = url+funName
  document.body.appendChild(link)
  window[funName] = function (res) {
    cb(res)
    delete window[funName]
    document.body.removeChild(link)
  }
}
mockJonp('http://xx', (res) => {
  console.log(res)
})

function mockAjax(url, option) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest(option)
    xhr.open('GET', url, true)
    xhr.onreadystatechange = function() {
      if(xhr.readyState === xhr.DONE && xhr.status == 200) {
        resolve(xhr.responseText)
      }
    }
    xhr.send()
  })
}

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
  static race(arr) {
    return new Promise((resolve, reject) => {
      for (let [key, val] of Object.entries(arr)) {
        return Promise.resolve(val).then(
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
  // two
  static allSettled(arr) {
    return Promise.all(
      arr.map((item) => {
        return Promise.resolve(item).then(
          val => {value: val, status: 'fulfilled'},
          err => {reason: err, status: 'rejected'}
        );
    }));
  }
  static allSettled(all) {
    return Promise.all(
      all.map((item) => {
        return Promise.resolve(item).then(
          (val) => {status: 'fulfilled', value: val},
          (err) => {status: 'rejected', value: err},
        );
      }),
    );}
}
function binarySearch(arr, target) {
  let l = 0;
  let r = arr.length - 1;
  while (l <= r) {
    let base = l + Math.floor(r - l / 2);
    if (arr[base] === target) {
      return base;
    } else if (arr[base] > target) {
      r = mid - 1;
    } else {
      l = mid + 1;
    }
  }
  return -1;
}

class EventEmitter {
  constructor() {
    this.map = {};
  }
  // 绑定
  on(type, fn) {
    if (this.map[type].length) {
      this.map[type].push(fn);
    } else {
      this.map[type] = [fn];
    }
  }
  // 触发
  emit(type, ...rest) {
    if (this.map[type] && this.map[type].length) {
      this.map[type].forEach((fn) => fn.apply(this, rest));
    }
  }
  // 卸载
  off(type, fn) {
    if (this.map[type] && this.map[type].length) {
      this.map[type] = this.map[type].filter((item) => item != fn);
    } else if (type.length) {
      this.map[type] = [];
    } else {
      this.map = {};
    }
  }
  // 只触发一次
  once(type, cb) {
    const fn = () => {
      cb();
      this.off(type, fn); // 卸载
    };
    this.on(type, fn); // 先绑定
  }
}

// 写多了 慢慢就记住了
function flattenObj(obj, res = {}, key = '', isArray = false) {
  for (let [k, val] of Object.entries(obj)) {
    if (val instanceof Array) {
      let tmp = isArray ? `${key}[${k}]` : `${key}${k}`;
      flattenObj(val, res, tmp, true);
    } else if (typeof val === 'object') {
      let tmp = isArray ? `${key}[${k}].` : `${key}${k}.`;
      flattenObj(val, res, tmp, false);
    } else {
      let tmp = isArray ? `${key}[${k}]` : `${key}${k}`;
      res[tmp] = val;
    }
  }
  return res;
}
flattenObj({
  a: {
    b: 2,
  },
});
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

Array.prototype.myMap = function (fn, context) {
  let arr = this || []
  let res = []
  for(let i = 0;i<arr.length;i++) {
    res.push(fn.call(context, arr[i],i, arr))
  }
  return res
}
// 多写几遍
Array.prototype.mockReduce = function (fn, init) {
  let arr = this || []
  let res = init ? init : arr[0]
  for(let i = init ? 0 : 1;i<arr.length;i++) {
    res = fn.call(this, res, arr[i], i, arr)
  }
  return res
}