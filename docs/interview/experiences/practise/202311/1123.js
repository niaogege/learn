/**
 * 1.请求超时设置
 * 2.qrcode
 * 3.promisify
 * 4.应用题mock查询语句
 */

var data = [
  { userId: 8, title: "title1" },
  { userId: 11, title: "other" },
  { userId: 15, title: null },
  { userId: 19, title: "title2" },
];

function find(data) {
  this.value = []
  return {
    data,
    value: this.value,
    where(obj) {
      this.value = this.data.filter((item) => {
        if (obj.title.test(item.title)) {
          return item
        }
      })
      return this
    },
    orderBy(name, sign) {
      // 倒序
      if (sign === 'desc') {
        this.value.sort((a, b) => b[name]- a[name])
      } else {
        this.value.sort((a, b) => a[name] - b[name])
      }
      return this
    },
    execute() {
      return this
    }
  }
}


// 查找data中，符合where中条件的数据，并根据orderBy中的条件进行排序
var result = find(data)
  .where({
    title: /\d$/, // 这里意思是过滤出数组中，满足title字段中符合 /\d$/的项
  })
  .orderBy("userId", "desc"); // 这里的意思是对数组中的项按照userId进行倒序排列

//=> 返回 [{ userId: 19, title: 'title2'}, { userId: 8, title: 'title1' }];
console.log(result);

function scanQrcode() {
  var qrcode = new BarcodeDetector({
    formats: ['qr_code'],
  });
  var img = document.querySelector('img');
  qrcode.detect(img).then((codes) => {
    codes.forEach((ele) => {
      console.log(ele.rawValue);
    });
  });
}
// 原有的callback调用
fs.readFile('test.js', function (err, data) {
  if (!err) {
    console.log(data);
  } else {
    console.log(err);
  }
});
function promisify(fn) {
  return (...arg) => {
    return new Promise((resolve, reject) => {
      arg.push((err, ...con) => {
        if (err) {
          reject(err);
        } else {
          resolve(con);
        }
      });
      fn.apply(this, arg);
      Reflect.apply(fn, this, arg)
    });
  };
}
var fn = promisify(fs.readFile);
fn('test.js').then(())