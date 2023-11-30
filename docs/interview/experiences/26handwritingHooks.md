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
 */
```

## 1.useUpdate

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
