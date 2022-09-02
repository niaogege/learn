---
title: 设计模式之装饰者模式
order: 2
group:
  order: 10
  title: js Basic
  path: /interview/designMode
nav:
  order: 3
  title: 'interview'
  path: /interview
---

## 定义

JavaScript 中的装饰器和 Python 的装饰器类似，依赖于 Object.defineProperty，一般是用来装饰类、类属性、类方法。使用装饰器可以做到不直接修改代码，就实现某些功能，做到真正的面向切面编程。这在一定程度上和 Proxy 很相似，但使用起来比 Proxy 会更加简洁。

在 TypeScript 中装饰器分为**类装饰器**、**属性装饰器**、**方法装饰器**和**参数装饰器**四大类。装饰器的**本质是一个函数**，通过装饰器我们可以方便地定义与对象相关的元数据。

### 类装饰器

编译前

```js
@annotation
class MyClass {}

function annotation(target) {
  target.annotated = true;
}
```

编译后

```js
'use strict';

var _class;

let MyClass = annotation((_class = class MyClass {})) || _class;

function annotation(target) {
  target.annotated = true;
}
```

@符号只是一个语法糖，如果你有使用过 Angular，相信你对以下代码并不会陌生。

```ts
const API_URL = new InjectionToken('apiUrl');

@Injectable()
export class HttpService {
  constructor(private httpClient: HttpClient, @Inject(API_URL) private apiUrl: string) {
    console.log('Injectable');
  }
}
```

在 **Injectable** 类装饰器修饰的 HttpService 类中，我们通过构造注入的方式注入了用于处理 HTTP 请求的 HttpClient 依赖对象。而通过 **Inject** 参数装饰器注入了 API_URL 对应的对象，这种方式我们称之为依赖注入 **Dependency Injection**。

类装饰器的原理等同于

```js
@decorator
class Test {}

// 等同于
class Test {}
Test = decorator(Test) || Test;
```

除了可以修改类本身，还可以通过修改原型，给实例增加新属性。下面是给目标类增加 speak 方法的例子

```js
const withSpeak = (targetClass) => {
  const prototype = targetClass.prototype;
  prototype.speak = function () {
    console.log('I can speak ', this.language);
  };
};
@withSpeak
class Student {
  constructor(language) {
    this.language = language;
  }
}
const student1 = new Student('Chinese');
const student2 = new Student('English');
student1.speak(); // I can speak  Chinese

student2.speak(); // I can speak  English
```

此外 类装饰器还支持传參

```js
const withLanguage = (language) => (targetClass) => {
  targetClass.prototype.language = language;
};
@withLanguage('Chinese')
class Student {}
const student = new Student();
student.language; // 'Chinese'
```

如果你经常编写 **react-redux** 的代码，那么也会遇到需要将 store 中的数据映射到组件中的情况。**connect** 是一个高阶组件，它接收了两个函数 mapStateToProps 和 mapDispatchToProps 以及一个组件 App，最终返回了一个增强版的组件。

```ts
export const PageDecorator = (params: Params) => {
  return (WrappedComponent: typeof Component) => {
    return class PageBgColor extends Component {
      componentDidMount() {
        console.log('装饰器 didMount');
      }
      render() {
        return (
          // <div style={{backgroundColor: `${params.color}`}}>
          //   <WrappedComponent {...this.props}/>
          // </div>
        )
      }
    }
  }
}
@PageDecorator({color: 'red'})
class PageIndex extends Component {
  componentDidMount() {
    console.log('业务组件 did Page');
  }
  render() {
    return (
      <div>
        <TestHoc />
        this is Test
      </div>
    );
  }
}
```

### 类属性或者方法装饰器

**类属性装饰器**可以用在类的属性、方法、get/set 函数中，一般会接收三个参数

- target：被修饰的类
- name：类成员的名字
- descriptor：属性描述符，对象会将这个参数传给 **Object.defineProperty** 使用类属性装饰器可以做到很多有意思的事情，比如最开始举的那个 **readonly** 的例子：

编译前

```js
class Person {
  @readonly name = 'cpp';
}
function readonly(target, name, descriptor) {
  descriptor.writable = false;
  return descriptor;
}
const person = new Person();
person.name = 'wmh';
console.log(person.name);
```

