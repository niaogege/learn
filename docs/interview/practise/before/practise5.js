/**
 * 20230727
 * 1.封装一个类使对象可以被 for of 遍历
 * 2.数字千分位展示
 * 3.Promise.all/Promise.race/Promise.any/Promise.allSettled()
 * 4.实现一个批量请求函数，能够限制并发
 * 5.js 如何实现函数重载
 * 6.compose1/compose2/pipe
 * 7.实现 es6 中的 flatten()
 * 8.实现一个 useRequest/useFetch Hook
 * 9.实现一个useEvent,封装事件处理函数
 * 10.手写memo 缓存函数
 */

function compose(middlewares) {
  return function (ctx, next) {
    return dispatch(0);
    function dispatch(i) {
      let fn = middlewares[i];
      if (fn.length === middlewares.length) return Promise.reject('');
      if (!fn) {
        fn = next;
      }
      try {
        return Promise.resolve(fn(ctx, () => dispatch(i + 1)));
      } catch (e) {
        return Promise.reject('error');
      }
    }
  };
}
// 右到左
function compose1(...rest) {
  if (rest.length === 0) return (num) => num;
  if (rest.length === 1) return rest[0];
  return rest.reduce((pre, cur) => {
    return (...arg) => pre(cur(...arg));
  });
}

// 从左到右
function pipe(...rest) {
  return function (val) {
    return rest.reduce((pre, cur) => cur(pre), val);
  };
}

var sum1 = (x) => x + 1;
var sum2 = (x) => x * 2;
var sum3 = (x) => x * 3;

var t1 = compose1(sum1, sum2, sum3);
t1(10); // 61

var t2 = pipe(sum1, sum2, sum3);
t2(10); // 66

// 将123456789转化为123,456,789
function thousand(str) {
  var reg = /(?!^)(?=(\d{3})+$)/g;
  var res = str.replace(reg, ',');
  return res;
}
thousand('123456789');

// Promise.all/race/allSettled
// Promise.all() 方法会将多个 Promise 实例组合成一个新的 Promise 实例
// 1.传入的参数必须可迭代
// 2.传入的实例不一定是Promise,必须再用Promise.resolve()包装下
// 3.组合后的Promise实例，只有当每个包含的Promise实例都解决才去解决(fulFilled),当然如果有一个Promise实例被拒绝的话,则合成的Promise会拒绝(rejected)
Promise.prototype.myAll = function (arr) {
  return new Promise((resolve, reject) => {
    var res = [];
    for (let [i, item] of arr.entries()) {
      Promise.resolve(item).then(
        (val) => {
          res.push(val);
          if (i === arr.length - 1) {
            resolve(res);
          }
        },
        (err) => {
          return reject(err);
        },
      );
    }
  });
};
// Promise.all的反向操作，只有当每个包含的Promise实例都拒绝了，合成的promise才会拒绝rejected
Promise.prototype.any = function (arr) {
  return new Promise((resolve, reject) => {
    for (let [i, item] of arr.entries()) {
      Promise.resolve(item).then(
        (val) => {
          resolve(val);
        },
        (err) => {
          if (i === arr.length - 1) {
            reject('error');
          }
        },
      );
    }
  });
};

Promise.prototype.myRace = function (arr) {
  return new Promise((resolve, reject) => {
    for (let [i, item] of arr.entries()) {
      Promise.resolve(item).then(
        (val) => {
          resolve(val);
        },
        (err) => {
          reject(err);
        },
      );
    }
  });
};

/**
 * 成功返回 {
 *  value: '',
 *  status: 'fifulled'
 * }
 * 失败返回 {
 * status: 'rejected'
 * reason: ''
 * }
 * 
 * Promise.allSettled() 方法也是返回一个合成的 Promise，不过只有等到所有 Promise 实例都返回结果落定时，不管是解决(fulfilled)还是拒绝(rejected)，合成的 Promise 才会结束。一旦结束，状态总是 fulfilled。

等所有的成功和失败的结果都有了才会返回promise结果,成功的时候返回[{value: '', status: 'fifulled'}]，失败的时候返回[{reason: '', status: 'rejected'}]，组成一个失败和成功的组合的promise
 */
Promise.prototype.myAllSettled = function (arr) {
  return new Promise((resolve, reject) => {
    for (let [i, item] of arr.entries()) {
      let last = [];
      Promise.resolve(item).then(
        (res) => {
          last[i] = {
            value: res,
            status: 'fulfilled',
          };
          if (i === arr.length - 1) {
            resolve(last);
          }
        },
        (err) => {
          last[i] = {
            reason: err,
            status: 'rejected',
          };
          if (i === arr.length - 1) {
            reject(last);
          }
        },
      );
    }
  });
};

