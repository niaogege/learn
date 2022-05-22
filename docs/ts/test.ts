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
