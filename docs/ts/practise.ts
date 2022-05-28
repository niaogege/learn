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
