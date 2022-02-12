import { letflat, ToFlat } from "./flattening";
import { ParseDefine as innerParseDefine } from "./gparser";
import { MessageBuilder } from "./mbuilder";

export type ParseDefine<T extends object> = innerParseDefine<ToFlat<T>>;
function generator<D extends object, O, G extends ParseDefine<D>>(
  define: D,
  mode: "release" | "debug",
  handler: (msg: string, code: keyof G) => O
): <K extends keyof G>(k: K, c: G[K]["all"]) => O {
  const result = letflat(define) as Record<
    keyof G,
    { debug: MessageBuilder; release: MessageBuilder }
  >;
  return (k, c) => {
    const ik = (typeof k !== "string" ? `${k}` : k) as keyof G;
    return handler(result[ik][mode].build(c), k);
  };
}
export default generator;
