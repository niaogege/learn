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

## Source Code

```ts
import { useEffect, useCallback, useState } from 'react';
import type { ReactNode, ReactPortal } from 'react';
import { createPortal, unmountComponentAtNode } from 'react-dom';

interface UsePortal {
  render: ({ children }: { children: ReactNode | null }) => ReactPortal | null;
  remove: () => null | boolean;
}
const useProtal = (el: Element) => {
  if (!el) {
    return () => null;
  }
  const [portal, setPortal] = useState<UsePortal>({
    render: () => null,
    remove: () => null,
  });

  const CreatePortal = useCallback((el: Element) => {
    const Portal = ({ children }: any) => createPortal(children, el);
    const remove = () => unmountComponentAtNode(el);
    return {
      render: Portal,
      remove,
    };
  }, []);

  useEffect(() => {
    if (el && portal) {
      portal.remove();
    }
    const newPortal = el && CreatePortal(el);
    //@ts-ignore
    setPortal(newPortal);
    return () => {
      el && newPortal.remove();
      el.parentNode && el.parentNode.removeChild(el);
    };
  }, [el]);
  return portal && portal.render;
};
export default useProtal;
```
