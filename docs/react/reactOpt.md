---
title: React性能优化套路
order: 8
group:
  title: react生态
  order: 0
---

简历上写熟练运用 react 框架，那基本上 react 性能优化是逃不掉的，如果进行深度性能优化且在实践中运用呢，做好总结和思考，且先看看大佬们怎样去做的。。。

## 渲染过程

了解 React 渲染的基本原理。在 v16 后 React 组件渲染会分为两个阶段，即 render 和 commit 阶段。

- render 阶段决定需要进行哪些变更。这个阶段 React 会调用 **render** 函数，并将结果和上一次 render 的结果进行 diff, 计算出需要进行变更的操作队列
- commit 阶段。或者称为提交阶段, 在这个阶段会执行 render 阶段 diff 出来的变更请求。比如 DOM 插入、更新、删除、排序等等。在这个阶段 React 还会调用 **componentDidMount 和 componentDidUpdate** 生命周期函数.

## 概括起来

- 减少重新 Render 的次数
- 减少渲染的节点
- 降低渲染计算量
- 合理设计组件

## 减少重新 Render 的次数

### PureComponent

### ShouldComponentUpdate

可以利用此事件来决定何时需要重新渲染组件。如果组件 Props 更改或调用 setState，则此函数返回一个 Boolean 值，为 true 则会重新渲染组件，反之则不会重新渲染组件。在这两种情况下组件都会重新渲染。我们可以在这个生命周期事件中放置一个自定义逻辑，以决定是否调用组件的 Render 函数

### React.memo

React.memo 仅检查 Props 变更。如果函数组件被 React.memo 包裹，且其实现中拥有 useState，useReducer 或 useContext 的 Hook，当 State 或 Context 发生变化时，它仍会重新渲染。

默认情况下其只会对复杂对象做浅层对比，如果你想要控制对比过程，那么请将自定义的比较函数通过第二个参数传入来实现。

```js
function MyComponent(props) {
  /* 使用 props 渲染 */
}
function areEqual(prevProps, nextProps) {
  /*
  如果把 nextProps 传入 render 方法的返回结果与
  将 prevProps 传入 render 方法的返回结果一致则返回 true，不渲染
  否则返回 false 重新渲染
  */
}
export default React.memo(MyComponent, areEqual);
```

> 与 Class 组件中 shouldComponentUpdate() 方法不同的是，如果 Props 相等，areEqual 会返回 true, 则不重新渲染；如果 Props 不相等，则返回 false， 重新渲染。这与 shouldComponentUpdate 方法的返回值相反。

### 合理使用 Context

Context 提供了一个无需为每层组件手动添加 Props，就能在组件树间进行数据传递的方法。正是因为其这个特点，它是可以穿透 React.memo 或者 shouldComponentUpdate 的比对的，也就是说，一旦 Context 的 Value 变动，所有依赖该 Context 的组件会全部 forceUpdate.这个和 Mobx 和 Vue 的响应式系统不同，Context API 并不能细粒度地检测哪些组件依赖哪些状态。

## 减少渲染的节点

### 组件懒加载

组件懒加载可以让 React 应用在真正需要展示这个组件的时候再去展示，可以比较有效的减少渲染的节点数提高页面的加载速度

React 官方在 16.6 版本后引入了新的特性：React.lazy 和 React.Suspense,这两个组件的配合使用可以比较方便进行组件懒加载的实现；

### 虚拟列表

虚拟列表是一种根据滚动容器元素的可视区域来渲染长列表数据中某一个部分数据的技术，在开发一些项目中，会遇到一些不是直接分页来加载列表数据的场景，在这种情况下可以考虑结合虚拟列表来进行优化，可以达到根据容器元素的**高度**以及列表项元素的高度来显示长列表数据中的某一个部分，而不是去完整地渲染长列表，以提高无限滚动的性能。

## 降低渲染计算量

### useMemo

### 遍历展示视图时使用 key

## 合理设计组件

- 简化 Props
- 简化 State
- 减少组件嵌套一般不必要的节点嵌套都是滥用高阶组件/ RenderProps 导致的。所以还是那句话‘只有在必要时才使用 xxx’。有很多种方式来代替高阶组件/ RenderProps，例如优先使用 Props、React Hooks

## 参考

- [React 性能优化总结](https://mp.weixin.qq.com/s/RG0ANLwfrhU_2_5nbhIEDw)
- [React 性能优化指南之性能分析与 16 种优化方法大总结](https://mp.weixin.qq.com/s/_SafpFkho1omGWdvx6DMvg)
