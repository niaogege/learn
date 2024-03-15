---
title: 手撕React Hooks
order: 26
group:
  order: 0
  title: interview
nav:
  order: 3
  title: 'interview'
  path: /interview
---

```js
/**
 * 1.useUpdate 强制更新
 * 2.useLatest
 * 3.useCreation 结合useMemo和useRef封装
 * 4.useToggle
 * 5.useRequest
 * 6.useEventListener
 * 7.useTimeout
 */
```

## 1.useUpdate

有的时候我们需要组件强制更新，这个时候就可以使用这个钩子：

```js
import { useCallback, useState } from 'react';

const useUpdate = () => {
  const [, setState] = useState({});
  return useCallback(() => {
    setState({});
  }, []);
};
export default useUpdate;
```

## 2.useLatest

```js
import { useRef } from 'react';
const useLatest = (value) => {
  const ref = useRef(value);
  ref.current = value;
  return ref;
};
```

## 3.useCreation

useCreation ：是 useMemo 或 useRef 的替代品。换言之，useCreation 这个钩子增强了 useMemo 和 useRef，让这个钩子可以替换这两个钩子。（来自 ahooks-useCreation）

- useMemo 的值不一定是最新的值，但 useCreation 可以保证拿到的值一定是最新的值
- 对于复杂常量的创建，useRef 容易出现潜在的的性能隐患，但 useCreation 可以避免

```ts
import { useRef } from 'react';
import type { DependencyList } from 'react';

const depsAreSame = (oldDeps: DependencyList, deps: DependencyList): boolean => {
  if (oldDeps === deps) return true;
  for (let i = 0; i < oldDeps.length; i++) {
    // 判断两个值是否是同一个值
    if (!Object.is(oldDeps[i], deps[i])) return false;
  }
  return true;
};

const useCreation = (fn: () => any, deps: DependencyList) => {
  const { current } = useRef({
    deps,
    obj: undefined as undefined,
    initialized: false,
  });
  if (current.initialized === false || !depsAreSame(current.deps, deps)) {
    current.deps = deps;
    current.obj = fn();
    current.initialized = true;
  }
  return current.obj;
};

export default useCreation;
```

## 4.useToggle

```js
import { useCallback, useState } from 'react';
const useToggle = (init) => {
  const [toggle, setToggle] = useState(init);
  const changeToggle = useCallback(() => {
    setToggle((val) => !val);
  }, []);
  return [toggle, changeToggle];
};
```

## 5.useRequest

```ts
import { useState, useEffect } from 'react';
const useRequest = (url: string, options: any) => {
  const [abort, setAbort] = useState(() => {});
  const [res, setResponse] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const abortController = new AbortController();
        const signal = abortController.signal;
        setAbort(() => abortController.abort());
        const res = await window.fetch(url, { ...options, signal, method: 'get' });
        setResponse(res);
      } catch (error) {
        setError(error as any);
      }
    };
    fetchData();
    return () => {
      if (typeof abort === 'function') {
        abort();
      }
    };
  }, []);
  return {
    res,
    error,
    abort,
  };
};
export default useRequest;
```

## 6.useEventListener

```ts
import { useRef, useEffect } from 'react';

function useEventListener(eventName: string, handler: Function, element = window): void {
  const saveHandler = useRef<Function>(() => {});
  useEffect(() => {
    saveHandler.current = handler;
  }, [handler]);
  useEffect(() => {
    const isSupported = element && element.addEventListener;
    if (!isSupported) return;
    const eventListener = (event: Event) => saveHandler.current(event);
    element.addEventListener(eventName, eventListener);
    return () => {
      element.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element]);
}
export default useEventListener;
useEventListener('click', () => {});
```

## 7.useTimeout

useTimeout：一段时间内，执行一次

传递参数只要函数和延迟时间即可，需要注意的是卸载的时候将定时器清除下就 OK 了

```ts
import { useEffect } from 'react';
export const useTimeout = (fn: () => void, delay: number) => {
  const fnRef = useRef();
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);
  useEffect(() => {
    if (!delay || delay < 0) return;
    const timer = setTimeout(() => {
      fnRef && fnRef.current();
    }, delay);
    return () => {
      clearTimeout(timer);
    };
  }, [delay]);
};
```

## 8.useInterval

useInterval: 每过一段时间内一直执行

大体上与 useTimeout 一样，多了一个是否要首次渲染的参数 immediate

```ts
import { useEffect } from 'react';
export const useInterval = (fn: () => void, delay: number, immediate: boolean) => {
  const fnRef = useLatest(fn);
  useEffect(() => {
    if (!delay || delay < 0) return;
    if (immediate) {
      fnRef.current();
    }
    const timer = setInterval(() => {
      fnRef && fnRef.current();
    }, delay);
    return () => {
      clearInterval(timer);
    };
  }, []);
};
```
