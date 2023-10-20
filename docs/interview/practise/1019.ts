/**
 * 1.间隔输出1秒
 * 2.使用Promise封装异步加载图片的方法
 * 3.实现对象的flatten
 * 4.数字千分位逗号分开
 * 5.排序回顾
 * 6.Promisify手写
 */

function OutputSecond() {
  var arr = [1, 2, 3];
  return arr.reduce((p, cur) => {
    return p.then(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(console.log(cur));
        }, 1000);
      });
    });
  }, Promise.resolve());
}
OutputSecond();

function loadImg(src, cb) {
  const img = document.createElement('img');
  img.src = src;
  img.onload = () => cb(null, img);
  img.onerror = () => {
    cb('img error');
  };
  document.appendChild(img);
}

loadImg('http://www.baidu.com/img', (err, content) => {
  if (err) {
    console.log(err, 'err');
  }
  console.log(content);
});

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
const imgSrc = '';
loadImgPromise(imgSrc)
  .then((res) => {
    console.log(res, 'res');
  })
  .catch((err) => {
    console.log(err);
  });

function flatten(arr) {
  var stack = [...arr];
  var res = [];
  while (stack.length) {
    var cur = stack.pop();
    if (Array.isArray(cur)) {
      stack.push(...cur);
    } else {
      res.push(cur);
    }
  }
  return res.reverse();
}

function flatten2(arr) {
  return arr.reduce((pre, cur) => {
    return pre.concat(Array.isArray(cur) ? flatten2(cur) : cur);
  }, []);
}

flatten2([1, 2, [3, 4, [5, 9]]]);
// 函数主要是做什么的？忘的一干二净
// promisify 作用是把回调函数转成 promise 形式

// 输入：
// 原有的callback调用
// fs.readFile('test.js', function (err, data) {
//   if (!err) {
//     console.log(data);
//   } else {
//     console.log(err);
//   }
// });
// // 输出：
// // promisify后
// var readFileAsync = promisify(fs.readFile);
// readFileAsync('test.js').then(
//   (data) => {
//     console.log(data);
//   },
//   (err) => {
//     console.log(err);
//   },
// );
function Promisify(fn) {
  return (...rest) => {
    return new Promise((resolve, reject) => {
      rest.push((err, res) => {
        if (err) {
          reject('err');
        }
        resolve(res);
      });
      // fn(...rest);
      // fn.apply(this, rest);
      Reflect.apply(fn, this, rest);
    });
  };
}
