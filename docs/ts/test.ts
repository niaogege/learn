interface Func {
  (name: string): void;
  (age: number): void;
}
declare const func2: Func;
func2('name');

type Funcs = ((name: string) => void) & ((age: number) => void);
declare const func3: Funcs;
func3(30);

// document.createEvent()
// infer
// extends
// 交叉
// 条件判断
type TupleToIntersectionFun<T extends unknown[]> = T extends [infer First, ...infer Rest]
  ? First & TupleToIntersectionFun<Rest>
  : {};

type res = TupleToIntersectionFun<
  [(name: string) => void, (age: number) => void, (hobby: string) => string]
>;
declare const fun4: res;
fun4();

type ParamsArr = ['CloseEvent', 'CustomEvent', 'InputEvent'];

type ReturnTypeMap = {
  CloseEvent: string;
  CustomEvent: void;
  InputEvent: any;
};

type TupleToIntersectionFunTry<Tuple extends unknown[]> = Tuple extends [infer First, ...infer Rest]
  ? First extends keyof ReturnTypeMap
    ? ((params: First) => ReturnTypeMap[First]) & TupleToIntersectionFunTry<Rest>
    : never
  : {};

type resTry = TupleToIntersectionFunTry<ParamsArr>;
declare const fun5: resTry;
fun5('CustomEvent');

type User = {
  id: number;
  name: string;
  age: number;
  grades: string;
};

const userList: User[] = [
  { id: 1, name: '小明', age: 20, grades: '98' },
  { id: 2, name: '小明', age: 20, grades: '98' },
  { id: 3, name: '小明', age: 20, grades: '98' },
  { id: 4, name: '小明', age: 20, grades: '98' },
];

function getUserInfo1(value: number | string): User | User[] {
  if (typeof value === 'number') {
    return userList.find((item) => item.id === value);
  } else {
    return userList.filter((item) => item.grades === value);
  }
}

function getUserInfo(value: number): User | undefined;
function getUserInfo(value: string, count: number): User[];
function getUserInfo(value: number | string, count: number = 1): User | User[] | undefined {
  if (typeof value === 'number') {
    return userList[0];
  } else {
    return userList;
  }
}
getUserInfo('98', 3);

function sayName(value: string): string | undefined;
function sayName(value: number, age: number): number;
function sayName(value: string | number, age: number = 0): number | string | undefined {
  if (typeof value === 'number') {
    return age;
  } else {
    return value;
  }
}
sayName(10, 10);

import * as data from './module';
console.log(data);

const enum ConstRoutes {
  // 此前会提示「常量枚举成员初始值设定项只能包含字面量值和其他计算的枚举值」
  Parts = `${Prefix}/parts`, // "/data/parts"
  Invoices = `${Prefix}/invoices`, // "/data/invoices"
}

interface DataType {
  name: string;
  age: number;
}
function getData2(id: string): DataType;
function getData2(id: string[]): DataType[];
function getData2(id: string | string[]): DataType | DataType[] {
  let data;
  if (Array.isArray(id)) {
    return data as DataType[];
  } else {
    return data as DataType;
  }
}
getData2('1111');
getData2(['1111']);

type Unique1<T, R extends any[] = []> = T extends [infer F, ...infer Rest]
  ? IsInclude<R, F> extends true
    ? Unique1<Rest, R>
    : Unique1<Rest, [...R, F]>
  : R;
type TP1 = Unique1<[1, 2, 3, 3, 4]>;

// A是否在数组里
type IsInclude<A = [], V = unknown> = A extends [infer F, ...infer R]
  ? Equal<F, V> extends true
    ? true
    : IsInclude<R, V>
  : false;

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
  ? true
  : false;

type TP2 = Equal<1, 2>;
type TP3 = Equal<unknown, any>;
type TP4 = IsInclude<[1, 3, 3], 11>;

type result = ConstructTuple<2>; // expect to be [unknown, unkonwn]
type ConstructTuple<
  L extends number,
  V extends unknown = unknown,
  Arr extends unknown[] = [],
> = Arr['length'] extends L ? Arr : ConstructTuple<L, V, [V, ...Arr]>;
type TP31 = ConstructTuple<999>;

type Track<T extends unknown[] = []> = T extends [infer F, ...infer R]
  ? Track<R> | [F, ...Track<R>]
  : T;
type PP2 = Track<[1, 2]>;
