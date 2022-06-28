---
title: 手写redux
order: 9
group:
  title: react
  order: 1
  path: /read-code/react
nav:
  order: 1
  title: 'read-code'
  path: /read-code
---

生活中总有各种各样的问题去等你解决，而我要做的就是随时做好准备，时刻准备着，不能放松。作为 react 生态中的一部分，这个数据流 还是要深度掌握。疫情期间，是用来恶补自己弱点的最佳时机，不能浪费！

## 思路

运用 reudx -> 明白核心的 api(createStore/reducer/compose/middleware) -> 源码阅读 -> 手写 redux

> 源码里的 ts 类型好复杂！看得抓狂手写过程中的函数名和变量名尽量结局源码

## 核心概念

state: 全局的状态对象，唯一且不可变。 store: 调用 createStore 函数生成的对象，里面封入了定义在 createStore 内部用于操作全局状态的方法，用户通过这些方法使用 Redux。 action: 描述状态如何修改的对象，固定拥有一个 type 属性，通过 store 的 dispatch 方法提交。 reducer: 实际执行状态修改的纯函数，由用户定义并传入，接收来自 dispatch 的 action 作为参数，计算返回全新的状态，完成 state 的更新，然后执行订阅的监听函数。

storeEnhancer: createStore 的高阶函数封装，用于加强 store 的能力，redux 提供的 applyMiddleware 是官方实现的一个 storeEnhancer。 middleware: dispatch 的高阶函数封装，由 applyMiddleware 把原 dispatch 替换为包含 middleware 链式调用的实现。

## 核心 api

