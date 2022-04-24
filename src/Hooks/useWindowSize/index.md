---
title: useWindowSize
order: 5
group:
  title: Hooks
  order: 1,
nav:
  order: 3
  title: 'react'
  path: /react
---

## Demo

<code src="./index.tsx"></code>

## Code

```ts
import React from 'react';
import useWindowSize from './useWindowSize';

const MyApp = () => {
  const { width, height } = useWindowSize();
  return (
    <p>
      Window size: ({width} x {height})
    </p>
  );
};
// ReactDOM.render(<MyApp />, document.getElementById('root'));
export default MyApp;
```

## Source code

```ts
import { useEffect, useState } from 'react';

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined || 0,
    height: undefined || 0,
  });
  useEffect(() => {
    const handleResize = () =>
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return windowSize;
};
export default useWindowSize;
```
