type TO1 = ToLength<5>;

type ToLength<T extends number, R extends unknown[] = [], E = unknown> = R['length'] extends T
  ? R
  : ToLength<T, [E, ...R]>;

type TO2 = Subsequence<[1, 2, 3]>;
type Subsequence<T extends any[]> = T extends [infer F, ...infer R]
  ? Subsequence<R> | [F, ...Subsequence<R>]
  : T;

interface Cat {
  type: 'cat';
  breeds: 'Abyssinian' | 'Shorthair' | 'Curl' | 'Bengal';
}

interface Dog {
  type: 'dog';
  breeds: 'Hound' | 'Brittany' | 'Bulldog' | 'Boxer';
  color: 'brown' | 'white' | 'black';
}

type MyDog = LookUp<Cat | Dog, 'dog'>; // expected to be `Dog

type LookUp<T, A> = T extends {
  type: infer P;
}
  ? P extends A
    ? T
    : never
  : never;

type LookUp2<T extends { type: any }, A extends T['type']> = T extends {
  type: A;
}
  ? T
  : never;

type MyDog2 = LookUp2<Cat | Dog, 'dog'>;

type TO5 = Subsequence1<[1, 2]>;

type Subsequence1<T> = T extends [infer F, ...infer R]
  ? Subsequence1<R> | [F, ...Subsequence1<R>]
  : T;

type Trim<T extends string> = T extends ` ${infer W}` | `${infer W} ` ? W : T;
type TO6 = Trim<' ppp'>;

type Cap<T extends string> = T extends `${infer F}${infer I}` ? `${Uppercase<F>}${I}` : T;
type TO7 = Cap<'chendap'>;
