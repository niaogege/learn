---
title: 四种异步
order: 3
group:
  order: 1
  title: js Basic
  path: /interview/js
nav:
  order: 3
  title: 'interview'
  path: /interview
---

## info asynchronization 和 synchronization

如何理解同步和异步？

> 个人理解：一件一件事做，按续就班，每件事都是先后顺序来做，这个叫同步，sync,而异步则是，做一件事的同时为阔以做其他事，比如中午吃饭，我先把米煮了，煮米的过程我阔以择菜，这个煮米的过程就是异步的

所谓同步(synchronization)，简单来说，就是顺序执行，指的是同一时间只能做一件事情，只有目前正在执行的事情做完之后，才能做下一件事情。

同步操作的优点在于做任何事情都是依次执行，井然有序，不会存在大家同时抢一个资源的问题。同步操作的缺点在于会阻塞后续代码的执行。如果当前执行的任务需要花费很长的时间，那么后面的程序就只能一直等待。从而影响效率，对应到前端页面的展示来说，比如 css 解析会造成页面渲染的阻塞，大大影响用户体验。

所谓异步(Asynchronization)，指的是当前代码的执行不影响后面代码的执行。当程序运行到异步的代码时，会将该异步的代码作为任务放进任务队列，而不是推入主线程的调用栈。等主线程执行完之后，再去任务队列里执行对应的任务即可。因此，异步操作的优点就是：不会阻塞后续代码的执行。

### js 中异步的应用场景

开篇讲了同步和异步的概念，那么在 JS 中异步的应用场景有哪些呢？

- 定时任务：setTimeout、setInterval(面试题又来了，还要手写 setTimeout/setInterval)
- 网络请求：ajax 请求、动态创建 img 标签的加载
- 事件监听器：addEventListener (发布订阅模式)

> 对于 setTimeout、setInterval、addEventListener 这种异步场景，不需要我们手动实现异步，直接调用即可。但是对于 ajax 请求、node.js 中操作数据库这种异步，就需要我们自己来实现了~

## callback 回调函数

```js
function ajax({ url, success }) {
  const config = {
    url,
    type: 'GET',
    async: true,
    success,
  };
  let xhr = new XMLHttpRequest();
  xhr.open(config.type, config.url, config.async);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        let res = JSON.parse(xhr.responseText);
        success(res);
      }
    }
  };
  xhr.send();
}
// 使用
ajax({
  url: '/api/getData',
  success: function (res) {
    console.log(res);
  },
});
```

为了解决回调地狱的问题，提出了 Promise、async/await、generator 的概念。

## promise

```js
// 手写promise
class Promise {
  constructor(executor) {
    this.data = undefined;
    this.cbs = [];
    const resolve = (val) => {
      setTimeout(() => {
        this.data = val;
        this.cbs.forEach((fn) => fn(val));
      });
    };
    executor(resolve);
  }
  then(onfulfilled) {
    return new Promise((resolve, reject) => {
      this.cbs.push(() => {
        const res = onfulfilled(this.data);
        if (res instanceof Promise) {
          res.then(resolve);
        } else {
          resolve(res);
        }
      });
    });
  }
}
```

Promise 包含 pending、fulfilled、rejected 三种状态

- pending 指初始等待状态，初始化 promise 时的状态
- resolve 指已经解决，将 promise 状态设置为 fulfilled
- reject 指拒绝处理，将 promise 状态设置为 rejected
- promise 是生产者，通过 resolve 与 reject 函数告之结果
- promise 非常适合需要一定执行时间的异步任务
- 状态一旦改变将不可更改

> 如何理解 Promise 的异步链式调用 或者说怎么实现这种异步链式调用如何理解 Promise.then()里的异步嵌套

