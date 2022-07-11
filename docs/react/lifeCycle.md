---
title: react类组件生命周期
order: 7
group:
  title: react生态
  order: 0
---

React 的生命周期可以分为三个阶段：挂载、渲染、卸载; ![lifeCycle.png](https://s2.loli.net/2022/04/18/cTnguOrkpi348KN.png)

### mout 挂载

1.constructor constructor()中完成了 React 数据的初始化，它接受两个参数：props 和 context，当想在函数内部使用这两个参数时，需使用 super()传入这两个参数。

2.componentWillMount componentWillMount()它更多的是在服务端渲染时使用。它代表的过程是组件已经经历了 constructor()初始化数据后，但是还未渲染 DOM 时。

注意：实际项目中用的比较少，并且在生命周期中只执行一次；

3.componentDidMount 组件第一次通过 render()渲染完成之后才会进入 componentDidMount()，此时 dom 节点已经生成，页面已经可以看到 UI 了，可以在这里调用 ajax 请求；当函数内有 setState，组件会重新渲染，但是不会再次进入此生命周期函数了；

### update 更新

1.componentWillReceiveProps(nextProps) 在接受父组件改变后的 props 需要重新渲染组件时用到的比较多；

2.shouldComponentUpdate(nextProps,nextState) 主要用于性能优化(部分更新)，唯一用于控制组件重新渲染的生命周期；由于在 react 中，当属性(props)或者状态(state)发生改变的时候，组件会进入重新渲染的流程，在这里 return false 可以阻止组件的更新，如果是 return true，则继续进入生命周期中；因为 react 父组件的重新渲染会导致其所有子组件的重新渲染，这个时候其实我们是不需要所有子组件都跟着重新渲染的，因此需要在子组件的该生命周期中做判断；示例:

```js
  shouldComponentUpdate({ isCurrent, id, source, src }) {
    const { id: _id } = this.props;
    if (_id === id) {
      // 如果前后都是同样一个id 则中断更新
      return false;
    }
    // 否则就是继续更新
    return true;
  }
```

3.componentWillUpdate (nextProps,nextState) 只有当 shouldComponentUpdate 返回 true 以后，组件进入重新渲染的流程，才会进入 componentWillUpdate，这里同样可以拿到 nextProps 和 nextState；

4.componentDidUpdate(prevProps,prevState) 组件更新完毕后，react 只会在第一次初始化成功会进入 componentDidmount，之后每次重新渲染后都会进入这个生命周期，这里可以拿到 prevProps 和 prevState，即更新前的 props 和 state。

5.render react 生命周期中关键环节，一般情况下一个 react 组件内部有且仅有一个 render()； jsx -> render Function -> vdom

### unmount 卸载

1.componentWillUnmount () 在此处完成组件的卸载和数据的销毁。

### 父子组件生命周期顺序

- 渲染挂载父组件 渲染 子组件渲染 子组件挂载 父组件挂载 Parent render => Child render => Child componentDidMount => Parent componentDidMount

- 卸载顺序父组件先卸载， 子组件在卸载 parent componentWillUnmount => child componentWillUnmount

### 参考文档

- [react 生命周期详解](https://mp.weixin.qq.com/s/yBZmFMAiXXbhXt0Ommo5Gw)
