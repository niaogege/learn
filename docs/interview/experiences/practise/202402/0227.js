/**
 * 1.实现一个 node 异步函数的 promisify
 * 2.封装一个类使对象可以被 for of 遍历
 * 3.手写 pipe/redux 中的 compose
 * 4.数组随机展示以及随机取一个数字展示
 * 5.滑动窗口，无重复字符的最长子串
 * 6.useEvent
 * 7.useFetch
 * 8.缓存函数
 * 9.函数重载
 * 10.NoSSR
 */

function longestStr(str) {
  let arr = [];
  let max = 0;
  for (let i = 0; i < str.length; i++) {
    let cur = str[i];
    const index = arr.indexOf(cur);
    if (index > -1) {
      arr.splice(0, index + 1);
    }
    arr.push(cur);
    max = Math.max(max, arr.length);
  }
  return max;
}
longestStr('abcabcd');

function memory(fn) {
  let cache = {};
  return (...arg) => {
    let key = JSON.stringify(arg);
    if (cache[key]) {
      return cache[key];
    }
    cache[key] = fn.apply(this, arg);
  };
}

// 记不得入参了
function heavyLoad(obj, name, fn) {
  let oldFn = obj[name];
  obj[name] = function (...arg) {
    if (fn.length === arg.length) {
      fn.apply(this, arg);
    } else {
      oldFn.apply(this, arg);
    }
  };
}

var test = { name: 'cpp' };
heavyLoad(test, 'show', () => {
  console.log('show one');
});
heavyLoad(test, 'show', (a, b) => {
  console.log('show two', a, b);
});
test.show();
test.show('wmh', 'cpp');

function randomDisplay(arr) {
  return arr[Math.ceil(Math.random(arr.length) * (arr.length - 1))];
}
// 打乱数组
function randomArr(arr) {
  return arr.sort(() => 0.5 - Math.random());
}
function randomArr(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i - 1));
    let tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}
randomArr([1, 2, 3, 4, 5, 6, 7]);
randomDisplay([1, 2, 3, 4, 5]);
// pipe/redux
// 从右到左
function compose(...rest) {
  if (!rest.length) return (...arg) => arg;
  if (rest.length === 1) return rest[0];
  return rest.reduce((pre, cur) => {
    return (...arg) => pre(cur(...arg));
  });
}

// 从左到右pipe
function pipe(...rest) {
  if (!rest.length) return (...arg) => arg;
  if (rest.length === 1) return rest[0];
  return (...arg) => {
    return rest.reduce((pre, cur) => cur(pre), arg);
  };
}

let test = {
  0: 'cpp',
  1: 'chendap',
  length: 2,
};
// 如何使这个对象可遍历
class Iterator {
  constructor(obj) {
    this.len = Object.keys(obj).keys;
    this.index = 0;
  }
  [Symbol.iterator]() {
    return this;
  }
  next() {
    if (this.index < this.len) {
      return {
        value: this.obj[this.index++],
        done: false,
      };
    } else {
      return {
        value: undefined,
        done: true,
      };
    }
  }
}
let tt = new Iterator(test);
console.log(tt);
import { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';

// 把回调函数转成Promise形式调用
function promisify(fn) {
  return (...rest) => {
    return new Promise((resolve, reject) => {
      rest.push((error, ...arg) => {
        if (error) {
          reject(error);
        }
        resolve(arg);
      });
      fn.apply(this, rest);
      // 跟下面的类似
      fn(rest[0], (err, ...val) => {
        if (err) {
          reject(err);
        } else {
          resolve(val);
        }
      });
    });
  };
}
// 原有的callback调用
fs.readFile('test.js', function (err, data) {
  if (!err) {
    console.log(data);
  } else {
    console.log(err);
  }
});
var readFileAsync = promisify(fs.readFile);
readFileAsync('test.js').then(
  (data) => {
    console.log(data);
  },
  (err) => {
    console.log(err);
  },
);

export function NoSSR({ props }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);
  if (show) {
    return <div>{props.children}</div>;
  } else {
    return null;
  }
}
// 真记不起这个是做啥用的？
export function useEvent(obj, fn) {
  const ref = useRef(obj);
  useLayoutEffect(() => {
    ref.current = fn;
  }, []);
  useEffect(() => {
    if (ref.current) {
      ref.current();
    }
  }, []);
}

function useEvent1(handler) {
  const handlerRef = useRef();
  useLayoutEffect(() => {
    handlerRef.current = handler;
  });
  return useCallback((...rest) => {
    handlerRef.current && handlerRef.current(...rest);
  }, []);
}
export function useFetch(url, opt) {
  const [res, setRes] = useState({});
  const [err, setErr] = useState();
  const [abort, setAbort] = useState(() => {});
  useEffect(() => {
    const controller = new AbortController();
    setAbort(() => controller.abort());
    const fn = async () => {
      try {
        const fetcher = await fetch(url, { signal: controller.signal, ...opt });
        setRes(fetcher.text);
      } catch (e) {
        setErr(e);
      }
    };
    fn();
    return () => {
      abort && abort();
    };
  }, []);
  return {
    data: res,
    error: err,
    abort,
  };
}
