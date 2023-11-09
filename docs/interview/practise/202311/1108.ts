/**
 * 1.bind
 * 2.limitQuest
 * 3.mockAsync
 * 4.红灯1s绿灯2s黄灯3秒
 */

function wait(fn, timer) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(fn());
    }, timer);
  });
}
function red() {
  console.log('red');
}
function green() {
  console.log('green');
}
function yellow() {
  console.log('yellow');
}
function main() {
  return Promise.resolve()
    .then(() => {
      return wait(red, 1000);
    })
    .then(() => wait(green, 1000))
    .then(() => wait(yellow, 1000))
    .then(() => main());
}
main();
function asyncGenerator(fn) {
  return (...rest) => {
    var asyncFn = fn.apply(this, rest);
    return new Promise((resolve, reject) => {
      step('next', {});
      function step(key, ...target) {
        var asyncRes;
        try {
          asyncRes = asyncFn[key](...target);
        } catch (e) {
          reject(e);
        }
        const { done, value } = asyncRes;
        if (done) {
          return resolve(value);
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

Function.prototype.myBind = function (context) {
  var self = this;
  var args = Array.prototype.slice.call(arguments, 1);
  var fBridge = function () {};
  var fBind = function () {
    var bindArgs = Array.prototype.slice.call(arguments);
    return self.apply(this instanceof self ? this : context, args.concat(bindArgs));
  };
  fBridge.prototype = this.prototype;
  fBind.prototype = new fBridge();
  return fBind;
};

async function limitQuest(arr, limit, fn) {
  var queue = []; // 保存当前执行的队列
  var res = [];
  for (let item of arr) {
    var p1 = Promise.resolve().then(() => fn(item));
    res.push(p1);
    if (arr.length >= limit) {
      var p2 = p1.then(() => {
        return queue.splice(queue.indexOf(p2), 1);
      });
      queue.push(p2);
      if (queue.length >= limit) {
        await Promise.race(queue);
      }
    }
  }
  return Promise.all(res);
}
