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

Thanks for typescript `infer`, now we can guess what values ​​are needed for errors

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
  DEFINE_ERRORS,
  process.env.NODE_ENV === "production" ? "release" : "debug",
  (msg) => msg
);

console.log(fail("E0004", { notyou: "pizza", whoareyou: "potato" }));
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

This magic make by typescript feature, no additional features, no automated build scripts.

All you need to do now is modify DEFINE_ERRORS. Typescript takes care of the rest.

## How to use?

### Getting start

!todo

---

### `release` | `debug`, conditional messaging

!todo

---

### Redefinition output type

!todo

---

## How does it work?

!todo

---

## Why a framework and not a library?

To implement this feature, i use typescript `const assertion`.
This is essential for implementation.

So, to use this **framework**, you must specify the value as `const assertion`.

The detailed technic described below, but to put it simply, you must follow certain rules to use the feature.

So it is framework, not library, but **very** small

However it's not important. you can just think whatever you want.
