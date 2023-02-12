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

> [EventTarget.addEventListener()](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener)

EventTarget.addEventListener() 方法将指定的监听器注册到 EventTarget 上，当该对象触发指定的事件时，指定的回调函数就会被执行。事件目标可以是一个文档上的元素 Element、Document 和 Window，也可以是任何支持事件的对象（比如 XMLHttpRequest）。

addEventListener() 的工作原理是将实现 EventListener 的函数或对象添加到调用它的 EventTarget 上的指定事件类型的事件侦听器列表中。如果要绑定的函数或对象已经被添加到列表中，该函数或对象不会被再次添加。

- 语法

```js
addEventListener(type, listener);
addEventListener(type, listener, options);
addEventListener(type, listener, useCapture);
```

- useCapture 参数(可选)

一个布尔值，表示在 DOM 树中注册了 listener 的元素，是否要先于它下面的 EventTarget 调用该 listener。当 useCapture（设为 true）时，沿着 DOM 树向上冒泡的事件不会触发 listener。当一个元素嵌套了另一个元素，并且两个元素都对同一事件注册了一个处理函数时，所发生的事件冒泡和事件捕获是两种不同的事件传播方式。事件传播模式决定了元素以哪个顺序接收事件

如果没有指定，useCapture 默认为 false

- options(可选) 一个指定有关 listener 属性的可选参数对象。可用的选项如下：

**capture** 可选一个布尔值，表示 listener 会在该类型的事件**捕获阶段**传播到该 EventTarget 时触发。

**once** 可选一个布尔值，表示 listener 在添加之后**最多只调用一次**。如果为 true，listener 会在其被调用之后自动移除。

**passive** 可选一个布尔值，设置为 true 时，表示 listener 永远**不会调用 preventDefault()**。如果 listener 仍然调用了这个函数，客户端将会忽略它并抛出一个控制台警告

**signal** 可选 AbortSignal，该 AbortSignal 的 abort() 方法被调用时，监听器会被移除。

### js 案例：添加一个简单的监听器

这个例子用来展示如何使用 addEventListener() 监听鼠标点击一个元素的事件。

```html
<body>
  <table id="outside">
    <tr>
      <td id="t1">one</td>
    </tr>
    <tr>
      <td id="t2">two</td>
    </tr>
  </table>
  <script>
    function modoify() {
      const t2 = document.getElementById('t2');
      const isT2 = t2.firstChild.nodeValue === 'Three';
      t2.firstChild.nodeValue = isT2 ? 'Two' : 'Three';
    }
    const el = document.getElementById('outside');
    el.addEventListener('click', modoify, false);
  </script>
</body>
```

这个例子中，modoify() 是一个 **click 事件的监听器**，通过使用 addEventListenter() 注册到 table 对象上。在表格中任何位置单击都会触发事件并执行 modoify()。

### js 案例：实现一个可移除的监听器

这个例子用来展示如何使用 addEventListenter() 添加一个可被 AbortSignal 移除的侦听器

```html
<body>
  <table id="outside">
    <tr>
      <td id="t1">one</td>
    </tr>
    <tr>
      <td id="t2">two</td>
    </tr>
  </table>
  <script>
    const controller = new AbortController();
    function modoify() {
      const t2 = document.getElementById('t2');
      const isT2 = t2.firstChild.nodeValue === 'Three';
      t2.firstChild.nodeValue = isT2 ? 'Two' : 'Three';
      if (t2.firstChild.nodeValue === 'Three') {
        controller.abort();
      }
    }
    const el = document.getElementById('outside');
    el.addEventListener('click', modoify, {
      signal: controller.signal,
    });
  </script>
</body>
```

在这个例子中，我们修改了上一个例子的代码。在第二行的内容变为 three 时，我们调用了传入 addEventListener() 的 AbortController 中的 abort() 方法。如此，无论如何点击表格，第二行的内容都不会再发生改变，因为表格中的点击事件监听器已被移除。

## 事件冒泡和事件捕获

### addEventListener 默认是捕获还是冒泡

**默认是冒泡**

addEventListener 第三个参数默认为 **false** 代表**执行事件冒泡行为**(代表冒泡时绑定)。

当为 true 时执行事件捕获行为(代表捕获时绑定)。

### 检测：以下代码输出打印顺序

```html
<body>
  <section class="container" id="container">
    <section class="item" id="item">
      <section class="btn" id="btn">Click me</section>
    </section>
  </section>
  <script>
    document.addEventListener(
      'click',
      (e) => {
        console.log('Document click');
      },
      {
        capture: true,
      },
    );

    container.addEventListener(
      'click',
      (e) => {
        console.log('Container click');
        // e.stopPropagation()
      },
      {
        capture: true,
      },
    );

    item.addEventListener('click', () => {
      console.log('Item click');
    });

    btn.addEventListener('click', () => {
      console.log('Btn click');
    });

    btn.addEventListener(
      'click',
      () => {
        console.log('Btn click When Capture');
      },
      {
        capture: true,
      },
    );

    // Document click
    // Container click
    // Btn click When Capture
    // Btn click
    // Item click
  </script>
</body>
```

记住： 捕获阶段是在冒泡阶段前面，先捕获在冒泡

### 阻止默认行为阻止冒泡

- 阻止冒泡

w3c 的方法是 **e.stopPropagation**()，IE 则是使用 e.cancelBubble = true；

- 阻止默认行为

w3c 的方法是 **e.preventDefault**()，IE 则是使用 e.returnValue = false;

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

> 触发事件和绑定事件的元素不一样,触发事件的元素可能一样 绑定的元素肯定不一样

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
