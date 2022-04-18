---
title: setState/useState异步同步问题
order: 6
group:
  title: react生态
  order: 0
---

本文了解到的知识

- useState 同步还是异步(18.0 版本之前跟之后)
- useState 中的闭包陷进
- useState 中的源码

## useState

> state 使用浅比较对比新旧数据。也就意味着，当 state 为引用数据类型时，如果你的新数据与旧数据引用相同，那么 React 无法感知到你的数据发生了变化

## useState 异步还是同步

**结论：**

- 在正常的 react 的事件流里（如 onClick 等合成事件和钩子函数）

setState 和 useState 是异步执行的（不会立即更新 state 的结果）多次执行 setState 和 useState，只会调用一次重新渲染 render

> 不同的是，setState 会进行 state 的合并,多次调用一个 state，setState 只会处理最后一个，而 useState 则不会，useState 会逐个进行处理，当然渲染都是一次

- 在 setTimeout，Promise.then 等原生异步事件中

setState 和 useState 是同步执行的（立即更新 state 的结果）多次执行 setState 和 useState，每一次的执行 setState 和 useState，都会调用一次 render

> state 是被监控的数据，它与 UI 的变化息息相关。在实践中，还有很多其他的数据与 UI 变化无关，他们不应该放在 state 中来管理，而应该想其他办法。

使用函数创建组件时，内部数据 state 通过 useState 定义。

```js
function F() {
  // 利用数组结构得到两个变量
  // count：表示定义的数据
  // setCount：修改该数据的方法
  // useState：从闭包数据中取出 count 的值，0 仅表示默认值
  const [A, setA] = useState(0);
  return (
    <>
      <div> A: {A}</div>
    </>
  );
}
```

## useState 中的闭包陷阱

在函数组件中，如果我们在回调函数中使用了 state 的值，那么闭包就会产生。闭包在函数创建时产生，他会缓存创建时的 state 的值。

在很多文章中，把这种现象称为“闭包陷阱”，它是一种正常现象，但是如果你在使用时无法正确识别它，那么会给你带来麻烦。

```js
export default () => {
  const [count, setCount] = useState(1);
  const [a, setA] = useState(1);
  const handle = () => {
    // 闭包陷阱
    setCount(count + 1); // 一次渲染
    setCount(count + 1); // 跟上一行代码一同渲染 合并渲染一次
  };
  console.log('render'); // 渲染一次
  return (
    <>
      <div>Count: {count}</div>
      <div>A: {a}</div>
      <button onClick={handle}>递增</button>
    </>
  );
};
```

解决之道：

```js
export default () => {
  const [count, setCount] = useState(1);
  const [a, setA] = useState(1);
  const handle = () => {
    /** 批处理 回调函数中一次渲染 18.0Before**/
    setCount((count) => count + 1);
    setCount((count) => count + 1);

    /**两次渲染 18.0Before**/
    // setTimeout(() => {
    //   setCount(count => count + 1); // 一次渲染
    //   setCount(count => count + 1); // 一次渲染
    // }, 0)
  };
  console.log('render'); // 会渲染1次
  return (
    <>
      <div>Count: {count}</div>
      <div>A: {a}</div>
      <button onClick={handle}>递增</button>
    </>
  );
};
```

## React18.0 中的自动批处理 Automatic Batching

批处理是指 react 将多个状态更新，聚合到一次渲染 render 执行，以提高性能

```js
class ClassIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      a: 0,
    };
  }
  handle = () => {
    /**两次合为一次渲染**/
    this.setState({ a: this.state.a + 1 });
    this.setState({ a: this.state.a + 1 });
    // 这里跟useState不同，同步执行时useState也会对state进行逐个处理，而setState则只会处理最后一次
  };
  handleWithPromise = () => {
    // 2次渲染 分别打印 1 2
    Promise.resolve().then(() => {
      this.setState({ a: this.state.a + 1 });
      this.setState({ a: this.state.a + 1 });
    });
  };
  render() {
    const A = this.state.a;
    return (
      <div>
        <h2>A: {A}</h2>
        <button onClick={this.handle}>同步执行递增</button>
        <button onClick={this.handleWithPromise}>异步执行递增</button>
      </div>
    );
  }
}
```

在 React 18 中，**所有的状态更新，都会自动使用批处理，不关心场景**。

```js
handleWithPromise = () => {
  // 18.0 改1次渲染 直接打印2 批处理
  Promise.resolve().then(() => {
    this.setState({ a: this.state.a + 1 });
    this.setState({ a: this.state.a + 1 });
  });
};
```

如果你在某种场景下不想使用批处理，你可以通过 flushSync 来强制同步执行（比如：你需要在状态更新后，立刻读取新 DOM 上的数据等。）

```js
handleWithPromise = () => {
  // 18.0 改1次渲染 直接打印2 批处理
  Promise.resolve().then(() => {
    ReactDom.flushSync(() => {
      this.setState({ a: this.state.a + 1 });
    });
    this.setState({ a: this.state.a + 1 });
  });
};
```

React 18 的批处理在绝大部分场景下是没有影响，但在 Class 组件中，如果你在两次 setState 中间读取了 state 值，会出现不兼容的情况，如下示例。

```js
handleClick = () => {
  setTimeout(() => {
    this.setState(({ count }) => ({ count: count + 1 }));
    // 在 React17 及之前，打印出来是 { count: 1, flag: false }
    // 在 React18，打印出来是 { count: 0, flag: false }
    console.log(this.state);
    this.setState(({ flag }) => ({ flag: !flag }));
  });
};
```

通过 **flushSync** 来修正它

```js
handleClick = () => {
  setTimeout(() => {
    ReactDOM.flushSync(() => {
      this.setState(({ count }) => ({ count: count + 1 }));
    });
    // 在 React18，打印出来是 { count: 1, flag: false }
    console.log(this.state);
    this.setState(({ flag }) => ({ flag: !flag }));
  });
};
```

## 源码

```js

```

## useState 其他

- [为什么 useState 不能在判断语句中声明](https://react.docschina.org/docs/hooks-rules.html)

## 参考文档

- [React18.0](https://mp.weixin.qq.com/s/t3dYc3Md1dpiv1vaFa5plA)
- [React useState 和 setState 到底是同步还是异步呢？](https://juejin.cn/post/6959885030063603743#heading-6)
- [setState 是同步还是异步](https://juejin.cn/post/6875115591154270221#heading-4)
- [React 精髓：深入了解 useState](https://mp.weixin.qq.com/s/cYNRcKi1CFpFyLxPBGJmIA)
