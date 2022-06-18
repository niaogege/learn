---
title: react源码Vdom和jsx
order: 0
group:
  title: react源码阅读
  order: 0
  path: /read-code/react
nav:
  order: 1
  title: 'read-code'
  path: /read-code
---

- 实现简单的 virtual-dom

### 实现简单的 virtual-dom

VDom 声明式的描述页面结构对象

dom 主要是**元素、属性、文本**，vdom 也是一样，其中元素是 {type、props、children} 的结构，文本就是字符串、数字。属性就是 props ,包含 className/style/onClick 等属性

type: li/div/p 元素标签名 props: className/style/onClick children: []

```js
{
  type: 'ul',
  props: {
    className: 'list'
  },
  children: [
    {
        type: 'li',
        props: {
            className: 'item',
            style: {
                background: 'blue',
                color: '#fff'
            },
            onClick: function() {
              alert(1);
            }
        },
        children: [
            'aaaa'
        ]
    },
    {
        type: 'li',
        props: {
            className: 'item'
        },
        children: [
            'bbbbddd'
        ]
    },
    {
          type: 'li',
          props: {
              className: 'item'
          },
          children: [
              'cccc'
          ]
      }
  ]
}
```

如果是文本类型，那么就要用 **document.createTextNode** 来创建文本节点。

如果是元素类型，那么就要用 **document.createElement** 来创建元素节点，元素节点还有属性要处理，并且要递归的渲染子节点。

```js
function isTextDom(vdom) {
  return typeof vdom === 'string' || typeof vdom === 'number';
}

function isElementDom(vdom) {
  return typeof vdom === 'object' && typeof vdom.type === 'string';
}

// 处理元素属性
// onClick 绑定
// style 合并到dom.style

function setAttribute(dom, key, val) {
  if (typeof val === 'function' && startsWith('on')) {
    const eventType = key.slice(2).toLowerCase();
    dom.addEventListeners(key, val);
  }
}

const render = (vdom, parent = null) => {
  const mount = parent ? (el) => parent.appendChild(el) : (el) => el;
  if (isTextDom(vdom)) {
    return mount(document.createTextNode(vdom));
  } else if (isElement(vdom)) {
    const dom = mount(document.createElement(vdom));
    for (const child of vdom.childrem) {
      render(child, dom);
    }
    for (const prop of vdom.props) {
      setAttribute(dom, prop, vdom.props[prop]);
    }
    return dom;
  }
};
```
