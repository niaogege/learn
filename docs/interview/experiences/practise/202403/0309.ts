/**
 * 1.pick
 * 2.Awaited
 * 3.Record
 * 4.Exclude/Extract
 */

type MockRecord<P extends string | number, T> = {
  [K in P]: T;
};

type MockAwaited<P extends Promise<any>> = P extends Promise<infer T>
  ? T extends Promise<unknown>
    ? MockAwaited<T>
    : T
  : P;
type AA1 = Awaited<Promise<[2, 3, Promise<4>]>>;

type TTU = {
  name: string;
  age: number;
  hobby: () => void;
};

type MockPick<T, K extends keyof T> = {
  [P in K]: T[K];
};
type EE2 = MockPick<TTU, 'hobby'>;
// type MockParameters<>

type ZONE = [0, 1, 1, 2, 2];
type Equal<A, B = A> = (<T>(arg: A) => T extends A ? 1 : 2) extends <T>(
  arg: B,
) => T extends B ? 1 : 2
  ? true
  : false;
type EE1 = Equal<false, string>;
type HasInclude<T, C> = T extends [infer F, ...infer R]
  ? Equal<F, C> extends true
    ? true
    : HasInclude<R, C>
  : false;
type TP = HasInclude<[1, 2, 3], 11>;
type Unique<T, N extends unknown[] = []> = T extends [infer F, ...infer R]
  ? HasInclude<N, F> extends true
    ? Unique<R, N>
    : Unique<R, [F, ...N]>
  : N;
type ZONE1 = Unique<ZONE>;

type Include<A extends unknown[], B> = A extends [infer F, ...infer R]
  ? Equal<B, F> extends true
    ? true
    : Include<R, B>
  : false;
type Q01 = Include<[1, 2, 3], 11>;

// type Unique<A extends unknown[], C extends unknown[] = []> = A extends [infer F, ...infer R]
//   ? Include<C, F> extends true
//     ? Unique<R, C>
//     : Unique<R, [F, ...C]>
//   : C;
// type Q02 = Unique<[1, 2, 3, 4, 4]>;

type TT112 = {
  name: string;
  age: number;
};
type PickString<T> = {
  [P in keyof T as T[P] extends string ? P : never]: T[P];
};

type TT113 = PickString<TT112>;

type IsNotNeg<T extends number> = `${T}` extends `-${number}` ? never : T;
function safeGet<T extends number>(arr: any[], index: IsNotNeg<T>) {
  console.log(arr[index]);
}
// Argument of type 'number' is not assignable to parameter of type 'never'.ts(2345)
safeGet([1, 2, 3, 4], -1);
