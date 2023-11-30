/**
 * 1.TS练习体操之Equal<A, B>
 * 2.TS练习之Pick<T, K>
 * 3.TS实现内置函数Parameters和ReturnTypes
 * 4.手写ts版Awaited<T>
 * 5.TS手写索引转联合类型
 * 6.TS手写联合转交叉
 * 7.TS手写Unique 去重
 * 8.Partial
 * 9.Record
 * 10.Exclude/Extract/Omit
 * 11.Required
 * 12.OptionalKeys提取 T 中所有可选类型的 key 组成的联合类型。
 * 13.
 * 14.
 */

type Equal<A, B = A> = (<T>(arg: A) => T extends A ? 1 : 2) extends <T>(
  arg: B,
) => T extends B ? 1 : 2
  ? true
  : false;

type Q1 = Equal<string, string>;
type Q2 = Equal<string, 'string'>;

type Q3 = {
  name: 'cpp';
  age: 32;
};

type MockPick<T, K extends keyof T> = {
  [P in K]: T[P];
};
type Q4 = MockPick<Q3, 'age'>;

// TS实现内置函数Parameters和ReturnTypes

function GetName(name: string): string | string[] {
  return 'my Name:' + name;
}

type MockParameters<T extends (...arg: any) => any> = T extends (...arg: infer P) => void
  ? P
  : never;
type Q5 = MockParameters<typeof GetName>;

type MockReturnTypes<T extends (...arg: any) => any> = T extends (...arg: any) => infer R ? R : any;
type Q6 = MockReturnTypes<typeof GetName>;

// 手写ts版Awaited<T>
type Q7 = Promise<1>;
type Q8 = Promise<Promise<22>>;
type Q9 = Awaited<Q8>;

type MockAwaited<T extends Promise<unknown>> = T extends Promise<infer P>
  ? P extends Promise<unknown>
    ? MockAwaited<P>
    : P
  : T;
type Q10 = MockAwaited<Q8>;

// TS手写索引转联合类型
// type Q3 = {
//   name: 'cpp';
//   age: 32;
// }; => {name: 'cpp'} | {age: 32}

type IndexToUnion<T extends Record<string, any>> = {
  [P in keyof T]: {
    [K in P]: T[K];
  };
}[keyof T];
type Q11 = IndexToUnion<Q3>;

// TS手写联合转交叉
type UnionToInsection<T> = (<T>(arg: any) => T) extends <T>(arg: infer P) => any ? P : never;

type UnionToInsection2<T> = (T extends T ? (x: T) => unknown : never) extends (
  x: infer P,
) => unknown
  ? P
  : never;

type Q12 = UnionToInsection2<
  | {
      age: 32;
    }
  | {
      name: 'cpp';
    }
>;
// type Q12 = {
//   age: 32;
// } & {
//   name: 'cpp';
// }

// TS手写Unique 去重

type Include<T extends unknown[], K> = T extends [infer F, ...infer R extends unknown[]]
  ? Equal<F, K> extends true
    ? true
    : Include<R, K>
  : false;

type Q14 = Include<[1, 2, 3], 1>;

type Unique<T extends number[], C extends unknown[] = []> = T extends [
  infer F,
  ...infer L extends number[],
]
  ? Include<C, F> extends true
    ? Unique<L, C>
    : Unique<L, [F, ...C]>
  : C;

type Q13 = Unique<[5, 1, 2, 1, 3, 2, 4]>;

type Q15 = Partial<Q3>;

type MockPartial<T> = {
  [P in keyof T]?: T[P];
};
type Q16 = MockPartial<Q3>;

type MockRecord<K extends string | number | symbol, T> = {
  [P in K]: T;
};

interface Test {
  name: string;
  age: number;
}
type Q17 = MockRecord<'hobby', Test>;
const TT1: Q17 = {
  hobby: {
    name: '11',
    age: 11,
  },
};

// * 10.Exclude/Extract/Omit
// * 11.Required
// * 12.OptionalKeys提取 T 中所有可选类型的 key 组成的联合类型。
// 13.根据键的属性来过滤索引类型
type T24 = 'a' | 'b' | 'c';
type T23 = 'a' | 'b';
type Q18 = Exclude<T24, T23>;

type MockExclude<T, E> = T extends E ? never : T;
type Q19 = MockExclude<T24, T23>;
type Q20 = Extract<T23, T24>;

type MockExtract<A, B> = A extends B ? A : never;
type Q21 = MockExtract<T23, T24>;

type Q22 = Omit<Q3, 'name'>;

type MockOmit<T, K> = {
  [P in Exclude<keyof T, K>]: T[P];
};

type Q23 = MockOmit<Q3, 'name'>;

interface Test1 {
  name: string;
  age: number;
  getName: () => void;
}
type Q25 = {
  name?: string;
  age?: number;
};
type Q24 = Required<Q25>;

type MockRequired<T> = {
  [P in keyof T]-?: T[P];
};

type Q26 = MockRequired<Q25>;

// 12.OptionalKeys提取 T 中所有可选类型的 key 组成的联合类型。
// 13.NotOptionKeys
type Q27 = {
  name?: string;
  age: number;
  hobby: string;
};

type NotOptionalKeys<T> = {
  [P in keyof T as T[P] extends {} ? P : never]: T[P];
};

type Q28 = NotOptionalKeys<Q27>;

type OptionalKeys<T> = {
  [P in keyof T as T[P] extends Required<T>[P] ? never : P]: T[P];
};
type Q29 = OptionalKeys<Q27>;
// type Q29 = {
//   name?: string | undefined;
// }
