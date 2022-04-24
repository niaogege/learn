---
title: useInterval
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
import React, { useState } from 'react';
import useInterval from './useInterval';

const MyApp = () => {
  const [seconds, setSeconds] = useState(0);
  useInterval(() => {
    setSeconds(seconds + 1);
  }, 1000);
  return <p>seconds: ({seconds})</p>;
};
export default MyApp;
```

## Source Code

```ts
import { useEffect, useRef } from 'react';

type cbT = () => any;
const useInterval = (cb: cbT, delay: number = 1000) => {
  const savedCallback = useRef<cbT>();
  useEffect(() => {
    savedCallback.current = cb;
  }, [cb]);
  useEffect(() => {
    const tick = () => {
      savedCallback && savedCallback.current && savedCallback.current();
    };
    if (delay != null) {
      const id = setInterval(tick, delay);
      return () => {
        clearInterval(id);
      };
    }
  }, [delay]);
};
export default useInterval;
```
