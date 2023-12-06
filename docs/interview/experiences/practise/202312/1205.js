/**
 * 1.asyncPool
 * 2.Promise/promise.finally
 * 3.extends
 * 4.mockClass
 * 5.手写NOSSR
 * 6.链表相交
 * 7.pipe/compose
 * 8.阶乘的递归？？
 * 9.验证回文字符串
 * 10.最长回文子串
 * 11.驼峰转换
 * 12.重排链表
 * 13.最近公共祖先
 */

var longestPalindrome = function (s) {
  var dp = new Array(s.length).fill(0).map(() => new Array(len).fill(false));
  let len = 1;
  let left = 0;
  for (let i = s.length - 1; i >= 0; i--) {
    for (let j = i; j < s.length; j++) {
      if (s[i] == s[j]) {
        if (j - i <= 1) {
          dp[i][j] = true;
        } else {
          dp[i][j] = dp[i + 1][j - 1];
        }
      }
      let temp = j - i + 1;
      if (dp[i][j] && temp > len) {
        len = temp;
        left = i;
      }
    }
  }
  return s.substring(left, left + len);
};

var isPalindrome = function (s) {
  if (!s) return true;
  var s = s.replace(/[\W|\_]/g, '').toLowerCase();
  var newStr = s.split('').reverse().join('');
  return newStr === s;
};

/**
 * 阶乘递归
 * 1*2*3 = 6
 */
function factorial(n) {
  if (n <= 1) {
    return 1;
  } else {
    return n * factorial(n - 1);
  }
}
factorial(3);
factorial(4);

/**
 * 验证回文字符串
 * @param {*} imgs
 */

function lazyLoad(imgs) {
  let Observer = new IntersectionObserver((entries) => {
    for (let entry of entries) {
      let { target, intersectionRatio } = entry;
      if (intersectionRatio > 0 && target) {
        let src = target.dataset.src;
        target.src = src;
        Observer.disconnect(target);
      }
    }
  });
  imgs.forEach((img) => Observer.observe(img));
  Observer.observe(img);
}

function transform(str) {
  return str.replace(/[-|@|_](\w)/, (_, p) => {
    if (p.length) {
      return p.toUpperCase();
    }
  });
}
transform('hello-cpp');

function transform2(str) {
  var arr = str.split('-');
  for (let i = 1; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substring(1);
  }
  return arr.join('');
}
transform2('hello-cpp');

function defineProperties(target, obj) {
  for (let key in obj) {
    Object.defineProperty(target, key, {
      value: obj[key],
      enumerable: false,
      configurable: true,
      writable: true,
    });
  }
}

// 手写class
function mockClass(con, proto, staticProp) {
  proto && defineProperties(con.prototype, proto);
  staticProp && defineProperties(con, staticProp);
  return con;
}

// 第一步： 创建对象，基于父类原型创建一个副本 prototype
// 第二步： 增强对象，弥补因重写原型而失去的默认的 constructor 属性
// 第三步： 指定对象，将副本 prototype 赋值给子类型的原型属性
function mockExtends(child, parent) {
  let proto = Object.create(parent.proptotype);
  proto.constuctor = child;
  child.prototype = proto;
  // 继承静态属性和方法
  parent && Object.setPrototypeOf(child, parent);
}

class MyPromise {
  constructor(executor) {
    this.data = undefined;
    this.cbs = [];
    let resolve = (res) => {
      setTimeout(() => {
        this.data = res;
        this.cbs.forEach((cb) => cb(res));
      });
    };
    executor(resolve);
  }
  then(onFulfilled) {
    return new MyPromise((resolve) => {
      this.cbs.push(() => {
        var res = onFulfilled(this.data);
        if (res instanceof MyPromise) {
          res.then(resolve);
        } else {
          resolve(res);
        }
      });
    });
  }
  static finally(cb) {
    return MyPromise.then((res) => {
      cb(res);
    }).catch((e) => {
      cb(e);
    });
  }
  //finally() 方法返回一个Promise。在promise结束时，无论结果是fulfilled或者是rejected，都会执行指定的回调函数。这为在Promise是否成功完成后都需要执行的代码提供了一种方式
  finally(cb) {
    return this.then(
      (res) => {
        return MyPromise.resolve(cb()).then(() => res);
      },
      (err) => {
        return MyPromise.resolve(cb()).then(() => err);
      },
    );
  }
  static resolve(res) {
    return new MyPromise((resolve) => {
      if (res instanceof MyPromise) {
        res.then(resolve);
      } else {
        resolve(res);
      }
    });
  }
  static reject(reason) {
    return new MyPromise((resolv, reject) => {
      reject(reason);
    });
  }
}
var p1 = new MyPromise((resolve) => resolve('cpp'));
p1.then((res) => MyPromise.resolve('cpp wmh')).finally(() => {
  console.log('finally');
});

import { useEffect, useState } from 'react';

const NOSSR = (props) => {
  const [render, setRender] = useState(false);
  useEffect(() => {
    setRender(true);
  }, []);
  return <>{render ? props.children : null}</>;
};
export default NOSSR;
async function asyncPool(arr, limit, fn) {
  try {
    let res = [];
    let queue = [];
    for (let item of arr) {
      let p1 = Promise.resolve(item).then((res) => fn(res));
      res.push(p1);
      if (arr.length >= limit) {
        const p2 = Promise.resolve(p1).then((res) => {
          return queue.splice(queue.indexOf(p2), 1);
        });
        queue.push(p2);
        if (queue.length >= limit) {
          await Promise.race(queue);
        }
      }
    }
    return Promise.all(res);
  } catch (e) {
    console.log(e);
  }
}

function one(e) {
  console.log('one');
  return e * 10;
}
function two(num) {
  console.log('two');
  return num * 2;
}
function three(num) {
  console.log('three');
  return num * 3;
}

// 从左到右
var pipe = (...rest) => {
  if (!rest.length) return (...arg) => arg;
  if (rest.length === 1) return rest[0];
  return (arg) => {
    return rest.reduce((a, b) => b(a), arg);
  };
};
var test = pipe(one, two, three);
console.log(test(10));

// 从右到左
var compose = (...rest) => {
  if (!rest.length) return (...arg) => arg;
  if (rest.length === 1) return rest[0];
  return rest.reduce((pre, cur) => {
    console.log(pre, 'pre');
    console.log('cur', cur);
    return (...arg) => pre(cur(...arg));
  });
};
var test2 = compose(one, two, three);
console.log(test2(10));
