---
title: Promisify手写
order: 9
group:
  order: 1
  title: js Basic
  path: /interview/js
nav:
  order: 3
  title: 'interview'
  path: /interview
---

面试官问： 实现一个 node 异步函数的 **promisify**

promisify 作用是把回调函数转成 promise 形式？即调用该回调函数的时候有 2 个参数，第一个是错误信息，其次才是真正要返回的内容，Promisify 就是把第二个参数转化为 promise

> 没太理解，具体业务场景是啥 0520 看下示例就明白了若川大佬的文章很好理解 浅显易懂 0528

### 抛砖

```js
// 输入：
// 原有的callback调用
fs.readFile('test.js', function (err, data) {
  if (!err) {
    console.log(data);
  } else {
    console.log(err);
  }
});
// 输出：
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
```

## 引玉 手写 promisify

手写之前写看一个实际案例，(都是摘抄若川大佬的文章) 我们知道 Node.js 天生异步，以错误回调的形式书写代码。回调函数的第一个参数是错误信息。也就是错误优先。

## 实际场景

有个加载图片资源的场景

```js
var imgSrc = 'http://xx/jpg';
function loadImg(src, cb) {
  console.log(process, 'PROCESS');
  if (process !== undefined) return;
  const img = document.createElement('img');
  img.src = src;
  img.onload = () => cb(null, img);
  img.onerror = () => {
    cb('img error');
  };
  document.appendChild(img);
}
// 调用
loadImg(imgSrc, (err, content) => {
  if (err) {
    console.log(err, 'err');
  }
  console.log(content);
});
```

回调函数有回调地狱等问题，我们接着用 promise 来优化下

### Promise 优化

```js
function loadImgPromise(src) {
  return new Promise((resolve, reject) => {
    loadImg(src, function (err, con) {
      if (err) {
        reject(err);
      }
      resolve(con);
    });
  });
}
loadImgPromise(imgSrc)
  .then((res) => {
    console.log(res, 'res');
  })
  .catch((err) => {
    console.log(err);
  });
```

不通用。我们需要封装一个比较通用的 **promisify** 函数，但是这一步基本也勾出了 promisify 函数的大致框架

```js
function loadPromise(src) {
  return new Promise((resolve, reject) => {
    loadImg(src, function (err, con) {
      // 重点是这部 这调用外部的函数，如果我们传入一个参数呢
      if (err) {
        reject(err);
      }
      resolve(con);
    });
  });
}
```

### 封装 promisify

安装上面的示例基本上阔以封装成

```js
function promisify(fn) {
  return (...arg) =>
    new Promise((resolve, reject) => {
      fn(args[0], function (err, con) {
        // fn对应上文的loadImg
        if (err) {
          reject(err);
        } else {
          resolve(con);
        }
      });
    });
}
```

简化下

```js
function promisify(fn) {
  return (...args) => {
    return new Promise((resolve, reject) => {
      args.push(function (err, ...val) {
        if (err) {
          reject(err);
        }
        resolve(val);
      });
      // fn.apply(this, args);
      Reflect.apply(fn, this, args);
    });
  };
}
```

使用的话

```js
// promisify后
var readFileAsync = promisify(fs.readFile);
async function dealAsync() {
  try {
    await readFileAsync('test.js');
  } catch (err) {
    console.log(err);
  }
}
dealAsync();
```

## 参考

- [从 22 行有趣的源码库中，我学到了 callback promisify 化的 Node.js 源码实现](https://juejin.cn/post/7028731182216904740#heading-8)

## 并发请求限制

```js
function request(url) {
  return new Promise((resove, reject) => {
    setTimeout(() => {
      resolve('ccc');
    });
  });
}
// 已失败
function asyncPool(max, urls, fn) {
  var res = [];
  var temp = [];
  var next = () => {
    for (let item of urls) {
      var p1 = Promise.resolve(item).then((res) => fn(res));
      temp.push(p1);
      if (urls.length >= max) {
        var index = temp.indexOf(p1);
        temp.splice(index, 1);
        if (temp.length >= max) {
          res.push(Promise.race(temp));
        }
      }
    }
  };
  return res;
}
```
