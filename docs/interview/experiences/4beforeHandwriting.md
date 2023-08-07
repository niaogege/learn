---
title: 面试经验之手写之历史汇总
order: 4
group:
  order: 0
  title: interview
nav:
  order: 3
  title: 'interview'
  path: /interview
---

# js 基础

## 手写 const

```js
function _const(obj, key, value) {
  const desc = {
    value,
    writable: false,
  };
  Object.defineProperty(obj, key, desc);
}

_const({}, 'obj', { i: 1 }); //定义obj
obj.b = 3; //可以正常给obj的属性赋值
obj = {};
```

## mock Promise(精简，重点是明白其中异步调用原理）

```js
class MyPromise {
  constructor(executor) {
    this.cbs = [];
    this.data = undefined;
    var resolve = (data) => {
      setTimeout(() => {
        this.data = data;
        this.cbs.forEach((cb) => cb(data));
      });
    };
    executor(resolve);
  }
  then(onResolved, onReject) {
    return new MyPromise((resolve) => {
      this.cbs.push(() => {
        const data = onResolved(this.data);
        if (data instanceof MyPromise) {
          data.then(resolve);
        } else {
          resolve(data);
        }
      });
    });
  }
}
```

测试案例

```js
new MyPromise((resolve) => {
  console.log('start');
  setTimeout(() => {
    resolve(1);
  }, 500);
})
  .then((res) => {
    console.log(res);
    return new MyPromise((resolve) => {
      setTimeout(() => {
        resolve(2);
      }, 500);
    });
  })
  .then(console.log);
console.log('end line');
// start
//  end line
// undefined
// 1
//2
```

## mock Promise.all

Promise.all() 方法会将多个 Promise 实例组合成一个新的 Promise 实例 1.传入的参数必须可迭代 2.传入的实例不一定是 Promise,必须再用 Promise.resolve()包装下 3.组合后的 Promise 实例，只有当每个包含的 Promise 实例都解决才去解决(fulFilled),当然如果有一个 Promise 实例被拒绝的话,则合成的 Promise 会拒绝(rejected)

```js
// mock
Promise.myAll = function (arr) {
  return new Promise((resolve, reject) => {
    let res = [];
    for (let [i, item] of arr.entries()) {
      Promise.resolve(item).then(
        (data) => {
          res.push(data);
          if (i === arr.length - 1) {
            resolve(res);
          }
        },
        (error) => {
          reject(error);
        },
      );
    }
  });
};
// test
var p1 = Promise.resolve(1);
var p2 = Promise.resolve(Promise.resolve('111'));
var p3 = Promise.resolve('error');
Promise.all([p1, p2, p3]).then(
  (res) => {
    console.log(res);
  },
  (err) => {
    console.warn(err);
  },
);
Promise.myAll([p1, p2, p3]).then(
  (res) => {
    console.log(res, 'my');
  },
  (err) => {
    console.warn(err, 'muy');
  },
);
```

## Mock Promise.any

Promise.all 的反向操作，只有当每个包含的 Promise 实例都拒绝了，合成的 promise 才会拒绝 rejected

```js
Promise.myAny = function (arr) {
  return new Promise((resolve, reject) => {
    let res = [];
    for (let [index, item] of arr.entries()) {
      return Promise.resolve(item).then(
        (data) => {
          resolve(data);
        },
        (err) => {
          if (index === arr.length - 1) {
            reject(err);
          }
          res.push(err);
        },
      );
    }
  });
};
```

## mock Promise.race

只要有一个请求有响应值，请求就会结束，返回有响应的那个 promise 结果

```js
Promise.myAny = function(arr) {
  return new Promise((resolve, reject) => {
    for (let [index, item] of arr.entries()) {
      return Promise.resolve(item).then(
        success: (data) => {
          resolve(data)
        },
        error: (err) => {
          reject(err)
        }
      )
    }
  })
}
```

## mock Promise.allSettled(es7+)

Promise.allSettled() 方法也是返回一个合成的 Promise，不过只有等到所有 Promise 实例都返回结果落定时，不管是解决(fulfilled)还是拒绝(rejected)，合成的 Promise 才会结束。一旦结束，状态总是 fulfilled。

等所有的成功和失败的结果都有了才会返回 promise 结果,成功的时候返回`[{value: '', status: 'fifulled'}]`，失败的时候返回`[{reason: '', status: 'rejected'}]`，组成一个失败和成功的组合的 promise

```js
// 第一种实现
Promise.prototype.myAllSettled = function(arr) {
  return new Promise((resove, reject) => {
    let res
    for (let [index, item] of arr.entries()) {
      Promise.resolve(item).then(
        data => {
          res[i] = {
            value: data,
            status: 'fifulled'
          }
          if (index + 1 === arr.length) {
            resove(res)
          }
        },
        error => {
          res[i] = {
            value: error,
            status: 'rejected'
          }
          if (index + 1 === arr.length) {
            resove(res)
          }
        }
      )
    }
  })
}
// 第二种实现方式
Promise.prototype.myAllSettled = function(arr) {
  var PromiseAll = [...arr]
  return Promise.all(PromiseAll.map(e) => {
    return Promise.resolve(e).then(
      data => {status: 'fulfilled', value: data},
      err  => {status: 'rejected', reason: err}
    )
  })
}
```

## 实现一个并发控制器

