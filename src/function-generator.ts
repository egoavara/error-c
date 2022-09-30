import { letflat, ToFlatKeys } from "./flattening.js";
import { ParseDefine } from "./parser.js";

export function FunctionGenerator<D extends object, O = string>(
    define: D,
    options?: {
        handler?: (msg: string, code: ToFlatKeys<D>, context: Record<string, any>) => O,
        defaultMode?: 'release' | 'debug'
    }
): <K extends keyof ParseDefine<D>>(k: K, c: ParseDefine<D>[K]["all"], mode?:'release' | 'debug') => O {
    const result = letflat(define);
    const defaultMode = options?.defaultMode ?? "release"
    const handler = options?.handler ?? ((msg, _0, _1) => msg as unknown as O)
    return (k, c, m) => {
        if (typeof k !== "string") {
            throw new Error(`unexpected not string k`)
        }
        if (!(k in result)) {
            throw new Error(`not exist key = '${k}'`)
        }
        const mbuilder = result[k][m ?? defaultMode]
        return handler(mbuilder.build(c), k, Object.fromEntries(Object.keys(mbuilder.args).map(k => [k, (c as any)[k]])));
    }
}