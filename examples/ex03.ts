import errorc from "../lib";

const DEFINE_ERRORS = {
  NUMBER: "-${value:number}-",
  STRING: "-${value:string}-",
  STR: "-${value:str}-",
  OBJECT: "-${value:object}-",
  BOOLEAN: "-${value:boolean}-",
  BOOL: "-${value:bool}-",
  FN: "-${value:fn}-",
  FUNC: "-${value:func}-",
  FUNCTION: "-${value:function}-",
  DEFAULT: "-${value}-",
} as const;

const fail = errorc(
  DEFINE_ERRORS,
  process.env.NODE_ENV === "production" ? "release" : "debug",
  (msg) => msg
);
console.log(
  fail("NUMBER", {
    value: 1,
  })
);

console.log(
  fail("STRING", {
    value: "str",
  })
);

console.log(
  fail("STR", {
    value: "str",
  })
);
console.log(
  fail("OBJECT", {
    value: { type: "obj" },
  })
);

console.log(
  fail("BOOLEAN", {
    value: true,
  })
);

console.log(
  fail("BOOL", {
    value: true,
  })
);

console.log(
  fail("FN", {
    value: () => "fn",
  })
);

console.log(
  fail("FUNC", {
    value: () => "func",
  })
);
console.log(
  fail("FUNCTION", {
    value: () => "function",
  })
);
console.log(
  fail("DEFAULT", {
    value: "def",
  })
);
