---
title: 面试经验之手写js中阶版
order: 5
group:
  order: 0
  title: interview
nav:
  order: 3
  title: 'interview'
  path: /interview
---

## 虚拟 dom 转换为真实 dom

VDom 实现一般来说是这四个步骤

- 用 js 对象模拟 DOM 树
- render 方法生成真实 DOM 节点
- 计算新老虚拟 dom 差异-即 diff 算法
- 将两个虚拟 DOM 对象的差异应用到真正的 DOM 树

前端框架就是通过这样的对象结构来描述界面的，然后把它渲染到真实 DOM 上

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
  if (isTextdom(vnode)) {
    return document.createTextNode(vnode);
  } else if (isElementDom(vnode)) {
    const dom = document.createElement(vnode);
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
