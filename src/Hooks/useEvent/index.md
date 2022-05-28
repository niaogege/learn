---
title: useEvent
order: 6
group:
  title: Hooks
  order: 1,
nav:
  order: 3
  title: 'react'
  path: /react
---

## Demo

主要应用场景： 「封装事件处理函数」

useEvent 有俩个特性：

- 在组件多次 render 时保持引用一致

- 函数内始终能获取到最新的 props 与 state

<code src="./index.tsx"></code>

## Code

```ts
import React, { useState, FC } from 'react';
import useEvent from './useEvent';

interface DataProp {
  onClick: () => void;
  text: string;
}
const SendButton: FC<DataProp> = ({ onClick, text }) => {
  return <button onClick={onClick}>{text}</button>;
};
const MyApp = () => {
  const [text, setText] = useState('TEXT');
  const onClick = useEvent(() => {
    setText('NEW Text');
  });

  return <SendButton onClick={onClick} text={text} />;
};
export default MyApp;
```

## Source code

```ts
import { useRef, useLayoutEffect, useCallback } from 'react';

const useEvent = (handler: any) => {
  const handleRef = useRef();
  useLayoutEffect(() => {
    handleRef.current = handler;
  });
  return useCallback((...args: []) => {
    handleRef && (handleRef as any).current(...args);
  }, []);
};
export default useEvent;
```
