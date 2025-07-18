type Too = {
  a: string;
  b: number;
};
type MyPartial<T> = {
  [P in keyof T]?: T[P];
};
type Too1 = Partial<Too>;

type Too2 = {
  a: string;
  b: number;
};
// your code here, don't use Pick<T,K> in your code.
type MyPick<T, K extends keyof T> = {};

// TS练习体操之Equal<A, B>

type MockEqual1<A, B> = (<T>(arg: A) => T extends A ? 1 : 2) extends <T>(
  arg: B,
) => T extends B ? 1 : 2
  ? true
  : false;
