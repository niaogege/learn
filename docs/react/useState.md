---
title: setState/useState异步同步问题
order: 6
group:
  title: react生态
  order: 0
---

本文了解到的知识

- useState 同步还是异步
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
    setCount(count + 1); // 一次渲染
    setCount(count + 1); // 跟上一行代码一同渲染 合并渲染一次
    // setCount(count => count + 1)
    // setCount(count => count + 1)
    // setTimeout(() => {
    //   setCount(count => count + 1); // 一次渲染
    // }, 0)
  };
  console.log('render'); // 只会渲染一次
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
    // setCount(count => count + 1)
    // setCount(count => count + 1)
    setTimeout(() => {
      setCount((count) => count + 1); // 一次渲染
      setCount((count) => count + 1); // 一次渲染
    }, 0);
  };
  console.log('render'); // 会渲染2次
  return (
    <>
      <div>Count: {count}</div>
      <div>A: {a}</div>
      <button onClick={handle}>递增</button>
    </>
  );
};
```

## 源码

```js

```

## 其他 useState

- [为什么 useState 不能在判断语句中声明](https://react.docschina.org/docs/hooks-rules.html)
-

## 参考文档

- [React useState 和 setState 到底是同步还是异步呢？](https://juejin.cn/post/6959885030063603743#heading-6)
- [setState 是同步还是异步](https://juejin.cn/post/6875115591154270221#heading-4)
- [React 精髓：深入了解 useState](https://mp.weixin.qq.com/s/cYNRcKi1CFpFyLxPBGJmIA)
