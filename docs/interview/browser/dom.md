---
title: DOM总览
order: 1
group:
  order: 10
  title: browser
  path: /interview/browser
nav:
  order: 3
  title: 'interview'
  path: /interview
---

本文总结

- DOM 事件处理程序
- DOM 0 级事件
- DOM 2 级事件
- 事件冒泡和事件捕获
- 事件代理（事件委托）
- target 和 currentTarget 区别
- 自定义一个事件

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

**默认是冒泡**

addEventListener 第三个参数默认为 **false** 代表**执行事件冒泡行为**(代表冒泡时绑定)。

当为 true 时执行事件捕获行为(代表捕获时绑定)。

## 事件代理

### 什么是事件代理（事件委托） 有什么好处

事件委托的原理：不给每个子节点单独设置事件监听器，而是设置在其父节点上，然后利用**冒泡原理**设置每个子节点。

- 减少内存消耗和 dom 操作，提高性能在 JavaScript 中，添加到页面上的事件处理程序数量将直接关系到页面的整体运行性能，因为需要不断的操作 dom,那么引起浏览器重绘和回流的可能也就越多，页面交互的事件也就变的越长，这也就是为什么要减少 dom 操作的原因。每一个事件处理函数，都是一个对象，多一个事件处理函数，内存中就会被多占用一部分空间。如果要用事件委托，就会将所有的操作放到 js 程序里面，只对它的父级进行操作，与 dom 的操作就只需要交互一次，这样就能大大的减少与 dom 的交互次数，提高性能；

- 动态绑定事件因为事件绑定在父级元素 所以新增的元素也能触发同样的事件

- 使用事件委托存在两大优点：

减少整个页面所需的内存，提升整体性能动态绑定，减少重复工作但是使用事件委托也是存在局限性：

- **focus、blur 这些事件没有事件冒泡机制，所以无法进行委托绑定事件**

- mousemove、mouseout 这样的事件，虽然有事件冒泡，但是只能不断通过位置去计算定位，对性能消耗高，因此也是不适合于事件委托

## 如何自定义一个事件，是某一个对象能够捕获到？

### new Event(type, options)

JS 中，最简单的创建事件方法，是使用 Event 构造器：

```js
var event = new Event(type, options);
```

Event 构造函数接受两个参数：第一个参数 type 是字符串，表示自定义事件的名称；第二个参数 options 是一个对象，表示事件对象的配置，该对象主要有下面两个属性：

**bubbles**：布尔值，可选，默认为 false，**表示事件对象是否冒泡**。如何设置 false,也就是不冒泡，父类元素捕获不到，设置 true，根元素就能捕获到

**cancelable**：布尔值，可选，默认为 false，表示能否用 **event.preventDefault()** 阻止浏览器默认事件。

> cancelable 啥用处?cancelable：false 不能被取消

自定义事件需要使用 **el.dispatchEvent(event)** 方法来触发事件。

示例

```html
<button type="button" id="btn">点我</button>

<script>
  var btn = document.getElementById('btn');
  var eve = new Event('msg');

  btn.addEventListener(
    'msg',
    function (event) {
      console.log('hello');
    },
    false,
  );

  btn.dispatchEvent(eve); // hello
</script>
```

### new CustomEvent(type, options)

CustomEvent 用法与 Event 一致，区别是 CustomEvent(type, options) 第二个参数 options 对象的 **detail** 属性可以绑定数据，即我们自定义传参：

```html
<button type="button" id="btn">点我</button>

<script>
  var btn = document.getElementById('btn');
  var eve = new CustomEvent('msg', {
    detail: {
      info: 'cpp',
    },
  });

  btn.addEventListener(
    'msg',
    function (event) {
      console.log(event.detail.info);
    },
    false,
  );

  btn.dispatchEvent(eve); // hello
</script>
```

通过上面两个简单的例子我们可以看出，Event 和 CustomEvent 最大的区别在于，**CustomEvent 可以传递数据**

### 应用场景

情景：有一个数组 arr，每当这个数组添加新的元素之后，我们都要重新打印它一次

```js
let arr = [];
function add(detail) {
  document.dispatchEvent(
    new CustomEvent('onAdd', {
      detail,
    }),
  );
}
// 监听添加事件
document.addEventListener('onAdd', (e) => {
  e.detail ? arr.push(e.detail) : null;
  console.log(arr);
});
// 触发事件
add();
add({ age: 18 });
const btn = document.getElementById('btn');
btn.addEventListener('click', function pp() {
  add({ name: 'cpp' });
});
```

## target 和 currentTarget 区别

- target: 代表的是**触发事件**的元素
- currentTarget: 代表的是**绑定事件**的元素

> 触发事件和绑定事件的元素不一样

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
