---
title: DOM总览
order: 0
group:
  order: 10
  title: browser
  path: /interview/browser
nav:
  order: 3
  title: 'interview'
  path: /interview
---

## DOM 事件处理程序

### DOM 0 级事件

```js
// 例1
var btn = document.getElementById('btn');
btn.onclick = function () {
  alert(this.innerHTML);
};
```

DOM0 事件绑定，给元素的事件行为绑定方法，这些方法都是在当前元素事件行为的冒泡阶段(或者目标阶段)执行的。

### DOM 2 级事件

语法 `el.addEventListener(event-name, callback, useCapture)`

event-name: 绑定的事件名 callback: 执行的回调函数 useCapture: 默认 false,代表冒泡时绑定

## 事件冒泡和事件捕获

### addEventListener 默认是捕获还是冒泡

默认是冒泡

addEventListener 第三个参数默认为 **false** 代表**执行事件冒泡行为**(代表冒泡时绑定)。

当为 true 时执行事件捕获行为(代表捕获时绑定)。

## 事件代理

### 什么是事件代理（事件委托） 有什么好处

事件委托的原理：不给每个子节点单独设置事件监听器，而是设置在其父节点上，然后利用冒泡原理设置每个子节点。

- 减少内存消耗和 dom 操作，提高性能在 JavaScript 中，添加到页面上的事件处理程序数量将直接关系到页面的整体运行性能，因为需要不断的操作 dom,那么引起浏览器重绘和回流的可能也就越多，页面交互的事件也就变的越长，这也就是为什么要减少 dom 操作的原因。每一个事件处理函数，都是一个对象，多一个事件处理函数，内存中就会被多占用一部分空间。如果要用事件委托，就会将所有的操作放到 js 程序里面，只对它的父级进行操作，与 dom 的操作就只需要交互一次，这样就能大大的减少与 dom 的交互次数，提高性能；

- 动态绑定事件因为事件绑定在父级元素 所以新增的元素也能触发同样的事件

- 使用事件委托存在两大优点：

减少整个页面所需的内存，提升整体性能动态绑定，减少重复工作但是使用事件委托也是存在局限性：

focus、blur 这些事件没有事件冒泡机制，所以无法进行委托绑定事件

mousemove、mouseout 这样的事件，虽然有事件冒泡，但是只能不断通过位置去计算定位，对性能消耗高，因此也是不适合于事件委托的

## 如何自定义一个事件，是某一个对象能够捕获到？

## target 和 currentTarget 区别

- target: 代表的是**触发事件**的元素
- currentTarget: 代表的是**绑定事件**的元素

addEventListener 第三个参数是 true 的话则分别打印,捕获

```js
targetId是child
currentTarget grand
targetId是child
currentTarget parent
targetId是child
currentTarget child
```

addEventListener 第三个参数是 false 的话则分别打印,冒泡

```js
targetId是child
currentTarget child
targetId是child
currentTarget parent
targetId是child
currentTarget grand
```

代码示例：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>冒泡和捕获</title>
  </head>
  <body>
    <div id="grand">
      爷爷
      <div id="parent">
        父亲
        <div id="child">自己</div>
      </div>
    </div>
    <script>
      var grand = document.getElementById('grand');
      var parent = document.getElementById('parent');
      var child = document.getElementById('child');
      grand.addEventListener(
        'click',
        function (e) {
          const { target, currentTarget } = e;
          console.log(`targetId是${target.id}`);
          console.log(`currentTarget ${currentTarget.id}`);
        },
        true,
      );
      parent.addEventListener(
        'click',
        function (e) {
          const { target, currentTarget } = e;
          console.log(`targetId是${target.id}`);
          console.log(`currentTarget ${currentTarget.id}`);
        },
        true,
      );
      child.addEventListener(
        'click',
        function (e) {
          const { target, currentTarget } = e;
          console.log(`targetId是${target.id}`);
          console.log(`currentTarget ${currentTarget.id}`);
        },
        true,
      );
    </script>
  </body>
</html>
```

## 感谢大佬提供的技术支持

- [DOM 事件机制](https://juejin.cn/post/6844903731079675917)
- [面试官：说说你对 DOM 的理解，常见的操作有哪些](https://mp.weixin.qq.com/s/naODDoX2w_qTrmheISx3Dw)
- [面试官：JavaScript 中的事件模型如何理解?](https://mp.weixin.qq.com/s/avXtM79vyywVq6Gg6ui29A)
