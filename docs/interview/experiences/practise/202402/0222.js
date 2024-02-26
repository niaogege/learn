/**
 * 1.myCall/myApply
 * 2.mockNew
 * 3.手写选择排序和插入排序
 * 4.compose 组合，koa洋葱模型
 * 5.myBind
 * 6.16进制转 rgb or rgb 转 16 进制
 * 7.手写Promise
 * 8.手写vue版render
 * 9.手写数字的千分位分割法
 * 10.手写驼峰转换
 */

function transform(str) {
  return str.replace(/[_-\s](\w)/g, (_, p) => p.toUpperCase());
}
transform('cpp-wmh');
function render(str, data) {
  let reg = /\{\{(\w+)\}\}/;
  if (reg.test(str)) {
    var key = reg.exec(str)[1];
    str = str.replace(reg, data[key]);
    return render(str, data);
  }
  return str;
}
render('my{{name}}::{{age}}', {
  name: 'cpp',
  age: 32,
});
function toThousand(str) {
  return str.replace(/(?!^)(?=(\d{3})+$)/g, ',');
}
toThousand('12345');

// #ffffff => rgb(255, 255, 255)
function hexToRgb(str) {
  str = str.replace('#', '0x');
  var r = str >> 16;
  var g = (str >> 8) & 0xff;
  var b = str & 0xff;
  return `rgb(${r},${g},${b})`;
}
hexToRgb('#ffffff');
// rgb(255, 255, 255) => #ffffff
function rgbToHex(str) {
  let [, r, g, b] = str.split(/\D+/);
  var toHex = (hex) => {
    let s = (+hex).toString(16);
    return s.length == 1 ? '0' + s : s;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
rgbToHex('rgb(255, 255, 255)');
class MyPromise {
  constructor(executor) {
    const data = null;
    const cbs = [];
    const resolve = function (res) {
      this.data = res;
      setTimeout(() => {
        cbs.forEach((fn) => {
          fn(res);
        });
      });
    };
    executor(resolve);
  }
  then(onFulFilled) {
    return MyPromise((resolve) => {
      this.cbs.push(() => {
        const val = onFulFilled(this.data);
        if (res instanceof MyPromise) {
          val.then(resolve);
        } else {
          resolve(val);
        }
      });
    });
  }
}

function myBind(context) {
  const self = this;
  let arg = Array.prototype.slice.call(arguments, 1);
  let bindFn = function () {
    let arg1 = Array.prototype.slice.call(arguments);
    return self.apply(this instanceof self ? this : context, [...arg1, ...arg]);
  };
  var bridgeFn = function () {};
  bridgeFn.prototype = this.prototype;
  bindFn.prototype = new bridgeFn();
  return bindFn;
}

function compose(middlewares) {
  return (ctx, next) => {
    return dispatch(0);
    function dispatch(i) {
      let fn = middlewares[i];
      if (!fn) {
        return Promise.reject('');
      }
      if (i + 1 == middlewares.length) fn = next;
      try {
        return Promise.resolve(fn.call(ctx, () => dispatch(i + 1)));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  };
}

function myCall(context, ...rest) {
  var obj = new Object(context) || window;
  const sys = Symbol('');
  obj[sys] = this;
  var res = obj[sys](...rest);
  delete obj[sys];
  return res;
}

function getName(name) {
  return name;
}
var test = {
  name: 'xmly',
};
getName.call(test, 'xmly');

function mockNew(fn, ...rest) {
  var target = Object.create(fn.prototype);
  var res = fn.apply(target, rest);
  return res instanceof Object ? res : target;
}

// 手写选择排序和插入排序
// 选择排序是将最小的元素存放在数组起始位置，再从剩下的未排序的序列中寻找最小的元素，然后将其放到已排序的序列后面。以此类推，直到排序完成。
function selectSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    let min = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[min] > arr[j]) {
        min = j;
      }
    }
    swap(arr, i, min);
  }
  return arr;
}
function swap(arr, i, j) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}
selectSort([22, 11, 22, 12, 13, 8]);
function insertSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let j = i - 1;
    while (j >= 0 && arr[j] > arr[j + 1]) {
      swap(arr, j, j + 1);
      j--;
    }
  }
  return arr;
}