1.Promise 中的 then 是链式调用执行的，所以 then 也要返回 Promise 才能实现 2.状态只能改变一次，且一旦改变就不可更改，调用`resolve`方法是 status 会更改成`fulfilled`,调用内部的`reject`方法会更改成`rejected` 3.then 处理状态的改变，then(onfulfilled, onrejected)中的 onfulfilled 用来处理成功的状态，onrejected 用来处理错误的状态，而两个方法都是用户自定义传入的，then 里的阔以采用 setTimeout 来模拟异步宏任务 4.构造函数中的 cbs 保存 pending 状态时处理函数，当状态改变时循环调用,且将 then 方法的回调函数加入 cbs 数组中，用于异步执行 5. 想不通，then 里如果返回的是 Promise 类型，需要如何处理这种

```js
then((res) => {
  console.log('res', res);
  return new Promise((resolve) => {
    resolve('cpp');
  });
});
```

手写 Promise 里 **the**n 基本都是这种写法

```js
then(onFulfilled) {
  return new Promise((resolve) => {
    this.cbs.push(() => {
      var val = onFulfilled(this.value)
      if (val instanceof Promise) {
        val.then(resolve, reject) // 这句话怎么理解
      } else {
        resolve(val)
      }
    })
  })
}
```

## generator(返回值为 Iterator)

Generator 是 ES6 提出的一种异步编程的方案。因为手动创建一个 iterator 十分麻烦，因此 ES6 推出了 generator，用于更方便的创建 iterator。也就是说，**Generator 是一个返回值为 iterator 对象的函数**。在讲 Generator 之前，我们先来看看 iterator 是什么：

### iterator 是什么？

iterator 中文名叫迭代器。它为 js 中各种不同的数据结构(Object、Array、Set、Map)提供统一的访问机制。任何数据结构只要部署了 Iterator 接口，就可以完成遍历操作。 因此 iterator 也是一种对象，不过相比于普通对象来说，它有着专为迭代而设计的接口。

iterator 的作用：

- 为各种数据结构，提供一个统一的、简便的访问接口；
- 使得数据结构的成员能够按某种次序排列；
- ES6 创造了一种新的遍历命令 for…of 循环，Iterator 接口主要供 for…of 消费 iterator 的结构： 它有**next**方法，该方法返回一个包含 value 和 done 两个属性的对象（我们假设叫 result）。value 是迭代的值，done 是表明迭代是否完成的标志。true 表示迭代完成，false 表示没有。iterator 内部有指向迭代位置的指针，每次调用 next，自动移动指针并返回相应的 result。原生具备 iterator 接口的数据结构如下：
- Array
- Map
- Set
- String
- TypedArray
- 函数里的 arguments 对象
- NodeList 对象

这些数据结构都有一个**Symbol.iterator**属性，可以直接通过这个属性来直接创建一个迭代器。也就是说，Symbol.iterator 属性只是一个用来创建迭代器的接口，而不是一个迭代器，因为它不含遍历的部分。

面试题，封装一个类使其可遍历(手写迭代器，遍历对象)

```js
var obj = {
  0: 'chen',
  1: 'peng',
};
class MakeIterator {
  constructor(obj) {
    this.len = Object.keys(obj).length;
    this.obj = obj;
    this.index = 0;
  }
  [Symbol.iterator]() {
    return this;
  }
  next() {
    return this.index < this.len
      ? {
          value: this.obj[this.index++],
          done: false,
        }
      : {
          value: undefined,
          done: true,
        };
  }
}
// test
var test = new MakeIterator(obj);
for (let i of test) {
  console.log(i, 'III');
}
// chen III
// peng III
```

for ... of 的循环内部实现机制其实就是**iterator**，它首先调用被遍历集合对象的 **Symbol.iterator** 方法，该方法返回一个迭代器对象，迭代器对象是可以拥有 **.next()** 方法的任何对象，然后，在 for ... of 的每次循环中，都将调用该迭代器对象上的 .next 方法。然后使用 for i of 打印出来的 i 也就是调用.next 方法后得到的对象上的 value 属性。

