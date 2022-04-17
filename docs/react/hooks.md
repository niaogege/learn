---
title: 概述
order: 1
group:
  title: Hooks
  path: /react/hooks
  order: 1
---

## hooks 规则

Hook 是 React 16.8 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。只在 React 函数中调用 Hook，不要在循环，条件或嵌套函数中调用 Hook。

不要在普通的 JavaScript 函数中调用 Hook。你可以： ✅ 在 React 的函数组件中调用 Hook ✅ 在自定义 Hook 中调用其他 Hook

## 为啥要有这玩意？

类组件内部有个 stata 能保存当前的状态，函数式组件就是一个函数，怎样才能让他像类组件那样有保存状态的能力？无疑就是 hooks function 组件不能做继承，因为 function 本来就没这个特性，所以是提供了一些 api 供函数使用，这些 api 会在内部的一个数据结构上挂载一些函数和值，并执行相应的逻辑，通过这种方式实现了 state 和类似 class 组件的生命周期函数的功能，这种 api 就叫做 hooks。

hooks 挂载数据的数据结构叫做 fiber。

hooks 就是通过把数据挂载到组件对应的 fiber 节点上来实现的,

看一组示例：

```js
function App() {
  const [num, updateNum] = useState('num');
  useState('emptyUseState');
  const clickApp = useCallback((e) => {
    console.log(e);
  }, []);
  useEffect(() => {
    updateNum(22);
  }, []);
  useRef('useRef');
  useMemo(() => {
    return 'UseMem';
  }, []);
  return <div onClick={clickApp}> APP </div>;
}
```

renderWithHooks -> workInProgress -> memoizedState 一共有 6 个 memoizedState，通过 next 指向下一个 hooks，hooks 中的状态被保存在 memoizedState 中

```js
{
  memoizedState: {
    baseState: 'num',
    memoizedState: 'num',
    next: {
      memoizedState: [f, Array(0)], // useCallback,
      next: {

      }
    }
  }
}
```

## 常用 hooks

- [useWindowSize](/react/hooks/use-window-size)
- [usePortal](/react/hooks/use-portal)
- useUpdateEffect (执行异步更新 effect)
- useUpdateLayoutEffect (执行同步更新 effect)
- usePrevious (使用前一个值)
- useDebounce （返回 memorized 防抖函数）
- useThrottle （返回 memorized 节流函数）
- useInViewport (监听元素是否在视口内)
- useVisibleObserve (监视元素在文档视口的可见性，可见性变化时触发回调)
- useCallbackRef (保存最新的值在 ref 中)
- useCountdown (倒计时，常用于获取验证码)
- useMount (组件加载执行回调)
- useUnmount (组件卸载执行回调)

## 参考

- [React Hoos 官网](https://react.docschina.org/docs/hooks-rules.html)
- [React Hooks 的原理，有的简单有的不简单](https://mp.weixin.qq.com/s/u89G-Uas0mzZQsiWT_4EZQ)
