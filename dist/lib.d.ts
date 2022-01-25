export declare type Trim<S extends string> = S extends ` ${infer T}` ? Trim<T> : S extends `${infer T} ` ? Trim<T> : S;
declare type DefaultType = number | string | object | boolean;
declare type LiteralToType<L extends string> = L extends "string" ? string : L extends "number" ? number : L extends "object" ? object : DefaultType;
export declare type Merge<A, B> = B extends never ? A : {
    [K in keyof A | keyof B]: K extends keyof A ? K extends keyof B ? A[K] | B[K] : A[K] : K extends keyof B ? B[K] : never;
};
export declare type ParseParam<S extends string> = S extends `${infer FIELD}:${infer TYPE}` ? {
    [K in FIELD]: LiteralToType<Trim<TYPE>>;
} : {
    [K in S]: DefaultType;
};
export declare type ParseParams<S extends string> = S extends `${infer T}\${${infer P}}${infer U}` ? Merge<ParseParam<Trim<P>>, ParseParams<U>> : {};
export declare type ConditionMessage = {
    release: string;
    debug: string;
};
export declare type ParseMessage<M extends string | ConditionMessage> = M extends ConditionMessage ? {
    all: Merge<ParseParams<M["release"]>, ParseParams<M["debug"]>>;
    release: ParseParams<M["release"]>;
    debug: ParseParams<M["debug"]>;
} : M extends string ? {
    all: ParseParams<M>;
    release: ParseParams<M>;
    debug: ParseParams<M>;
} : {
    error: "unexpected reach";
};
export declare type Define = Record<string | number | symbol, string | ConditionMessage>;
export declare type ParseDefine<T extends Define> = {
    [K in keyof T]: ParseMessage<T[K]>;
};
declare function generator<D extends Define, O, G extends ParseDefine<D>>(define: D, mode: "release" | "debug", handler: (msg: string, code: string | number | symbol) => O): <K extends keyof D>(k: K, c: G[K]["all"]) => O;
export default generator;
//# sourceMappingURL=lib.d.ts.map