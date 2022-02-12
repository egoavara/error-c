export type Trim<S extends string> = S extends ` ${infer T}`
  ? Trim<T>
  : S extends `${infer T} `
  ? Trim<T>
  : S;

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
