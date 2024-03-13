/**
 * 1.bind
 * 2.分糖果
 * 3.无重复的最长子串的长度
 * 4.compose/pipe
 * 5.两数之和
 * 6.拼红包手机
 * 7.async/await
 * 8.并发
 * 9.拼接url参数 和解析url
 * 10.render
 * 11.jsonp
 * 12.ajax
 */

function parseUrl() {
  let url = window.location.search;
  let str = url.split('?')[1];
  let obj = {};
  let arr = str.split('&');
  for (let item of arr) {
    const cur = item.split('=');
    obj[cur[0]] = cur[1];
  }
  return obj;
}
parseUrl();
function joinUrl(obj) {
  let str = '';
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const val = obj[key];
      str += key + '=' + val + '&';
    }
  }
  str = str.slice(0, -1);
  return str;
}
joinUrl({ name: 'cpp', age: 30 });

function ajax(url, option) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest(option);
    xhr.open('GET', url);
    xhr.onreadystatechange = function () {
      if (xhr.DONE == xhr.readyState && xhr.status == 200) {
        const res = xhr.response;
        resolve(JSON.parse(res));
      } else {
        reject('err');
      }
    };
    xhr.send();
  });
}

function mockJsonp(url, cb) {
  let jsonp = new Date().getTime();
  let script = document.createElement('script');
  script.src = url + '?jsonp=' + jsonp;
  script.async = true;
  document.appendChild(script);
  window[jsonp] = function (val) {
    cb(val);
    document.removeChild(script);
    delete window[jsonp];
  };
}

// pipe 从左向右
function pipe(...rest) {
  if (rest.length == 0) return (arg) => arg;
  if (rest.length == 1) return rest[0];
  return (...arg) => {
    return rest.reduce((a, b) => b(a), arg);
  };
}
// compose 从右向左
function compose(...rest) {
  if (rest.length == 0) return (arg) => arg;
  if (rest.length == 1) return rest[0];
  return rest.reduce((a, b) => {
    return (...arg) => a(b(...arg));
  });
}

function virtualRender(node, parent) {
  let mount = parent ? (el) => parent.appendChild(el) : (el) => el;
  if (typeof node == 'string') {
    return mount(document.createTextNode(node.type));
  } else {
    const vdom = mount(document.createElement(node.type));
    // props属性
    Object.keys(node).forEach((key) => {
      const val = node[key];
      vdom.setAttribute(key, val);
    });
    // child
    if (node.children && node.children.length) {
      node.children.map((child) => {
        document.appendChild(virtualRender(child, parent));
      });
    }
    return vdom;
  }
}
virtualRender(Vnode, document.getElementById('app'));

class Promise {
  static all(arr) {
    return new Promise((resolve, reject) => {
      let ans = [];
      for (let [key, val] of Object.entries(arr)) {
        Promise.resolve(val).then(
          (value) => {
            if (key == arr.length - 1) {
              resolve(ans);
            }
            ans[key] = value;
          },
          (err) => {
            reject(err);
          },
        );
      }
    });
  }
  static allSettled(arr) {
    return Promise.all(
      arr.map((item) => {
        Promise.resolve(item).then(
          (val) => ({
            value: val,
            status: 'fulfilled',
          }),
          (err) => ({
            reason: err,
            status: 'rejected',
          }),
        );
      }),
    );
  }
}

async function limitQuest(arr, limit, fn) {
  let ans = [];
  let queue = [];
  for (let item of arr) {
    let p1 = Promise.resolve().then(() => fn(item));
    ans.push(p1);
    if (arr.length >= limit) {
      let p2 = p1.then(() => queue.splice(queue.indexOf(p2), 1));
      queue.push(p2);
      if (queue.length >= limit) {
        await Promise.race(queue);
      }
    }
  }
  return Promise.all(ans);
}