```js
var arr = [1, 2, 3, 4];
var iter = arr[Symbol.iterator]();
iter.next(); // { value: 'a', done: false }
iter.next(); // { value: 'b', done: false }
iter.next(); // { value: 'c', done: false }
iter.next(); // { value: undefined, done: true }
```

面试官：如何定义一个**Iterator**来遍历对象如下对象

> 也阔以说手写一个 Generator 生成器函数

```js
var test = {
  a: 'hello',
  b: 'Fronted end',
};
// or
function* customGenerator() {
  yield 'hello';
  yield 'Fronted end';
}
var canT = customGenerator();
canT.next();
canT.next();

function customIterator(obj) {
  let len = Object.keys(obj).length;
  let i = 0;
  return {
    next: function () {
      return i >= len
        ? {
            value: undefined,
            done: true,
          }
        : {
            value: Object.values(obj)[i++],
            done: false,
          };
    },
  };
}
var ite = customIterator(test);
ite.next();
```

### Generator 生成器

看个例子

```js
function* Generator() {
  yield 1;
  yield 2;
  yield 3;
}
// generators可以像正常函数一样被调用，不同的是会返回一个 iterator
let iterator = Generator();
iterator.next();
iterator.next();
iterator.next();
```

Generator 函数是 ES6 提供的一种**异步编程**解决方案。形式上，Generator 函数是一个普通函数，但是有两个特征:

- function 关键字与函数名之间有一个**星号**
- 函数体内部使用**yield**语句，定义不同的内部状态

generator 的返回值是一个**iterator**

### yield 和 return 的区别：

- 都能返回紧跟在语句后面的那个表达式的值
- yield 相比于 return 来说，更像是一个断点。遇到 yield，函数暂停执行，下一次再从该位置继续向后执行，而 return 语句不具备位置记忆的功能。 -一个函数里面，只能执行一个 return 语句，但是可以执行多次 yield 表达式。
- 正常函数只能返回一个值，因为只能执行一次 return；Generator 函数可以返回一系列的值，因为可以有任意多个 yield

### 使用 Generator 的其余注意事项：

- 需要注意的是，yield 不能跨函数。并且 yield 需要和\*配套使用，别处使用无效

```js
function* createIterator(items) {
  items.forEach(function (item) {
    // 语法错误
    yield item + 1;
  });
}
```

- 箭头函数不能用做 **generator**

```js
var test = *(item) => { // throw error Uncaught SyntaxError: Unexpected token '*'
  yield 'cpp'
}
var tt = test()
tt.next()
```

### 好处

- 因为 Generator 可以在执行过程中多次返回，所以它看上去就像一个可以记住执行状态的函数，利用这一点，写一个 generator 就可以实现需要用面向对象才能实现的功能。
- Generator 还有另一个巨大的好处，就是把异步回调代码变成“**同步**”代码。这个在 ajax 请求中很有用，避免了回调地狱.

Generator 缺陷： 1.函数外部无法捕获异常 2.多个 yield 会导致调试困难

## async/await

> async/await 的目的为了简化使用基于 promise 的 API 时所需的语法。async/await 的行为就好像搭配使用了生成器 generator 和 promise。

async/await 是**ES7**提出的关于异步的终极解决方案。

### async/await 是 Generator 语法糖

总结下来，async 函数对 Generator 函数的改进，主要体现在以下三点:

- 内置执行器：Generator 函数的执行必须靠执行器，因为不能一次性执行完成，所以之后才有了开源的 co 函数库。但是，async 函数和正常的函数一样执行，也不用 co 函数库，也不用使用 next 方法，而 async 函数自带执行器，会自动执行。适用性更好：co 函数库有条件约束，yield 命令后面只能是 Thunk 函数或 Promise 对象，但是 async 函数的 await 关键词后面，可以不受约束。
- 可读性更好：async 和 await，比起使用 **\*号和 yield**，语义更清晰明了。

### 关于 async/await 是 Promise 的语法糖：

如果不使用 async/await 的话，Promise 就需要通过链式调用来依次执行 then 之后的代码

