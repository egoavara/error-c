import { ToFlat } from "./flattening";
import { ParseDefine as innerParseDefine } from "./gparser";
export declare type ParseDefine<T extends object> = innerParseDefine<ToFlat<T>>;
declare function generator<D extends object, O, G extends ParseDefine<D>>(define: D, mode: "release" | "debug", handler: (msg: string, code: keyof G) => O): <K extends keyof G>(k: K, c: G[K]["all"]) => O;
export default generator;
//# sourceMappingURL=lib.d.ts.map