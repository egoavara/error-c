export type Trim<S extends string> = S extends ` ${infer T}`
  ? Trim<T>
  : S extends `${infer T} `
  ? Trim<T>
  : S;

type DefaultType = number | string | object | boolean | (() => string);
type LiteralToType<L extends string> = L extends "string"
  ? string
  : L extends "str"
  ? string
  : L extends "number"
  ? number
  : L extends "object"
  ? object
  : L extends "boolean"
  ? boolean
  : L extends "bool"
  ? boolean
  : L extends "function"
  ? () => string
  : L extends "func"
  ? () => string
  : L extends "fn"
  ? () => string
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
class MessageBuilder {
  base!: (string | { key: string })[];
  constructor(message: string) {
    this.base = [];
    let start = 0;
    for (const found of message.matchAll(
      /\$\{\s*([^}\s:]+)(\s*:\s*[^}]+)?\s*}/g
    )) {
      this.base.push(message.slice(start, found.index));
      this.base.push({ key: found[1] });
      start = (found.index ?? start) + found[0].length;
    }
    if (start !== message.length) {
      this.base.push(message.slice(start));
    }
  }
  build(context: Record<string, any>): string {
    return this.base
      .map((v) => {
        if (typeof v === "string") {
          return v;
        } else {
          const rep = context[v.key];
          if (typeof rep === "object") {
            return JSON.stringify(rep);
          } else if (typeof rep === "function") {
            return rep();
          } else {
            return rep;
          }
        }
      })
      .join("");
  }
}
function generator<D extends Define, O, G extends ParseDefine<D>>(
  define: D,
  mode: "release" | "debug",
  handler: (msg: string, code: string | number | symbol) => O
): <K extends keyof D>(k: K, c: G[K]["all"]) => O {
  const obj = Object.fromEntries(
    Object.entries(define).map(([k, v]) => [
      k,
      typeof v === "string"
        ? {
            debug: new MessageBuilder(v),
            release: new MessageBuilder(v),
          }
        : {
            debug: new MessageBuilder(v["debug"]),
            release: new MessageBuilder(v["release"]),
          },
    ])
  ) as Record<keyof D, { debug: MessageBuilder; release: MessageBuilder }>;
  return (k, c) => {
    return handler(obj[k][mode].build(c), k);
  };
}
export default generator;
