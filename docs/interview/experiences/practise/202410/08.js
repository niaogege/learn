// 2024-10-08
// 写一个策略模式的实现
// 策略模式的实现，主要是通过将不同的策略封装成对象，然后通过一个策略管理器来管理这些策略对象。
// 策略管理器可以根据不同的条件来选择不同的策略对象，从而实现不同的策略。

//验证电话号码
const phoneValidator = {
  validate: function (phone) {
    return phone.length === 11 && /^1[3456789]\d{9}$/.test(phone);
  },
};

// 验证手机号码
const mobileValidator = {
  validate: function (mobile) {
    return mobile.length === 11 && /^1[3456789]\d{9}$/.test(mobile);
  },
};

// 实现lodash中的get方法
const get = function (obj, path) {
  const paths = path.split('.');
  let current = obj;
  for (let i = 0; i < paths.length; i++) {
    if (!current) return undefined;
    current = current[paths[i]];
  }
  return current;
};

// 实现lodash中的get方法，并且路径拆分的时候严谨一点
// 路径拆分的时候，需要考虑到路径中的逗号、方括号、点号等符号
// 路径拆分的时候，需要考虑到路径中的空格、换行等符号
// 路径拆分的时候，需要考虑到路径中的注释等符号

const get2 = function (obj, path) {
  const paths = path.split(/[,[\].]+?/).filter(Boolean);
  let current = obj;
  for (let i = 0; i < paths.length; i++) {
    if (!current) return undefined;
    current = current[paths[i]];
  }
  return current;
};

// 实现每间隔 1 秒打印 1/2/3/4/
// 使用闭包实现

const print = function () {
  let i = 0;
  return function () {
    i++;
    console.log(i);
  };
};

// 实现每间隔 1 秒打印 1/2/3/4/5/
// 使用闭包实现
// 支持传参，支持传参的话，需要使用闭包的形式来实现

const print2 = function (n) {
  let i = 0;
  return function () {
    i++;
    console.log(i);
    if (i === n) {
      clearInterval(timer);
    }
  };
};