/**
 * 1.手写promise
 * 2.手写Promise.finally
 * 3.手写去重
 * 4.删除链表的一个节点
 * 5.间隔输出
 * 6.使用睡眠函数实现红绿灯代码，红灯2秒，黄灯1秒，绿灯3秒，循环改变颜色。
 */
class MyPromise {
  public data;
  public cbs;
  constructor(exe) {
    this.data = undefined;
    this.cbs = [];
    const resolve = (val) => {
      setTimeout(() => {
        this.data = val;
        this.cbs.forEach((cb) => cb(val));
      });
    };
    exe(resolve);
  }
  then(onResolved) {
    return new MyPromise((resolve) => {
      var res = onResolved(this.data);
      if (res instanceof MyPromise) {
        return res.then(resolve);
      } else {
        resolve(res);
      }
    });
  }
  static resolve(val) {
    return new MyPromise((resolve, reject) => {
      if (val instanceof MyPromise) {
        val.then(resolve);
      } else {
        resolve(val);
      }
    });
  }

  static reject(err) {
    return new MyPromise((resolve, reject) => {
      reject(err);
    });
  }
  finally(cb) {
    return (
      this.then((res) => {
        return MyPromise.resolve(cb()).then((res) => res);
      }),
      (err) => {
        return MyPromise.resolve(cb()).then(() => {
          throw err;
        });
      }
    );
  }
}

const p1 = new MyPromise((resolve) => {
  resolve('cpp');
});
p1.then((res) => {
  return new MyPromise((resolve) => {
    resolve('cpp2');
  });
}).finally((e) => {});

function Unique(arr) {
  var m = new Map();
  var res = [];
  for (let i = 0; i < arr.length; i++) {
    if (!m.has(arr[i])) {
      res.push(arr[i]);
      m.set(arr[i], true);
    }
  }
  return res;
}

/**
 * @param {ListNode} head
 * @param {number} val
 * @return {ListNode}
 */
var deleteNode = function (head, val) {
  var dummy = {
    val: null,
    next: head,
  };
  var cur = dummy;
  while (cur.next) {
    if (val === cur.val) {
      cur.next = cur.next.next;
    }
    cur = cur.next;
  }
  return dummy.next;
};

function createRepeat(fun, repeat, interval) {
  return async (val) => {
    // 间隔4秒
    // 输出3次 执行3次 fn(val)
    let i = 0;
    while (i < repeat) {
      await sleep(() => fun(val), interval * 1000);
      i = i + 1;
    }
  };
}

const fn1 = createRepeat(console.log, 3, 1);

fn1('helloWorld'); // 每4秒输出一次helloWorld, 输出3次

/**
 * 使用睡眠函数实现红绿灯代码，红灯2秒，黄灯1秒，绿灯3秒，循环改变颜色。
 */
function sleep(fn, delay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(fn());
    }, delay);
  });
}
function red() {
  console.log('red');
}
function yellow() {
  console.log('yellow');
}
function green() {
  console.log('green');
}

function main() {
  return Promise.resolve()
    .then(() => {
      return sleep(red, 2000);
    })
    .then(() => {
      return sleep(yellow, 1000);
    })
    .then(() => {
      return sleep(green, 3000);
    })
    .then(() => {
      main();
    });
}
main();

// async function Main() {
//   while (true) {
//     await sleep(red, 2000);
//     await sleep(yellow, 1000);
//     await sleep(green, 3000);
//   }
// }

function sleep(fn, delay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(fn());
    }, delay);
  });
}
function sayOne() {
  console.log(1);
}
function sayTwo() {
  console.log(2);
}
function sayThree() {
  console.log(3);
}
async function main2() {
  while (true) {
    await sleep(sayOne, 1000);
    await sleep(sayTwo, 1000);
    await sleep(sayThree, 1000);
  }
}
main2();
