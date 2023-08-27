/**
 * 1.TS中的Unique
 * 2.手写ts版Awaited<T>
 * 3.TS手写IndexToUnion索引转联合类型
 * 4.extends
 * 5.class
 * 6.bind
 * 7.async/awaited
 */

function myClass(con, proto) {}

function myExtends(child, parent) {
  var parentProto = parent.prototype;
  parentProto.constructor = child;
  child.prototype = parentProto;
  Object.setPrototypeOf(child, parent);
}

type MyAwaited2<T extends Promise<unknown>> = T extends Promise<infer P>
  ? P extends Promise<unknown>
    ? MyAwaited2<P>
    : P
  : T;
type TY0 = Promise<[2, 3, 4]>;
type TY2 = Promise<Promise<[2, 4, 5]>>;
type TY1 = MyAwaited2<TY0>;
type TY3 = MyAwaited2<TY2>;

// index => union

interface E141 {
  name: string;
  age: number;
}
// type E151 = {
//     name: string;
// } | {
//     age: number;
// }

type IndexToUnion<T extends Record<PropertyKey, any>> = {
  [P in keyof T]: {
    [K in P]: T[K];
  };
}[keyof T];
type E142 = IndexToUnion<E141>;

var t1: E141 = { name: 'cpp', age: 32 };
var t2: E142 = { age: 22 };

function asyncToGenerator2(G) {
  return (...rest) => {
    var g = G.apply(this, rest);
    return new Promise((resolve, reject) => {
      function step(key, ...arg) {
        let genRes;
        try {
          genRes = g[key](arg);
        } catch (e) {
          reject(e);
        }
        const { done, value } = genRes;
        if (done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(
            (res) => {
              return step('next', res);
            },
            (err) => {
              return step('next', err);
            },
          );
        }
      }
      step('next');
    });
  };
}
