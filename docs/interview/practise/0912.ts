/**
 * 1.useIntersectionObserver
 * 2.禁止调试
 * 3.requestIdleCallback
 * 4.联合转交叉
 * 5.索引转联合
 */

type UU = {
  age: number;
  name: string;
};

type IndexToUnion<T> = {
  [P in keyof T]: {
    [K in P]: T[K];
  };
}[keyof T];
type UU2 = IndexToUnion<UU>;

type UU3 =
  | {
      age: number;
    }
  | {
      name: string;
    };

type UnionToIndex<T> = (T extends T ? (x: T) => unknown : never) extends (x: infer R) => unknown
  ? R
  : never;

type UUION<T> = (T extends T ? (x: T) => unknown : never) extends (x: infer R) => unknown
  ? R
  : never;

function GetName(name: string): string {
  return name;
}

type MyParameters<T extends (...args: any) => any> = T extends (...args: infer P) => any
  ? P
  : never;

type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;

type MyReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R
  ? R
  : never;

type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;

type FnGetParam = MyParameters<typeof GetName>; // [name: string]
type FnGetReturn = MyReturnType<typeof GetName>; // string
type UU4 = UnionToIndex<UU3>;

type T631 = '1' | '2' | '3';
type UnionToTuple<T extends unknown, R extends unknown[] = []> = T extends string ? [T] : R;
type T632 = UnionToTuple<T631>;

type GetReturnType<Func extends Function> = Func extends (...args: any[]) => infer ReturnType
  ? ReturnType
  : never;

import { useEffect, useState } from 'react';
const useIntersectionObserver = ({ ref, option }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
    });
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      observer.unobserve(ref.current);
    };
  }, []);
  return visible;
};

function requestIdleCallback(cb) {
  var start = Date.now();
  return setTimeout(() => {
    cb({
      didTimeout: false,
      timeRemaining: function () {
        return Math.max(0, 50 - (Date.now() - start));
      },
    });
  }, 0);
}