```js
async function asyncPool(limit, arr, fn) {
  try {
    const res = []; // 最终存放的promise的数组
    let executing = []; // 正在执行的promise
    for (let i = 0; i < arr.length; i++) {
      var p1 = Promise.resolve().then(() => fn.call(this, i));
      res.push(p1);
      if (limit <= arr.length) {
        const cur = Promise.resolve(p1).then(() => {
          return executing.splice(executing.indeOf(cur), 1);
        });
        executing.push(cur);
        if (executing.length >= limit) {
          await Promise.race(executing);
        }
      }
    }
    return Promise.all(res);
  } catch (err) {
    console.log(err);
  }
}
// test
const timeFn = (i) => {
  return new Promise((resolve) => setTimeout(() => resolve(i), i));
};

var arr = [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000];
asyncPool(2, arr2, null).then((res) => {
  console.log(`res`, res);
});
```

## mock async

```js
const getData = () => new Promise((resolve) => setTimeout(() => resolve('data'), 1000));
async function test() {
  const data = await getData();
  console.log('data: ', data);
  const data2 = await getData();
  console.log('data2: ', data2);
  return 'success';
}
// 这样的一个函数 应该再1秒后打印data 再过一秒打印data2 最后打印success
test().then((res) => console.log(res));
```

手写 async(22 行)

```js
// fn 传入的generator生成器函数
function asyncGenerator(fn) {
  return function () {
    const gen = fn.apply(this, arguments);
    return new Promise((resolve, reject) => {
      function step(key, arg) {
        let generatorResult;
        try {
          generatorResult = gen[key](arg);
        } catch (e) {
          reject(e);
        }
        const { value, done } = generatorResult;
        if (done) {
          return resolve(value);
        } else {
          return Promise.resolve(value).then(
            (val) => step('next', val),
            (err) => step('throw', err),
          );
        }
      }
      step('next');
    });
  };
}
var getData = () => new Promise((resolve) => setTimeout(() => resolve('data'), 1000));
var test = asyncGenerator(function* testG() {
  const data = yield getData();
  console.log('data1: ', data);
  const data2 = yield getData();
  console.log('data2: ', data2);
  return 'success';
});
test().then((res) => console.log(res, 'cpp'));
```

## 封装一个类使对象可以被 for of 遍历

```js
class MakeIterator {
  constructor(obj) {
    this.obj = obj;
    this.len = Object.keys(obj).length;
    this.index = 0;
  }
  [Symbol.iterator]() {
    return this;
  }
  next() {
    if (this.index < this.len) {
      return {
        value: this.obj[this.index++],
        done: false,
      };
    } else {
      return {
        value: undefined,
        done: true,
      };
    }
  }
}
// test
// 注意对象的格式 类数组
var obj = {
  0: 'wmh',
  1: 'cpp',
  2: 'chendap',
  length: 3,
};
for (var item of new MakeIterator(obj)) {
  console.log(item);
}
```

## Bind

一句话介绍： bind() 方法会创建一个新函数。当这个新函数被调用时，bind() 的第一个参数将作为它运行时的 this，之后的一序列参数将会在传递的实参前传入作为它的参数。

> 返回一个新函数阔以传入多个参数难点主要是在于：一个绑定函数也能使用 new 操作符创建对象：这种行为就像把原函数当成构造器。提供的 this 值被忽略，同时调用时的参数被提供给模拟函数。

```js
Function.protptyoe.mockBind = function (context, ...rest) {
  var self = this;
  var fNOP = function () {};
  var fbound = function (...arg) {
    var args = [...rest, ...arg];
    // 构造函数调用 为 true 的时候 this 指向实例 也就是通过new方式调用,因为下面一句 `fbound.prototype = this.prototype;`，已经修改了 fbound.prototype 为 绑定函数的 prototype
    // 普通函数调用 为false 的时候 this 指向window self指向绑定函数，此时结果为 false，当结果为 false 的时候，this 指向绑定的 context
    self.apply(this instanceof self ? this : context, args);
  };
  fNOP.prototype = this.prototype;
  fbound.prototype = new fNOP();
  return fbound;
};
// test
function sayName(name, age) {
  console.log(this.value); // undefined
  console.log(name);
  console.log(age);
}
Function.prototype.mockBind = mockBind;
var sayFnMock = sayName.mockBind(obj2, 'wmh');
var resMock = new sayFnMock('菜鸟Mock');
console.log(resMock, 'Mock的bind返回的值');
```

