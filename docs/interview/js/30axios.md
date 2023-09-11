---
title: axios 手写
order: 30
group:
  order: 1
  title: js Basic
  path: /interview/js
nav:
  order: 3
  title: 'interview'
  path: /interview
---

```js
var dispatch = (config) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 模拟xhr 结果响应值
      resolve('cpp', config);
    }, 1000);
  });
};

var dispatchRequest = (config) => {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open(config.method, config.url, true);
    xhr.onreadystatechange = function () {
      if (xhr.status >= 200 && xhr.readyState === 4) {
        resolve(xhr.responseText);
      } else {
        reject('failed');
      }
    };
    xhr.send();
  });
};
class Axios {
  public defaults;
  public interceptors;
  constructor(config) {
    this.defaults = config;
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager(),
    };
  }
  request(config) {
    // url
    if (typeof config === 'string') {
      config.url = arguments[0];
      config = arguments[1];
    } else {
      config = config || {};
    }
    // method
    if (config.method) {
      config.method = config.method.toLowerCase();
    } else {
      config.method = 'get';
    }
    const chain = [dispatchRequest, undefined];
    this.interceptors.request.forEach((item) => {
      chain.unshift(item.fulfilled, item.rejected);
    });
    this.interceptors.response.forEach((item) => {
      chain.push(item.fulfilled, item.rejected);
    });
    let promise = Promise.resolve(config);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }
    return promise;
  }
}

function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = Axios.prototype.request.bind(context);
     //将 Axios.prototype 属性扩展到 instance 上
    for(let k of Object.keys(Axios.prototype)){
        instance[k] = Axios.prototype[k].bind(context);
    }
    //将 context 属性扩展到 instance 上
    for(let k of Object.keys(context)){
        instance[k] = context[k]
    }
    return instance;
}

var axios = createInstance({})
axios.create = function(config){
    return createInstance(config);
}
export default axios

function extend(child, parent) {
  var parentProto = parent.prototype;
  parentProto.constructor = child;
  child.prototype = parentProto;
  Object.setPrototypeOf(child, parent);
}

axios({
  method: 'post',
  url: '/user/12345',
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone',
  },
});

axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    return config;
  },
  function (err) {
    // 对请求错误做些什么
    return Promise.reject(err);
  },
);

class InterceptorManager {
  public handlers;
  constructor() {
    this.handlers = [];
  }
  use(fulfilled, rejected) {
    this.handlers.push({
      fulfilled,
      rejected,
    });
    return this.handlers.length - 1;
  }
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }
  // 执行所以方法
  forEach(fn) {
    this.handlers.forEach((item) => {
      item && fn(item);
    });
  }
}
```