Promise.prototype.myAllSettled2 = function (arr) {
  var PromiseAll = [...arr];
  return Promise.all(
    PromiseAll.map((e) => {
      return Promise.resolve(e).then(
        (val) => ({
          status: 'fulfilled',
          value: val,
        }),
        (err) => ({
          status: 'rejected',
          reason: err,
        }),
      );
    }),
  );
};

var arr = [];

for (let i = 0; i < 20; i++) {
  const taskObj = {
    task: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('请求成功' + i);
        }, 2000);
      });
    },
    cb: (res) => {
      console.log(res);
    },
  };
  arr.push(taskObj);
}
console.log(arr);
function tasksControl(tasks, max) {
  const copyTasks = tasks.slice(0);
  const startSingle = () => {
    console.log(copyTasks, 'copyTasks');
    if (copyTasks.length === 0) return;
    const { task, cb } = copyTasks.shift();
    task().then((res) => {
      cb(res);
      startSingle();
    });
  };
  for (let i = 0; i < max; i++) {
    startSingle();
  }
}
tasksControl(arr, 4);

function flatten(arr) {
  var stack = [...arr];
  let res = [];
  while (stack.length) {
    var last = stack.pop();
    if (Array.isArray(last)) {
      stack.push(...last);
    } else {
      res.push(last);
    }
  }
  return res.reverse();
}
flatten([12, [33, [44, 55]]]);

function memo(fn) {
  var obj = {};
  return (...rest) => {
    var args = JSON.stringify(rest);
    return obj[args] || (obj[args] = fn.apply(this, rest));
  };
}

var add = (a, b) => {
  console.log('memo');
  return a + b;
};
var t1 = memo(add);
t1(1, 2);

// js 如何实现函数重载
function heavyLoad(obj, name, fn) {
  var old = obj[name];
  obj[name] = function () {
    let arg = Array.prototype.slice.call(arguments);
    if (fn.length === arg.length) {
      console.log(arg);
      fn.apply(this, arg);
    } else {
      old.apply(this, arg);
    }
  };
}
var person = { name: 'cpp' };

heavyLoad(person, 'show', function () {
  console.log(this.name, 'show1');
});
heavyLoad(person, 'show', function (str) {
  console.log(this.name, 'show2::' + str);
});

heavyLoad(person, 'show', function (a, b) {
  console.log(this.name, 'show3::' + a + b);
});

person.show();
person.show('cpp');
person.show('33', '44');

// 请求并发控制

// 选择排序
function selectSort(arr) {
  let len = arr.length;
  let minIndex = 0;
  for (let i = 0; i < len - 1; i++) {
    minIndex = i;
    for (let j = i + 1; j < len; j++) {
      if (arr[minIndex] >= arr[j]) {
        minIndex = j;
      }
    }
    var temp = arr[i];
    arr[i] = arr[minIndex];
    arr[minIndex] = temp;
  }
  return arr;
}
var selectSort = (arr) => {
  const len = arr.length;
  let min;
  for (let i = 0; i < len - 1; i++) {
    min = i;
    for (let j = i + 1; j < len; j++) {
      if (arr[j] < arr[min]) {
        min = j;
      }
    }
    // [arr[min], arr[i]] = [arr[i], arr[min]]
    let temp = arr[i];
    arr[i] = arr[min];
    arr[min] = temp;
  }
  return arr;
};
selectSort([1, 22, 33, 4, 5, 0, 6]);

// 插入排序
function insertSort(arr) {
  let len = arr.length;
  let pre, cur;
  for (let i = 1; i < len; i++) {
    pre = i - 1;
    cur = arr[i];
    while (pre >= 0 && arr[pre] > cur) {
      arr[pre + 1] = arr[pre];
      pre--;
    }
    arr[pre + 1] = cur;
  }
  return arr;
}

insertSort([1, 22, 33, 4, 5, 0, 6]);

//实现一个useEvent,封装事件处理函数
import { useRef, useLayoutEffect, useCallback } from 'react';
const useEvent = (handler) => {
  const handleRef = useRef();
  useLayoutEffect(() => {
    handleRef.current = handler;
  });
  return useCallback((...arg) => {
    handleRef.current && handleRef.current(...arg);
  }, []);
};

import { useState, useEffect } from 'react';
// https://www.30secondsofcode.org/react/s/use-fetch/
const useFetch = (url, option) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [abort, setAbort] = useState(() => {});
  useCallback(() => {
    const fetchData = async () => {
      try {
        const abortController = new AbortController();
        const signal = abortController.signal;
        setAbort(signal);
        const res = await fetch(url, {
          ...option,
          signal,
        });
        const json = await res.json();
        setResponse(json);
      } catch (e) {
        setError(e);
      }
    };
    fetchData();
    return () => {
      abort();
    };
  });
  return {
    response,
    error,
    abort,
  };
};

useFetch('', {});
