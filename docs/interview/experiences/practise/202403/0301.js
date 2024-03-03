/**
 * 1.惰性函数和偏函数
 * 2.异步串行和异步并行
 * 3.依次按照price/size降序
 * 4.滚动到页面底部和顶部
 * 5.红灯 3 秒亮一次，黄灯 2 秒亮一次，绿灯 1 秒亮一次；如何让三个灯不断交替重复亮灯？
 * 6.1s 后输出 1 2s 后输出 2 3s 后输出 3
 * 7.买卖股票的最佳时机
 * 8.多叉树的每层之和
 * 9.按照版本号进行排序
 */

function asyncS() {
  let arr = [1, 2, 3];
  arr.reduce((pre, cur) => {
    return pre.then(
      () =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(console.log(cur));
          }, 1000);
        }),
    );
  }, Promise.resolve());
}
asyncS();

function wait(timer, fn) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(fn());
    }, timer);
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

async function main() {
  while (true) {
    await wait(3000, red);
    await wait(2000, yellow);
    await wait(1000, green);
  }
}
function loopMain() {
  return Promise.resolve()
    .then(() => wait(3000, red))
    .then(() => wait(2000, yellow))
    .then(() => wait(1000, green))
    .then(() => loopMain());
}
loopMain();

// 惰性函数
function addHandler(ele, type, handler) {}

function partialFn(fn) {
  let arg = [].slice.call(arguments, 1);
  return function () {
    let newArgs = agr.concat([].slice.call(arguments));
    return fn.apply(this, newArgs);
  };
}

function curry(fn) {
  let tmp = function (...arg) {
    if (arg.length === fn.length) {
      fn.apply(this, arg);
    }
    return (...args) => tmp(...args, ...arg);
  };
  return tmp;
}

// 天天死记硬背 还是容易忘记

function scrollToTop() {
  const top = document.body.scrollTop || document.documentElement.scrollTop;
  if (top > 0) {
    window.requestAnimationFrame(scrollToTop);
    window.scrollTo(0, top - top / 4);
  }
}

var p1 = (name) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('p1' + name);
      resolve('p1' + name);
    }, 1000);
  });
};
var p2 = (name) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('p2' + name);
      resolve('p2' + name);
    }, 2000);
  });
};

var p3 = (name) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('p3' + name);
      resolve('p3' + name);
    }, 1000);
  });
};
// 异步串行
function asyncSeries(arr) {
  const [first, ...rest] = arr;
  return (...arg) => {
    return rest.reduce((a, b) => {
      return Promise.resolve(a).then((val) => b(val));
    }, first.apply(this, arg));
  };
}
// 异步并行
function asyncParallel(arr) {
  // return Promise.all(arr).then(() => {});
  return (...arg) => {
    const tasks = arr.map((fn) => fn(...arg));
    return Promise.all(tasks);
  };
}

// 样例输入：versions = ['0.1.1', '2.3.3', '0.302.1', '4.2', '4.3.5', '4.3.4.5']
// 输出：['0.1.1', '0.302.1', '2.3.3', '4.3.4.5', '4.3.5']
function sortVersion(nums) {
  return nums.sort((a, b) => {
    a = a.split('.');
    b = b.split('.');
    let len = Math.max(A.length, B.length);
    for (let i = 0; i < len; i++) {
      let A = +a[i] || 0;
      let B = +b[i] || 0;
      if (A == B) continue;
      return A - B;
    }
    return 0;
  });
}

// // [{ price: 1, size: 2 }, { price: 2, size: 2 }, { price: 1, size: 1 }]
function orderDesc(arr) {
  return arr.sort((a, b) => {
    if (a.price != b.price) {
      return a.price - b.price;
    } else {
      return a.size - b.size;
    }
  });
}
orderDesc([
  { price: 1, size: 2 },
  { price: 2, size: 2 },
  { price: 1, size: 1 },
]);
function maxProfit(prices) {
  let len = prices.length;
  let dp = new Array(len).fill([0, 0]);
  dp[0] = [-prices[0], 0];
  // 持有股票 卖出股票
  for (let i = 1; i < len; i++) {
    dp[i][0] = Math.max(dp[i - 1][0], -prices[i]);
    dp[i][1] = Math.max(dp[i - 1][1], dp[i - 1][0] + prices[i]);
  }
  return dp[len - 1][1];
}
// bfs
function layerSum(root) {
  const stack = [root];
  const ans = [];
  while (stack.length) {
    let sum = 0;
    let len = stack.length;
    for (let i = 0; i < len; i++) {
      const cur = stack.shift();
      sum += cur.value;
      if (cur.children && cur.children.length) {
        cur.children.forEach((child) => {
          stack.push(child);
        });
        delete cur.children;
      }
    }
    ans.push(sum);
  }
  return ans;
}
const res = layerSum({
  value: 2,
  children: [
    { value: 6, children: [{ value: 1 }] },
    { value: 3, children: [{ value: 2 }, { value: 3 }, { value: 4 }] },
    { value: 5, children: [{ value: 7 }, { value: 8 }] },
  ],
});

console.log(res);
