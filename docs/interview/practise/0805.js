/**
 * 1.删除链表的一个节点
 * 2.冒泡排序和选择排序和插入排序
 * 3.手写async/await
 * 4.手写并发请求控制
 * 5.最大子序和
 * 6.前端路由hash和history路由
 * 7.层序遍历
 * 8.实现一个带缓存斐波那契数列
 * 9.promisify
 * 10.promise
 */

// 最大子序和 剑指 Offer 42. 连续子数组的最大和
/**
 * 输入: nums = [-2,1,-3,4,-1,2,1,-5,4]
输出: 6
解释: 连续子数组 [4,-1,2,1] 的和最大，为 6。
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function (nums) {
  var sum = 0;
  var max = 0;
  for (let i = 0; i < nums.length; i++) {
    var cur = nums[i];
    if (sum < 0) {
      sum = cur;
    } else {
      sum += cur;
    }
    max = Math.max(sum, max);
  }
  return max;
};
maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]);

// promisify 作用是把回调函数转成 promise 形式
function promisify(fn) {
  return (...rest) =>
    new Promise((resolve, reject) => {
      rest.push((error, ...con) => {
        if (error) {
          reject(error);
        } else {
          resolve(con);
        }
      });
      // fn.apply(this, rest);
      Reflect.apply(fn, this, rest);
    });
}
fs.readFile('test.js', function (err, data) {
  if (!err) {
    console.log(data);
  } else {
    console.log(err);
  }
});
// promisify后
var readFileAsync = promisify(fs.readFile);
readFileAsync('test.js').then(
  (data) => {
    console.log(data);
  },
  (err) => {
    console.log(err);
  },
);

class MyPromise {
  constructor(exe) {
    this.data = undefined;
    this.cbs = [];
    var resolve = (res) => {
      setTimeout(() => {
        this.data = res;
        this.cbs.forEach((cb) => {
          cb(res);
        });
      });
    };
    exe(resolve);
  }

  then(onResolved) {
    return new MyPromise((resolve) => {
      this.cbs.push(() => {
        var res = onResolved(this.data);
        if (res instanceof MyPromise) {
          res.then(resolve);
        } else {
          resolve(res);
        }
      });
    });
  }
}

var p1 = new MyPromise((resolve) => {
  setTimeout(() => {
    resolve();
  }, 400);
});
p1.then((res) => {
  return new MyPromise((resolve) => {
    setTimeout(() => {
      resolve('1s');
    }, 200);
  });
}).then((res) => {
  console.log(res);
});

async function maxReqLimit(limit, array, fn) {
  var res = [];
  var executing = [];
  for (let item of array) {
    var p1 = Promise.resolve().then(() => fn(item, array));
    res.push(p1);
    if (limit <= array.length) {
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

// 前序 根左右
// 入栈 右 左
// 出栈 左右
function preorder(root, res = []) {
  if (!root) return res;
  var stack = [root];
  while (stack.length) {
    var cur = stack.pop();
    res.push(cur.val);
    if (cur.right) stack.push(cur.right);
    if (cur.left) stack.push(cur.left);
  }
  return res;
}

// 中 左根右
function inorder(root, res = []) {
  if (!root) return res;
  var stack = [];
  var cur = root;
  while (stack.length && cur) {
    if (cur) {
      cur = cur.left; // left
      stack.push(cur);
    } else {
      cur = stack.pop();
      res.push(cur.val);
      cur = cur.right;
    }
  }
}

// 后序 左右根 => 根右左 =》 反过来即可
function postorder(root, res = []) {
  if (!root) return res;
  var stack = [root];
  while (stack.length) {
    var cur = stack.pop();
    res.push(cur.val);
    if (cur.left) stack.push(cur.left);
    if (cur.right) stack.push(cur.right);
  }
  return res.reverse();
}

// 手写async/await
function asyncToGenerator(G) {}

// 实现一个带缓存斐波那契数列
// 不带缓存的斐波那契数列;
function fibonacci(n) {
  if (n < 1) return 0;
  if (n <= 2) return 1;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
// 1、1、2、3、5、8、13、21、34

// [3.9, 20, null, null, 15, 7]
// [[3], [9, 20], [15, 7]]
function levelOrder(root) {
  if (!root) return [];
  var stack = [root];
  var res = [];
  while (stack.length) {
    const len = stack.length;
    var arr = [];
    for (let i = 0; i < len; i++) {
      var res = stack.shift();
      res && arr.push(res.val);
      if (res.left) {
        stack.push(res.left);
      }
      if (res.right) {
        stack.push(res.right);
      }
    }
    res.push(arr);
  }
  return res;
}
/**
 * 浏览器地址上 # 后面的变化，是可以被监听的，浏览器为我们提供了原生监听事件 hashchange
 */
{
  /* <body>
    <div>
      <ul>
        <li><a href="#/page1">page1</a></li>
        <li><a href="#/page2">page2</a></li>
      </ul>
      <!--渲染对应组件的地方-->
      <div id="route-view"></div>
    </div>
  </body> */
}
function hashrouter() {
  let routeView = '';
  window.addEventListener('DOMContentLoaded', load);
  window.addEventListener('hashchange', hashChange);
  function load() {
    routeView = document.getElementById('router-view');
    hashChange();
  }
  function hashChange() {
    switch (location.hash) {
      case '#/page1':
        routeView.innerText = 'page1';
        break;
      case '#/page2':
        routeView.innerText = 'page2';
        break;
      default:
        routeView.innerText = 'default';
    }
  }
}

/**
 *   <body>
    <div>
      <ul>
        <li><a href="./page1">page1</a></li>
        <li><a href="./page2">page2</a></li>
      </ul>
      <!--渲染对应组件的地方-->
      <div id="route-view"></div>
    </div>
  </body>
1.遍历 a 标签得到 href 中的 url 地址
2.通过pushState 去改变浏览器的 location.pathname 属性值
3.通过监听popstate事件，手动执行回调函数，匹配相应路由
 */
function historyRouter() {
  // 第一次加载的时候，不会执行 hashchange 监听事件，默认执行一次
  // DOMContentLoaded 为浏览器 DOM 加载完成时触发
  window.addEventListener('DOMContentLoaded', load);
  window.addEventListener('popstate', popStateChange);
  let routerView = '';
  function load() {
    routerView = document.getElementById('route-view');
    popStateChange();
    var aList = document.querySelectorAll('a[href]');
    aList.forEach((e) => {
      e.addEventListener('click', function (target) {
        target.preventDefault();
        var href = e.getAttribute('href');
        // pushstate方法能改变浏览器url pathName 且不会刷新页面
        history.pushState(null, '', href);
        // popstate只能监听到手动点击浏览器的前进或者返回
        popStateChange();
      });
    });
  }
  function popStateChange() {
    switch (location.pathname) {
      case '/page1':
        routerView.innerText = 'this is Page1';
        break;
      case '/page2':
        routerView.innerText = 'this is Page2';
        break;
      default:
        routerView.innerText = 'this is Page default';
    }
  }
}
