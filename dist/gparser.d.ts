import { ConditionMessage, DefaultType, LiteralToType } from "./types";
import { Merge, Trim } from "./utils";
declare type ParseTypes<S extends string> = S extends `${infer F}|${infer L}` ? LiteralToType<Trim<F>> | ParseTypes<L> : LiteralToType<Trim<S>>;
declare type ParseParam<S extends string> = S extends `${infer FIELD}:${infer TYPE}` ? {
    [K in Trim<FIELD>]: ParseTypes<TYPE>;
} : {
    [K in S]: DefaultType;
};
declare type ParseParams<S extends string> = S extends `${infer T}\${${infer P}}${infer U}` ? Merge<ParseParam<Trim<P>>, ParseParams<U>> : {};
declare type ParseMessage<M> = M extends ConditionMessage ? {
    all: Merge<ParseParams<M["release"]>, ParseParams<M["debug"]>>;
    release: ParseParams<M["release"]>;
    debug: ParseParams<M["debug"]>;
} : M extends string ? {
    all: ParseParams<M>;
    release: ParseParams<M>;
    debug: ParseParams<M>;
} : never;
export declare type ParseDefine<T> = {
    [K in keyof T]: ParseMessage<T[K]>;
};
export {};
//# sourceMappingURL=gparser.d.ts.map