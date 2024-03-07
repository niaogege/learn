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

我最喜欢的自定义 hook 之一是 useToggle，这是一个友好的助手，其工作方式几乎与 useState 完全相同，但只能在 true 和 false 之间切换状态变量:

<code src="./index.tsx"></code>

## Code

```ts
import React from 'react';
import useToggle from './useToggle';

const MyApp = () => {
  const [isDarkMode, toggleDarkMode] = useToggle(false);
  return <button onClick={toggleDarkMode}>Toggle color theme{isDarkMode}</button>;
};
export default MyApp;
```

## Source code

```ts
import { useCallback, useState } from 'react';

const useToggle = (initialValue: boolean) => {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => {
    setValue((v) => !v);
  }, []);
  return [value, toggle];
};
export default useToggle;
```
