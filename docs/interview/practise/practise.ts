type Person = {
  name: string;
  age?: number;
};

type Person1 = {
  name: string;
};

type t1 = Pick<Person1, 'name' | 'age'>;
type t2 = Pick<Person, 'name' | 'age'>;
type Hot<T, K> = {
  [P in keyof T as P extends K ? P : T[P] extends {} ? P : never]: T[P];
};
type t44 = Hot<Person1, 'name' | 'age'>; //{ name : string;}
type t55 = Hot<Person, 'name' | 'age'>;

// 手写ts版Awaited<T>

type A1 = Promise<[1, 2, 3, 4]>;
type A2 = Awaited<A1>; // type A2 = [1, 2, 3, 4]
type A3 = Promise<Promise<{ name: string }>>;
type A4 = Awaited<A3>;
// type A4 = {
//     name: string;
// }
type AwaitedMy<T extends Promise<unknown>> = T extends Promise<infer A> ? A : T;
type AA1 = AwaitedMy<A1>;
type AA3 = AwaitedMy<A3>;

type AwaitedMy2<T extends Promise<unknown>> = T extends Promise<infer A>
  ? A extends Promise<unknown>
    ? AwaitedMy2<A>
    : A
  : T;

type AA4 = AwaitedMy2<A3>;