```js
function counter(n) {
  return new Promise((resolve, reject) => {
    resolve(n + 1);
  });
}

function adder(a, b) {
  return new Promise((resolve, reject) => {
    resolve(a + b);
  });
}

function delay(a) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(a), 1000);
  });
}
// 链式调用写法
function callAll() {
  counter(1)
    .then((val) => adder(val, 3))
    .then((val) => delay(val))
    .then(console.log);
}
callAll(); //5
```

如果使用 async/ await 调用呢

```js
async function callAll() {
  var count = await counter(1);
  var add = await adder(count + 3);
  var delay = await delay(add);
  return delay;
}
// callAll() 5
```

### 手写 async/await 使其实现相似的功能(or CO 协程 函数)

async/await 是生成器函数的语法糖

> co 接受一个生成器函数，当遇到 yield 时就暂停执行，交出控制权，当其他程序执行完毕后，将结果返回并从中断的地方继续执行，如此往复，一直到所有的任务都执行完毕，最后返回一个 Promise 并将生成器函数的返回值作为 resolve 值。

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

对于这个简单的案例来说，如果我们把它用 generator 函数表达，会是怎么样的呢？

```js
function* testG() {
  const data = yield getData();
  console.log(data, 'data');
  var data2 = yield getData();
  console.log(data2, 'data2');
  return 'success';
}
```

我们知道，generator 函数是不会自动执行的，每一次调用它的 **next** 方法，会停留在下一个 yield 的位置。

利用这个特性，我们只要编写一个**自动执行**的函数，就可以让这个 **generator 函数完全实现 async 函数**的功能。

```js
const getData = () => new Promise((resolve) => setTimeout(() => resolve('data'), 1000));

var test = asyncToGenerator(function* testG() {
  // await被编译成了yield
  const data = yield getData();
  console.log('data: ', data);
  const data2 = yield getData();
  console.log('data2: ', data2);
  return 'success';
});

test().then((res) => console.log(res));
```

`asyncToGenerator`接受一个**generator 生成器**函数，返回一个 promise，关键就在于，里面用 yield 来划分的异步流程，应该如何自动执行。

```js
function generatorToAsync(G) {
  return function () {
    //  对应 var gen = testG()
    const gen = G.apply(this, arguments);
    // var test = asyncToGenerator(testG)
    // test().then(res => console.log(res))
    return new Promise((resolve, reject) => {
      function step(key, arg) {
        let genResult;
        try {
          genResult = gen[key](arg); // gen.next(arg)
        } catch (e) {}
        const { done, value } = genResult;
        if (done) {
          resolve(value);
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

function asyncToGenerator(G) {
  return function (...arg) {
    var g = G.apply(this, arg);
    return new Promise((resolve, reject) => {
      function runGenerator(res = undefined) {
        var { done, value } = g.next(res);
        if (done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(
            (res) => {
              runGenerator(res);
            },
            (err) => {
              reject(err);
            },
          );
        }
      }
      runGenerator();
    });
  };
}
```

## 面试中如何回答三者之间的关系

Last: Promise + async 的操作最为常见。因为 Generator 被 async 替代了呀~

## 一些可能涉及到的问题

### 串行接口两个接口，如何保证第二个接口的正常发送

```js
var p1 = new Promise((resolve, rejece) => {
  reject('123');
});
var p2 = new Promise((resolve, reject) => {
  resolve('p2');
});
```

### 接口什么时候会 canceled?

## 参考

- [手写 async await 的最简实现（20 行）](https://juejin.cn/post/6844904102053281806?searchId=20230806150735CBE06003782DFB41F93F)

- [js 四种异步解决方案](https://mp.weixin.qq.com/s/eHB1eDwEt93FzSmsX4BSzg)
- [mdn/async](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function)

- [后盾人手写 promise](https://doc.houdunren.com/js/17%20Promise%E6%A0%B8%E5%BF%83.html#%E8%B5%B7%E6%AD%A5%E6%9E%84%E5%BB%BA)