[API Reference](https://redux.js.org/api/api-reference)

Top Level export

```js
createStore(reducer, [preloadedState], [enhancer]);
combineReducers(reducers);
applyMiddleware(...middlewares);
bindActionCreators(actionCreators, dispatch);
compose(...functions);
```

## 手写 redux

### createStore(reducer, [preloadedState], [enhancer])

创建 store 对象，包含 getState, dispatch, subscribe, replaceReducer 四个 API Creates a Redux store that holds the complete state tree of your app. There should only be a single store in your app.

- source Code

```js
const createStore = function (reducer, initState, rewriteCreateStoreFunc) {
  // 入參处理
  if (typeof initState === 'function') {
    initState = undefined;
    rewriteCreateStoreFunc = initState;
  }
  // applymiddleware 中间件
  if (rewriteCreateStoreFunc) {
    const newCreateStore = rewriteCreateStoreFunc(createStore);
    return newCreateStore(reducer, initState);
  }
  let state = initState;
  let listeners = [];
  // 订阅
  function subscribe(listener) {
    listeners.push(listener);
    return function unsubscribe() {
      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  }
  // 改变状态
  function dispatch(action) {
    state = reducer(state, action);
    for (let listener of listeners) {
      listener();
    }
  }
  // 得到state
  function getState() {
    return state;
  }
  // 替换store当前使用的reducer计算状态
  function replaceReducer(nextReducer) {
    reducer = nextReducer;
    // 刷新一遍state值 新来的reducer把自己的默认状态放到state树上去
    dispatch({ type: Symbol() });
  }
  // 用一个不匹配任何计划的type 来获取初始值
  dispatch({ type: Symbol() });
  return {
    subscribe, // 发布订阅
    getState, // getter
    dispatch, // setter
    replaceReducer,
  };
};

export default createStore;
```

返回的实例含有四个属性或者方法，

```js
getState();
dispatch(action);
subscribe(listener);
replaceReducer(nextReducer);
```

### combineReducers(reducers)

多 reducer 合并成一个 reducer

- source Code

```js
export default function combineReducers(reducers) {
  const reducerKeys = Object.keys(reducers);
  // 整合合并后的state 扁平化处理
  return function combine(state = {}, action) {
    const nextState = {};
    for (let i = 0; i < reducerKeys.length; i++) {
      const key = reducerKeys[i];
      const reducer = reducers[key];
      const previousStateForKey = state[key];
      const nextStateForKey = reducer(previousStateForKey, action);
      nextState[key] = nextStateForKey;
    }
    return nextState;
  };
}
```

- demo

```js
rootReducer = combineReducers({potato: potatoReducer, tomato: tomatoReducer})
// This would produce the following state object
{
  potato: {
    // ... potatoes, and other state managed by the potatoReducer ...
  },
  tomato: {
    // ... tomatoes, and other state managed by the tomatoReducer, maybe some nice sauce? ...
  }
}
```

### applyMiddleware(...middlewares)

返回跟调用`createStore()`对象类似

扩展 dispatch 函数！

- source code

```js
import compose from './compose';
const applyMiddleware = function (...middlewares) {
  return function rewriteCreateStoreFunc(oldCreateStore) {
    return function newCreateStore(reducer, initState) {
      // generate store
      const store = oldCreateStore(reducer, initState);
      // 每个middleware传參store
      const simpleStore = {
        getState: store.getState,
        dispatch: (action, ...args) => dispatch(action, ...args),
      };
      const chain = middlewares.map((middleware) => middleware(simpleStore));
      // let dispatch = store.dispatch;
      // /* 实现 exception(time((logger(dispatch))))*/
      // chain.reverse().forEach((middleware) => {
      //   dispatch = middleware(dispatch);
      // });
      // store.dispatch = dispatch;
      // return store;
      const dispatch = compose(...chain)(store.dispatch);
      return {
        ...store,
        dispatch,
      };
    };
  };
};
export default applyMiddleware;
```

- demo

```js
const loggerMiddleWare = (store) => (next) => (action) => {
  console.log('this.state logger', store.getState());
  next(action);
  console.log('next state logger', store.getState());
};
const exceptionMiddleware = (store) => (next) => {
  return (action) => {
    try {
      next(action);
    } catch (e) {
      console.log(e);
    }
  };
};
const rewriteCreateStoreFunc = applyMiddleware(exceptionMiddleware, loggerMiddleWare);
const store = createStore(reduces, initStates, rewriteCreateStoreFunc);
```

### bindActionCreators(actionCreators, dispatch)

- source code

```js
function bindActionCreator(actionCreator, dispatch) {
  return function () {
    return dispatch(actionCreator.apply(this, arguments));
  };
}
// 通过闭包 隐藏dispatch actionCreator
export default function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }
  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error('actionCreators occur error');
  }
  const keys = Object.keys(actionCreators);
  const boundActionCreators = {};
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const actionCreator = actionCreators[key];
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }
  return boundActionCreators;
}
```

- demo

```js
function increment() {
  return {
    type: 'INCREMENT',
  };
}
function setName(name) {
  return {
    type: 'SET_NAME',
    name,
  };
}
// 扁平化的actions
const actions = bindActionCreators(
  {
    increment,
    setName,
  },
  store.dispatch,
);
actions.increment();
actions.setName('cpp');
```

### compose(...functions)

compose(组合)是函数式编程范式中经常用到的一种处理，它创建一个从右到左的数据流，右边函数执行的结果作为参数传入左边。

- source code

```js
export default function compose(...funs) {
  if (!funs.length) {
    return (arg) => arg;
  }
  if (funs.length === 1) return funs[0];
  return funs.reduce(
    (a, b) =>
      (...args) =>
        a(b(args)),
  );
}
// demo
// var double = (x) => x * 2;
// var three = (x) => x * 3;
// var sum = compose(double, three);
// var total = sum(10);
// console.log(total); // 60
```

- demo

```js
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import DevTools from './containers/DevTools';
import reducer from '../reducers';

const store = createStore(reducer, compose(applyMiddleware(thunk), DevTools.instrument()));
```

## 使用 redux

```js
const App = () => {
  const state = store.getState();
  // 强制刷新了
  const [, forceRender] = useReducer((c) => c + 1, 0);
  // 订阅更新,状态变更刷新组件
  useEffect(() => {
    // 组件销毁时取消订阅
    return store.subscribe(() => {
      forceRender();
    });
  }, []);
  const onIncrement = () => {
    store.dispatch({ type: 'increment' });
  };
  const onDecrement = () => {
    store.dispatch({ type: 'decrement' });
  };
  return (
    <div style={{ textAlign: 'center', marginTop: '35%' }}>
      <h1 style={{ color: 'green', fontSize: '500%' }}>{state.count}</h1>
      <button onClick={onDecrement} style={{ marginRight: '10%' }}>
        decrement
      </button>
      <button onClick={onIncrement}>increment</button>
    </div>
  );
};
```

## other

### pure function 纯函数

纯函数的特点是函数输出不依赖于任何外部变量，相同的输入一定会产生相同的输出，非常稳定。使用它来进行全局状态修改，使得全局状态可以被预测。

### 什么是 thunk

calculation delay 延迟计算，看下 demo 就明白了

```js
function wrapped(arg) {
  return function thunk(...rest) {
    console.log('thunk ', arg, rest);
  };
}
const thunk = wrapped('cpp');
thunk('wmh');
```

> 有点类似函数编程里的柯里化

### react-thunk

dispatch 派发 action 的时候阔以传一个 function，就是一个标准的 redux middleware

```js
const createThunkMiddleware(extra) {
  return ({dispatch, getState}) => next => action => {
    if (typeof action === 'function') {
     return action(dispatch, getState, extra)
    }
    return next(action)
  }
}
const thunk = createThunkMiddleware({})
thunk.withExtraArgument = createThunkMiddleware
export default thunk
```

## 参考链接

- [你是这样理解 redux 的吗？](https://mp.weixin.qq.com/s/siBfMEjojpEzLIlDpnaBCg)
- [React 状态管理 - 你可能不需要 Redux，但你需要了解它](https://mp.weixin.qq.com/s/SdD8_yCYmGFmnDtaZGxy5w)
- [Redux 通关简洁攻略 -- 看这一篇就够了！](https://mp.weixin.qq.com/s/t7W0ulMaq5_8MxuiyTvXvw)
- [理解 redux-thunk](https://zhuanlan.zhihu.com/p/85403048)
- [react-redux demo](https://codesandbox.io/s/yv6kqo1yw9)