> 感谢[冴羽大佬提供的高水平文章-JavaScript 深入之 bind 的模拟实现](https://segmentfault.com/a/1190000009271416)

## Apply

```js
Function.prototype.mockApply = function (context, args) {
  var context = context || window;
  var sym = Symbol(); // 独一无二的值
  context[sym] = this;
  // 执行函数;
  // const result = context[sym](...args);
  let result = eval('context.sym(...args)');
  delete context[sym];
  return result;
};
// test
const obj = {
  name: 'cpp',
};
function sayName(name) {
  alert(name);
}
Function.prototype.mockApply = mockApply;
sayName.mockApply(obj, ['菜鸟']);

// 模拟实现call
Function.prototype.mockCall = function (context, ...args) {
  var context = context || window;
  context.fn = this;
  var result = eval('context.fn(...args)');
  delete context.fn;
  return result;
};
```

## new

step one: 创建一个空对象 obj; step two: 将空对象的隐式原型（proto）指向构造函数的 prototype。 step three: 使用 apply 改变 this 的指向 step four: 如果无返回值或者返回一个非对象值，则将 obj 返回作为新对象；如果返回值是一个新对象的话那么直接返回该对象。

```js
function mockNew(con, ...rest) {
  let obj = Object.create(con.prototype) || window; // step one two
  let res = con.apply(obj, rest); // step three
  return res instanceof Object ? res : obj; // step four
}
// 测试
function SayName(name) {
  this.name = name;
}
SayName.prototype.emit = function () {
  console.log(name);
};
var test = new SayName('cpp');
console.log(test);
var test1 = mockNew(SayName, 'cpp');
console.log(test1);
```

## instanceof

判断一个实例是否是其父类或者祖先类型的实例。 instanceof 在查找的过程中会遍历左边变量的原型链，直到找到右边变量的 prototype 查找失败，返回 false

```js
function mockInstanceof(target, origin) {
  while (target) {
    if (target.__proto__ === origin.prototype) {
      return true;
    }
    target = target.__proto__;
  }
  return false;
}
console.log([1, 2] instanceof Array); // true
mockInstanceof([1, 2], Array); // true
```

## curry 函数柯里化

### 第一种 参数固定(有局限，形参个数固定)

```js
function curry(fn) {
  let judge = (...args) => {
    if (args.length === fn.length) {
      return fn(...args);
    }
    return (...arg) => judge(...args, ...arg);
  };
  return judge;
}
// test
var add = (a, b, c) => a + b + c;
var addCurry = curry(add);
addCurry(1)(2)(3); // 必须是三个完整的参数
```

### 第二种，参数不固定(自由灵活)

```js
// 实现
function add(...arr) {
  return arr.reduce((a, b) => a + b);
}
function curry(fn) {
  var arr = [];
  return function temp(...rest) {
    if (rest.length) {
      arr.push(...rest);
      return temp;
    } else {
      const val = fn.apply(this, arr);
      arr = [];
      return val;
    }
  };
}
// 测试
var addFn = curry(add);
var test = addFn(3)(1)(5)(44)(); // 9 参数不固定
```

### 实现一个方法进行求和

```js
var foo = function (...args) {
  //
};
var f1 = foo(1)(2)(3);
f1.getValue();
```

#### 答案

```js
var foo = function (...args) {
  var target = (...arg) => foo(...[...args, ...arg]);
  target.getValue = () => args.reduce((a, b) => a + b, 0);
  return target;
};
```

## 函数重载

因为 ECMAScript 函数的参数是由零或多个值的类数组表示的，没有函数签名（接收的参数的类型和数量），真正的重载是不能做到的。在 JavaScript 中，同一个作用域，出现两个名字一样的函数，后面的会覆盖前面的，所以 JavaScript 没有真正意义的重载。但是我们可以通过检查传入函数中参数的类型和数量来执行不同的操作，从而实现“函数重载”。核心思想: 通过判断 arguments 对象的 length 属性来确定有几个参数，然后执行什么操作

```js
function addMethod(obj, name, fn) {
  var old = obj[name];
  obj[name] = function () {
    let arg = Array.from(arguments); // 转换成array
    if (fn.length === arg.length) {
      fn.apply(this, arg);
    } else if (typeof fn === 'function') {
      old.apply(this, arg);
    }
  };
}
// test
var person = { userName: 'bear鲍的小小熊' };
addMethod(person, 'show', function () {
  console.log(this.userName + '---->' + 'show1');
});
addMethod(person, 'show', function (str) {
  console.log(this.userName + '---->' + str);
});
addMethod(person, 'show', function (a, b) {
  console.log(this.userName + '---->' + (a + b));
});
person.show();
person.show('bkl');
person.show(10, 20);
```

## 防抖 debounce

核心：采用异步线程 setTimeout 进行延迟执行，多次触发之后执行一次，典型场景就是防止多次提交的按钮

```js
function debounce(fn, wait) {
  let timer;
  return function (...arg) {
    let that = this;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(that, arg);
    }, wait);
  };
}
```

## 节流 throttle

核心：每间隔多少秒执行一次，使之频率变低，典型场景：滚动事件

```js
// 事件戳版
function throttle(fn, wait) {
  let pre = 0;
  return function (...args) {
    let now = new Date().getTime();
    let that = this;
    if (now - pre > wait) {
      fn.apply(that, args);
      pre = now;
    }
  };
}
```

# webpack

## Mock webpack,模拟 webpack 打包构建过程

```js
const fs = require('fs');
const path = require('path');
// es6 code transform ast
const parser = require('@babel/parser');
// traverse 依赖路径
const traverse = require('@babel/traverse');
// paser transformFromAst es5代码
const babel = require('@babel/core');
const getModuleInfo = (file) => {
  const body = fs.readFileSync(file, 'utf-8');
  const ast = parser.parse(body, {
    sourceType: 'module', // 解析的是es模块 default sourceType: 'script'
  });
  // 收集依赖路径 win10系统下
  const deps = {};
  traverse.default(ast, {
    ImportDeclaration({ node }) {
      const dirname = path.dirname(file);
      const depsPath = node.source.value;
      const abspath = './' + path.join(dirname, depsPath);
      deps[depsPath] = abspath;
    },
  });
  const { code } = babel.transformFromAst(ast, null, {
    presets: ['@babel/preset-env'],
  });
  return {
    file,
    deps,
    code,
  };
};
// 解析模块深层次遍历模块 输出字符串
const parseModules = (file) => {
  const entry = getModuleInfo(file);
  const temp = [entry];
  for (let i = 0; i < temp.length; i++) {
    const deps = temp[i].deps;
    if (deps) {
      for (const key in deps) {
        if (deps.hasOwnProperty(key)) {
          temp.push(getModuleInfo(deps[key]));
        }
      }
    }
  }
  // 存储格式 add.js: {deps: '', code: ''}
  const depsGraph = {};
  temp.forEach((moduleInfo) => {
    depsGraph[moduleInfo.file] = {
      deps: moduleInfo.deps,
      code: moduleInfo.code,
    };
  });
  return depsGraph;
};
// 输出bundle
const bundle = (file) => {
  const depsGraph = JSON.stringify(parseModules(file));
  return `(function (graph) {
    function require(file) {
      var exports = {};
      function absRequire(relPath) {
        console.log(relPath, 'relPath')
        return require(graph[file].deps[relPath])
      }
      (function(require, exports, code){
        console.log(code)
        eval(code)
      })(absRequire, exports, graph[file].code)
      return exports
    }
    require('${file}')
  })(${depsGraph})`;
};
// 按照路径生成文件
function emit(path) {
  const content = bundle(path);
  const distPath = './dist';
  const bundlePath = './dist/bundle.js';
  fs.unlinkSync(bundlePath);
  fs.rmdirSync(distPath);
  fs.mkdirSync(distPath);
  fs.writeFileSync(bundlePath, content);
}
emit('./src/index.js');
```

## plugin

手写一个给打包文件头部注入作者和描述信息的 webpack plugin 实现

```js
class MyInfoPlugin {
  constructor(
    options = {
      author: 'cpp',
      description: 'plugin name',
    },
  ) {
    this.options = options;
  }
  get pluginName() {
    return MyInfoPlugin.name;
  }
  apply(compiler) {
    compiler.hooks.emit.tapPromise(this.pluginName, async (compilation) => {
      const options = this.options;
      await new Promise((resolve, reject) => {
        const assets = compilation.assets;
        Object.keys(assets).forEach((asset) => {
          let source = assets[asset].source();
          let info = [];
          if (options.author) {
            info.push(`@Author: ${options.author}`);
          }
          if (options.description) {
            info.push(`@Description: ${options.description}`);
          }
          if (info.length) {
            info.push(`@Date: ${new Date()}`);
            source = `/*\n  ${info.join('\n  ')}\n*/\n ${source}`;
          }
          compilation.assets[asset].source = () => source;
          compilation.assets[asset].size = () => source.size;
        });
        resolve('Success');
        reject('MyInfoPlugin 插件出问题咯');
      });
    });
  }
}
module.exports = MyInfoPlugin;
```

测试

```js
// build\webpack.common.js
const MyInfoPlugin = require('../plugin/MyInfoPlugin');
module.exports = {
  plugins: [
    new MyInfoPlugin({
      author: 'chendapeng',
      description: 'Test test description',
    }),
  ],
};
```

## loader

实现

```js
const loaderUtils = require('loader-utils');
const validateOptions = require('schema-utils');
// 定义loader里的options选项数据结构
const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
  },
};
module.exports = function (source) {
  // this指向当前的Loader Context,不是webpack实例也不是compilation
  const options = loaderUtils.getOptions(this);
  validateOptions(schema, options, 'Example Loader');
  return source;
};
```

测试三种使用方式，推荐 resolveLoader 种的 alias 模式以及匹配(test)单个 loader 还有常用的 npm link 软连接的方式

```js
// webpack.common.js
module.exports = {
  resolveLoader: {
    alias: {
      'async-loader': path.resolve(__dirname, '../loader/async-loader.js'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: '/node_modules/',
        use: [
          {
            loader: 'async-loader',
            options: {
              name: 'test my loader cpp',
            },
          },
        ],
      },
    ],
  },
};
```

## splitChunks

Webpack 中一个提取或分离代码的插件，主要作用是提取公共代码，防止代码被重复打包，拆分过大的 js 文件，合并零散的 js 文件

```js
module.exports = {
  configureWebpack: (config) => {
    return {
      optimization: {
        splitChunks: {
          chunks: 'async', // 默认是async：只提取异步加载的模块出来打包到一个文件中。 异步加载的模块：通过import('xxx')或require(['xxx'],() =>{})加载的模块
          minSize: 30000, // 规定被提取的模块在压缩前的大小最小值，单位为字节，默认为30000，只有超过了30000字节才会被提取
          maxSize: 0, // 把提取出来的模块打包生成的文件大小不能超过maxSize值，如果超过了，要对其进行分割并打包生成新的文件。单位为字节，默认为0，表示不限制大小
          minChunks: 1, // 表示要被提取的模块最小被引用次数，引用次数超过或等于minChunks值，才能被提取。
          maxAsyncRequests: 6, // 最大的按需(异步)加载次数，默认为 6
          maxInitialRequests: 4, // 打包后的入口文件加载时，还能同时加载js文件的数量（包括入口文件），默认为4
          automaticNameDelimiter: '~', // 打包生成的js文件名的分割符，默认为~
          // 核心重点 配置提取模块的方案。里面每一项代表一个提取模块的方案。下面是cacheGroups每项中特有的选项，其余选项和外面一致，若cacheGroups每项中有，就按配置的，没有就使用外面配置的
          cacheGroups: {
            vendors: {
              name: `chunk-vendors`,
              test: /[\\/]node_modules[\\/]/, // 用来匹配要提取的模块的资源路径或名称。值是正则或函数
              priority: -10, // 方案的优先级，值越大表示提取模块时优先采用此方案。默认值为0
              chunks: 'initial',
              enfore: false, // 为true时，忽略minSize，minChunks，maxAsyncRequests和maxInitialRequests外面选项
            },
            common: {
              name: `chunk-common`,
              minChunks: 2,
              priority: -20,
              chunks: 'initial',
              reuseExistingChunk: true, // true/false。为true时，如果当前要提取的模块，在已经在打包生成的js文件中存在，则将重用该模块，而不是把当前要提取的模块打包生成新的js文件
            },
          },
        },
      },
    };
  },
};
```

Vue-cli3 中的默认配置:

```js
module.exports = {
  configureWebpack: (config) => {
    return {
      optimization: {
        splitChunks: {
          chunks: 'async',
          minSize: 30000,
          maxSize: 0,
          minChunks: 1,
          maxAsyncRequests: 6,
          maxInitialRequests: 4,
          automaticNameDelimiter: '~',
          cacheGroups: {
            vendors: {
              name: `chunk-vendors`,
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              chunks: 'initial',
            },
            common: {
              name: `chunk-common`,
              minChunks: 2,
              priority: -20,
              chunks: 'initial',
              reuseExistingChunk: true,
            },
          },
        },
      },
    };
  },
};
```

## 参考

- [Webpack 之 SplitChunks 插件用法详解](https://zhuanlan.zhihu.com/p/152097785)

# vue

## vue instance

### vue 模板编译，正则解析

输入: render(`{{msg}}-{{name}}`, {msg: 'chendap', name: 'wmh'}) 输出: 'chendap-wmh'

```js
function render(template, data) {
  var reg = /\{\{(\w+)\}\}/;
  if (reg.test(template)) {
    const name = RegExp.$1.trim(); // name = reg.exec(template)[1]
    template = template.replace(reg, data[name]);
    return render(template, data);
  }
  return template;
}
// 测试
render(`{{msg}}-{{name}}`, { msg: 'chendap', name: 'wmh' }); // chendap-wmh
```

> RegExp 是 javascript 中的一个内置对象。为正则表达式。RegExp.$1 是 RegExp 的一个属性,指的是与正则表达式匹配的第一个 子匹配(以括号为标志)字符串，以此类推，RegExp.$2，RegExp.$3，..RegExp.$99 总共可以有 99 个匹配

### 实现一个 Observer

```js
function Observer(data) {
  this.data = data;
  this.walk(data);
}
Observer.prototype = {
  walk(data) {
    //遍历,对这个对象的所有属性都进行监听
    Object.keys(data).forEach(() => {
      this.defineReactive(data, key, data[key]);
    });
  },
  defineReactive(data, key, val) {
    let dep = new Dep();
    let childObj = observe(val);
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get: function getter() {
        if (Dep.target) {
          // 在这里添加一个订阅者
          console.log(Dep.target);
          dep.addSub(Dep.target);
        }
        return val;
      },
      set: function setter() {
        if (newVal === val) {
          return;
        }
        val = newVal;
        childObj = observe(newVal);
        dep.notify();
      },
    });
  },
};
function observe(value, vm) {
  if (!value || typeof value !== 'object') {
    return;
  }
  return new Observer(value);
}
// 消息订阅器Dep，订阅器Dep主要负责收集订阅者，然后在属性变化的时候执行对应订阅者的更新函数
function Dep() {
  this.subs = [];
}
Dep.prototype = {
  addSub(sub) {
    this.subs.push(sub);
  },
  notify() {
    this.subs.forEach((sub) => {
      sub.update();
    });
  },
};
Dep.target = null;
```

### 实现一个 Watcher

```js
function Watcher(vm, exp, cb) {
  this.cb = cb;
  this.vm = vm;
  this.exp = exp;
  this.value = this.get(); // 将自己添加到订阅器的操作
}
Watcher.prototype = {
  update() {
    this.run();
  },
  run() {
    let value = this.vm.data[this.exp];
    let oldVal = this.value;
    if (value !== oldVal) {
      this.value = value;
      this.cb.call(this.vm, value, oldVal);
    }
  },
  get() {
    Dep.target = this; // 缓存自己
    let value = this.vm.data[this.exp]; // 强制执行监听器里的get函数
    Dep.target = null; // 释放自己
    return value;
  },
};
```

## vuex

## vue-router

# tool

## Array.prototype.map()

1.不改变原数组 2.回调参数以及返回值如何处理 3.context 可选。对象作为该执行回调时使用，传递给函数，用作"this"的值。如果省略了 thisValue，或者传入 null、undefined，那么回调函数的 this 为全局对象。

```js
var arr = [1, 2, 3, 4, 5];
var obj = { name: 'cpp' };
Array.prototype.mockMap = function (fn, context) {
  var arr = Array.prototype.slice.call(this);
  var mapArr = [];
  for (var i = 0; i < arr.length; i++) {
    mapArr.push(fn.call(context, arr[i], i, this));
  }
  return mapArr;
};
// test
var test = arr.mockMap(function (e) {
  console.log(this, 'this指向obj');
  return e * 2;
}, obj);
```

## Array.prototype.filter()

```js
Array.prototype.mockFilter = function (fn, context) {
  var arr = Array.prototype.slice.call(this);
  var res = [];
  for (let i = 0; i < arr.length; i++) {
    var isSatisfy = fn.call(null, arr[i], i, this);
    if (isSatisfy) {
      res.push(arr[i]);
    }
  }
  return res;
};
```

## Array.prototype.reduce()

- 初始值传不传 差距蛮大
- 返回值如何处理

```js
Array.prototype.mockReduce = function (fn, initialValue) {
  var arr = Array.prototype.slice.call(this);
  var res, startIndex;
  res = initialValue ? initialValue : arr[0];
  startIndex = initialValue ? 0 : 1;
  for (var i = startIndex; i < arr.length; i++) {
    res = fn.call(null, res, arr[i], i, this);
  }
  return res;
};
function add2(...arr) {
  return arr.mockReduce((a, b, i, ar) => {
    console.log(a, b, i, arr);
    return a + b;
  });
}
add2(...[1, 2, 3, 4]);
```

## Array.prototype.flat()

多维数组降到一维数组

```js
// 实现
function flatten(arr = []) {
  const stack = [...arr];
  const res = [];
  while (stack.length) {
    const next = stack.pop(); // 栈尾
    if (Array.isArray(next)) {
      stack.push(...next);
    } else {
      res.push(next);
    }
  }
  return res.reverse();
}
// 测试
flatten([1, 2, 3, [4, 5], 6]);
// [1, 2, 3, 4, 5, 6]
```

## 去重

```js
// First
var arr = [1, 2, 3, 3, 4, 1, 00, 99, 99];
function unique(arr) {
  return arr.reduce((prev, cur) => {
    if (!prev.includes(cur)) {
      prev.push(cur);
    }
    return prev;
  }, []);
}
var test = unique(arr);
console.log(tes); // [1, 2, 3, 4, 00, 99]
// Second
function unique(arr) {
  return arr.filter((item, index, arr) => arr.indexOf(item) === index);
}
```

## URLSearchParams url 参数解析

```js
var str = new URL('http://ccing.com/develop.html?systemId=111&idc=cc');
function getParams(url) {
  var params = new URLSearchParams(url.search); // 主要是url里的search属性
  var obj = {};
  for ([k, v] of params.entries()) {
    obj[k] = v;
  }
  return obj;
}
var test = getParams(str);
console.log(test); // {systemId: '', idc:''}
```

存在缺陷，如果 url 里含有 hash 值，会优先解析 hash 参数，第二种

```js
var str = 'http://ccuning.com/d.html#/dashboard?reportId=1118&versionId=1.0&systemId=111';
function getParams(url) {
  var params = url.split('?').pop().split('#').shift().split('&');
  var obj = {};
  for ([k, v] of params.entries()) {
    const [key, val] = v.split('=');
    obj[key] = val;
  }
  return obj;
}
var test = getParams(str);
console.log(test);
```

## 缓存 memorize 函数

```js
var memorize = function (fn) {
  const cache = {};
  return function (...args) {
    const _args = JSON.stringify(args);
    return cache[_args] || (cache[_args] = fn.apply(this, args));
  };
};
// test
var add = function (a, b) {
  console.log('函数缓存');
  return a + b;
};
var addFn = memorize(add);
var a1 = addFn(2, 6);
var a2 = addFn(2, 6);
console.log(a1, a2);
// 函数缓存
// 8
```

## 手写原始 AJAX

使用 AJAX 最主要的两个特性做下列事：

- 在不重新加载页面的情况下发送请求给服务器。
- 接受并使用从服务器发来的数据。具体步骤: step one: 创建 XMLHttpRequest 实例 step two: 声明接到响应后要做啥事 step three: 发送一个实际的请求，通过调用 HTTP 请求对象的 open() 和 send() 方法

```js
function makeGetRequest(url, cb) {
  // step one
  let httpRequst = new XMLHttpRequest();
  // step two
  httpRequest.onreadystatechange = () => {
    // 检查请求的状态 4
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      // 检查请求状态码
      if (httpRequest.status === 200) {
        cb(httpRequest.responsText);
      }
    }
  };
  // step two
  httpRequest.open('GET', url, true);
  // 第三个参数可选，表示是否执行异步操作，默认为true。如果设为 true (默认值)，即开启异步，JavaScript就不会在此语句阻塞，使得用户能在服务器还没有响应的情况下与页面进行交互。如果值为 false，send() 方法直到收到答复前不会返回
  httpRequest.send();
}
```

如果你使用 POST 数据，那就需要设置请求的 **MIME** 类型。比如，在调用 send() 方法获取表单数据前要有下面这个：

`httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')`

```js
function makePostRequest(url, cb, userName) {
  let httpRequst = new XMLHttpRequest();
  httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState === XMLHttpRequest.done) {
      if (httpRequest.status === 200) {
        cb(httpRequest.responsText)
      }
    }
  }
  httpRequest.open('POST', url, true);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('userName=' + encodeURIComponent(userName));
```

## 手写 jsonp

事先定义一个用于获取跨域响应数据的回调函数，并通过没有同源策略限制的 script 标签发起一个请求（将回调函数的名称放到这个请求的 query 参数里），然后服务端返回这个回调函数的执行，并将需要响应的数据放到回调函数的参数里，前端的 script 标签请求到这个执行的回调函数后会立马执行，于是就拿到了执行的响应数据。

```js
function jsonp({ url, option = {}, callback = 'callback' }) {
  var funcName = callback;
  const script = document.createElement('script');
  var params = [];
  for (var key in data) {
    params.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
  }
  url = url.indexOf('?') > 0 ? url + '&' : url + '?';
  url += params.join('&');
  scriptNode.src = url + '?callback=' + callback;
  script.async = true;
  script.type = 'text/javascript';
  document.body.appendChild(script);
  window[funcName] = function (data) {
    callback && callback(data);
    // 重点清除全局函数和script标签
    delete window[funcName];
    document.body.removeChild(script);
  };
}
// test
jsonp({
  url: 'http://127.0.0.1:8080/api',
  data: { name: 'cpp' },
  callback: function (res) {
    console.log(res);
  },
});
```

## RGB 转 16 进制

1.| 运算符跟 & 的区别在于如果对应的位中任一个操作数为 1 那么结果就是 1。 2. << 运算符使指定值的二进制数所有位都左移指定次数，其移动规则：丢弃高位，低位补 0 即按二进制形式把所有的数字向左移动对应的位数，高位移出(舍弃)，低位的空位补零。

```js
function RGBToHex(rgb) {
  var rgbArr = rgb.split(/[^\d]+/);
  var color = (rgbArr[1] << 16) | (rgbArr[2] << 8) | rgbArr[3];
  return `#${color.toString(16)}`;
}
// 测试
var test = 'rgb(255,255,255)';
console.log(RGBToHex(test)); // #ffffff
```

## 16 进制转 RGB

```js
function HexToRgb(hex) {
  var hexx = hex.replace('#', '0x');
  var r = hexx >> 16;
  var g = (hexx >> 8) & 0xff;
  var b = hexx & 0xff;
  return `rgb(${r}, ${g}, ${b})`;
}
// 测试
var test = '#ffffff';
console.log(HexToRgb(test)); // rgb(255, 255, 255)
```

## 实现一下 es6 的 extends

```js
class Parent {
  constructor(name) {
    this.name = name;
  }
  getName() {
    return this.name;
  }
}
class Child extends Parent {
  constructor(name, age) {
    super(name);
    this.age = age;
  }
}
```

# 简单的算法

## 滑动窗口，无重复字符的最长子串

给定一个字符串，请你找出其中不含有重复字符的   最长子串   的长度。

示例  1:

输入: s = "abcabcbb" 输出: 3 解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。

```js
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
  if (s && !s.length) return 0;
  let arr = [];
  let max = 0;
  for (let i = 0; i < s.length; i++) {
    const num = arr.indexOf(s[i]);
    if (num > -1) {
      arr.splice(0, num + 1);
    }
    arr.push(s[i]);
    max = Math.max(max, arr.length);
  }
  return max;
};
```

## 计算容器的面积

```js
输入：[1,8,6,2,5,4,8,3,7]
输出：49
解释：图中垂直线代表输入数组 [1,8,6,2,5,4,8,3,7]。在此情况下，容器能够容纳水（表示为蓝色部分）的最大值为 49。
```

- 双指针解法

```js
var maxArea = function (height) {
  var max = 0;
  var left = 0;
  var right = height.length - 1;
  while (left < right) {
    max = Math.max(max, Math.min(height[right], height[left]) * (right - left));
    if (height[right] > height[left]) {
      left++;
    } else {
      right--;
    }
  }
  return max;
};
```

## 实现一个带缓存的求阶乘函数

```js
// 第一版 迭代阶乘
function factoialIterative(n) {
  if (n < 0) return undefined;
  let total = 1;
  for (let num = n; num > 1; num--) {
    total = total * num;
  }
  return total;
}

