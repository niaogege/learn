type MockPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

type TT2 = {
  name: string;
  age: number;
  getName: () => void;
};
type TT3 = MockPick<TT2, 'age'>;

type MockOmit<T, K> = Pick<T, Exclude<keyof T, K>>;

type TT4 = Omit<TT2, 'age'>;
type TT5 = MockOmit<TT2, 'age'>;
// 交集
type MockExtract<A, B> = A extends B ? A : never;

// Exclude 返回 T 中不存在 U 的部分
type MockExclude<A, B> = A extends B ? never : A;

type MockFunction<T, K> = {
  [P in keyof T as T[P] extends K ? P : never]: T[P];
};
type TT6 = MockFunction<TT2, string>;

type Equal<A, B> = (<T>(arg: A) => T extends A ? 1 : 2) extends <T>(arg: B) => T extends B ? 1 : 2
  ? true
  : false;

type TT7 = Equal<true, 'true'>;

type MockReturnTypes<T extends (...arg: any) => any> = T extends (...arg: any) => infer R
  ? R
  : never;

type MockParameters<T extends (...arg: any) => any> = T extends (...arg: infer P) => any
  ? P
  : never;

type MockAwaited<T extends Promise<unknown>> = T extends Promise<infer P>
  ? P extends Promise<unknown>
    ? MockAwaited<P>
    : P
  : T;

type MockRecord<T extends PropertyKey, O> = {
  [K in keyof T]: O;
};

type MockRequired<T> = {
  [P in keyof T]-?: T[P];
};

type Q3 = {
  name: 'cpp';
  age: 32;
};
type Q4 = { name: 'cpp' } | { age: 32 };
// 索引转联合
type IndexToUnion<T> = {
  [P in keyof T]: {
    [K in P]: T[K];
  };
}[keyof T];
type Q5 = IndexToUnion<Q3>;
type Q6 = UnionToIndex<Q4>;
// 联合转交叉
type UnionToIndex<T> = (T extends T ? (x: T) => unknown : never) extends (x: infer P) => unknown
  ? P
  : never;
