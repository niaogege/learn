/**
 * 1.千分位展示
 * 2.驼峰大小写
 * 3.手写插入和选择排序
 * 4.flatten扁平化
 * 5.bubbleSort 冒泡排序
 * 6.promisify
 * 7.二叉树的前中后需迭代遍历
 * 8.url参数拼接
 * 9.ajax手写
 * 10.instanceof
 */

// ajax
function ajax(url, option, cb) {
  var xml = new XMLHttpRequest();
  xml.open('GET', url, true);
  xml.onreadystatechange = function () {
    if (xml.readyState === xml.DONE) {
      if (xml.status === 200) {
        cb(xml.responseText);
      }
    }
  };
  xml.send();
}

// 用于检测构造函数的原型是否在某一个实例的原型链上
Function.prototype.instanceof = function (l, r) {
  while (l) {
    if (l === r.prototype) {
      return true;
    }
    l = l.__proto__;
  }
  return false;
};

Function.prototype.mockInstanceOf = function (l, r) {
  return r.prototype.isPrototypeof(l);
};

class Promise {
  constructor(exe) {
    this.cbs = [];
    this.data = undefined;
    const resolve = (val) => {
      setTimeout(() => {
        this.data = val;
        this.cbs.forEach((cb) => cb(val));
      });
    };
    exe(resolve);
  }
  then(onFulfilled) {
    return new Promise((resolve, reject) => {
      this.cbs.push(() => {
        var res = onFulfilled(this.data);
        if (res instanceof Promise) {
          res.then(resolve);
        } else {
          resolve(res);
        }
      });
    });
  }
}

function thousand(str) {
  var reg = /(?!^)(?=(\d{3})+$)/g;
  return str.replace(reg, ',');
}
thousand('123456789');

function upperCase(str) {
  return str.replace(/[-|@|_]([\w])/g, (match, p) => p.toUpperCase());
}
upperCase('cpp-wmh');

// 插入 从后往前 一一对比
function insertSort(arr) {
  var pre;
  var len = arr.length;
  for (let i = 1; i < len; i++) {
    pre = i - 1;
    var cur = arr[i];
    while (pre >= 0 && arr[pre] > cur) {
      arr[pre + 1] = arr[pre];
      pre--;
    }
    arr[pre + 1] = cur;
  }
  return arr;
}
insertSort([33, 22, 11, 2, 334, 2, 99]);

// 选择排序 选择最小的交换
function selectSort(arr) {
  let minIndex, temp;
  len = arr.length;
  for (let i = 0; i < len - 1; i++) {
    minIndex = i;
    for (let j = i + 1; j < len; j++) {
      if (arr[j] <= arr[minIndex]) {
        minIndex = j;
      }
    }
    temp = arr[i];
    arr[i] = arr[minIndex];
    arr[minIndex] = temp;
  }
  return arr;
}
selectSort([33, 22, 11, 2, 334, 2, 99]);

function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] >= arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}
bubbleSort([22, 33, 11, 2, 99, 88, 7]);

function flatten(arr) {
  var stack = [...arr];
  var res = [];
  while (stack.length) {
    var last = stack.pop();
    if (Array.isArray(last)) {
      stack.push(...last);
    } else {
      res.push(last);
    }
  }
  return res.reverse();
}
flatten([1, [2, [4, [55, 66, 7], 9]]]);

function promisify(fn) {
  return new Promise((resolve, reject) => {
    return (...rest) => {
      rest.push(function (err, con) {
        if (err) {
          reject(err);
        } else {
          resolve(con);
        }
      });
      fn.apply(this, rest);
    };
  });
}

// ?name=cpp&age=30&sex=huamn
// http://ops.ximalaya.com/api-manager-backend/router-page/projectApiLook/2161/103995?activeTab=0&name=cpp&age=30&sex=huamn
function UrlParam(url) {
  var str = url.split('?')[1];
  var arr = str.split('&');
  var res = {};
  for (let i = 0; i < arr.length; i++) {
    var item = arr[i].split('=');
    res[item[0]] = item[1];
  }
  return res;
}
UrlParam(
  `http://ops.ximalaya.com/api-manager-backend/router-page/projectApiLook/2161/103995?activeTab=0&name=cpp&age=30&sex=huamn`,
);
