/**
 * 1.买卖股票的最佳时机
 * 2.岛屿数量
 * 3.反转链表 II
 * 4.螺旋矩阵
 * 5.最长上升子序列
 * 6.字符串相乘
 * 7.字符串相加
 */
// 22;
// (33)[(0, 0, 0, 0)];
function mulStr(a, b) {
  let aLen = a.length;
  let bLen = b.length;
  let arr = new Array(aLen + bLen).fill(0);
  for (let i = aLen - 1; i >= 0; i--) {
    for (let j = bLen - 1; j >= 0; j--) {
      let p1 = i + j;
      let p2 = p1 + 1;
      let res = Number(a[i]) * Number(b[j]);
      let sum = arr[p2] + res;
      arr[p2] = sum % 10;
      arr[p1] = arr[p1] + Math.floor(res / 10);
    }
  }
  while (arr[0] == 0) {
    arr.shift();
  }
  return arr.length ? arr.join('') : '0';
}
mulStr('22', '33');

function bigNumAdd(a, b) {
  let len = Math.max(a.length, b.length);
  a = a.padStart(len, '0');
  b = b.padStart(len, '0');
  let flag = 0;
  let res = '';
  let i = len - 1;
  while (i >= 0) {
    flag = Number(a[i]) + Number(b[i]) + flag;
    res = (flag % 10) + res;
    flag = Math.floor(flag / 10);
    i--;
  }
  return flag == 1 ? '1' + res : res;
}
bigNumAdd('22', '88');

function requestIdleCallback(cb) {
  let cur = new Date().getTime();
  return setTimeout(() => {
    cb({
      didTimeout: false,
      timeRemaining: () => 1,
    });
  });
}

function merge(arr1, m, arr2, n) {
  for (let i = m; i < m + n; i++) {
    arr1[i] = arr2[i - m];
  }
  return arr1.sort((a, b) => a - b);
}

function defineProperties(target, obj) {
  for (let key in obj) {
    Object.defineProperty(target, key, {
      writable: true,
      value: obj[key],
      enumerable: false,
      configurable: true,
    });
  }
}

function mockClass(con, proto, staticProps) {
  proto && defineProperties(con.prototype, proto);
  staticProps && defineProperties(con, staticProps);
  return con;
}
