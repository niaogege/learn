/**
 * 1.lodash.get/set
 * 2.日期格式化
 * 3.手写类型判断函数
 * 4.如何自定义一个事件，使某一个对象能够捕获到？
 * 5.如何实现 shallow 浅比较
 * 6.对象扁平化
 */

// 如何转换成2024/04/17
function dataFormat(date, code = '') {
  let Year = date.getFullYear();
  let M = date.getMonth() + 1;
  let D = date.getDate();
  code = code.replace(/yyyy/i, Year);
  code = code.replace(/mm/i, M);
  code = code.replace(/dd/i, D);
  return code;
}
dataFormat(new Date(), 'yyyy-MM-dd');

function getDataType(data) {
  return Object.prototype.toString.call(data).slice(8, -1);
}
getDataType([]);

function mockLodashGet(obj, path, defaultVal = {}) {
  let paths = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  let res = obj;
  for (let p of paths) {
    res = res[p];
    if (res == undefined) {
      res = defaultVal;
    }
  }
  return res;
}

mockLodashGet(object, 'a[0].b.c');

var object = { a: { b: { c: 3 } } };

function mockLodashSet(obj, path, val) {
  let paths = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  console.log(paths, 'paths');
  paths.reduce((cur, pre, index, arr) => {
    // 最后一个 直接赋值
    if (index == arr.length - 1) {
      cur[pre] = val;
      return null;
    } else if (pre in cur) {
      return cur[pre];
    } else {
      cur[pre] = {};
      return cur[pre];
    }
  }, obj);
}
mockLodashSet(object, 'a.b.c', 'cpp');
