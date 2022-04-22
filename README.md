# error-c

## What is this package do?

error-c is constant based error define micro framework, you can define error with message(dynamic) more staticaly and safely on typescript.

The goal of packages is similar to that of typeScript.

When your using typescript, perhaps you want to generate **SAFER** code through static type analysis.

However, think about this

```ts
const DEFINE_ERRORS = {
  E0001: "This is error!",
  E0002: "I'm error too!",
  E0003: "I'm ${whoareyou}!",
  E0004: "I'm not ${notyou}, i'm ${whoareyou}!",
};
```

The goal of the definition of this code is clear.

You want to use error with **dynamicaly generated message**

However, there is no way to know what value is needed for the message of that particular error code.

Until now, not now.

Thanks for typescript `infer`, now we can guess what values are needed for errors

> If you're not using typescript, you don't need to use this package **at all**.

Look at this, _it's also in the examples folder_.

```ts
import errorc from "error-c";

const DEFINE_ERRORS = {
    E0001: "This is error!",
    E0002: "I'm error too!",
    E0003: "I'm ${whoareyou}!",
    E0004: "I'm not ${notyou}, i'm ${whoareyou}!",
} as const;

const fail = errorc(
    "namespace",
    DEFINE_ERRORS,
    {
        defaultMode: "release",
    }
);

console.log(fail.E0004({ notyou: "pizza", whoareyou: "potato" }));
```

That code is simply a generate error message function that create by automated generator.

It's ok, but the generator is very powerful than your thought

Imagine that you accidentally wrote a value into the "noryou" field instead of the "notyou" field.

This is a common mistake in practice.

![the compiler tells you that there is an error in the noryou part](./images/error-by-not-exist-field.png)

This code throws a compile error.

Or, you don't know which fields are in a particular error code.

Now you can, see below

![autocomplete tells me that struct has "notyou", "whoareyou" fields](./images/autocomplete-available-fields.png)

This magic make by typescript feature, no additional plugins, no automated build scripts.

All you need to do now is modify `DEFINE_ERRORS`. Typescript takes care of the rest.

## How to use?

---
### Define

First of all, to use this library, you need to define it.

You can define it like the code below.

```ts
import { Define } from "error-c";

const DEFINE_ERRORS = {
  SIMPLE0: "This is error!",
  SIMPLE1: "I'm not ${notyou}, i'm ${whoareyou}!",
  // You can define nested object
  INNER : {
    HELLO : "Inner hello?",
    RENNI :{
      HELLO : "Inner.Inner hello?",
    }
  }
} as const;
```

> **WARNING**
>
> `as const` is **VERY IMPORTANT** never take it off

**Importantly, DO NOT explicitly define types.**


---
### Generate 

After writing the definition, the next thing to do is create an error generating function.

You can do this simply as below.

```ts
import errorc, {FunctionGenerator, NamespaceGenerate} from "error-c";

const DEFINE_ERRORS = {
    E0001: "Hello, world!",
    E0002: "I'm ${whoareyou}!",
    INNER: {
        INNER_ERROR: "inner error"
    },
} as const;

const fnStyle = errorc("function", DEFINE_ERRORS);
// or
// const fnStyle = FunctionGenerator(DEFINE_ERRORS);

const nsStyle = errorc("namespace", DEFINE_ERRORS);
// or
// const nsStyle = errorc(DEFINE_ERRORS);

// or
// const nsStyle = NamespaceGenerate(DEFINE_ERRORS);

// > Hello, world!
console.log(fnStyle("E0001", {}))
console.log(nsStyle.E0001())

// > I'm potato!
console.log(fnStyle("E0002", {whoareyou : "potato"}))
console.log(nsStyle.E0002({whoareyou : "potato"}))

// > inner error
console.log(fnStyle("INNER.INNER_ERROR", {}))
console.log(nsStyle.INNER.INNER_ERROR())
```
As you can see, there is two generator, `function` and `namespace`

Two are similar

But the `namespace` has the advantage to omitting it if there is no parameters

Also, IDEs such as vscode support shortcuts to declarations, `namespace` is recommended to use the namespace method whenever possible.

--- 
### Conditional message

