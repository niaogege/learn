---
title: 手写react-redux部分
order: 2
group:
  title: react
  order: 1
  path: /read-code/react
nav:
  order: 1
  title: 'read-code'
  path: /read-code
---

## 使用案例

手写之前，先看怎么用的

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import store from './store'
import App from './App';
ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>
  document.getElementById('root')
);
```

store 是有 redux 中的`createStore`生成的，调用该方法返回`store`

```js
import { createStore } from 'redux';
import { reducer } from '../reducer';
export default createStore(reducer);
```

上面代码中 createStore 的参数是一个 reducer，所以我们还要写个 reducer:

```js
const initialState = {
  value: 0,
  data: {
    list: [
      {
        name: '',
      },
    ],
    name: 'xxx',
  },
};
export function reducer(state = initialState, action: any) {
  switch (action.type) {
    case 'ADD':
      return {
        ...state,
        data: {
          list: [{ name: 'cpp' }, { name: 'wmh' }],
          name: 'cpp + wmh',
        },
      };
    case 'DEC':
      return {
        ...state,
        data: {
          list: [{ name: 'cpp' }],
          name: 'cpp',
        },
      };
    case 'RESET':
      return { ...state, data: { name: '', list: [] } };
    default:
      return { ...state };
  }
}
// action.js
export const add = () => ({ type: 'ADD' });
export const dec = () => ({ type: 'DEC' });
export const reset = () => ({ type: 'RESET' });
```

这里的 reducer 会有一个初始对象，{value, data}, 同时它还有三个 action,分别对应三个不同改变数据的 action，现在需要用到`connect`将对应的 state 和 action 连接到组件，比如说现在就有三个 action,分别是加/减/重置

```js
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { add, dec, reset } from './commonRedux';
const List = ({ list = [], name = '', addList, decList, reset }: any) => {
  return (
    <div>
      <div>
        name: {name} <br />
        List:
        {list.map((item: any) => (
          <div key={item.name}>{item.name}</div>
        ))}
        <button onClick={addList}>add数据 + </button>
        <button onClick={decList}>dec数据 - </button>
        <button onClick={reset}>Reset </button>
      </div>
    </div>
  );
};
// first 方案二选一即可 都支持
// const mapDispatchToProps = (dispatch: Dispatch) => ({
//   addList: () => dispatch(add()),
//   decList: () => dispatch(dec()),
//   reset: () => dispatch(reset()),
// })
// or second bindActionCreators
const mapDispatchToProps = {
  addList: add,
  decList: dec,
  reset,
};
const mapStateToProps = ({ data: { list = [], name = '' } }) => ({
  list,
  name,
});
export default connect(mapStateToProps, mapDispatchToProps)(List);
```

上面代码可以看到 connect 是一个高阶函数，他的第一阶会接收`mapStateToProps和mapDispatchToProps`两个参数，这两个参数都是函数。mapStateToProps 可以自定义需要将哪些 state 连接到当前组件，这些自定义的 state 可以在组件里面通过 props 拿到。mapDispatchToProps 方法会传入 dispatch 函数，我们可以自定义一些方法，这些方法可以调用 dispatch 去 dispatch action，(当然 react-redux 以及帮我们集成了对象的方式触发 action,比如第二种写法)从而触发 state 的更新，这些自定义的方法也可以通过组件的 props 拿到，connect 的第二阶接收的参数是一个组件，我们可以猜测这个函数的作用就是将前面自定义的 state 和方法注入到这个组件里面，同时要返回一个新的组件给外部调用，所以 connect 其实也是一个**高阶组件**。

## 核心 API 实现

手写目标 Provider: 用来包裹根组件的组件，作用是注入 Redux 的 store。 createStore: Redux 用来创建 store 的核心方法， redux 已经提供过了。 connect：用来将 state 和 dispatch 注入给需要的组件，返回一个新组件，他其实是个高阶组件。

所以 React-Redux 核心其实就两个 API，而且两个都是组件，作用还很类似，都是往组件里面注入参数，Provider 是往根组件注入 store，connect 是往需要的组件注入 state 和 dispatch

### 熟悉下 React 中的 context API

- React.createConext() react 提供了一个全局注入变量的 api,即`React.createConext()`, 创建一个 `Context` 对象。当 React 渲染一个订阅了这个 Context 对象的组件，这个组件会从组件树中离自身最近的那个匹配的 Provider 中读取到当前的 context 值。

```ts
import * as React from 'react';
type contextType = {
  name: string;
  theme: 'dark' | 'light';
};
export const themeContext = React.createContext<contextType>({
  name: 'wmh',
  theme: 'dark',
});
```

- 使用`themeContext.Provider`包裹跟组件或者你需要包含的子组件

```js
export default class themeProvider extends React.Component {
  render() {
    return (
      <themeContext.Provider
        value={{
          theme: 'dark',
          name: 'cpp',
        }}
      >
        {this.props.children}
      </themeContext.Provider>
    );
  }
}
ReactDOM.render(<themeProvider />, document.getElementById('XX'));
```

- 使用`themeContext.Consumer`消费组件

```js
import { themeContext } from './index';
const TTT = (props: any) => (
  <themeContext.Consumer>
    {(value) => (
      <h1>
        {value.name}---{props.children}
      </h1>
    )}
  </themeContext.Consumer>
);
export default TTT;
```

### 使用`useContext(themeContext)`接受参数

useContext 的参数必须是 context 对象本身,当组件上层最近的 `<themeContext.Provider>` 更新时，该 Hook 会触发重渲染，并使用最新传递给 `themeContext provider` 的 context value 值。即使祖先使用 `React.memo` 或 `shouldComponentUpdate`，也会在组件本身使用 `useContext` 时重新渲染。

```js
import * as React from 'react';
import { themeContext } from './index';

const TTT = (props: any) => {
  const value = React.useContext(themeContext);
  return (
    <h1>
      {value.name}---{props.children}
    </h1>
  );
};
export default TTT;
```

所以我们完全可以用 context api 来传递**redux store**，现在我们也可以猜测 React-Redux 的 Provider 其实就是包装了**Context.Provider**，而传递的参数就是 redux store，而 React-Redux 的 connect 的 HOC 其实就是包装的 Context.Consumer 或者**useContext**。我们可以按照这个思路来自己实现下 React-Redux 了。

### 手写 Provider

## 参考

- [手写一个 React-Redux，玩转 React 的 Context API](https://juejin.cn/post/6847902222756347911)
- [React.createContext](https://zh-hans.reactjs.org/docs/context.html#reactcreatecontext)
