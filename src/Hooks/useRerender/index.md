---
title: useRerender
order: 6
group:
  title: Hooks
  order: 1
nav:
  order: 3
  title: 'react'
  path: /react
---

## Demo

[useRerender](http://zoeice.com/react-hook-useRef/)

<code src="./index.tsx"></code>

## Code

```ts
import React, { useState, useRef, useEffect } from 'react';
import useRerender from './useRerender';

const Example = () => {
  const [count, setCount] = useState(0);
  const reRender = useRerender();
  if (reRender) {
    console.log('后续渲染');
  } else {
    console.log('首次渲染');
  }

  return (
    <div>
      <div>{count}</div>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        Add
      </button>
    </div>
  );
};
export default Example;
```

## Source Code

```ts
import React, { useRef, useEffect } from 'react';

function useRerender() {
  const ref = useRef(false);
  useEffect(() => {
    ref.current = true;
  }, []);
  return ref.current;
}
export default useRerender;
```
