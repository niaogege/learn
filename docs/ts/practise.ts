// import Cpp from './module';

// console.log(Cpp.name, Cpp.age);

export {};

export type ExcludeTest = 'cpp' | 'wmh';
export type ExcludeTest2 = 'cpp' | 'wmh' | 'chendap';

type ExcludeCopy<T, U> = T extends U ? never : T;
export type ExcludeDemo1 = Exclude<ExcludeTest2, ExcludeTest>; // never
export type ExcludeDemo3 = ExcludeCopy<ExcludeTest2, ExcludeTest>;

type ExtraCopy<T, U> = T extends U ? T : never;
export type ExcludeDemo2 = Extract<ExcludeTest2, ExcludeTest>; // 'cpp' \ 'wmh'
export type ExtraDemo1 = ExtraCopy<ExcludeTest2, ExcludeTest>; // 'cpp' \ 'wmh'

type NonNullable<T> = T extends null | undefined ? never : T;
type ObjNon = undefined;
export type TestNon = NonNullable<ObjNon>;

type ReturnTypeCopy<T extends (...args: any) => any> = T extends (...args: any) => infer R
  ? R
  : any;
function SayName<T>(name: string): number {
  return +name;
}
export type FunReturn = ReturnType<typeof SayName>;
export type FunReturn2 = ReturnTypeCopy<typeof SayName>;

type ParametersCopy<T extends (...args: any) => any> = T extends (...args: infer P) => any
  ? P
  : never;
export type FunParam = Parameters<typeof SayName>;
export type FunParam2 = ParametersCopy<typeof SayName>;

type InferTest<T> = T extends (...args: any) => infer R ? R : any;

type result = ConstructTuple<2>; // expect to be [unknown, unkonwn]
type ConstructTuple<
  T extends number,
  E extends unknown = unknown,
  R extends unknown[] = [],
> = R['length'] extends T ? R : ConstructTuple<T, E, [E, ...R]>;
type result3 = ConstructTuple<3, string>; // type result3 = [string, string, string]

// type AllCombinations_ABC = AllCombinations<'ABC'>
// should be '' | 'A' | 'B' | 'C' | 'AB' | 'AC' | 'BA' | 'BC' | 'CA' | 'CB' | 'ABC' | 'ACB' | 'BAC' | 'BCA' | 'CAB' | 'CBA'

// expected to be `"foo" | "bar" | "baz" | "foo bar" | "foo bar baz" | "foo baz" | "foo baz bar" | "bar foo" | "bar foo baz" | "bar baz" | "bar baz foo" | "baz foo" | "baz foo bar" | "baz bar" | "baz bar foo"`
// type Keys = Combination<['foo', 'bar', 'baz']>
// type Combination<T extends string[], U = T[number], A = U> =
// U extends infer U extends string ? `${U} ${Combination<T, Exclude<A, U>>}` | U : never; 

type StrToUnion<S> = S extends `${infer F}${infer R}`
  ? F | StrToUnion<R>
  : never

type TT11 = StrToUnion<'abc'>

type Len = ['a', 'b', 'c'][number]
type Len2 = ['a', 'b', 'c']['length']


type A = Subsequence2<[1, 2, 3]> // [] | [1] | [2] | [1, 2]
type AB = Subsequence<[1, 2, 3]> // [] | [1] | [2] | [1, 2]
type Subsequence<T extends number[], U = unknown> = T extends [infer F, ...(infer R extends number[])]
? [F] | Subsequence<R, U | F > | T | []
: T

type Subsequence2<T extends number[]> = T extends [infer F, ...(infer R extends number[])]
? Subsequence2<R> | [F, ...Subsequence2<R>]
: T

class EG2 {
  private name: string;
  public readonly age: number;
  protected sex: string;
}
type T21 = keyof EG2; //type T21 = "age"

interface EG1 {
  name1: string;
  readonly hobby: string;
}
type T22 = keyof EG1;
interface Animals {
  name: string;
}

interface Dog extends Animals {
  break(): void;
}

let A: Animals;
let B: Dog;

A = B
// B = A
interface User {
  id: number;
  name: string;
}
interface CPP {
  id: number;
  name: string;
  hobby: string;
}
let personT: User = {
  id: 31,
  name: 'person',
};
let CppPerson: CPP = {
  id: 31,
  name: 'person',
  hobby: 'shufa',
};
personT = CppPerson; // ok
// CppPerson = personT

let PP1: Array<User>
let CC1: Array<CPP>
PP1 = CC1

let EG3: Array<Animals>
let EG4: Array<Dog>
EG3 = EG4

interface Animal {
  name: string;
}

interface Dog extends Animal {
  break(): void;
}

type AnimalFn = (arg: Animal) => void
type DogFn = (arg: Dog) => void

let Eg1: AnimalFn;
let Eg2: DogFn;
// 不再可以赋值了，
// AnimalFn = DogFn不可以赋值了, Animal = Dog是可以的
Eg1 = Eg2;
// 反过来可以
Eg2 = Eg1;

let animal: AnimalFn = (arg: Animal) => {}
let dog: DogFn = (arg: Dog) => {
  arg.break();
}

animal = dog
animal({name: 'cpp'})

interface EventListener {
  (evt: Event): void;
}
interface Event {
  readonly target: EventTarget | null;
  preventDefault(): void;
}

interface MouseEvent extends Event {
  readonly x: number;
  readonly y: number;
}

interface Window {
  addEventListener(type: string, listener: EventListener)
}

window.addEventListener('click', (e: Event) => {})
window.addEventListener('mouseout', (e: MouseEvent) => {})

type E24 = {
  name: string;
  age: number;
  hobby: string;
};
type E25 = {
  hobby: string;
};
type E19 = {
  name?: string;
  age: number;
  hobby: string;
};
type E20 = OptionalKeys<E19>;
type OptionalKeys<T> = {
  [K in keyof T as T[K] extends {} ? K : never]: T[K];
};

type E27 = Intersection<E24, E25>;
type Intersection<T extends object, U extends object> = Pick<T, Extract<keyof T, keyof U>> &
  Extract<keyof U, keyof T>;

export const e271:E27 = {
  hobby: 'cpp'
}

type Intersection1<T extends object, U extends object> = Pick<T,
  Extract<keyof T, keyof U> & Extract<keyof U, keyof T>
>

type Eg = Intersection1<{key1: string}, {key1:string, key2: number}>

type UnionTo<T> = (T extends T ? (x: T) => unknown : never) extends (
  (x: infer R) => unknown
) ? R : never;

type E251 = {
  hobby: string;
};
type E2512 = {
  name: string;
} | {hobby: string};
type E2513 = UnionTo<E2512>

type Equal<A, B = A> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
type E28 = Equal<E251, {hobby: string, name: symbol}>

type T26 = Promise<[Promise<{ name: 'cpp' }>, 2, 3]>;
type MyPromise<T> = T extends Promise<infer A> ? A : never;
type T27 = MyPromise<T26>;