---
title: function 和 class 组件(笔记)
order: 2
group:
  title: react源码阅读
  order: 0
  path: /read-code/react
nav:
  order: 1
  title: 'read-code'
  path: /read-code
---

> 内容来自神光[function 和 class 组件](https://mp.weixin.qq.com/s/T6SvUYdkf1nAaxoYO4wcgg)

> 了解类和函数组件的大概流程和架构以及设计理念

jsx 不是直接编译成 vdom 的，而是生成 render function，执行之后产生 vdom。

jsx => render function => vdom

中间多加了一层 render function，可以执行一些动态逻辑。别小看这一层 render function，它恰恰是实现组件的原理。

## 实现组件渲染

支持了 jsx 后，可以执行一些动态逻辑，比如循环遍历、比如从上下文中取值：

```js
const data = {
  a1: 'cpp',
  a2: 'wmh',
  a3: 'chendapeng',
};
const list = ['cpp', 'wmh'];
const jsx = (
  <ul className="list">
    {list.map((item) => (
      <li>{item}</li>
    ))}
  </ul>
);

render(jsx, document.getElementById('root'));
```

这个封装成函数，然后传入参数不就是组件么？我们在 render 函数里处理下函数组件的渲染：

```js
// render函数最终返回真实DOM
const render = (vdom, parent = null) => {
  // 如果有父节点要挂载到父节点 组装成一个dom树
  const mount = parent ? (el) => parent.appendChild(el) : (el) => el;
  // 如果是文本节点 则是先创建文本节点在直接挂载
  if (isTextDom(vdom)) {
    return mount(document.createTextNode(vdom));
    // 如果是元素类型 则需要遍历和递归处理
  } else if (isElementDom(vdom)) {
    const dom = mount(document.createElement(vdom.type));
    for (const child of vdom.children) {
      render(child, dom);
    }
    // 元素上的各种属性需要设置下
    for (const prop in vdom.props) {
      setAttribute(dom, prop, vdom.props[prop]);
    }
    return dom;
    // 如果是函数式组件
  } else if (isComponent(vdom)) {
    const props = Object.assign({}, vdom.props, {
      children: vdom.children,
    });
    const componentVdom = vdom.type(props); // dom 都是li/div/'cpp'这种，类函数不一样
    return render(componentVdom, parent);
  } else {
    throw new Error(`Invalid VDOM: ${vdom}.`);
  }
};
```

## 实现 class 组件

class 组件需要声明一个类，有 state 的属性：

```js
class Component {
  constructor(props) {
    this.props = props || {};
    this.state = null;
  }
  setState(nextState) {
    this.state = nextState;
  }
  render() {
    return <></>;
  }
}
```

所以需要在 render 判断类型那里再加个逻辑,还可以加上渲染前后的生命周期函数：

```js
// render函数最终返回真实DOM
const render = (vdom, parent = null) => {
  ...
  // 如果是函数式组件
  if (isComponent(vdom)) {
    if (Component.isPrototypeOf(vdom.type)) {
      const instance = new vdom.type(props)

      instance.componentWillMount() // 即将初始化

      const componentVdom = instance.render()
      instance.dom = render(componentVdom, parent)

      instance.componentDidMount()

      return instance.dom
    } else {
      const props = Object.assign({}, vdom.props, {
        children: vdom.children,
      });
      const componentVdom = vdom.type(props);// dom 都是li/div/'cpp'这种，类函数不一样
      return render(componentVdom, parent);
    }
  } else {
    throw new Error(`Invalid VDOM: ${vdom}.`);
  }
};
```

上篇文章我们支持了 jsx，它编译产生 render function，执行之后可以拿到 vdom，然后再渲染。

多了这层 **render function** 之后，它可以执行很多动态逻辑，比如条件判断、循环，从上下文取值等。

对这些逻辑封装一下就是组件了：

- 封装成函数，传入 props，就是函数组件
- 封装成 class，传入 props，设置 state 属性，就是 class 组件

**组件本质上是对 vdom 的动态渲染逻辑的封装，class 和 function 是两种封装形式**

组件本质上是 render Function 渲染函数执行时对动态逻辑的封装，类组件和函数组件都是两种封装形式

> 大佬总结就是精辟

实现了 vdom 的渲染之后，支持组件的两种封装形式是非常简单的事情。