function asyncToGenerator(fn) {
  return (...rest) => {
    const genFn = fn.apply(this, rest);
    return new Promise((resolve, reject) => {
      return step('next');
      function step(key, ...arg) {
        let res;
        try {
          res = genFn[key](...arg);
        } catch (e) {
          reject(e);
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

function flatten(arr, depth) {
  let stack = [...arr];
  let i = 1;
  let ans = [];
  while (stack.length) {
    let cur = stack.pop();
    if (Array.isArray(cur) && i < depth) {
      i++;
      stack.push(...cur);
    } else {
      ans.push(cur);
    }
  }
  return ans.reverse();
}
flatten([1, 2, [3, 4, [5, 6]], 5], 2);

/**
 * @param {number } money 总共发多少红包
 * @param {number } count 红包个数
 * @param {number } minBase 红包最少发多少
 * @param {number } maxBase 红包最多不能超过平均的几倍
 */
function redPacket({ money, count, minBase = 0.1, maxBase = 2 }) {
  let remainMoney = money;
  let ans = [];
  for (let i = 0; i < count - 1; i++) {
    let max = (remainMoney / count) * maxBase; // 最多不能超过平均的2倍
    let curMon = Math.random() * max;
    curMon = curMon < minBase ? minBase : curMon;
    curMon = Math.floor(curMon * 100) / 100;
    remainMoney = Math.round((remainMoney - curMon) * 100) / 100;
    ans.push(curMon);
  }
  ans.push(remainMoney);
  console.log(
    ans,
    ans.reduce((a, b) => Number(a) + Number(b)),
  );
}
redPacket({
  money: 20,
  count: 4,
});

function print(count, money) {
  let remain = money;
  let ans = [];
  for (let i = 0; i < count - 1; i++) {
    let min = 0.1;
    let max = (remain / count) * 2;
    let cur = Math.floor(Math.random() * max * 100) / 100;
    cur = cur > min ? min : cur;
    ans.push(cur);
    remain = Math.round((remain - cur) * 100) / 100;
  }
  ans.push(remain);
}

// console.log(ans, 'ans', ans.reduce((a,b) => Number(a)+Number(b)))

function arrToTree(arr) {
  let ans = [];
  let dfs = (arr, ans, parentId) => {
    for (let item of arr) {
      if (item.parentId == parentId) {
        let newItem = {
          ...item,
          children: [],
        };
        ans.push(newItem);
        dfs(arr, newItem.children, item.id);
      }
    }
  };
  dfs(arr, ans, 0);
  return ans;
}
// 括号匹配
function isvalid(str) {
  str = str.split('');
  let m = new Map([
    [']', '['],
    ['}', '{'],
    [')', '('],
  ]);
  let ans = [];
  for (let item of str) {
    let last = ans.slice(-1);
    if (last && last == m.get(item)) {
      ans.pop();
    } else {
      ans.push(item);
    }
  }
  return ans.length == 0;
}
isvalid('()');

// [1,2,3,4,5] 8 // 返回下标
function twoSum(arr, target) {
  let m = new Map();
  let len = arr.length;
  for (let i = 0; i < len; i++) {
    let item = arr[i];
    if (m.has(target - item)) {
      return [m.get(target - item), i];
    } else {
      m.set(item, i);
    }
  }
  return [-1, -1];
}
twoSum([1, 2, 3, 4, 5], 8);
function random(arr) {
  return arr.sort((a, b) => 0.5 - Math.random());
}
function random(arr) {
  for (let i = arr.length - 1; i >= 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    swap(arr, i, j);
  }
  return arr;
}

function compose(middlewares) {
  return (ctx, next) => {
    return dispatch(0);
    function dispatch(i) {
      let fn = middlewares[i];
      if (!fn) return Promise.reject();
      if (i == middlewares.length) fn = next;
      try {
        return Promise.resolve(fn(ctx, () => dispatch(i + 1)));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  };
}

function mockBind(context) {
  let self = this;
  let arg1 = Array.prototype.slice.call(arguments, 1);
  let bindFn = function () {
    let arg2 = Array.prototype.slice.call(arguments);
    self.apply(this instanceof self ? this : context, arg2.concat(arg1));
  };
  let BridgeFn = function () {};
  BridgeFn.prototype = this.prototype;
  bindFn.prototype = new BridgeFn();
  return bindFn;
}

function maxWidth(str) {
  str = str.split('');
  let max = 0;
  let arr = [];
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

Array.prototype.selectType = function (fn, context) {
  let arr = this || [];
  let res = {};
  for (let i = 0; i < arr.length; i++) {
    let val = fn.call(this, arr[i], i, arr);
    res[val] = res[val] ? [...res[val], arr[i]] : [arr[i]];
  }
  return res;
};
var test = [1, 2, 3, 4, 5];
test.selectType((item) => {
  return item > 3 ? 'bigger' : 'small';
});

// 分糖果
function dispatch(arr) {
  let len = arr.length;
  let candy = new Array(len).fill(1);
  for (let i = 1; i < len; i++) {
    // 右边比左边大 正序
    if (arr[i] > arr[i - 1]) {
      candy[i] = candy[i - 1] + 1;
    }
  }
  for (let i = len - 2; i >= 0; i--) {
    // 左边比右边大 倒序
    if (arr[i] > arr[i + 1]) {
      candy[i] = Math.max(candy[i], candy[i + 1] + 1);
    }
  }
  return candy.reduce((a, b) => a + b);
}
