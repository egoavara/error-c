import { ToFlat } from "./flattening";
import { ConditionMessage, DefaultType, LiteralToType } from "./types";
import { Merge, Trim } from "./utils";

type ParseTypes<S extends string> = S extends `${infer F}|${infer L}`
  ? LiteralToType<Trim<F>> | ParseTypes<L>
  : LiteralToType<Trim<S>>;

type ParseParam<S extends string> =
  S extends `${infer FIELD}:${infer TYPE}`
    ? { [K in Trim<FIELD>]: ParseTypes<TYPE> }
    : { [K in S]: DefaultType };

type ParseParams<S extends string> =
  S extends `${infer T}\${${infer P}}${infer U}`
    ? Merge<ParseParam<Trim<P>>, ParseParams<U>>
    : {};

type ParseMessage<M> = M extends ConditionMessage
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
  : never;

export type ParseDefine<T> = {
  [K in keyof T]: ParseMessage<T[K]>;
};
