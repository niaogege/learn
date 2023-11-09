/**
 * 1.mockIterator
 * 2.链式调用
 * 3.函数重载
 * 4.vue解析模板
 * 5.链接符大小写
 */
function chartUppercase(str) {
  return str.replace(/[-|@](^\w)/g, (m, p) => {
    console.log(p, 'ppp');
    return p.toUpperCase();
  });
}
chartUppercase('cpp-wmh');
// cppWmh

function render(str, data) {
  var reg = new RegExp(/\{\{(\w+)\}\}/);
  if (reg.test(str)) {
    var key = reg.exec(str) && reg.exec(str)[1];
    // var key = RegExp.$1.trim();
    str = str.replace(reg, data[key]);
    return render(str, data);
  }
  return str;
}
render('{{name}}是程序员:年龄是{{age}}', {
  name: 'cpp',
  age: 30,
});
// 你是一个前端工程师，现在需要实现一个类，其实例阔以链式调用，他有一个sleep方法，sleep一段时间后在后续调用。
// 大家好我是Tom
// 1s 之后
// 我在玩王者
// 2s 之后
// 我在玩跳一跳
class PlayBoy {
  constructor(name) {
    this.name = name;
    this.queue = []; // 队列存放事务
    setTimeout(() => {
      this.next();
    }, 0);
    return this;
  }
  sayHi() {
    const fn = () => {
      console.log('大家好 我是：' + this.name);
      this.next();
    };
    this.queue.push(fn);
    return this;
  }
  sleep(num) {
    const fn = () => {
      setTimeout(() => {
        this.next();
      }, num);
    };
    this.queue.push(fn);
    return this;
  }
  play(name) {
    const fn = () => {
      console.log('我在玩' + name);
      this.next();
    };
    this.queue.push(fn);
    return this;
  }
  next() {
    const fn = this.queue.shift();
    fn && fn();
  }
}

const boy = new PlayBoy('cpp');
boy.sayHi().sleep(2000).play('王者');
