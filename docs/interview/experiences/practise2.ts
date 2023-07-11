/**
 *
 */

type IsEqaul<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
  ? true
  : false;

type TT1 = IsEqaul<1, 22>;

type FunctionKeys<T, N> = {
  [P in keyof T as T[P] extends N ? P : never]: T[P];
};

type TT2 = {
  name: string;
  getName: () => string;
  age?: number;
};

type TT3 = FunctionKeys<TT2, Function>;

// MutableKeys查找 T 所有非只读类型的 key 组成的联合类型。
type E19 = {
  readonly name?: string;
  age?: number;
  hobby: string;
};

type E21 = OptionalKeys<E19>;
// type E21 = {
//     readonly name?: string | undefined;
//     age?: number | undefined;
// }
type OptionalKeys<T> = {
  [P in keyof T as T[P] extends Required<T>[P] ? never : P]: T[P];
};
//Required 所有属性必须为必选项
type Required1<T> = {
  [P in keyof T]-?: T[P];
};
type E20 = Required1<TT2>;

type E22 = Subsequence2<[1, 2, 3]>;
type Subsequence2<T> = T extends [infer F, ...infer R]
  ? Subsequence2<R> | [F, ...Subsequence2<R>]
  : T;
type E23 = Subsequence2<[1, 2, 3]>;
