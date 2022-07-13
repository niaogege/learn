---
title: redux/react-redux
order: 1
group:
  title: react生态
  order: 0
---

## 聊聊 Redux 和 Vuex 的设计思想

## 为什么 Vuex 的 mutation 和 Redux 的 reducer 中不能做异步操作？

vuex 中的 mutation 应该是为了配合 dev-tool 跟踪数据流变化，实现时间旅行，而采用同步方式执行

尤大大的回答是： 能用 devtools 追踪状态变化，vuex 真正限制你的只有 mutation 必须是同步的这一点（在 redux 里面就好像 reducer 必须同步返回下一个状态一样）。

react 中的 reducer 要求说纯函数，异步操作明显不符合纯函数理念

来看看稍微标准点的回答

因为更改 state 的 reducer 函数必须是纯函数，纯函数既是统一输入就会统一输出，没有任何副作用；如果是异步则会引入额外的副作用，导致更改后的 state 不可预测,因为你不知道异步操作是失败还是成功，

当异步操作成功或失败时，如果不 commit(mutation) 或者 dispatch(action)，Vuex 和 Redux 就不能捕获到异步的结果从而进行相应的操作。也就是说先有异步操作，才会有后续的 muation/action

## [redux 为什么要把 reducer 设计成纯函数](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/107)

store 里的 state 是一个引用类型，多个组件都可能共享这个 state，如果允许直接在组件中修改这个 state，由于组件间千丝万缕的关系，复杂度会变得很高，定位问题会变得异常困难，因为很难搞清楚到底是哪个组件“搞坏”了数据，而采用纯函数就没有这样的副作用。

redux 三大原则

- 单一数据流整个应用 state 都被储存在一个 store 里面 构成一个 Object tree
- State 是只读的唯一改变 state 的方法就是触发 action, action 是一个用于描述已发生事件的普通对象
- 使用纯函数来执行修改为了描述 action 如何改变 state tree， 你需要编写 reducers，把 reducer 设计成纯函数，可以实现时间旅行，记录/回放或者热加载

> reducer 的职责不允许有副作用，副作用简单来说就是不确定性，如果 reducer 有副作用，那么返回的 state 就不确定

## react-redux 源码手写

### react-redux 中的 Provider 实现

### react-redux 中 connect 怎么连接组件的

高阶组件，先看普通的示例

```js
const enhance = (Wrapcomponent) => {
  const res = class Enhance extends Component {
    constructor(props) {
      super(props);
    }
    render() {
      return <Wrapcomponent name="cpp" />;
    }
  };
  res.staticValue = Wrapcomponent.staticValue;
};
const WrapComponent = (props) => <div>CHild-{props.name}</div>;
WrapComponent.staticValue = 'wrappedComponent';
const EnhancedComponent = enchance(WrapComponent);
function App() {
  <EnhancedComponent />;
}
const rootElement = document.getElementById('app');
ReactDOM.render(<App />, rootElement);
```

接下来看看 connect 用法

```js
connect(mapStateToProps, mapDispatchToProps)(App);
```

connect 接受 2 个 mapStateToProps, mapDispatchToProps 参数，返回一个高阶函数，高阶函数接受一个组件，返回一个高阶组件，其实就给传入的组件增加属性和功能

### connect 核心源码

```js
function connect(
  mapStateToProps?: MapStateToPropsParam<TStateProps, TOwnProps, State>,
  mapDispatchToProps?: MapDispatchToPropsParam<TDispatchProps, TOwnProps>,
  mergeProps
) {
  const initMapStateToProps = mapStateToPropsFactory(mapStateToProps)
  const initMapDispatchToProps = mapDispatchToPropsFactory(mapDispatchToProps)
  const initMergeProps = mergePropsFactory(mergeProps)
  const wrapWithConnect = (WrappedComponent) => {
    const selectorFactoryOptions = {
      initMapStateToProps,
      // @ts-ignore
      initMapDispatchToProps,
      initMergeProps,
    }
    function ConnectFunction() {
      const renderedWrappedComponent = useMemo(() => {
        return (
          // @ts-ignore
          <WrappedComponent
            {...actualChildProps}
            ref={reactReduxForwardedRef}
          />
        )
      }, [reactReduxForwardedRef, WrappedComponent, actualChildProps])
      const renderedChild = useMemo(() => {
        if (shouldHandleStateChanges) {
          return (
            <ContextToUse.Provider value={overriddenContextValue}>
              {renderedWrappedComponent}
            </ContextToUse.Provider>
          )
        }
        return renderedWrappedComponent
      }, [ContextToUse, renderedWrappedComponent, overriddenContextValue])
      return renderedChild
    }
    const _Connect = React.memo(ConnectFunction)
    const Connect = _Connect as unknown as ConnectedComponent<
      typeof WrappedComponent,
      WrappedComponentProps
    >
    Connect.WrappedComponent = WrappedComponent
    Connect.displayName = ConnectFunction.displayName = displayName
    return hoistStatics(Connect, WrappedComponent)
  }
  return wrapWithConnect
}
connect(
  mapStateToProps,
  mapDispatchToProps
)(component)
```

## 描述一下 redux 的中间件原理

## redux 如何进行异步处理

## 参考文档

- [一切前端概念，都是纸老虎](https://mp.weixin.qq.com/s/vDqbnfUyL1IZrNb-cIq_Hw)
- [19 年面试题](https://juejin.cn/post/6844903885488783374#heading-41)
