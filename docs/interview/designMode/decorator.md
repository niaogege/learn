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

如果你经常编写 react-redux 的代码，那么也会遇到需要将 store 中的数据映射到组件中的情况。connect 是一个高阶组件，它接收了两个函数 mapStateToProps 和 mapDispatchToProps 以及一个组件 App，最终返回了一个增强版的组件。

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
      // <div>
      //   <TestHoc />
      //   this is Test
      // </div>
    );
  }
}
```

### 类属性或者方法装饰器

类属性装饰器可以用在类的属性、方法、get/set 函数中，一般会接收三个参数

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

实现 time 方法

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

手写

```js
function time(target: any, name: string, descriptor: any) {
  const func = descriptor.value;
  if (typeof descriptor === 'function') {
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

## 装饰器模式代码

```ts

```

- [觉得装饰器有点难？那就进来看看呗](https://mp.weixin.qq.com/s?__biz=MzI2MjcxNTQ0Nw==&mid=2247484552&idx=1&sn=fe548e36a4fcda8e103ae6a5cb6cec41&chksm=ea47a5d0dd302cc6fef0c6eab2e585aed4563e90a97a21094ee00d871d9cddaa7a2ba881533c&scene=21#wechat_redirect)
- [如何理解装饰器的作用](https://mp.weixin.qq.com/s/FTtobh-wGylG1TQAkng8uw)
- [ES6 系列之我们来聊聊装饰器](https://segmentfault.com/a/1190000017016040)
