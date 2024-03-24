/**
 * 1.滚动到底部
 * 2.滚动到顶部
 * 3.手写jsonp
 * 4.手写观察者模式
 * 5.连续正整数之和
 */
// 被观察者 主题通知观察者
class Subject {
  constructor(name) {
    this.name = name;
    this.list = [];
  }
  addObserver(fn) {
    this.list.push(fn);
  }
  notify(name) {
    this.list.forEach((fn) => fn.call(this, name));
  }
}
// 观察者
class Observer {
  constructor(name) {
    this.name = name;
  }
  update(state) {
    console.log(`${this.name} Say:: ${state}`);
  }
}

var subject = new (function mockJsonp(url, cb) {
  var cb = new Date().getTime();
  var script = document.createElement('script');
  script.async = true;
  script.src = url + '?cb=' + cb;
  document.body.appendChild(script);
  window[cb] = function (res) {
    cb(res);
    document.body.removeChild(script);
    delete window[cb];
  };
})();

function scrollTop() {
  var top = document.body.scrollTop || document.documentElement.scrollTop;
  if (top > 0) {
    window.requestAnimationFrame(scrollTop);
    window.scrollTo(0, height - height / 8);
  }
}

function scrollBottom() {
  // 滚动的总距离
  var scrollAllheight = document.body.scrollHeight || document.documentElement.scrollHeight;
  // 视图高度
  var innerHeight = window.innerHeight || document.body.clientHeight;
  // 滚动的距离
  var scrollH = document.body.scrollTop;
  if (scrollH + innerHeight >= scrollAllheight) {
    console.log('到底了');
  }
}
