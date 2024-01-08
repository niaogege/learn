---
title: useRequest
order: 7
group:
  title: Hooks
  order: 1
nav:
  order: 3
  title: 'react'
  path: /react
---

## [Demo](https://www.30secondsofcode.org/react/s/use-fetch)

Implements fetch() in a declarative manner.

- Create a custom hook that takes a url and options.
- Use the useState() hook to initialize the response, error and abort state variables.
- Use the useEffect() hook to asynchronously call fetch() and update the state variables accordingly.
- Create and use an AbortController to allow aborting the request. Use it to cancel the request when the component unmounts.
- Return an object containing the response, error and abort state variables.

<code src="./index.tsx"></code>

## Code

```ts
import React from 'react';
import useRequest from './useRequest';

const ImageFetch = () => {
  const res: any = useRequest('https://bythewayer.com/api/v1/cats/image', {
    method: 'GET',
  });
  if (!res.response) {
    return <div>Loading...</div>;
  }
  const imageUrl = res.response.message;
  return (
    <>
      {imageUrl ? (
        <div>
          <img src={imageUrl} alt="avatar" width={400} height="auto" />
        </div>
      ) : null}
    </>
  );
};
export default ImageFetch;
```

## Source code

```ts
import { useState, useEffect } from 'react';

const useRequest = (url: string, options: any) => {
  const [abort, setAbort] = useState(() => {});
  const [res, setResponse] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const abortController = new AbortController();
        const signal = abortController.signal;
        setAbort(() => abortController.abort());
        const res = await fetch(url, { ...options, signal });
        const json = await res.json();
        setResponse(json);
      } catch (error) {
        setError(error);
      }
    };
    fetchData();
    return () => {
      abort && abort();
    };
  }, []);
  return {
    res,
    error,
    abort,
  };
};
export default useRequest;
```
