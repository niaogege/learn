---
title: useEventListener
order: 8
group:
  title: Hooks
  order: 1,
nav:
  order: 3
  title: 'react'
  path: /react
---

## Demo

[useEventListener](https://usehooks.com/useEventListener/)

<code src="./index.tsx"></code>

## Code

```ts
import React, { useCallback, useState } from 'react';
import useEventListener from './useEventListener';
function App() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const handler = useCallback(
    ({ clientX, clientY }: any) => {
      setCoords({
        x: clientX,
        y: clientY,
      });
    },
    [setCoords],
  );

  useEventListener('mousemove', handler);

  return (
    <div>
      this is AddEventListener: x: {coords.x}, y: {coords.y}
    </div>
  );
}
export default App;
```

## Source

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
```