// 第二版 递归阶乘
function factorial(n) {
  if (n <= 1) {
    return 1;
  } else {
    return n * factorial(n - 1);
  }
}
var b = factorial(3);
console.log(b);

// 第三版 缓存阶乘？？
function factorial(n) {
  var m = new Map();
  var fn = (n) => {
    if (n <= 1) return 1;
    if (m.has(n)) return m.get(n);
    let res = n * fn(n - 1);
    m.set(n, res);
    return res;
  };
  return fn(n);
}

// 第四版 ES6尾调用优化
function factorialTail(n, total = 1) {
  if (n <= 1) return 1;
  return factorialTail(n - 1, n * total);
}
```

## 实现一个带缓存斐波那契数列

```js
// // 1、1、2、3、5、8、13、21、34
// fb(n) = fb(n-1) + fb(n-2)
// 第一版
function fibonacci(n) {
  if (n < 1) return 0;
  if (n <= 2) return 1;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
// 记忆化
function fibonacciMemo(n) {
  const memo = [0, 1];
  const fibonacci = (n) => {
    if (memo[n] != null) return momo[n];
    return (memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo));
  };
  return fibonacci(n);
}
```

## LRU Cache

浏览器中的缓存是一种在本地保存资源副本，它的大小是有限的，当我们请求数过多时，缓存空间会被用满，此时，继续进行网络请求就需要确定缓存中哪些数据被保留，哪些数据被移除，这就是浏览器缓存淘汰策略，最常见的淘汰策略有 FIFO（先进先出）、LFU（最少使用）、LRU（最近最少使用）。 LRU(least recently used): 最近最少使用 缓存淘汰策略；根据数据的历史记录来进行淘汰数据，其核心思想是如果最近被访问过，那么将来被访问的几率也高，优先淘汰最近没有被访问的数据

```ts
class LRUCache {
  private caches: Map<number, number>;
  private capacity: number;
  constructor(capacity: number) {
    this.caches = new Map();
    this.capacity = capacity;
  }
  // 如果存在key 则返回当前的key 同时更新缓存
  // 如果不存在 则返回-1
  get(key: number): number {
    if (this.caches.has(key)) {
      const val = this.caches.get(key);
      this.caches.delete(key);
      this.caches.set(key, val);
      return val;
    }
    return -1;
  }
  // 如果存在 删除当前的key
  // 如果不存在 则需要添加到缓存列表里 添加的时候需要判断缓存的长度，同时更新缓存
  put(key: number, value: number): void {
    if (this.caches.has(key)) {
      this.caches.delete(key);
    } else if (this.caches.size >= this.capacity) {
      this.caches.delete(this.caches.keys().next().value);
    }
    this.caches.set(key, value);
  }
}
```

## 验证回文字符串

示例 1: 输入: "A man, a plan, a canal: Panama" 输出: true

```js
var isPalindrome = function (s) {
  if (typeof s != 'string') return (s = s.toString());
  if (s.length < 2) return true;
  var r = /[^a-zA-Z0-9]/gi;
  s = s.replace(r, '').toLowerCase();
  return s == s.split('').reverse().join('');
};
// test
isPalindrome('cppc'); // true
```

## 最长回文子串

## 全排列

输入： [1,2,3] 输出： [ [1,2,3], [1,3,2], ... ]

```js
var permute = (nums) => {
  var len = nums.length;
  if (nums.length < 2) return nums;
  var res = [];
  var path = [];
  var backTrack = (path, nums) => {
    if (path.length === nums.length) {
      res.push(path);
    }
    for (let num of nums) {
      if (!path.includes(num)) {
        path.push(num);
        backTrack(path.slice(), nums);
        path.pop();
      }
    }
  };
  backTrack(path, nums);
  return res;
};
permute([1, 2, 3, 4]);
```

## 驼峰转换

// 输入： content-type // 输出： contentType

```js
// 第一级别
function camel(str) {
  // TODO
  let ans = '';
  let upper = false;
  for (let index = 0; index < str.length; index++) {
    const element = str[index];
    if (element == '_' || element == '-' || element == '@') {
      upper = true;
    } else {
      if (upper) {
        ans += element.toUpperCase();
      } else {
        ans += element;
      }
      upper = false;
    }
  }
  return ans;
}
// 第二等级
function transform(word) {
  return word.replace(/[-|@|_]([\w])/g, (match, p) => p.toUpperCase());
}
// test
transform('content-type');
// cppName -> cpp-name
function camel(str) {
  // TODO
  let ans = '';
  let upper = false;
  let name = '';
  for (let index = 0; index < str.length; index++) {
    const element = str[index];
    if (/^[A-Z]+$/.test(element)) {
      upper = true;
      name += element;
    } else {
      if (upper) {
        ans = ans + '_' + name.toLowerCase() + element;
      } else {
        ans += element;
      }
      upper = false;
    }
  }
  return ans;
}
camel('cppNName');
```

## 二分法查找

给定一个  n  个元素有序的（升序）整型数组  nums 和一个目标值  target  ，写一个函数搜索  nums  中的 target，如果目标值存在返回下标，否则返回 -1。

示例 1:

输入: nums = [-1,0,3,5,9,12], target = 9 输出: 4 解释: 9 出现在 nums 中并且下标为 4

```ts
function search(nums: number[], target: number): number {
  let max = nums.length - 1;
  let min = 0;
  while (max >= min) {
    if (nums[max] === target) {
      return max;
    } else if (target < nums[max]) {
      max--;
    } else if (target > nums[min]) {
      min++;
    }
  }
  return -1;
}
```

> 第一家公司就跪了，这道题铭记在心

## 反转链表

给你单链表的头节点 head ，请你反转链表，并返回反转后的链表。输入：head = [1,2,3,4,5] 输出：[5,4,3,2,1]

```ts
function reverseList(head: ListNode | null): ListNode | null {
  let current = head;
  let pre = null;
  while (current) {
    const next = current.next;
    current.next = pre;
    pre = current;
    current = next;
  }
  return pre;
}
```

## 最大子序和

给定一个整数数组 nums ，找到一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。

示例 1：输入：nums = [-2,1,-3,4,-1,2,1,-5,4] 输出：6 解释：连续子数组  [4,-1,2,1] 的和最大，为  6 。示例 2：

```js
function maxSubArray(nums) {
  let ans = nums[0];
  let sum = 0;
  for (let num of nums) {
    if (sum > 0) {
      sum = sum + num;
    } else {
      sum = num;
    }
    ans = Math.max(ans, sum);
  }
  return ans;
}
// test
var nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
maxSubArray(nums); // 6
```

# 参考链接

> 感谢各位大佬的倾情奉献，小弟只是代码搬运工！

- [JavaScript 深入之 bind 的模拟实现](https://segmentfault.com/a/1190000009271416)
- [前端 JavaScript 高频手写面试大全，助你查漏补缺](https://zhuanlan.zhihu.com/p/345232890)
- [还得学习 css](https://segmentfault.com/a/1190000022110467)
- [关于 JS 中一些重要的 api 实现, 巩固你的原生 JS 功底](https://juejin.cn/post/6844903924520992782)
- [位运算符在 JS 中的妙用](https://juejin.cn/post/6844903568906911752#heading-8)
- [你也许不知道的 javascript 高级函数](https://juejin.cn/post/6844904127948914701)
- [10 问 10 答，带你快速入门前端算法](https://juejin.cn/post/6844904122496319495#heading-6)
- [死磕 36 个 JS 手写题](https://mp.weixin.qq.com/s/2COjA4ngJHAnKwYjJO8MYQ)
- [js 算法集合](https://fanerge.github.io/2018/js%E7%AE%97%E6%B3%95%E9%9B%86%E5%90%88.html)
