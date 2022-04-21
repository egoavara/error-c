import errorc, { ParseDefine } from "../src/lib";

const DEFINE_ERRORS = {
  a: "a",
  b: {
    aa: "b.aa",
    bb: "b.bb",
  },
  c: {
    aa: {
      aaa: "c.aa.aaa",
      bbb: "c.aa.bbb",
      ccc: "c.aa.ccc",
    },
    bb: {
      aaa: "c.bb.aaa",
      bbb: "c.bb.bbb",
      ccc: "c.bb.ccc",
      [-1]: "c.bb.-1 ${b}",
    },
  },
  d: {
    release: "d[release]",
    debug: "d[debug]",
  },
} as const;
type TYPE_DEFINE_ERRORS = ParseDefine<typeof DEFINE_ERRORS>;
const fail = errorc(
  DEFINE_ERRORS,
  process.env.NODE_ENV === "production" ? "release" : "debug",
  (msg) => msg
);

console.log(
  fail("c.bb.-1", {
    b: "ff",
  })
);

type Primitives = number | string | boolean | undefined | null | bigint;

type FlatKeys<T, K extends keyof T> = K extends string
  ? T[K] extends Primitives
    ? `${K}`
    : `${K}.${FlatKeys<T[K], keyof T[K]>}`
  : never;

type WithBase<B extends string, K extends string> = B extends ``
  ? K
  : `${B}.${K}`;
type FlatValue<
  T,
  K extends string,
  BASE extends string = ""
> = K extends `${infer PRE}.${infer POST}`
  ? WithBase<BASE, PRE> extends keyof T
    ? FlatValue<T[WithBase<BASE, PRE>], POST>
    : FlatValue<T, POST, WithBase<BASE, PRE>>
  : WithBase<BASE, K> extends keyof T
  ? T[WithBase<BASE, K>]
  : never;

type Flatten<T> = {
  [K in FlatKeys<T, keyof T>]: FlatValue<T, K>;
};

export function flatten<T extends Record<string, any>>(t: T): Flatten<T> {
  let result: Record<string, any> = {};
  function inner(t: Record<string, any>, base = "") {
    for (const [k, v] of Object.entries(t)) {
      const fk = base.length === 0 ? k : `${base}.${k}`;
      if (
        ["number", "string", "boolean", "undefined", "null", "bigint"].includes(
          typeof v
        )
      ) {
        result[fk] = v;
      } else {
        inner(v, fk);
      }
    }
  }
  inner(t)
  return result as Flatten<T>;
}
