// === begin:version1.2 ===
// version1.2 : Flattening feature

import { MessageBuilder } from "./mbuilder";
import { MessageType } from "./types";

// detect flatten key list
type FlatKeys<T, K extends keyof T> = K extends string
  ? T[K] extends MessageType
    ? `${K}`
    : `${K}.${FlatKeys1<T[K], keyof T[K]>}`
  : K extends number
  ? T[K] extends MessageType
    ? K | `${K}`
    : `${K}.${FlatKeys1<T[K], keyof T[K]>}`
  : never;
type FlatKeys1<T, K extends keyof T> = K extends string | number
  ? T[K] extends MessageType
    ? `${K}`
    : `${K}.${FlatKeys2<T[K], keyof T[K]>}`
  : never;
type FlatKeys2<T, K extends keyof T> = K extends string | number
  ? T[K] extends MessageType
    ? `${K}`
    : `${K}.${FlatKeys3<T[K], keyof T[K]>}`
  : never;
type FlatKeys3<T, K extends keyof T> = K extends string | number
  ? T[K] extends MessageType
    ? `${K}`
    : `${K}.${FlatKeys4<T[K], keyof T[K]>}`
  : never;
type FlatKeys4<T, K extends keyof T> = K extends string | number
  ? T[K] extends MessageType
    ? `${K}`
    : `${K}.${FlatKeys5<T[K], keyof T[K]>}`
  : never;
type FlatKeys5<T, K extends keyof T> = K extends string | number
  ? T[K] extends MessageType
    ? `${K}`
    : `${K}.${FlatKeys6<T[K], keyof T[K]>}`
  : never;
type FlatKeys6<T, K extends keyof T> = K extends string | number
  ? T[K] extends MessageType
    ? `${K}`
    : `${K}.${FlatKeys7<T[K], keyof T[K]>}`
  : never;
type FlatKeys7<T, K extends keyof T> = K extends string | number
  ? T[K] extends MessageType
    ? `${K}`
    : `${K}.${FlatKeys8<T[K], keyof T[K]>}`
  : never;
type FlatKeys8<T, K extends keyof T> = K extends string | number
  ? T[K] extends MessageType
    ? `${K}`
    : `${K}.${FlatKeys9<T[K], keyof T[K]>}`
  : never;
type FlatKeys9<T, K extends keyof T> = K extends string | number
  ? T[K] extends MessageType
    ? `${K}`
    : `${K}.${FlatKeysLast<T[K], keyof T[K]>}`
  : never;

type FlatKeysLast<T, K extends keyof T> = K extends string | number
  ? T[K] extends MessageType
    ? `${K}`
    : never
  : never;
type ObjectValue<T, K extends keyof T, S extends string> = K extends number
  ? S extends `${K}`
    ? T[K]
    : never
  : S extends K
  ? T[K]
  : never;
type FlatTypes<
  T,
  K extends string,
  BASE extends string = ""
> = K extends `${infer PRE}.${infer POST}`
  ? BASE extends ``
    ? ObjectValue<T, keyof T, PRE> extends never
      ? FlatTypes<T, POST, PRE>
      : FlatTypes<ObjectValue<T, keyof T, PRE>, POST>
    : ObjectValue<T, keyof T, `${BASE}.${PRE}`> extends never
    ? FlatTypes<T, POST, `${BASE}.${PRE}`>
    : ObjectValue<T, keyof T, `${BASE}.${PRE}`>
  : BASE extends ``
  ? ObjectValue<T, keyof T, K> extends never
    ? never
    : ObjectValue<T, keyof T, K>
  : ObjectValue<T, keyof T, `${BASE}.${K}`> extends never
  ? never
  : ObjectValue<T, keyof T, `${BASE}.${K}`>;

function isMessage(o: any): o is MessageType {
  return (
    typeof o === "string" ||
    (typeof o === "object" && "release" in o && "debug" in o)
  );
}
function* flatkeys(
  o: Record<string | number, any>,
  base: string = ""
): Generator<[string, MessageType]> {
  for (const k of Object.keys(o)) {
    const nbase = base === "" ? k : `${base}.${k}`;
    if (isMessage(o[k])) {
      yield [nbase, o[k]];
    } else {
      yield* flatkeys(o[k], nbase);
    }
  }
}

export type ToFlat<T extends object> = {
  [K in FlatKeys<T, keyof T>]: K extends string ? FlatTypes<T, K> : never;
};

export function letflat<D extends Record<string | number, any>>(
  o: D
): Record<string, { debug: MessageBuilder; release: MessageBuilder }> {
  let result: Record<
    string,
    { debug: MessageBuilder; release: MessageBuilder }
  > = {};
  for (const [fk, v] of flatkeys(o)) {
    if (typeof v === "string") {
      result[fk] = {
        release: new MessageBuilder(v),
        debug: new MessageBuilder(v),
      };
    } else {
      result[fk] = {
        release: new MessageBuilder(v["release"]),
        debug: new MessageBuilder(v["debug"]),
      };
    }
  }
  return result;
}
// === end:version1.2 ===
