/**
 * 1.TS手写联合转交叉
 * 2.TS实现内置函数Parameters和ReturnTypes
 * 3.Ts手写索引转联合
 * 4.手写Awaited
 * 5.手写Include
 */

type Equal<A, B = A> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
  ? true
  : false;

type II = Include<[1, 2, 3], 1>;

type Include<T, O> = T extends [infer F, ...infer L]
  ? Equal<F, O> extends true
    ? true
    : Include<L, O>
  : false;

type UUU2 = { name: string } | { age: number };
type UnionToIn<T> = (T extends T ? (x: T) => unknown : never) extends (x: infer R) => unknown
  ? R
  : never;

type UUU3 = UnionToIn<UUU2>;

type MockParameters<T extends (...arg: any) => any> = T extends (...arg: infer V) => any
  ? V
  : never;

function getName(name: string): string | number {
  return name;
}

type TU = MockParameters<typeof getName>;

type MockReturnTypes<T extends (...arg: any) => any> = T extends (...arg: any) => infer R
  ? R
  : never;

type TU2 = MockReturnTypes<typeof getName>;

type Awaited2<T extends Promise<unknown>> = T extends Promise<infer V>
  ? V extends Promise<any>
    ? Awaited2<V>
    : V
  : never;
type AA2 = Awaited2<Promise<[1, 2, 3]>>;
type AA3 = Awaited<Promise<[1, 3, Promise<111>]>>;

type UU1 =
  | {
      name: string;
    }
  | {
      age: number;
    };

type UnionToInserction<T> = (T extends T ? (x: T) => unknown : never) extends (
  x: infer R,
) => unknown
  ? R
  : never;

type UU2 = UnionToInserction<UU1>;

type IndexToUnion<T> = {
  [P in keyof T]: {
    [K in P]: T[K];
  };
}[keyof T];

type UU3 = IndexToUnion<UU2>;
