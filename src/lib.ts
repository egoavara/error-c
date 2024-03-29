import { ToFlatKeys } from "./flattening.js"
import { FunctionGenerator } from "./function-generator.js"
import { NamespaceGenerate, NamespaceGenerator } from "./namespace-generator.js"
import { ParseDefine } from "./parser.js"

export { ParseDefine } from "./parser.js"
export { FunctionGenerator } from "./function-generator.js"
export { NamespaceGenerate } from "./namespace-generator.js"


function generator<D extends object, O = string>(
  define: D,
  options?: { handler?: (msg: string, code: ToFlatKeys<D>, context: Record<string, any>) => O, defaultMode?: 'release' | 'debug' }
): NamespaceGenerator<D, O>;
function generator<D extends object, O = string>(
  generator: 'function',
  define: D,
  options?: { handler?: (msg: string, code: ToFlatKeys<D>, context: Record<string, any>) => O, defaultMode?: 'release' | 'debug' }
): (<K extends keyof ParseDefine<D>>(k: K, c: ParseDefine<D>[K]["all"], mode?: 'release' | 'debug') => O);
function generator<D extends object, O = string>(
  generator: 'namespace',
  define: D,
  options?: { handler?: (msg: string, code: ToFlatKeys<D>, context: Record<string, any>) => O, defaultMode?: 'release' | 'debug' }
): NamespaceGenerator<D, O>;
function generator(arg0: any, arg1?: any, arg2?: any): any {
  let generator = 'namespace'
  let define: any = undefined
  let options: any = undefined
  if (typeof arg0 === 'string') {
    generator = arg0
    define = arg1
    options = arg2
  } else {
    define = arg0
    options = arg1
  }
  switch (generator) {
    case 'function':
      return FunctionGenerator(define, options)
    case 'namespace':
      return NamespaceGenerate(define, options)
  }
  throw new Error(`generator '${generator}' is unknown`)
};

export default generator;