```ts
import errorc from "error-c"

const DEFINE_ERRORS = {
    CONDMSG: { release: "hello, release", debug: "hello, debug" }
} as const;

const noDefault = errorc("namespace", DEFINE_ERRORS);
const defaultIsDebug = errorc("namespace", DEFINE_ERRORS, { defaultMode: "debug", });
const defaultIsRelease = errorc("namespace", DEFINE_ERRORS, { defaultMode: "release", });

console.log(noDefault.CONDMSG());                   // expected : 'hello, release'
console.log(noDefault.CONDMSG("debug"));            // expected : 'hello, debug'
console.log(noDefault.CONDMSG("release"));          // expected : 'hello, release'
console.log(defaultIsDebug.CONDMSG());              // expected : 'hello, debug'
console.log(defaultIsDebug.CONDMSG("debug"));       // expected : 'hello, debug'
console.log(defaultIsDebug.CONDMSG("release"));     // expected : 'hello, release'
console.log(defaultIsRelease.CONDMSG());            // expected : 'hello, release'
console.log(defaultIsRelease.CONDMSG("debug"));     // expected : 'hello, debug'
console.log(defaultIsRelease.CONDMSG("release"));   // expected : 'hello, release'
```
You can create conditional messages.
Currently, only `debug` and `release` are available.
If there is no `defaultMode`, it is `release` .

---
### types

This is useful if you want to allow only certain types of messages.

```ts
import errorc from "error-c"

export type DefaultType =
    | bigint
    | number
    | string
    | object
    | boolean
    | ((context: Record<string, any>) => string);

const DEFINE_ERRORS = {
    NUMBER: "${value:number}",
    STRING: "${value:string}",
    OBJECT: "${value:object}",
    BOOLEAN: "${value:boolean}",    // boolean
    FUNCTION: "${value:function}",  // (context : Record<string, any>) => string
    DEFAULT: "${value}",            // infer as `DefaultType`
} as const;

const ns = errorc("namespace", DEFINE_ERRORS);

console.log(ns.NUMBER({ value: 1 }));
console.log(ns.STRING({ value: "" }));
console.log(ns.OBJECT({ value: { foo: { bar: "foo-bar" } } }));
console.log(ns.BOOLEAN({ value: true }));
console.log(ns.FUNCTION({ value: (context) => "function" }));

console.log(ns.DEFAULT({ value: 1 }));
console.log(ns.DEFAULT({ value: {} }));
console.log(ns.DEFAULT({ value: { foo: { bar: "foo-bar" } } }));
console.log(ns.DEFAULT({ value: true }));
console.log(ns.DEFAULT({ value: (context) => "function" }));
```

![Type constaints](./images/type-constaints.png)
> **WARNING**
>
> The type provided by errorc is not a typescript type, 
> 
> But a type defined separately by errorc.
> 
> Don't confuse this.

---

### Redefinition output type

If you want to make the output type into `class` or `object` not `string`, you can use the like this.

```ts
import errorc from "error-c";

const DEFINE_ERRORS = {
    EOF: "End Of File",
    UnexpectedError: {
        debug: "unexpected error cause '${cause}'",
        release: "unexpected error",
    },
} as const;

class CustomError extends Error {
    readonly code: string
    readonly context: Record<string, any>
    constructor(message: string, code: string, context: Record<string, any>) {
        super(message)
        this.code = code
        this.context = context
    }
}

const ns = errorc(
    DEFINE_ERRORS,
    {
        handler: (message, code, context) => new CustomError(message, code, context)
    }
);

// CustomError(
//     "unexpected error cause '${secret data for debug}'",
//     "UnexpectedError",
//     {
//         cause : "secret data for debug"
//     }
// )
console.log(ns.UnexpectedError({ cause: "secret data for debug" }, "debug"))


// CustomError(
//     "unexpected error",
//     "UnexpectedError",
//     {}
// )
console.log(ns.UnexpectedError({ cause: "secret data for debug" }, "release"))
```
`handler` automatically determine whether it's debug or release, provide the appropriate context

You can use context, code, and messages to emit other type instead of `string`.


## More examples

Many example can be found [here](https://github.com/iamGreedy/error-c/tree/main/test)


- [function style generate](https://github.com/iamGreedy/error-c/blob/main/test/00_fn.ts)
- [namespace style generate](https://github.com/iamGreedy/error-c/blob/main/test/01_ns.ts)
- [how to define](https://github.com/iamGreedy/error-c/blob/main/test/02_default.ts)
- [mode and default mode](https://github.com/iamGreedy/error-c/blob/main/test/03_defaultMode.ts)
- [types](https://github.com/iamGreedy/error-c/blob/main/test/05_types.ts)
- [handler](https://github.com/iamGreedy/error-c/blob/main/test/07_context-by-rel-dbg.ts)

## How does it work?

I stumbled across some interesting code [here](https://www.typescriptlang.org/play?ts=4.1.0-dev.20201028#example/string-manipulation-with-template-literals)

```ts
type ExtractSemver<SemverString extends string> =
  SemverString extends `${infer Major}.${infer Minor}.${infer Patch}`
    ? { major: Major; minor: Minor; patch: Patch }
    : { error: "Cannot parse semver string" };
```

Surprisingly, typescript able to cut some of the parts from literals.

Using this, I cut and pasted literal, and created the package by using generics as a kind of function.

I also think this method will be useful for text template libraries like internationalization(i18n).