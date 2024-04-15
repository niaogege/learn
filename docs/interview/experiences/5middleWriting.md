---
title: 面试经验之手写js中阶版
order: 5
group:
  order: 11
  title: /interview/experience
nav:
  order: 3
  title: 'interview'
  path: /interview
---

- 虚拟 dom 转换为真实 dom
- 大数相加
- 数字通过千分位展示
- 模板字符串解析
- 驼峰转化
- 十六进制转 rgb 或者 rgb 转十六进制
- 手写 es6 中的 class
- 手写 es6 中的 extends

## 虚拟 dom 转换为真实 dom

VDom 实现一般来说是这四个步骤

- 用 js 对象模拟 DOM 树
- render 方法生成真实 DOM 节点
- 计算新老虚拟 dom 差异-即 diff 算法
- 将两个虚拟 DOM 对象的差异应用到真正的 DOM 树

前端框架就是通过这样的对象结构来描述界面的，然后把它渲染到真实 DOM 上

**通过 DOM 不同的 api (比如 document.createElement/document.createTextNode) 递归创建 dom 和设置属性(比如 dom.addEventListener/dom.setAttribute)，这就是 vdom 的渲染流程。」**

通过不同的 DOM API 创建和设置属性，返回最终的真实 DOM

```js
const vnode = {
  tag: 'DIV',
  attrs: {
    id: 'app',
  },
  children: [
    {
      tag: 'SPAN',
      children: [
        {
          tag: 'A',
          children: [],
        },
      ],
    },
    {
      tag: 'SPAN',
      children: [
        {
          tag: 'A',
          children: [],
        },
        {
          tag: 'A',
          children: [],
        },
      ],
    },
  ],
};

/**
 * 元素类型
 * tag = div 如果是元素类型，那么就要用 document.createElement 来创建元素节点，元素节点还有属性要处理，并且要递归的渲染子节点。
 * tag = text 生成文本节点 如果是文本类型，那么就要用 document.createTextNode 来创建文本节点。
 */
function render(vnode, parent = null) {
  const mount = parent ? (el) => parent.appendChild(el) : (el) => el;
  if (isTextdom(vnode)) {
    return mount(document.createTextNode(vnode));
  } else if (isElementDom(vnode)) {
    const dom = mount(document.createElement(vnode));
    for (const child of vnode.children) {
      render(child, dom);
    }
    for (const prop in vnode.props) {
      setAttribute(dom, prop, vnode.props[prop]);
    }
    return dom;
  }
}
function setAttribute(dom, key, val) {
  if (typeof val === 'function' && key.startsWith('on')) {
    const eventType = key.slice(2).toLowerCase();
  } else if (typeof val === 'object' && key === 'style') {
    Object.assign(dom.style, val);
  } else if (typeof val !== 'function' && typeof val !== 'object') {
    dom.setAttribute(key, val);
  }
}
function isTextDom(vdom) {
  return typeof vdom === 'string' || typeof vdom === 'number';
}

function isElementDom(vdom) {
  return typeof vdom === 'object' && typeof vdom.type === 'string';
}

render(vnode, document.getElementById('app'));
```

## 大数相加

```js
function bigInt(a, b) {}
```

## 数字通过千分位展示

```js
function thousand(str) {
  var reg = /(?!^)(?=(\d{3})+$)/g;
  return str.replace(reg, ',');
}
thousand('123456789');
```

## 手机号 3-4-4 分割

```js
// 18724009609 =》 187-2400-9609
function splitTel(str) {
  var reg = /(?=(\d{4})+$)/g;
  return str.replace(reg, '-');
}
splitTel('18724009609');
```

## 模板字符串解析

```js
function render(str, data) {
  var reg = /\{\{(\w+)\}\}/;
  if (reg.test(str)) {
    var name = RegExp.$1.trim(); // reg.exec(str)[1]
    str = str.replace(reg, data[name]);
    return render(str, data);
  }
  return str;
}
render(`{{msg}}-{{name}}`, { msg: 'chendap', name: 'wmh' });
```

## 驼峰转化

```js
function uppercase(str) {
  return str.replace(/[-|_|@]([\w])/, (match, p) => p && p.toUpperCase());
}
uppercase('cpp-wmh');
```

## 十六进制转 rgb 或者 rgb 转十六进制

```js
// rgb(255, 255, 255) => #ffffff
function rgbToHex(str) {
  var hex = str.split(/[^\d]+/g);
  console.log(hex, 'hex');
  var [, r, g, b] = hex;
  var toHex = (val) => {
    var hex = (+val).toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
rgbToHex(`rgb(255, 255, 255)`);

// #ffffff => rgb(255,255,255)
```

## 手写 es6 中的 class

```js
function mockClass(con, proto, staticProps) {
  proto && defineProperties(con.prototype, proto);
  staticProps && defineProperties(con, staticProps);
  return con;
}
function defineProperties(target, obj) {
  for (let key in obj) {
    Object.defineProperty(target, key, {
      value: obj[key],
      writable: true,
      enumerable: false,
      configurable: true,
    });
  }
}
```

## 手写 es6 中的 extends

1.类的属性和方法以及原型上的属性和方法需要继承 2.类的静态属性和方法需要子类继承

```js
function extend(Child, Parent, proto) {
  var prototype = Object.create(Parent.prototype); // 1
  prototype.constructor = Child; // 2 父类的构造函数指向子类
  Child.prototype = prototype; // 3 子类的原型执行父类原型
  Object.setPrototypeOf(Child, Parent); // 类的静态属性需要子类继承
  for (var k in proto) {
    Child.prototype[k] = proto[k];
  }
}
// test
function Par(name) {
  this.name = name;
}
Par.prototype.logName = function () {
  console.log(`My name is ${this.name}`);
};

Par.staticFn = function () {
  return 'staticFn';
};

function Child(name, age) {
  Par.call(this, name);
  this.age = age;
}

extend(Child, Par, {
  logAge() {
    console.log(`my age is ${this.age}`);
  },
});
var c1 = new Child('cpp', 32);
c1.age;
c1.logAge();
Child.staticFn();

class A {
  constructor(name) {
    this.name = name;
  }
  logName() {
    console.log('My name is ' + this.name + '.');
  }
  static staticFn() {
    return 'staticFn';
  }
}

class AA extends A {
  constructor(name, age) {
    super(name);
    this.age = age;
  }

  logAge() {
    console.log("I'm " + this.age + ' years old.');
  }
}
var a = new AA('xiaolan', 10);
a.logName(); //My name is xiaolan
a.logAge(); //I'm 10 years old.
a.staticFn();
```
