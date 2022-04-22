import { ToFlat } from "./flattening";
import { Merge, Trim } from "./utils";

export type DefaultType = number | string | object | boolean | ((context: Record<string, any>) => string);

export type MessageType = string | ConditionMessage;

export type LiteralToType<L extends string> =
  L extends "string"
  ? string
  : L extends "str"
  ? string
  : L extends "number"
  ? number
  : L extends "num"
  ? number
  : L extends "object"
  ? object
  : L extends "obj"
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

export type ConditionMessage = {
  release: string;
  debug: string;
};

export function intoConditionalMessage(data: any): ConditionMessage | undefined {
  if (typeof data === 'object' && 'release' in data && 'debug' in data) {
    return data
  } else if (typeof data === 'string') {
    return { debug: data, release: data }
  } else {
    return undefined
  }
}

type ParseTypes<S extends string> = S extends `${infer F}|${infer L}`
  ? LiteralToType<Trim<F>> | ParseTypes<L>
  : LiteralToType<Trim<S>>;

type ParseParam<S extends string> = S extends `${infer FIELD}:${infer TYPE}`
  ? { [K in Trim<FIELD>]: ParseTypes<TYPE> }
  : { [K in S]: DefaultType };

export type ParseParams<S extends string> =
  S extends `${infer T}\${${infer P}}${infer U}`
  ? Merge<ParseParam<Trim<P>>, ParseParams<U>>
  : {};

export type ParseMessage<M> = M extends ConditionMessage
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

type ForeachParseDefine<T> = {
  [K in keyof T]: ParseMessage<T[K]>;
};

export type ParseDefine<T extends object> = ForeachParseDefine<ToFlat<T>>