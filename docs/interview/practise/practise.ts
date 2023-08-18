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
