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
import { render } from 'react-dom';
import usePortal from './usePortal';

const TestPortal = () => {
  const Portal = usePortal(document.querySelector('title') as HTMLElement);
  return (
    <div>
      Hello UsePortal
      <Portal> UsePortal</Portal>
    </div>
  );
};
render(<TestPortal />, document.getElementById('root'));
```
