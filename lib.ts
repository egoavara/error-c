export type Trim<S extends string> = S extends ` ${infer T}`
  ? Trim<T>
  : S extends `${infer T} `
  ? Trim<T>
  : S;

type DefaultType = number | string | object | boolean;
type LiteralToType<L extends string> = L extends "string"
  ? string
  : L extends "number"
  ? number
  : L extends "object"
  ? object
  : DefaultType;

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

// export type ParseTypedParam<S extends string> =
//   S extends `${infer FIELD}:${infer TYPE}`
//     ? { [K in FIELD]: LiteralToType<Trim<TYPE>> | undefined }
//     : S extends `${infer FIELD}?`
//     ? { [K in FIELD]: DefaultType | undefined }
//     : S extends `${infer FIELD}!:${infer TYPE}`
//     ? { [K in FIELD]: LiteralToType<Trim<TYPE>> }
//     : S extends `${infer FIELD}!`
//     ? { [K in FIELD]: DefaultType }
//     : S extends `${infer FIELD}:${infer TYPE}`
//     ? { [K in FIELD]: LiteralToType<Trim<TYPE>> }
//     : { [K in S]: DefaultType };

export type ParseParam<S extends string> =
  //   S extends `${infer FIELD}?:${infer TYPE}`
  //     ? { [K in FIELD]?: LiteralToType<Trim<TYPE>> }
  //     : S extends `${infer FIELD}?`
  //     ? { [K in FIELD]?: DefaultType }
  //     : S extends `${infer FIELD}!:${infer TYPE}`
  //     ? { [K in FIELD]: LiteralToType<Trim<TYPE>> }
  //     : S extends `${infer FIELD}!`
  // ? { [K in FIELD]: DefaultType } :
  S extends `${infer FIELD}:${infer TYPE}`
    ? { [K in FIELD]: LiteralToType<Trim<TYPE>> }
    : { [K in S]: DefaultType };

export type ParseParams<S extends string> =
  S extends `${infer T}\${${infer P}}${infer U}`
    ? Merge<ParseParam<Trim<P>>, ParseParams<U>>
    : {};

export type ConditionMessage = {
  release: string;
  debug: string;
};

export type ParseMessage<M extends string | ConditionMessage> =
  M extends ConditionMessage
    ? {
        all: Merge<ParseParams<M["release"]>, ParseParams<M["debug"]>>;
        release: ParseParams<M["release"]>;
        debug: ParseParams<M["debug"]>;
      }
    : M extends string
    ? {
        all: ParseParams<M>;
        release: ParseParams<M>;
        debug: ParseParams<M>;
      }
    : { error: "unexpected reach" };

export type Define = Record<
  string | number | symbol,
  string | ConditionMessage
>;
export type ParseDefine<T extends Define> = {
  [K in keyof T]: ParseMessage<T[K]>;
};

function generator<D extends Define, O, G extends ParseDefine<D>>(
  define: D,
  mode: "release" | "debug",
  handler: (msg: string, code: string | number | symbol) => O
): <K extends keyof D>(k: K, c: G[K]["all"]) => O {
  return (k, c) => {
    const data = define[k];
    let message: string;
    if (typeof data !== "string") {
      if (mode === "release") {
        message = data.release;
      } else {
        message = data.debug;
      }
    } else {
      message = data;
    }
    for (const found of message.matchAll(
      /\$\{\s*([^}\s:]+)(\s*:\s*[^}]+)?\s*}/g
    )) {
      // @ts-expect-error
      message = message.replace(found[0], `${c[found[1]]}`);
    }
    return handler(message, k);
  };
}
export default generator;
