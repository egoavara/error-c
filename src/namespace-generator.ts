import { stringify } from "querystring";
import { MessageBuilder } from "./builder";
import { letflat, ToFlatKeys } from "./flattening";
import { ConditionMessage, intoConditionalMessage, ParseMessage } from "./parser";
type IsEmpty<O> = [keyof O] extends [never] ? true : false
type NamespaceGenerator<D, O> = {
  [_ in keyof D]
  : D[_] extends string | ConditionMessage
  ? (
    IsEmpty<ParseMessage<D[_]>["all"]> extends true
    ? ((mode?: 'release' | 'debug') => O)
    : ((ctx: ParseMessage<D[_]>["all"], mode?: 'release' | 'debug') => O)
  )
  : NamespaceGenerator<D[_], O >
}

function recursiveGenerate(
  define: object,
  handler: (msg: string, code: string, context: Record<string, any>) => any,
  defaultMode: 'release' | 'debug',
  codePrefix: string[]
): Record<string, any> {

  const ns: Record<string, any> = {}
  for (const [k, v] of Object.entries(define)) {
    const cmsg = intoConditionalMessage(v)
    if (cmsg !== undefined) {
      const dmsgb = new MessageBuilder(cmsg.debug)
      const rmsgb = new MessageBuilder(cmsg.release)
      ns[k] = (unknownCtx: any, mode?: 'release' | 'debug') => {
        let ctx:any = {}
        let use:'release' | 'debug' = defaultMode
        if(typeof unknownCtx === 'object'){
          ctx = unknownCtx
          if(mode !== undefined){
            use = mode
          }
        }else{
          use = mode ?? use
        }
        if (use === 'release') {
          return handler(rmsgb.build(ctx), [...codePrefix, k].join('.'), ctx)
        } else {
          return handler(dmsgb.build(ctx), [...codePrefix, k].join('.'), ctx)
        }
      }
    } else {
      ns[k] = recursiveGenerate(v, handler, defaultMode, [...codePrefix, k])
    }
  }
  return ns
}

export function NamespaceGenerate<D extends object, O = string>(
  define: D,
  options?: {
    handler?: (msg: string, code: keyof ToFlatKeys<D>, context: Record<string, any>) => O,
    defaultMode?: 'release' | 'debug'
  }
): NamespaceGenerator<D, O> {

  return recursiveGenerate(
    define,
    (options?.handler ?? ((msg: string, _0: string, _1: any) => {
      return msg
    })) as any,
    options?.defaultMode ?? 'release',
    []
  ) as any;
}