export type Trim<S extends string> =
  S extends ` ${infer T}`
  ? Trim<T>
  : S extends `\t${infer T}`
  ? Trim<T>
  : S extends `\n${infer T}`
  ? Trim<T>
  : S extends `${infer T} `
  ? Trim<T>
  : S extends `${infer T}\t`
  ? Trim<T>
  : S extends `${infer T}\n`
  ? Trim<T>
  : S;
export type IsEmpty<O> = [keyof O] extends [never] ? true : false;

export type Merge<A, B> = B extends never
  ? A
  : {
    [K in keyof A | keyof B]: K extends keyof A
    ? K extends keyof B
    ? A[K] | B[K]
    : A[K]
    : K extends keyof B
    ? B[K]
    : never;
  };
