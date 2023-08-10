/**
 * 1.盛最多的水
 * 2.有效的括号
 * 3.LRU
 * 4.async/await
 * 5.手写bind
 * 6.手写new
 * 7.手写call
 * 8.函数柯里化
 * 9.promise版的ajax[](https://mp.weixin.qq.com/s/AiC8C-2CjTs0GQafU3gPaQ)
 * 10.防抖和节流
 * 11. 手写reduce以及利用reduce实现数组的map方法
 */

function asyncToGenerator(G) {
  return function (...rest) {
    var gen = G.apply(this, rest);
    return new Promise((resolve, reject) => {
      function step(key, arg) {
        var res;
        try {
          res = gen(key)(...arg);
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
        } catch (e) {
          reject(e);
        }
      }
      step('next');
    });
  };
}

Array.prototype.myMap = function (fn, context) {
  var arr = this || [];
  var res = [];
  // for (let i = 0; i < arr.length; i++) {
  //   res.push(fn.call(context, arr[i], i, arr));
  // }
  // return res;
  arr.reduce((pre, cur, i, array) => {
    res.push(fn.call(context, cur, i, array));
  }, []);
  return res;
};

/**
 * 
柯里化的定义：接收一部分参数，返回一个函数接收剩余参数，接收足够参数后，执行原函数。

当柯里化函数接收到足够参数后，就会执行原函数，如何去确定何时达到足够的参数呢？

有两种思路：

通过函数的 length 属性，获取函数的形参个数，形参的个数就是所需的参数个数
在调用柯里化工具函数时，手动指定所需的参数个数
 */

function curry(fn) {
  var judge = (...rest) => {
    if (rest.length === fn.length) {
      fn.apply(this, rest);
    } else {
      return (...arg) => judge(...arg, ...rest);
    }
  };
  return judge;
}
var fn = curry((a, b, c, d) => console.log(a, b, c, d));
// fn(1, 2, 3, 4);
fn(1)(2, 3)(4);

function curry2(fn) {
  var arr = [];
  return function temp(...rest) {
    if (rest.length) {
      arr.push(...rest);
      return temp;
    } else {
      var res = fn.apply(this, arr);
      arr = [];
      return res;
    }
  };
}
var sum = (...rest) => rest.reduce((a, b) => a + b, 0);
var fn = curry2(sum);
fn(1)(2)(3)(4)();
