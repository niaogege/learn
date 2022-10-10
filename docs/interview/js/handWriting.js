/**
 * 手写练习1
 * 并发限制
 */

var timeFn = (i) =>
  new Promise((resolve) => {
    setTimeout(() => {
      console.log(i);
    }, i);
  });
var arr = [1000, 5000, 3000, 2000];
async function Pool(limit, arr, fn) {
  var last = []; // 存储最终的pro
  var res = []; // 当前正在进行的
  for (let item of arr) {
    var cur = Promise.resolve().then(() => {
      fn.call(this, item);
    });
    last.push(cur);
    if (arr.length >= limit) {
      var doing = cur.then(() => {
        var index = res.indexOf(doing);
        res.splice(index, 1);
      });
      res.push(doing);
      if (res.length >= limit) {
        await Promise.race(res);
      }
    }
  }
  return Promise.all(last);
}
Pool(2, arr, timeFn);
