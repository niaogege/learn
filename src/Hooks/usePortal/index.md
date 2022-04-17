---
title: usePortal
order: 4
group:
  title: Hooks
  order: 1,
nav:
  order: 3
  title: 'react'
  path: /react
---

## Demo

[usePortal](https://www.30secondsofcode.org/react/s/use-portal)

<code src="./index.tsx"></code>

## Code

```ts
import React from 'react';
import usePortal from './usePortal';
let container: Element;
const TestPortal = () => {
  if (!container) {
    container = document.createElement('div');
    container.setAttribute('id', 'cpp-ui');
    document.body.appendChild(container);
  } else {
    document.body.appendChild(container);
  }
  const Portal = container && usePortal(container);
  return (
    <>
      <h2>
        元素查看<code>document.getElementById('cpp-ui')</code>
      </h2>
      <Portal> Hello UsePortal</Portal>
    </>
  );
};
export default TestPortal;
```