编译后

```js
'use strict';

var _class, _descriptor;

function _initializerDefineProperty(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0,
  });
}
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object.keys(descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;
  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }
  desc = decorators
    .slice()
    .reverse()
    .reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);
  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }
  if (desc.initializer === void 0) {
    Object.defineProperty(target, property, desc);
    desc = null;
  }
  return desc;
}

function _initializerWarningHelper(descriptor, context) {
  throw new Error(
    'Decorating class property failed. Please ensure that ' +
      'proposal-class-properties is enabled and runs after the decorators transform.',
  );
}

let Person =
  ((_class = class Person {
    constructor() {
      _initializerDefineProperty(this, 'name', _descriptor, this);
    }
  }),
  (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'name', [readonly], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return 'cpp';
    },
  })),
  _class);

function readonly(target, name, descriptor) {
  descriptor.writable = false;
  return descriptor;
}

const person = new Person();
person.name = 'wmh';
console.log(person.name);
```

## 实际应用场景

### log 日志

### 统计函数执行时间

实现 time 方法，通过 console.time()以及 console.timeEnd()来计算函数执行时间

```js
class Person {
  @time
  say() {
    console.log('hello');
  }
}
const person1 = new Person();
person1.say();
```

手写 time 装饰器

```js
function time(target: any, name: string, descriptor: any) {
  const func = descriptor.value;
  if (typeof func === 'function') {
    descriptor.value = function (...arg: []) {
      console.time();
      const res = func.apply(this, arg);
      console.timeEnd();
      return res;
    };
  }
}
```

### 防抖和节流

以往我们在频繁触发的场景下，为了优化性能，经常会使用到节流函数。下面以 React 组件绑定滚动事件为例子：

```js
import _ from 'loadsh';
class App extends React.Component {
  componentDidMount() {
    this.handleScroll = _.throttle(this.scroll, 500);
    window.addEveneListener('scroll', this.handleScroll);
  }
  componentWillUnmount() {
    window.removeEveneListener('scroll', this.handleScroll);
  }
  scroll() {}
}
```

有了装饰器之后，我们就不必在每个绑定事件的地方都手动设置 throttle 方法，只需要在 scroll 函数添加一个 throttle 的装饰器就行了。

```js
const throttle = (time) => {
  let prev;
  return (target, name, descriptor) => {
    const func = descriptor.value;
    if (typeof func === 'function') {
      descriptor.value = function (...args) {
        let now = Date.now();
        if (now - prev > time) {
          func.apply(this, agrs);
          prev = now;
        }
      };
    }
  };
};
```

组件使用

```js
import throttle from 'throttle';
class App extends React.Component {
  componentDidMount() {
    window.addEveneListener('scroll', this.scroll);
  }
  componentWillUnmount() {
    window.removeEveneListener('scroll', this.scroll);
  }
  @throttle(50)
  scroll() {}
}
```

防抖版的装饰器试试

```js
// 正常版
function debounce(fn, delay) {
  let timer = null;
  return function (...rest) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, rest);
    }, delay);
  };
}

// ts版

function debouncets(wait) {
  let timer = null
  return (target, name, descriptor) {
    let func = descriptor.value;
    if (typeof func === 'function') {
      descriptor.value = function (...rest) {
        if (timer) {
          clearTimeout(timer)
          timer = setTimeout(() => {
            func.apply(this, rest)
          }, wait)
        }
      }
    }
  }
}
```

## 装饰器模式代码

```ts

```

- [觉得装饰器有点难？那就进来看看呗](https://mp.weixin.qq.com/s?__biz=MzI2MjcxNTQ0Nw==&mid=2247484552&idx=1&sn=fe548e36a4fcda8e103ae6a5cb6cec41&chksm=ea47a5d0dd302cc6fef0c6eab2e585aed4563e90a97a21094ee00d871d9cddaa7a2ba881533c&scene=21#wechat_redirect)
- [如何理解装饰器的作用](https://mp.weixin.qq.com/s/FTtobh-wGylG1TQAkng8uw)
- [ES6 系列之我们来聊聊装饰器](https://segmentfault.com/a/1190000017016040)
